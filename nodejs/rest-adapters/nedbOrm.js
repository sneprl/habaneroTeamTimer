//TODO implement all CRUD methods!

var Datastore = require('nedb'),
    models = require('../models.js'),
    db = {};

module.exports = {
    /*
     * Connect
     */
    connect: function (config, done) {
        for (var i = 0; i < models.length; i++) {
            var model = models[i];
            db[model.name] = new Datastore({filename: 'database/' + model.name + '.db', autoload: true});
            console.log("[collection "+model.name+" created]");
        }

        console.log("[NEDB CONNECTED]");
        done();
    },

    defineModel: function (model, done) {
        done();
        //model(mongoose, null, done);
    },
    findAll: function (entity, where, done) {
        try {
            db[entity].find(where, done);

            //var model = mongoose.model(entity);
            //var w = where || {};
            //model.find(w, done);
        }
        catch (e) {
            done({code: 500, message: "[Error::ormService.findAll] " + entity}, null);
        }


    },
    findById: function (entity, id, done) {
        try {
            var model = mongoose.model(entity);
            model.findById(id, done);
        }
        catch (e) {
            done({code: 500, message: "[Error::ormService.findById] " + entity}, null);
        }
    },
    count: function (entity, done) {
        try {
            var model = mongoose.model(entity);
            model.count({}, done);
        }
        catch (e) {
            done({code: 500, message: "[Error::ormService.count] " + entity}, null);
        }
    },
    createRecord: function (entity, record, done) {
        try {
            db[entity].insert(record, done);
        }
        catch (e) {
            done({code: 404, message: "[Error::ormService.createRecord] " + entity}, null);
        }
    },
    updateRecord: function (entity, id, record, done) {
        try {
            var model = mongoose.model(entity);
            model.findByIdAndUpdate(id, record, {}, done);
        }
        catch (e) {
            done({code: 404, message: "[Error::ormService.updateRecord] " + entity}, null);
        }
    },
    deleteAll: function (entity, done) {
        try {
            var model = mongoose.model(entity);
            model.remove({}, done);
        }
        catch (e) {
            done({code: 500, message: "[Error::ormService.deleteAll] " + entity}, null);
        }
    },
    deleteById: function (entity, id, done) {
        try {
            var model = mongoose.model(entity);
            model.findByIdAndRemove(id, {}, done);
        }
        catch (e) {
            done({code: 500, message: "[Error::ormService.deleteAll] " + entity}, null);
        }
    },
    disconnect: function (done) {
        mongoose.disconnect(function () {
            console.log("[ORM SERVICE] disconnected");
            done();
        });

    }


};
