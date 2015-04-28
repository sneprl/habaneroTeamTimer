var restacular = require('node-restacular'),
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

        orm.model("posts", new orm.Schema({
                title: String,
                slug: String,
                body: String
            },
            {
                collection: 'posts',
                versionKey: false
            }));

        done();
    },
    ormService: require('./rest-adapters/mongooseOrm'),
    acl: {

    }
};

restacular.launchServer(restConfiguration, function () {
    //Run additional code if you need!
});