
// Creator Felix Mariotto

// Based on Lee Stemkoski's work who coded the core texture offsetting part :
// http://stemkoski.github.io/Three.js/Texture-Animation.html

function SpriteMixer() {


	var actionSprites = []; // Will store every new actionSprite.
	var listeners = []; // Will store the user callbacks to call upon loop, finished, etc..

	var api = {
		actionSprites: actionSprites,
		update: update,
		offsetTexture: offsetTexture,
		updateSprite: updateSprite,
		ActionSprite: ActionSprite,
		Action: Action,
		addEventListener: addEventListener
	};


	function addEventListener( eventName, callback ) {
		if ( eventName && callback ) {
			listeners.push(  { eventName, callback }  );
		} else {
			throw 'Error : an argument is missing';
		};
	};


	function update(delta) { // Update every stored actionSprite if needed.
		if (actionSprites.length > 0) {
			let milliSec = delta * 1000 ; // THREE.Clock.getDelta() returns seconds.
			for (let i=0 ; i < actionSprites.length ; i++) {
				if ( actionSprites[i].paused == false ) {
					updateSprite( actionSprites[i], milliSec );
				};
			};
		};
	};


	// This offsets the texture to make the next frame of the animation appear.
	function offsetTexture( actionSprite ) {
		actionSprite.material.map.offset.x = actionSprite.getColumn() / actionSprite.tilesHoriz;
		actionSprite.material.map.offset.y = (actionSprite.tilesVert - actionSprite.getRow() -1 ) / actionSprite.tilesVert;
	};


	function updateSprite( actionSprite, milliSec ) {
		
		actionSprite.currentDisplayTime += milliSec;

		while (actionSprite.currentDisplayTime > actionSprite.tileDisplayDuration) {
			// This while loop will be called several times if the passed milliSec
			// parameter is longer than a frame lasts. See bellow :
			actionSprite.currentDisplayTime -= actionSprite.tileDisplayDuration;
			actionSprite.currentTile ++;

			// Restarts the animation if the last frame was reached at last call.
			if (actionSprite.currentTile == actionSprite.numberOfTiles -1) {
				actionSprite.currentTile = 0;
				// Call the user callbacks on the event 'loop'
				if ( actionSprite.mustLoop == true ) {
					listeners.forEach( (listener)=> {
						if ( listener.eventName == 'loop' ) {
							listener.callback({
								type:'loop',
								action: actionSprite
							});
						};
					});
				};
			};

			offsetTexture(actionSprite);

			if (actionSprite.currentTile == actionSprite.numberOfTiles - 1 &&
				actionSprite.mustLoop == false &&
			    actionSprite.clampWhenFinished == true) {
				// Pause at last frame if .clampWhenFinished == true.
					actionSprite.paused = true ;
					if (actionSprite.hideWhenFinished == true) {
						actionSprite.visible = false ;
					};
					callFinishedListeners( actionSprite );
				
			} else if (actionSprite.currentTile == 0 &&
				actionSprite.mustLoop == false &&
			    actionSprite.clampWhenFinished == false) {
				// Pause at first frame is .clampWhenFinished == false.
					actionSprite.paused = true ;
					if (actionSprite.hideWhenFinished == true) {
						actionSprite.visible = false ;
					};
					callFinishedListeners( actionSprite );
			};

			// Call the user callbacks on the event 'finished'.
			function callFinishedListeners( actionSprite ) {
				setTimeout( ()=> {
					listeners.forEach( (listener)=> {
						if ( listener.eventName == 'finished' ) {
							listener.callback({
								type:'finished',
								action: actionSprite
							});
						};
					}, actionSprite.tileDisplayDuration );
				})
				
			};
		};

	};



	// reveal the sprite and play the action only once
	function playOnce() {
		this.currentTile = 0 ;
		this.paused = false ;
		this.visible = true ;
		this.mustLoop = false ;
	};

	// resume the action if it was paused
	function resume() {
		// this is in case setFrame was used to set a frame outside of the
		// animation range, which would lead to bugs.
		if ( this.currentTile > this.numberOfTiles -1 ) {
			this.currentTile = 0;
		};
		this.paused = false ;
		this.visible = true ;
	};

	// reveal the sprite and play it in a loop
	function playLoop() {
		this.currentTile = 0;
		this.paused = false ;
		this.visible = true ;
		this.mustLoop = true ;
	};

	// pause the action when it reach the last frame
	function pauseNextEnd() {
		this.mustLoop = false;
	};

	// pause the action on the current frame
	function pause() {
		this.paused = true ;
	};

	// pause and reset the action
	function stop() {
		this.currentDisplayTime = 0;
		this.currentTile = 0;
		this.paused = true ;
		if (this.hideWhenFinished == true) {
			this.visible = false ;
		};
		offsetTexture(this);
	};

	// Set manually a frame of the animation. Frame indexing starts at 0.
	function setFrame( frameID ) {
		this.pause();
		this.currentTile = frameID;
		offsetTexture(this);
	};

	function getRow() {
		return Math.floor(this.currentTile / this.tilesHoriz);
	};

	function getColumn() {
		return this.currentTile % this.tilesHoriz;
	};





	function ActionSprite( texture, tilesHoriz, tilesVert ) {

		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 1/tilesHoriz, 1/tilesVert );

		let spriteMaterial = new THREE.SpriteMaterial({
			map:texture, color:0xffffff});

		let actionSprite = new THREE.Sprite(spriteMaterial);
		actionSprite.isIndexedSprite = true ;

		actionSprite.tilesHoriz = tilesHoriz ;
		actionSprite.tilesVert = tilesVert ;
		actionSprite.tiles = (tilesHoriz * tilesVert) ;
		actionSprite.currentDisplayTime = 0 ;
		actionSprite.currentTile = 0 ;
		actionSprite.paused = false ;

		actionSprite.setFrame = setFrame ;
		actionSprite.getRow = getRow;
		actionSprite.getColumn = getColumn;

		
		offsetTexture( actionSprite ) ;

		/*

		actionSprites.push( actionSprite );

		*/

		return actionSprite ;
		
	};






	/*
		ActionSprite(textureURL:string, tilesHoriz:integer, tilesVert:integer, numTiles:integer, tileDispDuration:integer)
			- texture : texture containing all the frames in a grid.
			- tilesHoriz : number of frames on the horizontal direction.
			- tilesVert : number of frames on the vertical direction.
			- numTiles : total number of frames. As you can see in the exemples,
			  it does not necessarily equal tilesHoriz*tilesVert, for instance
			  if the last frames are empty.
			- tileDispDuration : display duration of ONE FRAME, un milliseconds.

		spriteMixer.ActionSprite() returns a extended THREE.Sprite.
		All the parameters necessary for the animation are stored inside,
		but you can still use it as any THREE.Sprite, like scale it etc..
	*/
	function Action( actionSprite, numberOfTiles, tileDisplayDuration ) {

		if ( !actionSprite.isIndexedSprite ) {
			throw 'Error : "texture" argument must be an indexedTexture.' ;
			return
		};

		return {
			type: "spriteAction",
			playOnce,
			playLoop,
			resume,
			pause,
			pauseNextEnd,
			stop,
			clampWhenFinished: true,
			hideWhenFinished: false,
			mustLoop: true,
			tileDisplayDuration,
			numberOfTiles,
			actionSprite
		};

	};





	return api;

};