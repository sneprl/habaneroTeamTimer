module.exports = function config () {
    // server.js
    var express = require('express'),
        bodyParser = require('body-parser'),
        app = express(),
        Q = require('q'),
        router = express.Router(),
    //DB
        Datastore = require('nedb'),
        users = new Datastore({ filename: 'db/users.json', autoload: true }),
        teams = new Datastore({ filename: 'db/teams.json', autoload: true }),
    //VAR
        port = 4000,
        hostname = 'localhost',
        startUrl = '/api',
        self = {};

    function fetchDataUsers (params) {
        var def = Q.defer();
        users.find(params, function (err, res) {
            if (err) {
                def.reject(err);
            } else {
                def.resolve(res);
            }
        });
        return def.promise;
    }

    function startServer () {
        app.use(startUrl, router);
        app.listen(port, hostname);
        console.log(hostname + ':' + port);
        /*users.insert({
            "nome": "dario",
            "cognome": "civallero",
            "email": "civa@gmail.com",
            "pass": "1234",
            "isAmin": true,
            "teams": "All"
        });*/
    }

    self.fetchDataUsers = fetchDataUsers;

    self.startServer = startServer;

    self.router = router;
    self.Q = Q;
    self.app = app;

    return (function init () {
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
        return self;
    })();
};