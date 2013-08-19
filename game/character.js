
CharacterView = Backbone.View.extend({
	
	id: 'char',

	initialize: function () {
		this.speed = 0;
		this.downwardSpeed = 0;
		this.acceleration = 0;
		this.negativeAcceleration = .2;
		this.frameNumber = 0;
		this.views = this.options.viewsMatrix;
		this.navigate = _.bind(this.navigate, this);
		this.gameView = this.options.gameView
		this.render();
	},

	render: function () {
		$('body').on('keydown', _.bind(this.onKeydown, this));
		$('body').on('keyup', _.bind(this.onKeyup, this));
		this.navigate();
	},

	navigate: function () {
		this.frameNumber++;
		if(this.frameNumber > 60){
			this.frameNumber = 0;
		}
		this.setSpeed();
		this.gameView.trigger('moveWindow', this.speed);
		if(this.frameNumber % 3 == 0){
			this.manageCharacter();
		}
		if(this.isJumping == true){ 
			this.continueJump();
		} else if(this.isFalling == true){
			this.fall();
		} else {
			this.moveCharacter();
		}
		this.navTimer = setTimeout(this.navigate, 17);
	},

	continueJump: function () {
		this.jumpStart--;
		var top = parseInt(this.$el.css('top'));
		var jumpRate = this.jumpStart / 1;
		var newTop = top - jumpRate;
		this.$el.css('top', newTop);
		if(this.jumpStart == 0){
			this.isJumping = false;
			this.isFalling = true;
		}
	},

	fall: function () {
		var currentTop = parseInt(this.$el.css('top'));
		this.downwardSpeed += this.negativeAcceleration;
		bottom = this.getFloorTop();
		if(currentTop + this.downwardSpeed >= bottom){
			this.$el.css('top', bottom + 'px');
			this.isFalling = false;
		} else {
			this.$el.css('top', (currentTop + this.downwardSpeed) + 'px');
		}

	},

	moveCharacter: function () {
		this.$el.css('top', this.getFloorTop() + 'px');
	},

	getFloorTop: function () {
		var currentPosition = (Math.abs(parseInt(this.gameView.frame.css('margin-left'))) + 200) / 25;
		var position = parseInt(currentPosition);
		var remainder = parseFloat((currentPosition % 1).toFixed(2));
		var realIndex;
		var nextIndex;
		_.find(this.views[position], function(view, index){
			realIndex = index;
			return view.info.fallThrough == false;
		})
		_.find(this.views[position + 1], function(view, index){
			nextIndex = index;
			return view.info.fallThrough == false;
		})

		var base = (realIndex - 1) * window.tileSize;
		var next = (nextIndex - 1) * window.tileSize;
		var diff = next - base;
		base += remainder * diff;
		return base - 12;
	},

	manageCharacter: function () {
		if(this.isJumping){
			this.$el.attr('class','jumping');
		} else if(this.speed == 0){
			this.$el.attr('class','standing');
			this.currentClassPosition = 0;
		} else if (this.speed){
			if(this.currentClassPosition > 12){ this.currentClassPosition = 0; }
			if(this.speed > 0){
				this.$el.attr('class','left_' + this.currentClassPosition);
			} else {
				this.$el.attr('class','right_' + this.currentClassPosition);
			}
			this.currentClassPosition++;
		}
	},

	setSpeed: function () {
		//top speed is 10px per frame
		var deceleration;
		if(this.speed >= 10 && this.acceleration > 0){ return; }
		if(this.speed <= -10 && this.acceleration < 0){ return; }
		if(this.returnToZero){
			if(this.speed < 1 && this.speed > -1){
				this.speed = 0;
				this.returnToZero = false;
			} else if(this.speed < 0){
				this.speed += .2 + (this.acceleration ? 1 : 0);
			} else {
				this.speed -= .2 - (this.acceleration ? -1 : 0);
			}
		} else {
			this.speed += this.acceleration;	
		}
	},

	jump: function () {
		if(this.isFalling){ return; }
		this.jumpStart = 15;
		this.isJumping = true;
	},

	onKeydown: function (evt) {
		if(this.keyIsDown){ return; }
		this.keyIsDown = true;
		//left = 37
		//right = 39
		//up = 38
		//down = 40
		switch (evt.keyCode){
			case 37:
				this.currentDirection = 'left';
				if(this.acceleration == 0){
					if(this.speed > 0){
						this.returnToZero = false;
					}
				}
				this.acceleration = .511;
				evt.preventDefault;
				break;
			case 38:
				this.jump();
				evt.preventDefault;
				break;
			case 39:
				if(this.acceleration == 0){
					if(this.speed < 0){
						this.returnToZero = false;
					}
				}
				this.acceleration = -.511;
				evt.preventDefault;
				break;
			case 40:
				evt.preventDefault;
				break;
		}
	},

	onKeyup: function (evt){
		if(evt.keyCode == 38){
			this.keyIsDown = false;
		}
		if(evt.keyCode == 37 || evt.keyCode == 39){
			this.acceleration = 0;
			this.keyIsDown = false;
			this.returnToZero = true;
		}
	}
})