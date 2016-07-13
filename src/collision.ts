import { Vec2 } from "./vec2"
import { Ball } from "./ball"
import { Wall } from "./wall"

export function checkBallCollisions(balls: Ball[], maxBoundingSphere: number, callback: (a: Ball, b: Ball) => void) {
    // Using a "sweep and prune" collision detection
    // to reduce number of comparisons
    balls.sort(function(a, b) {
        if (a.position.x < b.position.x) {
            return -1;
        } else if(a.position.x > b.position.x) {
            return 1;
        } else return 0;
    })
    // if we really cared about performance, you could maintain the sorted list as
    // balls were moved. but this is good enough, its like O(n log n) instead of O(n),
    // also spacial partitioning algorithms are slightly more efficient in practice,
    // but are harder to implement

    for (var i = 0; i < balls.length -1; i++) {
        let ball = balls[i];
        let j = i + 1;
        while(j < balls.length) {
            let other = balls[j];
            if (ball.position.x + ball.radius < other.position.x - maxBoundingSphere) {
                break;
            }
            if (ball.isColliding(other)) {
                callback(ball, other);
            }
            j++;
        }
    }
}

export function checkWallCollisions(balls: Ball[], walls: Wall[], callback: (a: Ball, b: Wall) => void) {
    balls.forEach(function(ball) {
        walls.forEach(function(wall) {
            if (ball.isColliding(wall)) {
                callback(ball, wall);
            }
        })
    })
}

function collideBall(a: Ball, b: Ball) {
    // there is probably a quicker way. but this was fun to work out
    // by only considering their relative velocity, you can treat one ball as a fixed point
    // and the other as a line (defined by current position and relative velocity)
    // then work out the closest point on that line to the point. - an edge of a right-angled triangle
    // see: https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line#Vector_formulation
    // then you can use pythagoras to work out the point on the line (and hence point in time) where the two were touching
    const n = a.velocity.subtract(b.velocity).normalize();
    const ap = a.position.subtract(b.position); // (a-p)
    const apnn = n.mult(ap.dotProduct(n)) // ((a-p).n)n
    const distance = ap.subtract(apnn);
    // (a-p) - ((a-p).n)n
    // a = point on line
    // p = the point
    // n = line vector

    const hyp = (a.radius + b.radius)
    const d = distance.magnitude();
    const c = Math.sqrt(hyp * hyp - d * d);

    const collisionDelta = (c - apnn.magnitude()) / a.velocity.subtract(b.velocity).magnitude();
    return collisionDelta;
    // //unwind time
    // a.move(-collisionDelta)
    // b.move(-collisionDelta)
    // a.collideBall(b)
    // a.move(collisionDelta)
    // b.move(collisionDelta)
}

function collideWall(ball: Ball, wall: Wall) {
    const distanceAlongNormal = this.position.dotProduct(wall.normal) + this.radius;
    const u = ball.velocity.dotProduct(wall.normal);
    // how long ago the collision occurred
    const collisionDelta = (distanceAlongNormal - wall.limit) / u; 
    if (collisionDelta < 0) { // moving out of collision...
        return;
    }
    // unwind time
    // ball.move(-collisionDelta)
    // ball.collideWall(wall)
    // ball.move(collisionDelta)
}
