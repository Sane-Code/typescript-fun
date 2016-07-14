
import { Ball } from "../src/ball";
import { Wall } from "../src/wall";
import { Vec2 } from "../src/vec2";

import { expect } from "chai";

// make it easy to create balls with defaults
function ball(prop: any) {
    const defaults = {
        "position": new Vec2(0, 0),
        "velocity": new Vec2(0, 0),
        "radius": 10,
        "restitution": 1,
    }
    for (var attr in prop) {
        defaults[attr] = prop[attr];
    }
    return new Ball(
        defaults["position"],
        defaults["velocity"],
        defaults["radius"],
        defaults["restitution"],
        ""
    );
}

describe("Ball", function() {
    describe("#move()", function() {

        it("should move in the direction of it's velocity", function() {
            const b = ball({"velocity": new Vec2(1, 2)});
            b.move(2); // after 2s

            expect(b.position).to.deep.equal(new Vec2(2, 4))
        })

        it("should be consistent if we reverse time", function() {
            const start = new Vec2(1, 1);
            const b = ball({
                "position": start,
                "velocity": new Vec2(1, 2)
            });
            b.move(2);
            b.move(-4);
            b.move(2);

            expect(b.position).to.deep.equal(start)
        })
    })

    describe("#addGravity()", function() {

        it("should accellerate towards the ground (positive y direction)", function() {
            const startVelocity = new Vec2(1, 2);
            const b = ball({"velocity": startVelocity});

            b.addGravity(1);

            expect(b.velocity.y).to.be.above(startVelocity.y)
        })
    })

    describe("#impactTimeWall()", function() {
        it("should accurately tell us when a wall impact happened", function () {
            // vertical wall, 10m to the right
            const w = new Wall(new Vec2(1, 0), 10);

            const b = ball({
                "position": new Vec2(0, 0),
                "velocity": new Vec2(1, 1),
                "radius": 5
            })
            //moving 1ms in the x direction and having radius 5m
            // should strike the wall 5s in the future
            expect(b.impactTimeWall(w)).to.equal(-5);
        })
    })

    describe("#isColliding()", function() {
        it("should tell me if two balls are colliding", function() {
            const a = ball({
                "position": new Vec2(2, 2),
                "radius": 1
            })
            const b = ball({
                "position": new Vec2(3, 2),
                "radius": 1
            })
            expect(a.isColliding(b)).to.be.true;
        })

        it("should tell me if two balls aren't colliding", function() {
            const a = ball({
                "position": new Vec2(0, 0),
                "radius": 1
            })
            const b = ball({
                "position": new Vec2(2, 2),
                "radius": 1
            })
            expect(a.isColliding(b)).to.be.false;
        })

        it("should tell me if the ball is colliding with a wall", function() {
            // vertical wall, 10m to the right
            const w = new Wall(new Vec2(1, 0), 10);

            const b = ball({
                "position": new Vec2(8, 0),
                "radius": 5
            })
            expect(b.isColliding(w)).to.be.true;
        })

        it("should tell me if the ball isnt colliding with a wall", function() {
            // vertical wall, 10m to the right
            const w = new Wall(new Vec2(1, 0), 10);
 
            const b = ball({
                "position": new Vec2(8, 0),
                "radius": 1
            })
            expect(b.isColliding(w)).to.be.false;
        })
    })

    describe("#impactTimeBall()", function() {

        it("should accurately tell us when a ball impact happened", function() {
            //position balls so they're touching
            const a = ball({
                "position": new Vec2(4, 4),
                "velocity": new Vec2(-1, 0),
                "radius": 1
            })
            const b = ball({
                "position": new Vec2(2, 4),
                "velocity": new Vec2(1, 0),
                "radius": 1
            })
            // rewind time 2s
            a.move(-2)
            b.move(-2)
            // expect a collision 2s in the future
            expect(a.impactTimeBall(b)).to.equal(-2)
        })
    })
});
