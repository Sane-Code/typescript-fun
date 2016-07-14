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
