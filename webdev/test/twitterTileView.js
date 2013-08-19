window.TwitterTile = Backbone.View.extend({
	
	className: 'brick twitter',

	template:
		'<div class="flip-container">' +
			'<div class="flipper">' +
				'<div class="front"></div>' +
				'<div class="back"></div>' +
			'</div>' +
		'</div>'
	,

	tweet: _.template(
		'<div class="image"><img src="{{ image }}"></div>' +
		'<div class="username">{{ username }}</div>' +
		'<div class="content">{{ content }}</div>' +
		'<div class="timestamp">{{ timestamp }}</div>' +
		'<div class="logo"></div>'
	),

	colors: ['#486c91','#689cd0','#223344','#283d51','#192633'],

	initialize: function(){
		this.requestCallback = _.bind(this.requestCallback, this);
		this.flipCard = _.bind(this.flipCard, this);
		this.username = this.options.username;
		var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
		this.regex = new RegExp(expression);
		this.on('tweetsReady', this.startFeed);
		this.render();
	},

	render: function(tweets){
		this.interval = Math.floor(Math.random() * (30000 - 15000 + 1)) + 15000;
		var color = Math.floor(Math.random() * this.colors.length);
		this.$el.append($(this.template));
		this.$el.find('.front').css({
			'background-color': this.colors[color]
		})
		this.$el.find('.back').css({
			'background-color': ((color + 1) > (this.colors.length - 1) ? this.colors[0] : this.colors[color + 1])
		})
	},

	requestCallback: function (json) {
		this.data = json;
		this.currentIndex = 0;
		if(json.length){
			this.updateTile();
		}
	},

	startFeed: function () {
		var front = this.options.masonView.getTweet();
		var back = this.options.masonView.getTweet();
		this.$el.find('.front').empty().append(this.tweet({
			image: front.user.profile_image_url,
			username:front.user.name,
			content: this.parseContent(front.text),
			timestamp: moment(front.created_at).format('D MMM')
		}));
		this.$el.find('.back').empty().append(this.tweet({
			image: back.user.profile_image_url,
			username:this.username,
			content: this.parseContent(back.text),
			timestamp: moment(back.created_at).format('D MMM')
		}));
		this.cardFlip = false;
		setTimeout(this.flipCard, this.interval);
	},

	renderSide: function (tweet, side) {
		var content = {
			image: tweet.user.profile_image_url,
			username:tweet.user.name,
			content: this.parseContent(tweet.text),
			timestamp: moment(tweet.created_at).format('D MMM')
		}
		if(side == 'front'){
			this.$el.find('.front').empty().append(this.tweet(content));
		} else {
			this.$el.find('.back').empty().append(this.tweet(content));
		}
	},

	parseContent: function (text) {
		var links = text.match(this.regex);
		_.each(links, function(link){
			text = text.replace(link, '<a href="' + link + '" target="_blank">' + link + '</a>')
		});
		return text;
	},

	flipCard: function () {
		this.cardFlip = !this.cardFlip;
		if(this.cardFlip == false){ 
			this.renderSide(this.options.masonView.getTweet(), 'front');
			this.$el.find('.flip-container').removeClass('flipped');
		} else {
			//flip the card
			this.renderSide(this.options.masonView.getTweet(), 'back');
			this.$el.find('.flip-container').addClass('flipped');
		}
		setTimeout(this.flipCard, this.interval);
	}

})




