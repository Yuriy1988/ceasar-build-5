'use strict';

(function (This, app) {
    This.SmallUserView = Backbone.View.extend({
        tagName: 'div',
        className: 'user-photo',
		
	    template: templates.smallUserViewTpl,
	    
		events: {
	        'click': 'showUserProfile'
	    },

	    initialize: function () {
	        this.listenTo(this.model, 'change', this.render);
	    },

	    render: function () {
            this.$el.empty();
	        this.$el.html(this.template(this.model.toJSON()));

	        return this;
	    },

	    showUserProfile: function () {
	        app.mediator.publish('User: user-profile-called', this.model);
	    }
    });
})(CS.User, app);