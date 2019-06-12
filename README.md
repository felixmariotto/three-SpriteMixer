# three-SpriteMixer
Based on http://stemkoski.github.io/Three.js/Texture-Animation.html
Working example here : https://felixmariotto.github.io/spritemixer

### Mixing table to play sprite animations in Three.js ###

The aim is to make visual effects in Three.js games simple : give a path to the texture including the frames of your animation, give the parameters of the animation, and you get a extended THREE.Sprite object, that you can use as a normal Sprite object, but also animate with SpriteMixer's functions.

### How to use ###
Instantiate :
```javascript
var spriteMixer = SpriteMixer();
```  

Create a actionSprite :
```javascript
var actionSprite = spriteMixer.ActionSprite("texture.png", 3, 3, 9, 60);
```  

Update in your animation loop:
```javascript
function loop() {
	requestAnimationFrame(loop);
	renderer.render(scene, camera);

	var delta = clock.getDelta();
        // delta provided by THREE.Clock
			
	spriteMixer.update(delta);
};
```
Animate your actionSprite :
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
// let the action finish its course then stop it

actionSprite.resume();
// resume the action if it was paused before its end

actionSprite.clampWhenFinished = true;
// make the action stop on last frame when it finish, reset if false

actionSprite.hideWhenFinished = true;
// set the object.visible = false at last frame if true

```  



