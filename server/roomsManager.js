/**
 * The rooms manager module
 * @module server/roomsManager
 */
module.exports = (function () {
    //attributes
    var $rooms = {},
        //methods
        joinTeam,
        leaveTeam,
        leaveAllRooms,
        cleanRooms,
        getRooms,
        setTimerVal;

    /**
     * @function joinTeam
     */
    joinTeam = function joinTeam(client, roomName, user, timerVal) {
        leaveAllRooms(client);
        client.join(roomName);
        cleanRooms(user, client);
        if (!$rooms[roomName]) {
            $rooms[roomName] = {};
        }
        $rooms[roomName][user + "/" + client.id] = {
            timer: timerVal
        };
    };

    /**
     * @function leaveTeam
     */
    leaveTeam = function leaveTeam(client, user) {
        leaveAllRooms(client);
        cleanRooms(user, client);
    };

    /**
     * @function leaveAllRooms
     */
    leaveAllRooms = function leaveAllRooms(client) {
        if (client.rooms) {
            for (var i = 0; i < client.rooms.length; i++) {
                client.leave(client.rooms[i]);
            }
        }
    };

    /**
     * @function cleanRooms
     */
    cleanRooms = function cleanRooms(user, client) {
        var j,
            k,
            empty;
        for (j in $rooms) {
            if ($rooms && $rooms[j]) {
                if (typeof $rooms[j][user + "/" + client.id] === "object") {
                    delete $rooms[j][user + "/" + client.id];
                }
            }
            empty = true;
            for (k in $rooms[j]) {
                if ($rooms[j][k]) {
                    empty = false;
                }
            }
            if (empty === true) {
                delete $rooms[j];
            }
        }
    };

    /**
     * @function getRooms
     */
    getRooms = function getRooms() {
        return $rooms;
    };

    /**
     * @function setTimerVal
     */
    setTimerVal = function setTimerVal(client, roomName, user, timerVal) {
        $rooms[roomName][user + '/' + client.id].timer = timerVal;
    };

    return {
        joinTeam: joinTeam,
        leaveTeam: leaveTeam,
        leaveAllRooms: leaveAllRooms,
        cleanRooms: cleanRooms,
        getRooms: getRooms,
        setTimerVal: setTimerVal
    };
})();
