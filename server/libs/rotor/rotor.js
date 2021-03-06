'use strict';

var Rotor = require('backbone'),
	Store = require('./Store');

var Model = Rotor.Model = Rotor.Model.extend({
	idAttribute: '_id',
	name: ''
});

var Collection = Rotor.Collection = Rotor.Collection.extend({
    name: '',

    initialize: function (callback) {
        this.fetch({success: function (result) {
			if (callback) {
				callback(result);
			}
		}},{wait: true});
    },

    getCollection: function (callback) {
    	if (callback) {
    		callback('', this.toJSON());
    	}
    	
    	return this.toJSON();
    },

    deleteItem: function (callback, id) {
    	var model = this.get(id);

    	model.destroy({success: function (result) {
    		callback('', result);
    	}, error: function (err) {
    		callback(err);
    	}}, {wait: true});
    },

    saveNew: function (callback, data) {
    	this.create(data, {success: function (result) {
    		callback('', result.attributes);
    	}, error: function (err) {
    		callback(err);
    	}}, {wait: true});
    },

    saveUpdated: function (callback, data, id) {
    	var model = this.get(id);

    	model.save(data, {success: function (result) {
    		callback('', result.attributes);
    	}, error: function (err) {
    		callback(err);
    	}}, {wait: true});
    }
});

var Controller = Rotor.Controller = require('./Controller');

Rotor.sync = function(method, model, options) {
		var resp;
		var store = new Store(model.name || model.collection.name);

		switch (method) {
			case "read":    
				resp = model.id ? store.find(model, function (err, result) {
					if (err !== null) {
						options.error(err);
					} else {
						options.success(result);
					}
				}) : store.findAll(function (err, result) {
					if (err !== null) {
						options.error(err);
					} else {
						options.success(result);
					}
				}); 
				break;

			case "create":  resp = store.create(model, function (err, result) {
				if (err !== null) {
					options.error(err);
				} else {
					options.success(result);
				}
			});                            
				break;

			case "update":  resp = store.update(model, function (err, result) {
				if (err !== null) {
					options.error(err);
				} else {
					options.success(result);
				}
			});                            
				break;

			case "delete":  resp = store.destroy(model, function (err, result) {
				if (err !== null) {
					options.error(err);
				} else {
					options.success(result);
				}
			});                           
				break;
				
			default: options.error("Record not found");
		}
};
module.exports = Rotor;
