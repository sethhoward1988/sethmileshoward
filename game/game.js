console.log('hello world');
Game = Backbone.View.extend({

	id: 'game',

	initialize: function () {
		this.attach();
		this.render();
	},

	attach: function () {
		this.on('moveWindow', this.moveWindow);
	},

	render: function () {
		//Analyze Data
		this.appData = window.landscape;
		this.frame = $('<div class="window"></div>').appendTo(this.$el);
		this.frame.css('width', (window.widthTiles * window.tileSize) + 'px');
		this.viewsMatrix = [];

		for(var i = 0; i < window.widthTiles; i++){
			var column = this.createColumn(i);
			this.frame.append(column.column);
			this.viewsMatrix.push(column.viewsColumn);
		}

		this.character = new CharacterView({ viewsMatrix: this.viewsMatrix, gameView: this });
		this.$el.append(this.character.$el);
	},

	createColumn: function (index) {
		var column = $('<div class="column"></div>');
		var strip = this.appData[index];
		var viewsColumn = [];
		_.each(strip, _.bind(function(block){
			var view = this.createBlock(block);
			viewsColumn.push(view);
			column.append(view.$el);
		},this))
		return {
			column: column,
			viewsColumn: viewsColumn
		}
	},

	createBlock: function (block) {
		var view;
		switch (block) {
			case 'a':
				view = new AirView({});
				break;
			case 'd':
				view = new DirtView({});
				break;
			case 'g':
				view = new GrassView({});
		}
		return view;
	},

	moveWindow: function (amount) {
		var marginLeft = parseInt(this.frame.css('margin-left'));
		var amount = marginLeft + amount;
		if(amount > 1 || amount < -5175 ){ return; }
		this.frame.css('margin-left', amount);
	}

});

window.game = new Game({});
$('body').append(game.$el);