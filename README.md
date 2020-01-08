# three-SpriteMixer

Example : https://felixmariotto.github.io/from_indexed_texture    

### Mixing table to play sprite animations in Three.js ###

The aim is to make 2D animations in Three.js simple : load the texture including the frames of your animation, give the animation's parameters, and you get an extended THREE.Sprite object, that you can use as a normal Sprite object, but also animate with SpriteMixer's functions.

# How to use
### Instantiate :
```javascript
var spriteMixer = SpriteMixer();
```  

### Create an actionSprite and some Actions from it :
```javascript
new THREE.TextureLoader().load("./character.png", (texture)=> {

	actionSprite = spriteMixer.ActionSprite( texture, 5, 2 );

	action1 = spriteMixer.Action(actionSprite, 0, 4, 50);
	action2 = spriteMixer.Action(actionSprite, 5, 9, 50);
	
	scene.add( actionSprite );
});
```  

**SpriteMixer.ActionSprite() returns an extended THREE.Sprite.    
All the parameters necessary for the animation are stored inside, 
but you can still use it as any THREE.Sprite, like scale it etc..**

**ActionSprite**( texture : *THREE.Texture*, tilesHoriz : *integer*, tilesVert : *integer* )    
	- texture : texture containing all the frames in a grid.    
	- tilesHoriz : number of frames on the horizontal direction.    
	- tilesVert : number of frames on the vertical direction.    
	
**SpriteMixer.Action returns an object containing the informations related to a
specific sequence in an actionSprite. For instance, if the actionSprite
contains 20 tiles, an Action could start at tile 5 and finish at tile 8.**

**Action**( actionSprite : *ActionSprite*, indexStart : *integer*, indexEnd : *integer*, tileDisplayDuration : *integer* )    
	- actionSprite is a SpriteMixer.ActionSprite, containing a loaded texture with tiles    
	- indexStart is the starting tile of the animation, index starts at 0.    
	- indexEnd is the ending tile of the animation    
	- tileDisplayDuration is the duration of ONE FRAME in the animation    
	

### Update in your animation loop:
```javascript
function loop() {
	requestAnimationFrame(loop);
	renderer.render(scene, camera);

	var delta = clock.getDelta();
        // clock is a THREE.Clock object
			
	spriteMixer.update(delta);
};
```
### Animate your Actions :
```javascript
action.playOnce();
// Make the sprite visible and play the action once

action.playLoop();
// Make the sprite visible and play the sprite animation in a loop

action.stop();
// stop the action and reset

action.pause();
// pause the action without reset

action.pauseNextEnd();
// let the action finish its current loop, then stop it

action.resume();
// resume the action if it was paused before its end

action.clampWhenFinished = true;
// If true, stops on its last frame. If false, it resets. Default is true.

action.hideWhenFinished = true;
// If true, hide the Sprite when action finishes. Default is false.

```  

### Listen for animation events :
```javascript
spriteMixer.addEventListener('finished', function(event) {
	console.log(event.action)
});
```

**spriteMixer.addEventListener**( eventName : *"finished" or "loop"*, callback : *function* )
	-> eventName is a string, either 'loop' or 'finished'.   
	   If 'loop', the callback will be called every time a looping actionSprite finishes a cycle.   
	   If 'finished', the callback is called once a non-looping actionSprite finishes its cycle.
	-> callback is the function you wish to be called at the resolution of this event.
	
The first argument of the callback takes an object containing a 'type' argument, which is either 'loop' or 'finished',
and an 'action' argument, containing the action that triggered the event.

### Set a frame manually (so you can use actionSprite as a table of indexed textures) :
```javascript
actionSprite.setFrame( index );
```
Set manually a frame of the animation. Frame indexing starts at 0.

### The texture including tiles must be in this format :
- Frames go from left ro right and top to bottom
- One texture can contain tiles for several actions
- Some tiles can be empty
- Each side of the texture must be power of 2, or browsers will resize it
![exemple of tiles texture](https://felixmariotto.s3.eu-west-3.amazonaws.com/character2.png)


