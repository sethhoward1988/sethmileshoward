window.MasonView = Backbone.View.extend({

	className: 'mason-view',

	initialize: function () {
		this.collection = this.options.collection;
		this.checkIfReady = _.bind(this.checkIfReady, this);
		this.bricks = $('<div class="bricks"></div>').appendTo(this.$el);
		this.render();
	},

	render: function () {
		var profile, twitterTile, rand;
		this.twitterBricks = [];
		this.collection.each(_.bind(function(model, index){
			if(index % 7 == 0 && index != 0){
				twitterTile = new TwitterTile({ masonView: this });
				this.twitterBricks.push(twitterTile);
				this.bricks.append(twitterTile.$el);
			}
			profile = new ProfileView({ model: model, appView: this.options.appView })
			this.bricks.append(profile.$el);
		}, this));

		//No caching means no twitter feed
		try {
			if(localStorage.tweets){
				var difference = +moment() - parseInt(localStorage.twitterTimestamp);
				console.log(difference);
				difference = difference > 3600000; //It's been longer than one hour
				if(difference){
					this.getTwitterFeed();
				} else {
					this.twitterCallback(JSON.parse(localStorage.tweets));
				}
			} else {
				this.getTwitterFeed();
			}
		} catch (err){
			console.log('Browser Storage Not Permitted');
			this.destroyBricks();
		}
		
		this.checkIfReady();
		this.attach();
	},

	destroyBricks: function(){
		_.each(this.twitterBricks, function(brick){
			brick.$el.remove();
		});
	},

	getTwitterFeed: function () {
		var url = 'https://api.twitter.com/1/lists/statuses.json?slug=tech&owner_screen_name=sethhoward22&per_page=500&page=1';
		console.log(url);
		var that = this;
		var req = $.ajax({
			url: url,
			dataType: 'jsonp',
			success: function(json){
				localStorage.tweets = JSON.stringify(json);
				localStorage.twitterTimestamp = +moment();
				that.twitterCallback(json);
			}
		});
	},

	twitterCallback: function (json) {
		this.tweets = json;
		this.totalTweets = this.tweets.length;
		this.currentTweet = Math.floor(Math.random() * this.tweets.length);
		_.each(this.twitterBricks, function(brick){
			brick.trigger('tweetsReady');
		})
	},

	getTweet: function(){
		var tweet = this.tweets[this.currentTweet];
		this.currentTweet++;
		if(this.currentTweet >= this.totalTweets){
			this.currentTweet = 0;
		}
		return tweet;
	},

	attach: function () {
		this.collection.on('add remove', this.update);
	},

	update: function () {

	},

	checkIfReady: function () {
		if(this.collection.any(function(model){
			return model.get('ready') == false;
		})){
			setTimeout(this.checkIfReady, 250);
		} else {
			//Images are ready to go
			this.loadMasonry();
		}
	},

	loadMasonry: function () {
	  	this.bricks.masonry({
		    itemSelector : '.brick',
		    columnWidth : 225, // 225
		    gutterWidth: 15,
		    isAnimated: true,
		    isFitWidth: true,
		  	animationOptions: {
			    duration: 300,
			    easing: 'swing',
			    queue: false
			}
		});
		this.reload();
		this.reload();
	},

	reload: function () {
		_.delay(_.bind(function(){
			this.bricks.masonry( 'reload' );
			this.$el.fadeIn();
		}, this), 500);
		
	}

})