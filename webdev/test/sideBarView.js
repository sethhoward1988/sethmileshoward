window.SideBarView = Backbone.View.extend({

	className: 'side-bar',

	template: 
	'<div class="close">X</div>' +
	'<div class="header">We are<br />Utah Tech</div>' +
	'<div class="body">' +
		'<h2>about us</h2>' +
		"<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. 1500s, when an unknown printer took a galley of type and scra</p>" +
		'<h2>find</h2>' +
		'<select name="pretty">' +
			'<option>Ruby</option>' +
			'<option>Python</option>' +
			'<option>Designer</option>' +
		'</select>' +
		'<h2>recent tweets</h2>' +
		'<div class="twitter"></div>' +
		'<h2>follow us</h2>' +
		'<div class="social"></div>' +
		'<div class="footer">' +
			'<span>All Rights Reserved 2013 | we are Utah Tech</span>' +
		'</div>' +
	'</div>',

	tweet:_.template(
		'<div class="tweet">' +
			'<div class="username">{{ username }}</div>' +
			'<div class="content">{{ tweet }}</div>' +
			'<div class="timestamp">{{ timestamp }}</div>' +
		'</div>'
	),

	events: {
		'click .close': 'onClickClose'
	},
	
	initialize: function () {
		this.buildTwitter = _.bind(this.buildTwitter, this);
		this.render();
	},

	render: function () {
		this.$el.append(this.template);
		this.body = this.$el.find('.body');
		this.button = this.$el.find('.close');
		//this.getTweets();
		_.defer(_.bind(function(){
			this.$el.find('select').customSelect();	
		}, this));
	},

	getTweets: function () {
		var req = $.ajax({
			url:'https://api.twitter.com/1/statuses/user_timeline.json?include_entities=true&include_rts=true&screen_name=sethhoward22&count=3',
			dataType: 'jsonp'
		})
		req.done(this.buildTwitter);
	},

	buildTwitter: function (json) {
		var twitter = '';
		_.each(json, _.bind(function(tweet){
			twitter += this.buildTweet(tweet);
		}, this));
		this.$el.find('.twitter').append($(twitter));
	},

	buildTweet: function (tweet) {
		return this.tweet({
			username: 'WeAreUtahTech',
			tweet: tweet.text,
			timestamp: moment(tweet.created_at).format('D MMM')
		})
	},

	toggleSidebar: function () {
		this.body.stop(true);
		this.button.stop(true);

		if(this.button.text() == 'X'){
			this.body.slideToggle();
			this.button.text('>')
			this.button.animate({
				left:0
			});
			this.options.masonView.$el.animate({
				'padding-left':'0px'
			})
		} else {
			this.body.slideToggle();
			this.button.text('X')
			this.button.animate({
				left: '233px'
			});
			this.options.masonView.$el.animate({
				'padding-left':'235px'
			})
		}
		this.options.masonView.reload();
	},

	onClickClose: function () {
		this.toggleSidebar();
	}



})