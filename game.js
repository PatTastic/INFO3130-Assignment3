import Database from './db';
import Utils from './utils';
import API from './api';

const DB = Database.DB;
const MySQL = Database.MySQL;

const Game = {
    play: function(body, from){
        if(!Utils.doesExist(req.params['player'])){
            let player = API.checkIfNumberExists(from);

            if(player.success){
                res.cookie('player', JSON.stringify(player));
            }
            else{
                API.createPlayer('', from);
                player = API.checkIfNumberExists(from);
                res.cookie('player', JSON.stringify(player));
            }

            res.cookie('progress', 1);
            res.cookie('isChoice', 'false');
        }

        let progress = req.cookies['progress'];
        let toSend = {};

        if(req.cookies['isChoice'] == 'true'){
            let choices = API.getChoices(req.cookies['progress']);
            let toStory = 0;

            for(let i=0; i<choices.length; i++){
                if(body.toLowerCase().indexOf('choices') > -1){
                    toStory = choices[i].toStory;
                    break;
                }
            }

            if(toStory == 0){
                toSend = {
                    body: 'Response not recognized',
                    sendDelay: 0
                };
            }
            else{
                toSend = API.getNextStory(toStory);
            }
        }
        else{
            toSend = API.getNextStory(progress);

            if(toSend.isChoice){
                toSend = API.getChoices(progress);
                res.cookie('isChoice', 'true');
            }
            else{
                res.cookie('progress', toSend.toNextStory);
                res.cookie('isChoice', 'false');
            }
        }

        let msg = '<Response><Message>' + toSend.body + '</Message></Response>';
        setTimeout(Game.sendSMS, toSend.sendDelay, msg);

        if(!toSend.isChoice){
            Game.play();
        }
    },
    sendSMS: function(msg){
        res.writeHead(200, {'Content-Type': 'text/xml'});
        res.end(msg);
    }
};

exports.Game = Game;
console.log('game.js loaded successfully');
