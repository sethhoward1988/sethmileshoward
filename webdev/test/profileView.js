window.ProfileView = Backbone.View.extend({

		className: 'brick profile',

		template: _.template(
			'<div class="image-container" style="background-image: url(\'{{ image }}\')">' +
				'<div class="description">' +
					'<div class="name">{{ name }}</div>' +
				'</div>' +
			'</div>'
		),

		events:{
			'mouseenter' : 'onMouseEnter',
			'mouseleave' : 'onMouseLeave',
			'click' : 'onMouseClick'
		},

		initialize: function () {
			this.timeout = _.bind(this.timeout, this);
			this.attach();
			this.render();
		},

		attach: function () {
			//this.model.on('change', this.render);
		},

		render: function () {
			this.$el.append(this.template(this.model.toJSON()));
			this.imageContainer = this.$el.find('.image-container');

			//ImageContainer and Profile need to have matching width and height, which match the picture size
			this.img = new Image();
			this.img.src = this.model.get('image');
			this.img.onload = _.bind(this.setDimensions, this);
			setTimeout(this.timeout, 3000);

		},

		timeout: function () {
			if(this.img.width == 0){
				this.img.onload = null;
				this.model.set({ready: true});
				this.$el.remove();
			}
		},

		setDimensions: function () {
			var width, height, iw = this.img.width;

			//225 new width, 240 with padding

			if(iw >= 465 && iw < 690){
				width = 465;
			} else if(iw >= 690){
				width = 690;
			} else {
				width = 225;
			}

			this.$el.css({ width: width, height: this.img.height });
			this.imageContainer.css({ width: width, height: this.img.height });
			this.$el.find('.relative').css({
				height: 100 - 11,
				width: width - 22
			})
			this.model.set({ready: true});
		},

		onMouseEnter: function (evt) {
			// this.imageContainer.stop(true);
			// this.imageContainer.animate({height: this.img.height - 50},300,'swing');
			this.$el.addClass('glow');
		},

		onMouseLeave: function (evt) {
			// this.imageContainer.stop(true);
			// this.imageContainer.animate({height: this.img.height},300,'swing');
			this.$el.removeClass('glow');
		},

		onMouseClick: function () {
			// this.$el.addClass('selected');
			this.options.appView.trigger('openDetailView', this.model);
		},

		offSelected: function () {
			// this.$el.removeClass('selected');
		}
	});