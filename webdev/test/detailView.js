window.DetailView = Backbone.View.extend({

	className: 'detail-view',

	template: _.template(
		'<div class="overlay"></div>' +
		'<img src="{{ image }}" width="250px">' +
		'<div>Headline: {{ headline }}</div>' +
		'<div>Hometown: {{ homeTown }}</div>' +
		'<div>Skill: {{ skill }}</div>' +
		'<div>Name: {{ name }}</div>'
	),
	
	initialize: function () {
		this.render();
	},

	render: function () {

	},

	renderModel: function (model) {
		this.$el.empty();
		this.$el.append(this.template(model.toJSON()));
		this.$el.fadeIn();
	}

})