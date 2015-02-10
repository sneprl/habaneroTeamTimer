//CONF
var conf = new require('./config')(),
    router = conf.router;
//FETCH
router.get('/user', function (req, res) {
    var thisRes = res;
    conf.fetchDataUsers().then(
        function successFn (res) {
            thisRes.json(res);
        }
    );
});
router.post('/user', function (req, res) {
    var thisRes = res;
    conf.fetchDataUsers(req.body).then(
        function successFn (res) {
            thisRes.json(res);
        }
    );
});
router.post('/login', function (req, res) {
    var thisRes = res;

    if (req.body && req.body.email) {
        conf.fetchDataUsers(req.body).then(
            function successFn (res) {
                if (res && res.length === 1) {
                    thisRes.json({ 'code': '200', 'message': 'Login Success Message' });
                } else {
                    thisRes.json({ 'code': '403', 'message': 'email or password not vaild' });
                }
            }
        );
    } else {
        thisRes.json({ 'code': '403', 'message': 'email or password not vaild' });
    }
});
//FETCH
router.get('/out/', function (req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

conf.startServer();