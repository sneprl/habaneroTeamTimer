/**
 * modules requirements
 */
var io = require('socket.io'),
    cookie = require('cookie'),
    cookieParser = require('cookie-parser'),
    roomsManager = require('./roomsManager'),
    webserver = require('./webserver'),
    config = require('./config'),
    //VARIABLES
    app = webserver.initWebServer(),
    sessionStore = webserver.getSessionStore(),
    server = app.listen(config.port),
    socket = io.listen(server, {
        log: false
    });
//Server started
console.log('Express listening at http://' + config.hostname + ':' + config.port);
/**
 * socket binding
 */
socket.set('authorization', function (data, accept) {
    if (data.headers.cookie) {
        var cookies = cookie.parse(data.headers.cookie);
        data.sessionID = cookieParser.signedCookie(cookies.session_cookie, 's3cr3tp4s5');
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
    console.log('client connected', user);
    client.on('joinedRoom', function (data) {
        roomsManager.joinTeam(client, data.roomName, user, data.timerVal);
        broadCastRoomStatus();
    });
    client.on('timerVal', function (data) {
        roomsManager.setTimerVal(client, data.roomName, user, data.timerVal);
        socket.to(data.roomName).emit('roomStatus', {
            name: data.roomName,
            users: r[data.roomName]
        });
    });
    client.on('leavedRoom', function (roomName) {
        roomsManager.leaveTeam(client, user);
        broadCastRoomStatus();
    });
    client.on('disconnect', function () {
        roomsManager.cleanRooms(user, client);
        broadCastRoomStatus();
    });
});

function broadCastRoomStatus() {
    var r = roomsManager.getRooms(),
        i;
    for (i in r) {
        socket.to(i).emit('roomStatus', {
            name: i,
            users: r[i]
        });
    }
}

setInterval(function () {
    socket.emit('tick');
}, 1000);
