'use strict';
var Rotor = require('../libs/rotor/rotor'),
	Users = require('../users/Models/UsersList'),
	Locations = require('../locations/Models/CoursesList'),
	Groups = require('../groups/Models/GroupsList'),
    lock = require('../libs/lock');

var Controller = Rotor.Controller.extend({
    session: {},

    responseHead: {
        statusOK: '200',
        statusErr: '401',
        cookies: ''
    },

    preloadData: {
        users: '',
        locations: '',
        groups: ''
    },

	initialize: function (req, resp, action, currSession) {
        var reqBody;

        this.request = req;
        this.response = resp;
        this.session = currSession;
        reqBody = this.getRequestData(this.request);
        this.getPreloadData(this.request);
    },

    getPreloadData: function (request) {
    	var userId = this.session.get('userID');
            
        if (userId) {
			this.preloadData.users = this.getUserData(userId);
            this.getLocationsData();
            this.getGroupsData();

            lock.reset(2).then(function () {
                this.sendResponse('', this.preloadData);
            }.bind(this));
        } else {
            this.sendResponse('Not authorized');      
        }
    },

    getUserData: function (id) {
    	var user = Users.get(id),
    		data;

    	data = user.toJSON();
    	data.id = data._id;
        
        delete data._id;
        delete data.password;

    	return data;
    },

    getLocationsData: function () {
        Locations.initialize(function (result) {
            this.preloadData.locations = this.formatData(Locations.getCollection());
            lock.check();
        }.bind(this));
    },

    getGroupsData: function () {
    	Groups.initialize(function (result) {
            this.preloadData.groups = this.formatData(Groups.getCollection());
            lock.check();
        }.bind(this));
    }
});

module.exports = new Controller();