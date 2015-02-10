//MODULES
var io = require('socket.io');
var cookie = require('cookie');
var cookieParser = require('cookie-parser');

//VARIABLES
var hostname = process.env.HOSTNAME || 'localhost';
var port = 3000;

var app = require('./webserver');
var webserver = app.initWebServer(__dirname + "/../");

var server = webserver.listen(port);

var _rooms = {};

if (server) {
    console.log("Express listening at http://" + hostname + ":" + port);
    var sessionStore = app.getSessionStore();
    var socket = io.listen(server, {log: false});

    socket.set('authorization', function (data, accept) {
        if (data.headers.cookie) {
            var cookies = cookie.parse(data.headers.cookie);
            data.sessionID = cookieParser.signedCookie(cookies["session_cookie"], "s3cr3tp4s5");

            sessionStore.get(data.sessionID, function (err, session) {
                if (err || !session) {
                    // if we cannot grab a session, turn down the connection
                    accept('Error', false);
                } else {
                    // save the session data and accept the connection
                    data.session = session;
                    accept(null, true);
                }
            });
        } else {
            return accept('No cookie transmitted.', false);
        }
    });


    socket.on('connection', function (client) {
        var user = client.request.session.user;
        console.log("client connected", user);

        client.on("joinedRoom", function (data) {
            joinTeam(client, data.roomName, user, data.timerVal);
            broadCastRoomStatus();
        });

        client.on("timerVal", function (data) {
            _rooms[data.roomName][user + "/" + client.id].timer = data.timerVal;
            socket.to(data.roomName).emit('roomStatus', {name: data.roomName, users: _rooms[data.roomName]});
        });

        client.on("leavedRoom", function (roomName) {
            leaveTeam(client, user);
            broadCastRoomStatus();
        });

        client.on("disconnect", function () {
            cleanRooms(user, client);
			broadCastRoomStatus();
        });

    });
	
	function broadCastRoomStatus(){
		for (var i in _rooms) {
            socket.to(i).emit('roomStatus', {name: i, users: _rooms[i]});
        }
	}
	
    function joinTeam(client, roomName, user, timerVal) {
        leaveAllRooms(client);
        client.join(roomName);

        cleanRooms(user, client);
        if (!_rooms[roomName]) {
            _rooms[roomName] = {};
        }
        _rooms[roomName][user + "/" + client.id] = {timer: timerVal};
    }

    function leaveTeam(client, user) {
        leaveAllRooms(client);
        cleanRooms(user, client);
    }

    function leaveAllRooms(client) {
        if (client.rooms) {
            for (var i = 0; i < client.rooms.length; i++) {
                client.leave(client.rooms[i]);
            }
        }
    }

    function cleanRooms(user, client) {
        for (var j in _rooms) {
            if (_rooms && _rooms[j]) {
                if(typeof _rooms[j][user + "/" + client.id] === "object"){
                    delete _rooms[j][user + "/" + client.id];
                }

            }
            var empty = true;
            for(var k in _rooms[j]){
                if(_rooms[j][k]) empty = false;
            }
            if(empty === true){
                delete _rooms[j];
            }
        }
    }


    setInterval(function () {
        socket.emit("tick");

    }, 1000);
}