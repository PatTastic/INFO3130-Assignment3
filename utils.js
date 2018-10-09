import util from 'util';

const Utils = {
    formatResult: function(err, suc, message, emptyIdBad){
        if(!doesExist(emptyIdBad)){
            emptyIdBad = false;
        }

        if(doesExist(err)){
            result = err;
            result.success = false;
        }
        else if(doesExist(suc)){
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
                printObj(result);
            }
        }
        else{
            printObj(result);
        }

        return result;
    },
    printObj: function(elem){
        util.inspect(obj, {showHidden: false, depth: null});
    },
    doesExist: function(elem){
        return !(typeof elem === 'undefined' || elem == null);
    }
};

exports.Utils = Utils;
console.log('utils.js loaded successfully');
