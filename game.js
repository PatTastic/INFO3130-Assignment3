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

const Game = {
    play: function(req, res, body, from){
        if (typeof localStorage === 'undefined' || localStorage === null) {
            localStorage = new LocalStorage('./scratch');
        }

        let savedPlayer = localStorage.getItem(from + '_player');
        if(!Utils.doesStorageExist(savedPlayer)){
            API.checkIfNumberExists(from).then((player) => {
                localStorage.setItem(from + '_player', JSON.stringify(player));
                Game.setupGame(req, res, body, from, player);
            }).catch(() => {
                API.createPlayer('', from).then(() => {
                    API.checkIfNumberExists(from).then((player) => {
                        localStorage.setItem(from + '_player', JSON.stringify(player));
                        Game.setupGame(req, res, body, from, player);
                    }).catch((err) => {
                        console.log('ERROR: ' + err);
                    })
                }).catch((err) => {
                    console.log('ERROR: ' + err);
                });
            });
        }
        else{
            Game.checkAlwaysPresentStates(req, res, body, from);
        }
    },
    setupGame: function(req, res, body, from, player){
        localStorage.setItem(from + '_progress', player.storyProgress);
        API.updatePlayerProgress(from, player.storyProgress);

        API.isChoice(player.storyProgress).then((isChoice) => {
            localStorage.setItem(from + '_isChoice', (isChoice == 1 ? 'true' : 'false'));
        }).catch((err) => {
            console.log('ERROR: ' + err);
        })

        Game.checkAlwaysPresentStates(req, res, body, from);
    },
    checkAlwaysPresentStates: function(req, res, body, from){
        let msg = '';

        if(body.toLowerCase() != 'reset'){
            localStorage.removeItem(from + '_reset');
        }
        if(body.toLowerCase().match(/^(change name ).+/gi)){
            let newName = body.replace(/(change name)/, '').trim();
            msg = 'Name changed to ' + newName;
            API.updatePlayerName(newName, from);
            let player = localStorage.getItem(from + '_player');
            player = JSON.parse(player);
            player.name = newName;
            localStorage.setItem(from + '_player', JSON.stringify(player));
        }

        switch(body.toLowerCase()){
            case 'help':
                msg = '== Help =='
                    + '\nAction options appear in [square brackets].'
                    + '\nMessage back one of the options to progress the game.'
                    + '</Message><Message>'
                    + '== Help =='
                    + '\nOther Commands:'
                    + '\n- reset\n- change name [new name]\n- credits';
                break;
            case 'reset':
                let reset = localStorage.getItem(from + '_reset');
                if(Utils.doesStorageExist(reset)){
                    msg = 'Your game has been reset.';
                    localStorage.removeItem(from + '_reset');
                    localStorage.removeItem(from + '_isChoice');
                    localStorage.setItem(from + '_progress', 1);
                    API.updatePlayerProgress(from, 1);
                }
                else{
                    localStorage.setItem(from + '_reset', 1);
                    msg = 'This will reset your game progress back to the very start.'
                        + '\nMessage "reset" again to confirm reset.'
                        + '\nContinue with the game to ignore.';
                }
                break;
            case 'credits':
                msg = 'Made by Pat Wilken for INFO3130 Assignment 3'
                    + '\n\nhttps://patwilken.me';
                break;
        }

        if(msg != ''){
            msg = '<Message>' + msg + '</Message>';
            SMS.sendSMS(res, msg);
        }

        Game.determineIfChoice(req, res, body, from);
    },
    determineIfChoice: function(req, res, body, from){
        let progress = localStorage.getItem(from + '_progress');

        if(localStorage.getItem(from + '_isChoice') == 'true'){
            Game.getChoices(req, res, body, from);
        }
        else{
            Game.getNextStory(req, res, body, from, progress);
        }
    },
    getChoices: function(req, res, body, from){
        let progress = localStorage.getItem(from + '_progress');
        API.getChoices(progress).then((choices) => {
            let toStory = 0;

            for(let i=0; i<choices.length; i++){
                if(progress == 10 && choices[i].choice == '%any%'){
                    toStory = choices[i].toStory;

                    let player = localStorage.getItem(from + '_player');
                    player = JSON.parse(player);
                    player.name = body;
                    localStorage.setItem(from + '_player', JSON.stringify(player));
                    API.updatePlayerName(body, from);
                }
                if(body.toLowerCase().indexOf(choices[i].choice) > -1){
                    toStory = choices[i].toStory;
                    break;
                }
            }

            if(toStory == 0){
                let msg = 'Response not recognized, looking for ';
                let choicesText = [];
                for(let i=0; i<choices.length; i++){
                    choicesText.push(choices[i].choice);
                }
                msg += '"' + choicesText.join('", "') + '".';

                let toSend = {
                    body: msg,
                    sendDelay: 0,
                    isChoice: true
                };

                Game.determineIfSMS(req, res, body, from, toSend);
            }
            else{
                Game.getNextStory(req, res, body, from, toStory);
            }
        }).catch((err) => {
            console.log('ERROR: ' + err);
        })
    },
    getNextStory: function(req, res, body, from, toStory){
        API.getNextStory(toStory).then((toSend) => {
            if(toSend.title == 'game over'){
                SMS.sendStory(res, from, toSend.body, true);
                localStorage.removeItem(from + '_reset');
                localStorage.removeItem(from + '_isChoice');
                localStorage.setItem(from + '_progress', 1);
                API.updatePlayerProgress(from, 1);
            }
            else{
                if(toSend.isChoice){
                    localStorage.setItem(from + '_isChoice', 'true');
                    Game.determineIfSMS(req, res, body, from, toSend);
                    //Game.getNextChoices(req, res, body, from, toStory);
                }
                else{
                    localStorage.setItem(from + '_progress', toSend.toNextStory);
                    localStorage.setItem(from + '_isChoice', 'false');
                    API.updatePlayerProgress(from, toSend.toNextStory);
                    Game.determineIfSMS(req, res, body, from, toSend);
                }
            }
        }).catch((err) => {
            console.log('ERROR: ' + err);
        })
    },
    getNextChoices: function(req, res, body, from, fromStory){
        API.getChoices(fromStory).then((toSend) => {
            Game.determineIfSMS(req, res, body, from, toSend);
        }).catch((err) => {
            console.log('ERROR: ' + err);
        })
    },
    determineIfSMS: function(req, res, body, from, toSend){
        let end = (toSend.isChoice);
        let smsTimeout = TimeoutPromise(toSend.sendDelay, SMS.sendStory(res, from, toSend.body, end));

        smsTimeout.then(() => {
            if(!toSend.isChoice){
                Game.play(req, res, body, from);
            }
        })
    }
};

exports.Game = Game;
console.log('game.js loaded successfully');
