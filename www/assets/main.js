$(function(){
    var pastMessages = History.get();
    if(pastMessages !== false){
        for(var i=0; i<pastMessages.length; i++){
            print(pastMessages[i].message, pastMessages[i].from);
        }
    }

    var phone = getPhoneNumber();
    if(phone === false){
        phone = makeID();
        localStorage.setItem('fake-number', phone);
    }
});

$('#send').click(function(e)){
    var msg = $('#msg').val().trim();

    if(msg != ''){
        History.add(msg, 'user');
        sendMessage(msg);
    }
}

function sendMessage(){
    $.get('https://info3130-a3.herokuapp.com/web/', {
        body: msg,
        from: getPhoneNumber()
    }, function(data, status){
        console.log(data);
        console.log(status);
    });
}

function print(msg, from){
    var className = (from == 'server' ? 'from-server' : 'from-user');
    $('#messages').append('<li class="' + className + '">' + msg + '</li>');
}

/* Helper Functions */
function getPhoneNumber(){
    var phone = localStorage.getItem('fake-number');

    if(typeof phone === 'undefined' || phone == null){
        phone = false;
    }

    return phone;
}

function makeID() {
    var id = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < 10; i++){
        id += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return id;
}

var History = {
    add: function(msg, from){
        var pastMessages = History.get();

        if(pastMessages === false){
            pastMessages = [{message: msg, from: from}];
        }
        else{
            pastMessages.push({message: msg, from: from});
        }

        localStorage.setItem('history', JSON.stringify(pastMessages));
    },
    get: function(){
        var pastMessages = localStorage.getItem('history');

        if(typeof pastMessages !== 'undefined' && pastMessages != null){
            pastMessages = JSON.parse(pastMessages);
        }
        else{
            pastMessages = false;
        }

        return pastMessages;
    }
};
