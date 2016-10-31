var clientio = require('socket.io-client');

var localserver='http://192.168.0.2:3000';

var namespace='/development';
var socketclient = clientio.connect(localserver+namespace);

//var roomtojoin='arduinoyun';      //to remove: roomtojoin is only used inside .on('connect') so no need for a global
                                    //variable
socketclient.on('connect', function () {
    console.log(returnDate(new Date())+' : arduino connected to socket');

    var roomtojoin='arduinoyun';
    socketclient.emit('join room', roomtojoin, function(ack){
        console.log(returnDate(new Date())+' : '+ ack);
    });
});

socketclient.on('message', function (msg) {
    console.log(returnDate(new Date())+' : '+msg);
    socketclient.emit('fromclient', ' ACK Arduino for message -> '+msg);
});

socketclient.on('disconnect', function () {
    console.log(returnDate(new Date())+' : arduino disconnected from socket');
});

//utils and functions
function returnDate(date){
    return date.getFullYear()+'/'+(date.getMonth()+1)+'/'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+'.'+date.getMilliseconds();
}