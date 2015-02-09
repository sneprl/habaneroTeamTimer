var timerRun = false,
    timerVal = 25000,
    defaultTimerVal = 25000,
    socket = null,
    username = '',
    currentRoom = '';
//DOCUMENT READY
$(document).ready(function () {
    startSocket();
    $('#teamSelect').val('-');
    $('#main-wrapper').on('change', '#teamSelect', function () {
        $('#teamSelect').find('option[value=' - ']').hide();
        currentRoom = $(this).val();
        socket.emit('joinedRoom', {
            timerVal: timerVal,
            roomName: currentRoom
        });
        $('#exitTeamBtn').fadeIn();
    });
    $('#main-wrapper').on('click', '#exitTeamBtn', function () {
        $(this).fadeOut();
        socket.emit('leavedRoom', currentRoom);
        currentRoom = '';
        $('#teamSelect').find('option[value=' - ']').show();
        $('#teamSelect').val('-');
        $('#users-connected').html('No Team To Work with');
    });
    $('#main-wrapper').on('click', '#toggleTimer', function () {
        if (timerRun === true) {
            timerRun = false;
            $('#pauseTimer').fadeOut();
            timerVal = defaultTimerVal;
            $('#timer-val').html(timerVal);
            $('#toggleTimer').text('START TIMER');
            if (currentRoom) {
                socket.emit('timerVal', {
                    timerVal: timerVal,
                    roomName: currentRoom
                });
            }
        } else {
            timerRun = true;
            $('#toggleTimer').text('STOP TIMER');
            $('#pauseTimer').fadeIn();
        }
    });
    $('#main-wrapper').on('click', '#pauseTimer', function () {
        timerRun = !timerRun;
    });
});

function startSocket() {
    socket = io();
    socket.on('tick', function () {
        console.log('tick');
        if (timerRun) {
            timerVal = timerVal - 1000;
            $('#timer-val').html(timerVal);
            if (currentRoom !== '') {
                socket.emit('timerVal', {
                    timerVal: timerVal,
                    roomName: currentRoom
                });
            }
        }
    });
    socket.on('roomStatus', function (room) {
        console.log('roomStatus::' + room.name);
        $('#users-connected').empty();
        $('#users-connected').append('<ul>');
        $('#users-connected').append('<b>Users in Team</b><br />');
        for (var i in room.users) {
            var user = i.split('/');
            $('#users-connected').append('<li>USER: <b>' + user[0] + '</b> - <small>client(' + user[1] + ')</small>' + ' <b>TIMER: </b>' + room.users[i].timer + '</li>');
        }
        $('#users-connected').append('</ul>');
    });
    socket.on('disconnect', function () {
        $('#main-wrapper').html('disconnected - reload page');
        timerRun = false;
        timerVal = 25000;
        socket.disconnect();
        socket = null;
    });
}