import timeoutPromise from './timeout-promise';
import nodeLocalstorage from 'node-localstorage';
import utils from './utils';

const Utils = utils.Utils;
const LocalStorage = nodeLocalstorage.LocalStorage;
var localStorage;

const SMS = {
    sendStory: function(res, from, msg, end){
        return new Promise((resolve, reject) => {
            if (typeof localStorage === 'undefined' || localStorage === null) {
                localStorage = new LocalStorage('./scratch');
            }

            let wholeMsg = localStorage.getItem(from + '_sms');
            if(!Utils.doesExist(wholeMsg) || wholeMsg.length == 0){
                wholeMsg = '';
            }

            wholeMsg += '<Message>' + msg + '</Message>';
            localStorage.setItem(from + '_sms', wholeMsg);

            if(end){
                wholeMsg = SMS.parseBody(from, wholeMsg);
                localStorage.removeItem(from + '_sms');

                SMS.sendSMS(res, wholeMsg);
            }

            resolve(true);
        })
    },
    parseBody: function(from, msg){
        let player = localStorage.getItem(from + '_player');
        player = JSON.parse(player);

        msg = msg.replace(/\%name\%/gi, player.name);
        msg = msg.replace(/\\n/gi, '%0a');

        return msg;
    },
    sendSMS: function(res, msg){
        res.writeHead(200, {'Content-Type': 'text/xml'});
        res.end('<Response>' + msg + '</Response>');
    }
};

exports.SMS = SMS;
console.log('sms.js loaded successfully');
