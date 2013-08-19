Profile = Backbone.Model.extend({
	initialize: function () {

	}

});

ProfileCollection = Backbone.Collection.extend({

	model: Profile,

	initialize: function () {

	}
})

_.templateSettings = {
	interpolate : /\{\{([\s\S]+?)\}\}/g,
	evaluate: /\[\[(.+?)\]\]/g
};