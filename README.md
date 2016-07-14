# Bouncing Balls

A deployed version of this project can be found at http://178.62.77.118/

## Setup

to run the code locally you will need to install some things, if you'd rather not, then see the
section on Docker below.

* node
* npm
* typescript
* typings
* webpack

This should get you going on a mac:

```
brew install node
npm install -g typescript webpack typings
```

Then you need to initialize the dev environment

```
npm install
typings install
```

## Running the Code

to run the code locally, you can run `webpack` to compile and bundle.
then run `webpack-dev-server` to serve up the site at http://localhost:8080/build/index.html

## Docker container

a Dockerfile is provided. It will produce a clean build from source and serve up the site using nginx.

the following should make the site available at http://localhost:8080/ (or the ip of your vm if you use docker-machine)
```
docker build -t balls .

docker run -p 8080:80 balls 
```

## Tests

use `npm test` to run the tests

## Overview

I've done a good deal more than neccessary because it was fun.

### Accurate physics simulation

balls have mass and restitution. They loose energy when they collide and they behave as real ~1 ton perfectly spherical bouncy balls without friction would when dropped from ~200m.

When a collision is detected, I rewind time to the point of impact and resolve it at that time, before advancing again. I doubt you would notice the effect unless you drop the framerate to about 10fps, but the physics would go a little wonky if I didnt.

### Angled walls

The code for collisions with walls parallel to axis is incredibly simple, you just reflect the component of velocity along the other axis - But I opted to generalize and allow walls to be any angle.

### Tooltips for ball stats

Its much more interesting if you can see the properties of the balls. Mouseover one to see a few attributes

## Flaws and known deficiencies

If you add a ton of balls and you wait for them to rest on eachother, they will "shiver" or "wobble" and push appart. This is because the balls get close enough to be colliding on both sides, when one collision is resolved, it results in the ball collding with another - which may not be resolved this iteration. The unresolved collsions are then resolved the next iteration, but to rewind until the point of impact, it will have to go further back in time than the length of this iteration, this will cause "instability". Another cause of this instability is that forces aren't transferred through objects in contact - due to gravity, a ball will accelerate into the ground even if it is already touching it.

The above instability is usually solved by putting objects to "sleep" when they're beneath a certain velocity for some time, but this poses its own problems which I wont get into here.

Another thing I've done in the d3 code is to put attributes on svg elements directly which should be pulled out and put into CSS, that can be a future extension.

It could probably use more tests.

## Disclaimer

Time spent on project: 3 days

I've never used typescript before this project and I've written very little javascript.
The biggest time sink was the maths and geometry to work out collisions accurately.
The second biggest time sink was learning webpack. What an awful(ly flexible) build tool.
The third biggest time sink was learning d3...

Though I'd never used these tools, I've read an awful lot about them, so it's been kind of cathertic to finally produce something with them.
