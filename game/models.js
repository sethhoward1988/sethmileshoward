
air = Backbone.Model.extend({
	
	initialize: function(){
		console.log('creating new air model');
	}


});


dirt = Backbone.Model.extend({

	initialize: function () {
		console.log('creating new dirt model');
	}
	
})

_.templateSettings = {
	interpolate : /\{\{([\s\S]+?)\}\}/g
};