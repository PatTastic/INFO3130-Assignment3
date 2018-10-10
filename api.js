import database from './db';
import utils from './utils';

const DB = database.DB;
const MySQL = database.MySQL;
const Utils = utils.Utils;

const API = {
    // PLAYER
    checkIfNumberExists: function(phoneNumber){
        return new Promise((resolve, reject) => {
            phoneNumber = phoneNumber.replace(/\D/gi, '');

            let query = 'SELECT p.name, p.phoneNumber, p.storyProgress FROM player p WHERE p.phoneNumber = ?;';
            query = MySQL.format(query, [phoneNumber]);

            DB.query(query, function(err, suc){
                let result = Utils.formatResult(err, suc, 'checkIfNumberExists');

                result = result[0];
                result.success = (Utils.doesExist(result.name));
                result.success ? resolve(result) : reject(result);
            })
        })
    },
    createPlayer: function(name, phoneNumber){
        return new Promise((resolve, reject) => {
            phoneNumber = phoneNumber.replace(/\D/gi, '');

            let insert = 'INSERT INO player(id, name, phoneNumber, storyProgress) VALUES (DEFAULT, ?, ?, 1);';
            insert = MySQL.format(insert, [name, phoneNumber]);

            DB.query(insert, function(err, suc){
                let result = Utils.formatResult(err, suc, 'createPlayer');
                result.success ? resolve(result) : reject(result);
            });
        })
    },
    updatePlayerName: function(name, phoneNumber){
        let update = 'UPDATE player p SET p.name = ? WHERE p.phoneNumber = ?;';
        update = MySQL.format(update, [name, phoneNumber]);

        DB.query(update, function(err, suc){
            let result = Utils.formatResult(err, suc, 'updatePlayerName');
            return result;
        });
    },
    getPlayerName: function(phoneNumber){
        let query = 'SELECT p.name FROM player p WHERE p.phoneNumber = ?;';
        query = MySQL.format(query, [phoneNumber]);

        DB.query(query, function(err, suc){
            let result = Utils.formatResult(err, suc, 'getPlayerName');
            return result[0];
        });
    },
    updatePlayerProgress: function(phoneNumber, storyProgress){
        let update = 'UPDATE player p SET storyProgress = ? WHERE p.phoneNumber = ?;';
        update = MySQL.format(update, [storyProgress, phoneNumber]);

        DB.query(update, function(err, suc){
            let result = Utils.formatResult(err, suc, 'updatePlayerProgress');
            return result;
        });
    },
    getPlayerProgress: function(phoneNumber){
        let query = 'SELECT p.storyProgress FROM player p WHERE p.phoneNumber = ?;';
        query = MySQL.format(query, [phoneNumber]);

        DB.query(query, function(err, suc){
            let result = Utils.formatResult(err, suc, 'getPlayerProgress');
            return result[0];
        });
    },
    // STORY
    getNextStory: function(storyId){
        return new Promise((resolve, reject) => {
            let query = 'SELECT s.title, s.body, s.sendDelay, s.isChoice, s.toNextStory FROM story s WHERE id = ?;';
            query = MySQL.format(query, [storyId]);

            DB.query(query, function(err, suc){
                let result = Utils.formatResult(err, suc, 'getNextStory');

                result = result[0];
                result.success ? resolve(result) : reject(result);
            });
        })
    },
    isChoice: function(storyId){
        return new Promise((resolve, reject) => {
            let query = 'SELECT s.isChoice FROM story s WHERE s.id = ?;';
            query = MySQL.format(query, [storyId]);

            DB.query(query, function(err, suc){
                let result = Utils.formatResult(err, suc, 'isChoice');

                result = result[0];
                result.success ? resolve(result) : reject(result);
            })
        })
    },
    // CHOICE
    getChoices: function(storyId){
        return new Promise((resolve, reject) => {
            let query = 'SELECT c.choice, sc.toStory FROM storyChoice sc JOIN choice c '
                + 'ON sc.choiceId = c.id WHERE sc.storyId = ?;';
            query = MySQL.format(query, [storyId]);

            DB.query(query, function(err, suc){
                let result = Utils.formatResult(err, suc, 'getChoices');

                result = result[0];
                result.success ? resolve(result) : reject(result);
            });
        })
    }
};

exports.API = API;
console.log('api.js loaded successfully');
