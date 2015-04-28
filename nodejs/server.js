var restacular = require('node-restacular'),
    models = require('./models.js'),
    restConfiguration;


restConfiguration = {
    server: {
        port: 9000
    },
    storage: {
        driver: "mongodb",
        host: "localhost",
        port: "27017",
        username: "",
        password: "",
        database: "habanero"
    },
    model: function (orm, schema, done) {
        for (var i = 0; i < models.length; i++) {
            var m = models[i];

            orm.model(m.name, new orm.Schema(m.schema, {
                collection: m.name,
                versionKey: false
            }));
        }

        done();
    },
    ormService: require('./rest-adapters/mongooseOrm'),
    acl: {}
};

restacular.launchServer(restConfiguration, function () {
    //Run additional code if you need!
});