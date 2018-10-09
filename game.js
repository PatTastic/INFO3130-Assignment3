import timeoutPromise from './timeout-promise';
import nodeLocalstorage from 'node-localstorage';
import database from './db';
import utils from './utils';
import api from './api';
import sms from './sms';

const TimeoutPromise = timeoutPromise.TimeoutPromise;
const DB = database.DB;
const MySQL = database.MySQL;
const API = api.API;
const Utils = utils.Utils;
const SMS = sms.SMS;
const LocalStorage = nodeLocalstorage.LocalStorage;
var localStorage;

const cookieOptions = {
    maxAge: (((60000 * 60) * 24) * 365),
    overwrite: true,
    path: '/'
};

const Game = {
    play: function(req, res, body, from){
        if (typeof localStorage === 'undefined' || localStorage === null) {
            localStorage = new LocalStorage('./scratch');
        }

        if(!Utils.doesExist(localStorage.getItem('player'))){
            API.checkIfNumberExists(from).then((player) => {
                if(player.success){
                    localStorage.setItem('player', JSON.stringify(player));
                    Game.setupGame(req, res, body, from, player);
                }
                else{
                    API.createPlayer('', from).then(() => {
                        API.checkIfNumberExists(from).then((player) => {
                            localStorage.setItem('player', JSON.stringify(player));
                            Game.setupGame(req, res, body, from, player);
                        })
                    });
                }
            });
        }
        else{
            Game.determineIfChoice(req, res, body, from);
        }
    },
    setupGame: function(req, res, body, from, player){
        localStorage.setItem('progress', player.storyProgress);
        localStorage.setItem('isChoice', 'false');
        API.updatePlayerProgress(from, player.storyProgress);

        Game.determineIfChoice(req, res, body, from);
    },
    determineIfChoice: function(req, res, body, from){
        let progress = localStorage.getItem('progress');

        if(localStorage.getItem('isChoice') == 'true'){
            Game.getChoices(req, res, body, from);
        }
        else{
            Game.getNextStory(req, res, body, from, progress);
        }
    },
    getChoices: function(req, res, body, from){
        API.getChoices(localStorage.getItem('progress')).then((choices) => {
            let toStory = 0;

            for(let i=0; i<choices.length; i++){
                if(body.toLowerCase().indexOf('choices') > -1){
                    toStory = choices[i].toStory;
                    break;
                }
            }

            if(toStory == 0){
                let toSend = {
                    body: 'Response not recognized',
                    sendDelay: 0,
                    isChoice: true
                };

                Game.determineIfSMS(req, res, body, from, toSend);
            }
            else{
                API.getNextStory(toStory).then((toSend) => {
                    Game.determineIfSMS(req, res, body, from, toSend);
                })
            }
        })
    },
    getNextStory: function(req, res, body, from, toStory){
        API.getNextStory(toStory).then((toSend) => {
            if(toSend.isChoice){
                localStorage.setItem('isChoice', 'true');
                Game.getNextChoices(req, res, body, from, toStory);
            }
            else{
                localStorage.setItem('progress', toSend.toNextStory);
                localStorage.setItem('isChoice', 'false');
                API.updatePlayerProgress(from, toSend.toNextStory);
                Game.determineIfSMS(req, res, body, from, toSend);
            }
        })
    },
    getNextChoices: function(req, res, body, from, fromStory){
        API.getChoices(fromStory).then((toSend) => {
            Game.determineIfSMS(req, res, body, from, toSend);
        })
    },
    determineIfSMS: function(req, res, body, from, toSend){
        let end = (toSend.isChoice);
        let smsTimeout = TimeoutPromise(toSend.sendDelay, SMS.sendSMS(res, toSend.body, end));

        smsTimeout.then(() => {
            console.log()
            if(!toSend.isChoice){
                Game.play(req, res, body, from);
            }
        })
    }
};

exports.Game = Game;
console.log('game.js loaded successfully');
