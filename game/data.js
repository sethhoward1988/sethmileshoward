
// block types

// d = dirt
// a = air
// height = 600 tiles
// width = 10000 tiles

landscape= []

//10x10 tiles
// height: 600px;
// width: 800px;

// Good 10x10 settings
// heightTiles = 60;
// widthTiles = 800;
// startingWidth = 20;

// windowFrameWidth = 80;
// windowFrameHeight = 60;

// currentGrassLevel = 45;
// grassLevelMax = 55;
// grassLevelMin = 25;

//Good 25 x 25 settings
tileSize = 25;
heightTiles = 24;
widthTiles = 240;
startingWidth = 8;

windowFrameWidth = 36;
windowFrameHeight = 24;

currentGrassLevel = 18;
grassLevelMax = 22;
grassLevelMin = 10;

function createStrip (count) {

	var strip = []

	if(count < startingWidth){
		strip = createBlankStrip();
	} else {
		while(strip.length < currentGrassLevel){
			strip.push('a');
		}

		var rand = Math.random();

		if(rand > .7){ 
			currentGrassLevel++;
		}
		if(rand < .3){ 
			currentGrassLevel--;
		}

		if(currentGrassLevel > grassLevelMax){
			currentGrassLevel = grassLevelMax;
		}
		if(currentGrassLevel < grassLevelMin){
			currentGrassLevel = grassLevelMin;	
		}

		while(strip.length < currentGrassLevel){
			strip.push('a');
		}
		strip.push('g');
		while(strip.length < heightTiles){
			strip.push('d');
		}
	}

	landscape.push(strip);
}

function createCastle () {
	var count = 0;

	while (count < 10) {
		landscape.push(createBlankStrip());
	}
	createPole();
	count = 0;
	while(count < 4){
		landscape.push(createBlankStrip());
	}

}

function createPole () {
	var strip = [];

	while(strip.length < 3){
		strip.push('a');
	}
	while(strip.length < currentGrassLevel){
		strip.push('p');
	}
	strip.push('g');
	while(strip.length < heightTiles){
		strip.push('d');
	}
}

function createBlankStrip () {
	var strip = [];
	while(strip.length < currentGrassLevel){
		strip.push('a');
	}
	strip.push('g');
	while(strip.length < heightTiles){
		strip.push('d');
	}
	return strip;
}

var count = 0;

while( count < widthTiles){
	createStrip(count);
	count++;
}

//createCastle();

