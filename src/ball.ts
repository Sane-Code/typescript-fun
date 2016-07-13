import { Vec2 } from "./vec2"
import { Wall } from "./wall"

const gravity = new Vec2(0, 9.806); // m/s^2

var counter = 0;

export class Ball {
    public mass: number;
    public id: string;

    constructor(public position: Vec2,
                public velocity: Vec2,
                public radius: number,
                public restitution: number,
                public color: string) {
        this.mass = Math.PI * radius * radius;
        this.id = "ball" + counter;
        counter++;
    }

    move(delta: number) {
        this.position = this.position.add(this.velocity.mult(delta));
    }

    addGravity(delta: number) {
        this.velocity = this.velocity.add(gravity.mult(delta));
    }

    isColliding(other: Ball | Wall) {
        if (other instanceof Ball) {
            const distance = this.position.subtract(other.position).magnitude();
            return distance < this.radius + other.radius;
        } else {
            const distanceAlongNormal = this.position.dotProduct(other.normal) + this.radius;
            return distanceAlongNormal > other.limit;
        }
    }

    collideBall(other: Ball) {
        const restitution = Math.min(this.restitution, other.restitution);
        const collisionNormal = this.position.subtract(other.position).normalize();
        // find components of their velocity along the normal
        const u1 = this.velocity.dotProduct(collisionNormal);
        const u2 = other.velocity.dotProduct(collisionNormal);
        const m1 = this.mass
        const m2 = other.mass
        // solve as a 1 dimension collision: https://en.wikipedia.org/wiki/Elastic_collision
        const v1 = restitution * ((u1 * (m1 - m2) + ( u2 * 2 * m2)) / (m1 + m2));
        const v2 = restitution * ((u2 * (m2 - m1) + ( u1 * 2 * m1)) / (m1 + m2));
        // replace original component of velocity with new one
        this.velocity = this.velocity.add(collisionNormal.mult(v1 - u1));
        other.velocity = other.velocity.add(collisionNormal.mult(v2 - u2));
    }

    collideWall(wall: Wall) {
        const u1 = this.velocity.dotProduct(wall.normal);
        const v1 = -u1 * this.restitution; // reflect & loose some energy
        this.velocity = this.velocity.add(wall.normal.mult(v1 - u1));
    }

    impactTimeBall(other: Ball): number { // how long ago the impact with the ball started
        // there is probably a quicker way. but this was fun to work out
        // by only considering their relative velocity, you can treat one ball as a fixed point
        // and the other as a line (defined by current position and relative velocity)
        // then work out the closest point on that line to the point. - an edge of a right-angled triangle
        // see: https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line#Vector_formulation
        // then you can use pythagoras to work out the point on the line (and hence point in time) where the two were touching
        const a = this.position; // a point on the line
        const p = other.position; // the point
        const n = this.velocity.subtract(other.velocity).normalize(); // the line vector
        // (a-p) - ((a-p).n)n
        const ap = a.subtract(p); // (a-p)
        const apnn = n.mult(ap.dotProduct(n)) // ((a-p).n)n
        const distance = ap.subtract(apnn);

        const hyp = (this.radius + other.radius)
        const d = distance.magnitude();
        const c = Math.sqrt(hyp * hyp - d * d);

        const collisionDelta = (c - apnn.magnitude()) / this.velocity.subtract(other.velocity).magnitude();
        return collisionDelta;
    }

    impactTimeWall(wall: Wall): number { // how long ago the impact with the wall started
        const distanceAlongNormal = this.position.dotProduct(wall.normal) + this.radius;
        const u = this.velocity.dotProduct(wall.normal);
        // how long ago the collision occurred
        const collisionDelta = (distanceAlongNormal - wall.limit) / u; 
        return collisionDelta;
    }
}
