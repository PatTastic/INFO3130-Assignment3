import database from './db';
import utils from './utils';

const DB = database.DB;
const MySQL = database.MySQL;
const Utils = utils.Utils;

/**
 * All APIs for communicating with the database
 */
const API = {
    // PLAYER //
    /**
     * Check if a phone number exists
     * If it does, pass back related data
     * @param {string} phoneNumber - Phone number to check
     */
    checkIfNumberExists: function(phoneNumber){
        return new Promise((resolve, reject) => {
            let query = 'SELECT p.name, p.phoneNumber, p.storyProgress FROM player p WHERE p.phoneNumber = ?;';
            query = MySQL.format(query, [phoneNumber]);

            DB.query(query, (err, suc) => {
                let result = Utils.formatResult(err, suc, 'checkIfNumberExists');

                result = result[0];
                result.success = (Utils.doesExist(result.name));
                result.success ? resolve(result) : reject(result);
            })
        })
    },
    /**
     * Create a new player
     * @param {string} name - Player name
     * @param {string} phoneNumber - Phone number
     */
    createPlayer: function(name, phoneNumber){
        return new Promise((resolve, reject) => {
            let insert = 'INSERT INTO player(id, name, phoneNumber, storyProgress) VALUES (DEFAULT, ?, ?, 1);';
            insert = MySQL.format(insert, [name, phoneNumber]);

            DB.query(insert, (err, suc) => {
                let result = Utils.formatResult(err, suc, 'createPlayer');
                result.success ? resolve(result) : reject(result);
            });
        })
    },
    /**
     * Update a player name
     * @param {string} name - New name
     * @param {string} phoneNumber - Related phone number
     */
    updatePlayerName: function(name, phoneNumber){
        let update = 'UPDATE player SET name = ? WHERE phoneNumber = ?;';
        update = MySQL.format(update, [name, phoneNumber]);

        DB.query(update, (err, suc) => {
            let result = Utils.formatResult(err, suc, 'updatePlayerName');
            return result;
        });
    },
    /**
     * Get a players name based on phone number
     * @param {string} phoneNumber - User phone number
     */
    getPlayerName: function(phoneNumber){
        let query = 'SELECT p.name FROM player p WHERE p.phoneNumber = ?;';
        query = MySQL.format(query, [phoneNumber]);

        DB.query(query, (err, suc) => {
            let result = Utils.formatResult(err, suc, 'getPlayerName');
            return result[0];
        });
    },
    /**
     * Update a players story progress
     * @param {string} phoneNumber - Phone number
     * @param {number} storyProgress - Story progress
     */
    updatePlayerProgress: function(phoneNumber, storyProgress){
        let update = 'UPDATE player SET storyProgress = ? WHERE phoneNumber = ?;';
        update = MySQL.format(update, [storyProgress, phoneNumber]);

        DB.query(update, (err, suc) => {
            let result = Utils.formatResult(err, suc, 'updatePlayerProgress');
            return result;
        });
    },
    /**
     * Get a players story progress
     * @param {string} phoneNumber - Phone number
     */
    getPlayerProgress: function(phoneNumber){
        let query = 'SELECT p.storyProgress FROM player p WHERE p.phoneNumber = ?;';
        query = MySQL.format(query, [phoneNumber]);

        DB.query(query, (err, suc) => {
            let result = Utils.formatResult(err, suc, 'getPlayerProgress');
            return result[0];
        });
    },
    // STORY //
    /**
     * Get the next story object
     * @param {number} storyId - ID of story object to fetch
     */
    getNextStory: function(storyId){
        return new Promise((resolve, reject) => {
            let query = 'SELECT s.title, s.body, s.sendDelay, s.isChoice, s.toNextStory FROM story s WHERE id = ?;';
            query = MySQL.format(query, [storyId]);

            DB.query(query, (err, suc) => {
                let result = Utils.formatResult(err, suc, 'getNextStory');

                result = result[0];
                result.success ? resolve(result) : reject(result);
            });
        })
    },
    /**
     * Check if story object includes a user choice
     * @param {number} storyId - Story object to check
     */
    isChoice: function(storyId){
        return new Promise((resolve, reject) => {
            let query = 'SELECT s.isChoice FROM story s WHERE s.id = ?;';
            query = MySQL.format(query, [storyId]);

            DB.query(query, (err, suc) => {
                let result = Utils.formatResult(err, suc, 'isChoice');

                result = result[0];
                result.success ? resolve(result) : reject(result);
            })
        })
    },
    // CHOICE //
    /**
     * Get current user story choices
     * @param {number} storyId - Story object to fetch choices for
     */
    getChoices: function(storyId){
        return new Promise((resolve, reject) => {
            let query = 'SELECT c.choice, sc.toStory FROM storyChoice sc JOIN choice c '
                + 'ON sc.choiceId = c.id WHERE sc.storyId = ?;';
            query = MySQL.format(query, [storyId]);

            DB.query(query, (err, suc) => {
                let result = Utils.formatResult(err, suc, 'getChoices');
                result[0].success ? resolve(result) : reject(result);
            });
        })
    }
};

exports.API = API;
console.log('api.js loaded successfully');
