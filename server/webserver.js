//MODULES
var express = require("express"),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    path = require('path'),
    exphbs = require('express-handlebars'),
    http = require('http');
//create errorHanlder module
sessionStore = null;

module.exports = {
    initWebServer: function (documentRoot) {
        //VARIABLES
        var app = express();
        var documentRootRelativePath = documentRoot || __dirname + "/../";
        var _documentRoot = path.resolve(documentRootRelativePath) + "/";
        var _session;
        var MemoryStore = session.MemoryStore;
        var restServer = {
            host: 'localhost',
            port: 4000,
            baseUrl: '/api'
        };

        sessionStore = new MemoryStore();

        //VIEW ENGINE - HANDLEBARS
        app.set('views', path.join(_documentRoot, "views"));
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
        app.use(bodyParser.urlencoded({extended: true}));

        app.use("/css", express.static(_documentRoot + 'css'));
        app.use("/js", express.static(_documentRoot + 'js'));
        app.use("/img", express.static(_documentRoot + 'img'));
        app.use("/tests", express.static(_documentRoot + 'tests'));

        //ROUTES
        app.get("/", function (req, res) {
            _session = req.session;
            if (_session.user) {

                res.render("index", {user: _session.user});
            }
            else {
                res.render("login");
            }
        });

        app.post("/login", function (req, res) {
            _session = req.session;
            var user = req.body.user;

            http.get(
                {
                    host: restServer.host, port: restServer.port, path: restServer.baseUrl + '/login',
                    method: 'POST',
                    data: { email: user }
                },
                function (resp) {
                    resp.on('data', function (chunk) {
                        res.send(chunk);
                        _session['user'] = user;
                    });
                }
            ).on("error", function (e) {
                console.log("Got error: " + e.message);
            });
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

        app.session = _session;
        return app;
    },
    getSessionStore: function(){
        return sessionStore;
    }
};


