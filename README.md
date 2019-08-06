# three-SpriteMixer
Based on http://stemkoski.github.io/Three.js/Texture-Animation.html  
Example 1 : https://felixmariotto.github.io/spritemixer    
Example 2 : https://felixmariotto.github.io/spritemixer2       
Example 3 : https://felixmariotto.github.io/spritemixer3

### Mixing table to play sprite animations in Three.js ###

The aim is to make visual effects in Three.js games simple : give a path to the texture including the frames of your animation, give the parameters of the animation, and you get an extended THREE.Sprite object, that you can use as a normal Sprite object, but also animate with SpriteMixer's functions.

# How to use
### Instantiate :
```javascript
var spriteMixer = SpriteMixer();
```  

### Create a actionSprite :
```javascript
new THREE.TextureLoader().load("texture.png", (texture)=> {
  actionSprite = spriteMixer.ActionSprite(texture, 3, 3, 9, 60);
});

/*
ActionSprite(texture:THREE.Texture, tilesHoriz:integer, tilesVert:integer, numTiles:integer, tileDispDuration:integer)
	- texture : texture containing all the frames of the animation in a grid.
	- tilesHoriz : number of frames on the horizontal direction.
	- tilesVert : number of frames on the vertical direction.
	- numTiles : total number of frames. As you can see in the exemples,
	  it does not necessarily equal tilesHoriz*tilesVert, for instance
	  if the last frames are empty.
	- tileDispDuration : display duration of ONE FRAME, in milliseconds.
*/
```  

### Update in your animation loop:
```javascript
function loop() {
	requestAnimationFrame(loop);
	renderer.render(scene, camera);

	var delta = clock.getDelta();
        // delta provided by THREE.Clock
			
	spriteMixer.update(delta);
};
```
### Animate your actionSprite :
```javascript
actionSprite.playOnce();
// make the sprite visible and play it only once

actionSprite.playLoop();
// play the sprite animation in a loop

actionSprite.stop();
// stop the action and reset

actionSprite.pause();
// pause the action without reset

actionSprite.pauseNextEnd();
// let the action finish its current animation, then stop it

actionSprite.resume();
// resume the action if it was paused before its end

actionSprite.clampWhenFinished = true;
// make the action stop on last frame when it finishes, reset if false

actionSprite.hideWhenFinished = true;
// set the object.visible = false at last frame if true

```  

### Listen for animation events :
```javascript
/*
	spriteMixer.addEventListener( eventName, callback )
	-> eventName is a string, either 'loop' or 'finished'. If 'loop', the callback
	   will be called every time an actionSprite with .mustLoop==true finishes a cycle.
	-> callback is the function you wish to be called at the resolution of this event.
*/

spriteMixer.addEventListener('finished' /* or 'loop' */ , function(event) {
	/* the first argument of the callback takes an object containing an 'type' argument, which is either 'loop' or 'finished',
	and an 'action' argument, containing the actionSprite that triggered the event. */
	console.log(event.action)
});
```

### Set a frame manually (so you can use actionSprite as a table of indexed textures) :
```javascript
// Set manually a frame of the animation. Frame indexing starts at 0.
actionSprite.setFrame( index );
```

The texture including tiles must be in this format :
![exemple of tiles texture](https://felixmariotto.s3.eu-west-3.amazonaws.com/tiles_texture.jpg)
Frames go from top-left to bottom-right. Last frames can be empty.

