

// All credit goes to Lee Stemkoski who coded the core texture offseting part :
// http://stemkoski.github.io/Three.js/Texture-Animation.html

function SpriteMixer() {


	var loader = new THREE.TextureLoader();
	var actionSprites = []; // Will store every new actionSprite.


	function update(delta) { // Update every stored actionSprite if needed.
		if (this.actionSprites.length > 0) {
			let milliSec = delta * 1000 ; // THREE.Clock.getDelta() returns seconds.
			for (let i=0 ; i<this.actionSprites.length ; i++) {
				if ( this.actionSprites[i].paused == false ) {
					this.updateSprite( this.actionSprites[i], milliSec );
				};
			};
		};
	};


	function offsetTexture(actionSprite) {
		// This offsets the texture to make the next frame of the animation appear.
		let currentColumn = actionSprite.currentTile % actionSprite.tilesHorizontal;
		actionSprite.material.map.offset.x = currentColumn / actionSprite.tilesHorizontal;
		let currentRow = Math.floor(actionSprite.currentTile / actionSprite.tilesHorizontal);
		actionSprite.material.map.offset.y = (actionSprite.tilesVertical - currentRow - 1) / actionSprite.tilesVertical;
	};


	function updateSprite(actionSprite, milliSec) {
		
		actionSprite.currentDisplayTime += milliSec;

		while (actionSprite.currentDisplayTime > actionSprite.tileDisplayDuration) {
			// This while loop while be called several time is the passed milliSec
			// parameter is longer than a frame lasts. See bellow :
			actionSprite.currentDisplayTime -= actionSprite.tileDisplayDuration;
			actionSprite.currentTile ++;

			if (actionSprite.currentTile == actionSprite.numberOfTiles) {
				actionSprite.currentTile = 0;
			}; // Restarts the animation if the last frame was reached at last call.

			this.offsetTexture(actionSprite);

			if (actionSprite.currentTile == actionSprite.numberOfTiles - 1 &&
				actionSprite.mustLoop == false &&
			    actionSprite.clampWhenFinished == true) {
				// Pause at last frame is .clampWhenFinished == true.
					actionSprite.paused = true ;
					if (actionSprite.hideWhenFinished == true) {
						actionSprite.visible = false ;
					};
				
			} else if (actionSprite.currentTile == 0 &&
				actionSprite.mustLoop == false &&
			    actionSprite.clampWhenFinished == false) {
				// Pause at first frame is .clampWhenFinished == false.
					actionSprite.paused = true ;
					if (actionSprite.hideWhenFinished == true) {
						actionSprite.visible = false ;
					};

			};
		};

	};


	function ActionSprite(textureURL, tilesHoriz, tilesVert, numTiles, tileDispDuration) {

		let texture = this.loader.load(textureURL);

		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 1/tilesHoriz, 1/tilesVert );

		let spriteMaterial = new THREE.SpriteMaterial({
			map:texture, color:0xffffff, premultipliedAlpha:true, alphaTest:0.5});

		let sprite = new THREE.Sprite(spriteMaterial);

		sprite.tilesHorizontal = tilesHoriz ;
		sprite.tilesVertical = tilesVert ;
		sprite.numberOfTiles = numTiles ;
		sprite.tileDisplayDuration = tileDispDuration;
		sprite.currentDisplayTime = 0;
		sprite.currentTile = 0;
		sprite.paused = true;
		sprite.mustLoop == false;
		sprite.clampWhenFinished = true;
		sprite.hideWhenFinished = false;

		this.offsetTexture( sprite );

		sprite.playOnce = function playOnce() {
			sprite.currentTile = 0 ;
			sprite.paused = false ;
			sprite.visible = true ;
			sprite.mustLoop = false ;
		};

		sprite.resume = function resume() {
			sprite.paused = false ;
			sprite.visible = true ;
		};

		sprite.playLoop = function playLoop() {
			sprite.currentTile = 0;
			sprite.paused = false ;
			sprite.visible = true ;
			sprite.mustLoop = true ;
		};

		sprite.pauseNextEnd = function pauseNextEnd() {
			sprite.mustLoop = false;
		};

		sprite.pause = function pause() {
			sprite.paused = true ;
		};

		sprite.stop = function stop() {
			sprite.currentDisplayTime = 0;
			sprite.currentTile = 0;
			actionSprite.paused = true ;
			if (actionSprite.hideWhenFinished == true) {
				actionSprite.visible = false ;
			};
			spriteMixer.offsetTexture(sprite);
		};

		this.actionSprites.push( sprite );
		return sprite ;
	};





	return {
		loader: loader,
		actionSprites: actionSprites,
		update: update,
		offsetTexture: offsetTexture,
		updateSprite: updateSprite,
		ActionSprite: ActionSprite
	};

};