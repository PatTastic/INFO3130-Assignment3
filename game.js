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

/**
 * The game itself
 */
const Game = {
    /**
     * Entry point, determine if a new game is needed or a game is continued
     * @param {any} req - Request
     * @param {any} res - Result
     * @param {string} body - Message received
     * @param {string} from - Phone number message was sent from
     */
    play: function(req, res, body, from){
        if (typeof localStorage === 'undefined' || localStorage === null) {
            localStorage = new LocalStorage('./scratch');
        }

        let savedPlayer = localStorage.getItem(from + '_player');
        if(!Utils.doesStorageExist(savedPlayer)){
            // player does not exist in session

            API.checkIfNumberExists(from).then((player) => {
                // number exists in database, load into session, continue game
                localStorage.setItem(from + '_player', JSON.stringify(player));
                Game.setupGame(req, res, body, from, player);
            }).catch(() => {
                // number does not exist, create new player, start new game
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
            // player exists in session, continue game
            Game.checkAlwaysPresentStates(req, res, body, from);
        }
    },
    /**
     * Game setup, only needed if user does not exist in session
     * @param {any} req - Request
     * @param {any} res - Result
     * @param {string} body - Message received
     * @param {string} from - Phone number message was sent from
     * @param {any} player - Current player object
     */
    setupGame: function(req, res, body, from, player){
        // set progress
        localStorage.setItem(from + '_progress', player.storyProgress);
        API.updatePlayerProgress(from, player.storyProgress);

        // check if current story is a user choice
        API.isChoice(player.storyProgress).then((isChoice) => {
            localStorage.setItem(from + '_isChoice', (isChoice == 1 ? 'true' : 'false'));
        }).catch((err) => {
            console.log('ERROR: ' + err);
        })

        Game.checkAlwaysPresentStates(req, res, body, from);
    },
    /**
     * Check if user requested a non-story state
     * @param {any} req - Request
     * @param {any} res - Result
     * @param {string} body - Message received
     * @param {string} from - Phone number message was sent from
     */
    checkAlwaysPresentStates: function(req, res, body, from){
        let msg = '';

        // inital checks before real check
        if(body.toLowerCase() != 'reset'){
            // "reset" requires the word "reset" to be sent twice as
            // a confirmation. If "reset" was not sent, remove flag from
            // session, if it exists
            localStorage.removeItem(from + '_reset');
        }
        if(body.toLowerCase().match(/^(change name ).+/gi)){
            // change the users name, regex wouldnt work in switch

            // parse out new name
            let newName = body.replace(/(change name)/, '').trim();
            // update name
            API.updatePlayerName(newName, from);
            let player = localStorage.getItem(from + '_player');
            player = JSON.parse(player);
            player.name = newName;
            localStorage.setItem(from + '_player', JSON.stringify(player));
            // create message for user
            msg = 'Name changed to ' + newName;
        }

        switch(body.toLowerCase()){
            case 'help':
                // display the help state
                msg = '== Help =='
                    + '\nAction options appear in [square brackets].'
                    + '\nMessage back one of the options to progress the game.'
                    + '</Message><Message>'
                    + '== Help =='
                    + '\nOther Commands:'
                    + '\n- reset\n- change name [new name]\n- credits';
                break;
            case 'reset':
                // reset state
                let reset = localStorage.getItem(from + '_reset');
                if(Utils.doesStorageExist(reset)){
                    // reset exists in session, has been sent twice in a row. Reset has been confirmed
                    msg = 'Your game has been reset.';
                    localStorage.removeItem(from + '_reset');
                    localStorage.removeItem(from + '_isChoice');
                    localStorage.setItem(from + '_progress', 1);
                    API.updatePlayerProgress(from, 1);
                }
                else{
                    // reset has been requested, ask for confirmation
                    localStorage.setItem(from + '_reset', 1);
                    msg = 'This will reset your game progress back to the very start.'
                        + '\nMessage "reset" again to confirm reset.'
                        + '\nContinue with the game to ignore.';
                }
                break;
            case 'credits':
                // display credits state
                msg = 'Made by Pat Wilken for INFO3130 Assignment 3'
                    + '\n\nhttps://patwilken.me';
                break;
        }

        if(msg != ''){
            // an always-present state was requested, send the result to the user
            // will not count as a proper game turn.
            msg = '<Message>' + msg + '</Message>';
            SMS.sendSMS(res, msg);
        }
        else{
            // an always-preset game state was not requested, continue
            Game.determineIfChoice(req, res, body, from);
        }
    },
    /**
     * Determine if current story requires a user choice
     * @param {any} req - Request
     * @param {any} res - Result
     * @param {string} body - Message received
     * @param {string} from - Phone number message was sent from
     */
    determineIfChoice: function(req, res, body, from){
        let progress = localStorage.getItem(from + '_progress');

        if(localStorage.getItem(from + '_isChoice') == 'true'){
            // story does require a choice, check for user response
            Game.getChoices(req, res, body, from);
        }
        else{
            // story does not require a choice, continue
            Game.getNextStory(req, res, body, from, progress);
        }
    },
    /**
     * Check user response against given choices
     * @param {any} req - Request
     * @param {any} res - Result
     * @param {string} body - Message received
     * @param {string} from - Phone number message was sent from
     */
    getChoices: function(req, res, body, from){
        let progress = localStorage.getItem(from + '_progress');
        API.getChoices(progress).then((choices) => {
            let toStory = 0;

            // loop through all possible choices, get next story ID if found
            for(let i=0; i<choices.length; i++){
                if(progress == 10 && choices[i].choice == '%any%'){
                    // choice is '%any%', so any user reponse is fine
                    // the only time this is used is for setting the users name
                    toStory = choices[i].toStory;

                    // update users name
                    let player = localStorage.getItem(from + '_player');
                    player = JSON.parse(player);
                    player.name = body;
                    localStorage.setItem(from + '_player', JSON.stringify(player));
                    API.updatePlayerName(body, from);
                }
                if(body.toLowerCase().indexOf(choices[i].choice) > -1){
                    // given choice exists somewhere in the users response, good enough
                    toStory = choices[i].toStory;
                    break;
                }
            }

            if(toStory == 0){
                // user response did not match any given choice, complain

                // show user a list of expected responses
                let msg = 'Response not recognized, looking for ';
                let choicesText = [];
                for(let i=0; i<choices.length; i++){
                    choicesText.push(choices[i].choice);
                }
                msg += '"' + choicesText.join('", "') + '".';

                // format in message-style object
                let toSend = {
                    body: msg,
                    sendDelay: 0,
                    isChoice: true
                };

                // pass to sms entry point within game.js
                Game.sendReponse(req, res, body, from, toSend);
            }
            else{
                // user response matched a given choice, update progress with choice
                localStorage.setItem(from + '_progress', toStory);
                Game.getNextStory(req, res, body, from, toStory);
            }
        }).catch((err) => {
            console.log('ERROR: ' + err);
        })
    },
    /**
     * Fetch next story object
     * @param {any} req - Request
     * @param {any} res - Result
     * @param {string} body - Message received
     * @param {string} from - Phone number message was sent from
     * @param {number} toStory - ID of story object to fetch
     */
    getNextStory: function(req, res, body, from, toStory){
        API.getNextStory(toStory).then((toSend) => {
            if(toSend.title == 'game over'){
                // game over scenario, reset game
                SMS.sendStory(res, from, toSend.body, true);
                localStorage.removeItem(from + '_reset');
                localStorage.removeItem(from + '_isChoice');
                localStorage.setItem(from + '_progress', 1);
                API.updatePlayerProgress(from, 1);
            }
            else{
                // continue game
                if(toSend.isChoice){
                    // story object requires user choice
                    localStorage.setItem(from + '_isChoice', 'true');
                    Game.sendReponse(req, res, body, from, toSend);
                }
                else{
                    // story object does not require user choice, continue
                    localStorage.setItem(from + '_progress', toSend.toNextStory);
                    localStorage.setItem(from + '_isChoice', 'false');
                    API.updatePlayerProgress(from, toSend.toNextStory);
                    Game.sendReponse(req, res, body, from, toSend);
                }
            }
        }).catch((err) => {
            console.log('ERROR: ' + err);
        })
    },
    /**
     * Fetch choices for current story
     * @param {any} req - Request
     * @param {any} res - Result
     * @param {string} body - Message received
     * @param {string} from - Phone number message was sent from
     * @param {number} fromStory - Story ID to fetch choices for
     */
    getNextChoices: function(req, res, body, from, fromStory){
        API.getChoices(fromStory).then((toSend) => {
            Game.sendReponse(req, res, body, from, toSend);
        }).catch((err) => {
            console.log('ERROR: ' + err);
        })
    },
    /**
     * Determine if a response will be sent to the user
     * @param {any} req - Request
     * @param {any} res - Result
     * @param {string} body - Message received
     * @param {string} from - Phone number message was sent from
     * @param {any} toSend - Message object
     */
    sendReponse: function(req, res, body, from, toSend){
        // set end flag (if last message of a response)
        let end = (toSend.isChoice);

        // send response after sendDelay
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
