import util from 'util';

/**
 * A collection of useful but semi-unrelated methods
 */
const Utils = {
    /**
     * Format an HTTP response
     * @param {string} err - An error
     * @param {string} suc - A success
     * @param {string} message - Hardcoded message, should be name of function
     * @param {boolean?} emptyIdBad - False by default, used for arrays
     */
    formatResult: function(err, suc, message, emptyIdBad){
        let result;
        if(!Utils.doesExist(emptyIdBad)){
            emptyIdBad = false;
        }

        if(Utils.doesExist(err)){
            result = err;
            result.success = false;
        }
        else if(Utils.doesExist(suc)){
            result = suc;

            if(Array.isArray(result)){
                if(result.length == 0){
                    if(emptyIdBad){
                        result.push({success: false});
                    }
                    else{
                        result.push({success: true});
                    }
                }
                else{
                    result[0].success = true;
                }
            }
            else{
                result.success = true;
            }
        }
        else{
            result.success = false;
        }

        console.log(message + ': ');
        if(Array.isArray(result)){
            for(let i=0; i<result.length; i++){
                Utils.printObj(result);
            }
        }
        else{
            Utils.printObj(result);
        }

        return result;
    },
    /**
     * Print an entire object
     * @param {any} elem - Any variable
     */
    printObj: function(elem){
        util.inspect(elem, {showHidden: false, depth: null});
    },
    /**
     * Check if a variable exists
     * @param {any} elem - Any variable
     */
    doesExist: function(elem){
        return !(typeof elem === 'undefined' || elem == null);
    },
    /**
     * Special case for checking if a localStorage item exists
     * @param {any} elem - Any localStorage return variable
     */
    doesStorageExist: function(elem){
        return (Utils.doesExist(elem) && elem.toString().length > 0);
    }
};

exports.Utils = Utils;
console.log('utils.js loaded successfully');
