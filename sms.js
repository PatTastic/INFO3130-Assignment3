import timeoutPromise from './timeout-promise';
import nodeLocalstorage from 'node-localstorage';
import utils from './utils';

const Utils = utils.Utils;
const LocalStorage = nodeLocalstorage.LocalStorage;
var localStorage;

/**
 * All SMS methods
 */
const SMS = {
    /**
     * Main entry point from game.js
     * Gathers & sends all related messages in 1 response
     * @param {any} res - Result
     * @param {string} from - User phone number
     * @param {string} msg - Message to send/add to messages
     * @param {boolean} end - If this is the last message, if true, end response
     */
    sendStory: function(res, from, msg, end){
        return new Promise((resolve, reject) => {
            if (typeof localStorage === 'undefined' || localStorage === null) {
                localStorage = new LocalStorage('./scratch');
            }

            // get other messages to be sent, if any exist
            let wholeMsg = localStorage.getItem(from + '_sms');
            if(!Utils.doesStorageExist(wholeMsg)){
                wholeMsg = '';
            }

            // add new message to other messages
            wholeMsg += '<Message>' + msg + '</Message>';
            localStorage.setItem(from + '_sms', wholeMsg);

            if(end){
                // finishing touches to message, then send
                wholeMsg = SMS.parseBody(from, wholeMsg);
                localStorage.removeItem(from + '_sms');

                SMS.sendSMS(res, wholeMsg);
            }

            resolve(true);
        })
    },
    /**
     * Parse message before it sends
     * @param {string} from - User phone number
     * @param {string} msg - Message to parse
     */
    parseBody: function(from, msg){
        // get current player
        let player = localStorage.getItem(from + '_player');
        player = JSON.parse(player);

        // parse
        msg = msg.replace(/\%name\%/gi, player.name);
        msg = msg.replace(/\\n/gi, '%0a');

        return msg;
    },
    /**
     * Send the SMS
     * @param {any} res - Result
     * @param {string} msg - Message to send
     */
    sendSMS: function(res, msg){
        if(!res.headersSent){
            // add headers if they have not yet been sent
            res.writeHead(200, {'Content-Type': 'text/xml'});
        }

        res.end('<Response>' + msg + '</Response>');
    }
};

exports.SMS = SMS;
console.log('sms.js loaded successfully');
