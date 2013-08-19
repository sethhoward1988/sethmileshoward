window.LoginView = Backbone.View.extend({
	
	className: 'login-view',

	template: _.template(
		'<div class="join">{{ name }}</div>' +
		'<input type="text" placeholder="search">'),

	initialize: function () {
		this.render();
	},

	render: function () {
		var info = {
			name: 'join/login'
		}
		if(this.model){
			info.name = this.model.get('name');
		}
		this.$el.append(this.template(info));
	}
})