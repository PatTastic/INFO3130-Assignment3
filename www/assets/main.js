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

    $('#msg').focus();
});

$('#clear').click(function(){
    localStorage.removeItem('history');
    $('#messages').html('');
});

$('#send').click(function(e){
    sendMessage();
});
$('#msg').keypress(function(e){
    if(typeof e !== 'undefined' && e.which == 13){
        sendMessage();
    }
})
function sendMessage(){
    var msg = $('#msg').val().trim();

    if(msg != ''){
        History.add(msg, 'user');
        print(msg, 'user');
        $('#msg').val('').focus();
        getNextStory(msg);
    }
}

function getNextStory(msg){
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
    var messages = $('#messages');

    messages.append('<li class="' + className + '"><p>' + msg + '</p></li>');
    messages.animate({scrollTop: messages.prop('scrollHeight')}, 0);
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
