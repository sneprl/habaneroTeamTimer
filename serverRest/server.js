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
    var thisRes = res,
        params = req.params;
    conf.fetchDataUsers({nome: 'tommaso'}).then(
        function successFn (res) {
            thisRes.json(res);
        }
    );
});
//FETCH
router.get('/out/', function (req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

conf.startServer();