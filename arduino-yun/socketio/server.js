var express = require('express');
var http = require('http');
var fs = require('fs');
var io = require('socket.io');
var clientio = require('socket.io-client');

var app = express();
app.use('/', express.static(__dirname + '/view'));
var server = app.listen(3000);
console.log(returnDate(new Date())+' : server listening on port 3000');

app.get('/', function (req, res) {
    res.writeHead(200, { 'Content-type': 'text/html'});
    res.end(fs.readFileSync(__dirname + '/view/index.html'));
});

io = io.listen(server);
var namespace = io
    .of('/development')
    .on('connection', function(socket) {
        console.log(returnDate(new Date())+' : client connected '+socket.client.id);
        var joinedRoom = null;

        socket.on('join room', function(room, ack) {
            socket.join(room);
            joinedRoom = room;

            /* no more needed, see below
            socket.emit('joined', "you've joined " + room);
             */

            // Instead of emitting the answer as .emit('joined') use the ack data to automatically send back an answer
            // to the sender (see the client part at "client.js" line 29)
            ack(["you've joined " + room]);

            socket.broadcast.to(joinedRoom).send('someone joined room ' + joinedRoom);
        });

        socket.on('fromclient', function(data) {
            if (joinedRoom) {
                socket.rooms.forEach(function(r) {
                    console.log('Room: '+r);
                });

                console.log('on "fromclient" (room ' + joinedRoom +'): '+ data);
                socket.broadcast.to(joinedRoom).send(data);
            } else {
                socket.send("you've not joined any room: select a room and then press join button");
            }
        });
    });

//utils and functions
function returnDate(date){
    return date.getFullYear()+'/'+(date.getMonth()+1)+'/'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+'.'+date.getMilliseconds();
}