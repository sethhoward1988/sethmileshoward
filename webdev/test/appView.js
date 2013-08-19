window.AppView = Backbone.View.extend({

	className:'app',

	initialize: function() {
		this.collection = new window.ProfileCollection(window.data);
		this.on('openDetailView', this.openDetailView);
		this.render();
	},

	events: {
		'click .overlay':'closeOverlay'
	},

	render: function () {
		this.overlay = $('<div class="overlay"></div>').appendTo(this.$el);

		this.detailView = new DetailView({});
		this.$el.append(this.detailView.$el);

		this.masonView = new MasonView({collection: this.collection, appView: this});
		this.$el.append(this.masonView.$el);

		this.sideBarView = new SideBarView({ masonView: this.masonView });
		this.$el.append(this.sideBarView.$el);

		this.loginView = new LoginView({});
		this.$el.append(this.loginView.$el);
	},

	openDetailView: function (model) {
		this.overlay.fadeIn();
		this.detailView.renderModel(model);
	},

	closeOverlay: function () {
		this.detailView.$el.fadeOut();
		this.overlay.fadeOut();
	}

});