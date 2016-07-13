
export class Vec2 {
    constructor(public x: number,
                public y: number) {
    }

    add(other: Vec2) {
        return new Vec2(this.x + other.x, this.y + other.y);
    }

    subtract(other: Vec2) {
        return new Vec2(this.x - other.x, this.y - other.y)
    }

    mult(scalar: number) {
        return new Vec2(this.x * scalar, this.y * scalar);
    }

    dotProduct(other: Vec2): number {
        return this.x * other.x + this.y * other.y;
    }

    magnitude(): number {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    normalize(): Vec2 {
        return this.mult(1/this.magnitude())
    }

    rotate(radians: number): Vec2 {
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        return new Vec2((this.x * cos) - (this.y * sin), (this.x * sin) + (this.y * cos));
    }
}
