import { Vec2 } from "./vec2"

export class Wall {
    public p1: Vec2;
    public p2: Vec2;

    constructor(public normal: Vec2, public limit: number) {
        // p1 and p2 are two points on this line. only used for drawing
        this.p1 = normal.mult(limit).add(normal.rotate(Math.PI/2).mult(100000));
        this.p2 = normal.mult(limit).add(normal.rotate(Math.PI/2).mult(-100000));
    }
}
