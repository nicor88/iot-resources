var clientio= {
    initialize: function () {
        var clientObj = this;       //reference to the current object (this --> clientio)

        //$('#connect').click(function (e) {
        //    var fullIp = 'http://' + $('#ip-select').val() + '/development';
        //    clientObj.connect(fullIp);
        // });

        $('#room-join').hide();
        $('#send').hide();
        clientObj.connect('http://localhost:3000/development');
    },
    connect: function(ip){
        var clientObj = this;
        var joined = false;
        var namespace_socket;
        namespace_socket = io.connect(ip);
        namespace_socket.on('connect', function () {
            $('#output').append('<br>' + clientObj.returnDate(new Date()) + ' : connected to socket');
            $('#room-join').show();
            $('#send').show();
            $('#room-join').click(function (e) {
                //joined = true;
                namespace_socket.emit('join room', $('#room-select').val(), function(ack){
                    $('#output').append('<br>'+clientObj.returnDate(new Date())+' : '+ ack);
                    joined = true;      //set joined to true only after the ack is received
                });
            });
            namespace_socket.on('message', function (msg) {
                $('#output').append('<br>' + clientObj.returnDate(new Date()) + ' : ' + msg);
            });
            $('#send').click(function (e) {
                if (joined) {
                    $('#output').append('<br>' + clientObj.returnDate(new Date()) + ' : ' + $('#room-text').val());
                    namespace_socket.emit('fromclient', $('#room-text').val());
                    $('#room-text').val('');
                }
                else {
                    //$('#output').append('<br>' + returnDate(new Date()) + ' : you need to join a room before send message');
                    alert('You need to join a room before send a message');
                }
            });
        });
    },
    returnDate: function(date){
        return date.getFullYear() + '/'+(date.getMonth()+1) + '/' + date.getDate() + ' ' + date.getHours() +
            ':' + date.getMinutes() + ':' + date.getSeconds() + '.' + date.getMilliseconds();
    }
};
clientio.initialize();

