
AirView = Backbone.View.extend({

	className:'tile air',

	initialize: function() {
		this.info = {
			type: 'air',
			fallThrough: true
		}
		this.render();
	},

	render: function(){

	}
});


DirtView = Backbone.View.extend({

	className:'tile dirt',

	initialize: function() {
		this.info = {
			type: 'dirt',
			fallThrough: false
		}
		this.render();
	},

	render: function(){
		
	}

});

GrassView = Backbone.View.extend({

	className:'tile grass',

	initialize: function() {
		this.info = {
			type: 'grass',
			fallThrough: false
		}
		this.render();
	},

	render: function(){
		
	}

})