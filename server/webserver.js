//MODULES
var express = require("express");
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var exphbs = require('express-handlebars');
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
            var username = req.body.username;
            _session['user'] = username;
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

        app.session = _session;
        return app;
    },
    getSessionStore: function(){
        return sessionStore;
    }
};


