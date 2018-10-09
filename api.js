import Database from './db';
import Utils from './utils';

const DB = Database.DB;
const MySQL = Database.MySQL;

const API = {
    // PLAYER
    checkIfNumberExists = function(phoneNumber){
        phoneNumber = phoneNumber.replace(/\D/gi, '');

        let query = 'SELECT p.name, p.phoneNumber, p.storyProgress FROM player p WHERE p.phoneNumber = ?;';
        query = MySQL.format(query, [phoneNumber]);

        DB.query(query, function(err, suc){
            let result = Utils.formatResult(err, suc, 'checkIfNumberExists');
            res.send(result);
        })
    },
    createPlayer = function(name, phoneNumber){
        phoneNumber = phoneNumber.replace(/\D/gi, '');

        let insert = 'INSERT INO player(id, name, phoneNumber, storyProgress) VALUES (DEFAULT, ?, ?, 1);';
        insert = MySQL.format(insert, [name, phoneNumber]);

        DB.query(insert, function(err, suc){
            let result = Utils.formatResult(err, suc, 'createPlayer');
            res.send(result);
        });
    },
    updatePlayerName = function(name, phoneNumber){
        let update = 'UPDATE player p SET p.name = ? WHERE p.phoneNumber = ?;';
        update = MySQL.format(update, [name, phoneNumber]);

        DB.query(update, function(err, suc){
            let result = Utils.formatResult(err, suc, 'updatePlayerName');
            res.send(result);
        });
    },
    getPlayerName = function(phoneNumber){
        let query = 'SELECT p.name FROM player p WHERE p.phoneNumber = ?;';
        query = MySQL.format(query, [phoneNumber]);

        DB.query(query, function(err, suc){
            let result = Utils.formatResult(err, suc, 'getPlayerName');
            res.send(result);
        });
    },
    updatePlayerProgress = function(phoneNumber, storyProgress){
        let update = 'UPDATE player p SET storyProgress = ? WHERE p.phoneNumber = ?;';
        update = MySQL.format(update, [storyProgress, phoneNumber]);

        DB.query(update, function(err, suc){
            let result = Utils.formatResult(err, suc, 'updatePlayerProgress');
            res.send(result);
        });
    },
    getPlayerProgress = function(phoneNumber){
        let query = 'SELECT p.storyProgress FROM player p WHERE p.phoneNumber = ?;';
        query = MySQL.format(query, [phoneNumber]);

        DB.query(query, function(err, suc){
            let result = Utils.formatResult(err, suc, 'getPlayerProgress');
            res.send(result);
        });
    },
    // STORY
    getNextStory = function(storyId){
        let query = 'SELECT s.title, s.body, s.sendDelay, s.isChoice, s.toNextStory FROM story s WHERE id = ?;';
        query = MySQL.format(query, [storyId]);

        DB.query(query, function(err, suc){
            let result = Utils.formatResult(err, suc, 'getNextStory');
            res.send(result);
        });
    },
    // CHOICE
    getChoices = function(storyId){
        let query = 'SELECT c.choice, sc.toStory FROM storyChoice sc JOIN choice c '
            + 'ON sc.choiceId = c.id WHERE sc.storyId = ?;';
        query = MySQL.format(query, [storyId]);

        DB.query(query, function(err, suc){
            let result = Utils.formatResult(err, suc, 'getChoices');
            res.send(result);
        });
    }
};

exports.API = API;
console.log('api.js loaded successfully');
