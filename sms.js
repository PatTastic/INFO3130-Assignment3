import timeoutPromise from './timeout-promise';

const SMS = {
    sendSMS: function(res, msg, end){
        return new Promise((resolve, reject) => {
            //res.writeHead(200, {'Content-Type': 'text/xml'});

            msg = '<Response><Message>' + msg + '</Message></Response>';
            (end ? res.end(msg) : res.write(msg));

            resolve(true);
        })
    }
};

exports.SMS = SMS;
console.log('sms.js loaded successfully');
