import util from 'util';

const Utils = {
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
    printObj: function(elem){
        util.inspect(elem, {showHidden: false, depth: null});
    },
    doesExist: function(elem){
        return !(typeof elem === 'undefined' || elem == null);
    }
};

exports.Utils = Utils;
console.log('utils.js loaded successfully');
