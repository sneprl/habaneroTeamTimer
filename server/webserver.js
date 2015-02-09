/**
 * The webserver module
 * @module server/webserver
 */
module.exports = (function () {
    //modules requirements
    var express = require("express"),
        session = require('express-session'),
        bodyParser = require('body-parser'),
        path = require('path'),
        exphbs = require('express-handlebars'),
        config = require('./config'),

        //attributes
        sessionStore = null,

        //methods
        initWebServer,
        getSessionStore;

    /**
     * @function initWebserver
     */
    initWebServer = function () {
        //VARIABLES
        var app = express(),
            documentRootRelativePath = config.documentRoot || __dirname + "/../",
            $documentRoot = path.resolve(documentRootRelativePath) + "/",
            $session,
            MemoryStore = session.MemoryStore;

        //INIT sessionStore
        sessionStore = new MemoryStore();

        //VIEW ENGINE - HANDLEBARS
        app.set('views', path.join($documentRoot, "views"));
        app.engine('.hbs', exphbs({
            layoutsDir: path.join(app.settings.views, "layouts"),
            defaultLayout: 'layout',
            extname: '.hbs'
        }));
        app.set('view engine', '.hbs');
        app.use(session({
            name: "session_cookie",
            secret: 's3cr3tp4s5',
            key: 'express.sid',
            store: sessionStore,
            resave: false,
            saveUninitialized: true
        }));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: true
        }));
        app.use("/css", express.static($documentRoot + 'css'));
        app.use("/js", express.static($documentRoot + 'js'));
        app.use("/img", express.static($documentRoot + 'img'));
        app.use("/tests", express.static($documentRoot + 'tests'));

        //ROUTES
        app.get("/", function (req, res) {
            $session = req.session;
            if ($session.user) {
                res.render("index", {
                    user: $session.user
                });
            } else {
                res.render("login");
            }
        });

        app.post("/login", function (req, res) {
            $session = req.session;
            var username = req.body.username;
            $session.user = username;
            res.end("logged " + username);
        });
        //ERRORS
        /// catch 404 and forwarding to error handler
        app.use(function (req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.send(JSON.stringify({
                message: err.message,
                error: err
            }));
        });
        app.session = $session;
        return app;
    };

    /**
     * @function getSessionStore
     */
    getSessionStore = function () {
        return sessionStore;
    };

    return {
        initWebServer: initWebServer,
        getSessionStore: getSessionStore
    };
})();