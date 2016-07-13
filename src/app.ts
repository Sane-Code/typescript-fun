
import * as d3 from "d3";
import { Vec2 } from "./vec2";
import { Ball } from "./ball";
import { Wall } from "./wall";
import { checkBallCollisions, checkWallCollisions } from "./collision";

const width = 1000;
const height = 500;

const maxRadius = 20;
const minRadius = 5;

const cornerInset = 100;

const ballColors = ["#F16745", "#FFC65D", "#7BC8A4", "#4CC3D9", "#93648D"];

const balls: Ball[] = [];
const walls: Wall[] = [
    //sides
    new Wall(new Vec2(1, 0), width),
    new Wall(new Vec2(-1, 0), 0),
    new Wall(new Vec2(0, 1), height),
    new Wall(new Vec2(0, -1), 0),
    //corners
    new Wall(new Vec2(1, 1).normalize(),
             new Vec2(width, height).magnitude() * Math.cos(Math.abs((Math.PI/4) - Math.atan(height/width))) - cornerInset), // bottom right
    new Wall(new Vec2(-1, -1).normalize(), -cornerInset), // top left
    new Wall(new Vec2(1, -1).normalize(), (Math.sin(Math.PI/4) * width) - cornerInset), //top right
    new Wall(new Vec2(-1, 1).normalize(), (Math.sin(Math.PI/4) * height) - cornerInset) //bottom left
];

function step(delta: number) {
    balls.forEach(function(ball) {
        ball.addGravity(delta);
        ball.move(delta);
    })
    // to resolve collisions we first rewind to the time of impact
    // this results in a much more accurate and stable simulation
    checkBallCollisions(balls, maxRadius, function(a: Ball, b: Ball) {
        const impactDelta = a.impactTimeBall(b);
        a.move(-impactDelta);
        b.move(-impactDelta);
        a.collideBall(b);
        a.move(impactDelta);
        b.move(impactDelta);
    });
    checkWallCollisions(balls, walls, function(a: Ball, b: Wall) {
        const impactDelta = a.impactTimeWall(b);
        a.move(-impactDelta);
        a.collideWall(b);
        a.move(impactDelta);
    });
}

function rand(min: number, max: number): number {
    return (Math.random() * (max - min)) + min;
}

function randomBall(x: number, y: number): Ball {
    return new Ball(
        new Vec2(x, y), // position
        new Vec2(rand(-100, 100), rand(-100, 100)), // velocity
        rand(minRadius, maxRadius), // radius
        rand(0.7, 0.9), // restitution
        ballColors[Math.floor(Math.random()*ballColors.length)] //color
    );
}

const body = d3.select("body");

const svg = body.append("svg")
    .attr("width", width)
    .attr("height", height);

svg.on("click", function(a, b, c) {
    const coords = d3.mouse(svg.node());
    balls.push(randomBall(coords[0], coords[1]));
});

function draw() {
    const ball = svg.selectAll(".ball").data(balls, function(b) {return b.id;});
    ball.enter()
        .append("g")
        .attr("class", "ball")
        .attr("id", function(ball) { return ball.id;})
        .append("circle")
            .attr("cy", "0")
            .attr("cx", "0")
            .attr("fill", function(d) {return d.color;})
            .attr("r", function(d) { return d.radius; })
            .on("mouseover", function(d) {
        d3.select("#" + d.id + "tooltip")
            .style("opacity", 1)
            .interrupt()
            .transition()
            .delay(3000)
            .style("opacity", 0)
    })

    ball.attr("transform", function(d) {
        return "translate(" + d.position.x + ", " + d.position.y + ")";
    });

    ball.exit().remove();

    //tooltips cant go in the same group as the ball, we need to draw them on-top
    const tips = svg.selectAll(".tooltip").data(balls, function(b) {return b.id;});
    tips.enter()
        .append("g")
        .attr("class", "tooltip")
        .attr("pointer-events", "none")
        .style("opacity", 0)
        .attr("id", function(ball) { return ball.id + "tooltip";})
        .call(function(tip) {
            tip.append("line")
              .attr("x1", 1)
              .attr("x2", 15)
              .attr("y1", 0)
              .attr("y2", 0)
              .attr("stroke", "black")
              .attr("stroke-width", "1");

            tip.append("rect")
                .attr("x", 15)
                .attr("y", -20)
                .attr("width", 115)
                .attr("height", 40)
                .attr("rx", 5)
                .attr("ry", 5)
                .attr("fill", "#404040")
                .attr("stroke", "black")

            function tipText(clazz: string, y: number) {
                tip.append("text")
                    .attr("class", clazz)
                    .attr("x", 20)
                    .attr("y", y)
                    .attr("font-family", "Andale Mono, sans-serif")
                    .attr("font-size", "10")
                    .attr("fill", "#FFC65D")
            }

            tipText("velocity", -8)
            tipText("height", 2)
            tipText("mass", 12)

        })

    tips.attr("transform", function(d) {
        return "translate(" + (d.position.x + d.radius) + ", " + d.position.y + ")";
    });
    tips.select(".velocity").text(function(d) {
        return "velocity: " + d.velocity.magnitude().toFixed(1) + "m/s";
    })
    tips.select(".height").text(function(d) {
        return "height: " + (height - d.position.y).toFixed(0) + "m";
    })
    tips.select(".mass").text(function(d) {
        return "mass: " + d.mass.toFixed(0) + "kg";
    })

    tips.exit().remove();

    const line = svg.selectAll("line").data(walls);
    line.enter().append("line")
        .attr("x1", function(d) { return d.p1.x })
        .attr("x2", function(d) { return d.p2.x })
        .attr("y1", function(d) { return d.p1.y })
        .attr("y2", function(d) { return d.p2.y })
        .attr("stroke", "black")
        .attr("stroke-width", "2");
}

// The initial display.
draw();

var t0 = performance.now();

setInterval(function() {
    let t1 = performance.now();
    step((t1 - t0) / 1000);
    draw();
    t0 = t1;
}, 10); // up to 100 fps
