i2i-Academy-ThreeJsReactThreeFiberGameDevelopment-1


#What is this game?
Basically, you control a little pink cube and try to dodge endless red obstacles coming right at you. The longer you survive, the higher your score gets. If you hit a red block, it's game over—but you can always hit the restart button and try again. 

# How to Play
* Use **W-A-S-D** or the **Arrow Keys** to move left and right.
* Don't hit the red cubes!

I kept the architecture clean and component-driven:
* Three.js & React Three Fiber:Handled all the 3D rendering, lighting, and meshes.
* Game Loop:** Used R3F's `useFrame` hook to manage the 60 FPS movement, delta time, and score tracking.
* Collision Detection:** Implemented simple math-based boundary checks to detect when the player and an obstacle overlap.

Ege Goktug Ergin
