//canvas letiabelen
let canvas;
let cw = innerWidth;
let ch = innerHeight;
let ctx;
let imgWidth;
let imgHeight;

let figures = [];
let figureLayer;
let figureShadowLayer;

var figureRotationX = 0;
var figureRotationY = 0;

var light_distanceX = 0;
var light_distanceY = 0;
let y_offset = 200;

var settingChangeLight = false;
var settingEnableShadow = true;
var keySDown = false;
var lightX = cw/2;
var lightY = ch/2 + y_offset;
var lightImage;

let mouse = {
    x: null,
    y: null,
    changed: false,
    changeCount: 0,
}
document.addEventListener("mousemove", mouseEvent);
document.addEventListener("keydown", keydownEvent);
document.addEventListener("keyup", keyupEvent);

// Basis instellingen canvas
canvas = document.getElementById("mainCanvas");
canvas.width = cw;
canvas.height = ch;
ctx = canvas.getContext('2d');


// Basis instellingen canvas2
canvas2 = document.getElementById("shadowCanvas");
canvas2.width = cw;
canvas2.height = ch;
ctx2 = canvas2.getContext('2d');

class Light {
    constructor({
        image = "still",
        x = 0,
        y = 0
    } = {}) {
        this.image = "img/changelightsettinglight/" + image + ".png";
        this.x = x;
        this.y = y;
    }

    draw() {
        let img = new Image();
        img.src = this.image;
        if (!settingChangeLight)
            ctx.globalAlpha = .1;
        ctx.drawImage(img, this.x - img.width, this.y - img.height, img.width * 2, img.height * 2);
        ctx.globalAlpha = 1;
    }

    update() {
        this.draw();
    }
}

class Figure {
    constructor({
        image = "img/test.png",
        times = 0,
    } = {}) {
        this.image = image;
        this.times = times;
    }

    draw() {
        for (let i = 0; i < this.times; i++) {
            let img = new Image();
            img.onload = function () {
                imgWidth = this.width * imgScale;
                imgHeight = this.height * imgScale;
            }
            let x = (cw / 2);
            let y = (ch / 2) - (figureLayer * imgScale/3) * 2 + y_offset;
            if (!settingChangeLight) {
                figureRotationX = mouse.x;
                figureRotationY = mouse.y;
            }
            img.src = this.image;
            ctx.globalAlpha = 1 - ghostEffect/100;
            ctx.setTransform(1, 0, 0, 1, x, y);
            ctx.rotate(Math.atan2(figureRotationY - (y + (figureLayer * imgScale/3) * 2), figureRotationX - x) - Math.PI / 2);
            ctx.drawImage(img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            if (!settingChangeLight)
                figureLayer++;
        }
    }

    update() {
        this.draw();
    }
}

class FigureShadow {
    constructor({
        image = "img/test.png",
        times = 0,
    } = {}) {
        this.image = image;
        this.times = times;
    }

    draw() {
        let img = new Image();
        img.onload = function () {
            imgWidth = this.width * imgScale;
            imgHeight = this.height * imgScale;
        }
        let x = 0;
        let y = 0;
        img.src = this.image;

        if (!settingChangeLight) {
            figureRotationX = mouse.x;
            figureRotationY = mouse.y;
        }

        drawShadowCanvas();
        ctx2.drawImage(img, x, y, imgWidth, imgHeight);
        let imageData = ctx2.getImageData(x, y, imgWidth * imgScale, imgHeight * imgScale);
        this.invertColors(imageData.data);
        ctx2.putImageData(imageData, x, y);

        var multiplytimesX = (light_distanceX / 2 >= 1) ? Math.abs(light_distanceX / 2) : 1;
        var multiplytimesY = (light_distanceY / 2 >= 1) ? Math.abs(light_distanceY / 2) : 1;
        var multiplytimes = (multiplytimesX > multiplytimesY) ? multiplytimesX : (multiplytimesX == multiplytimesY) ? multiplytimesX : multiplytimesY;
        multiplytimes *= 20;

        for (let i = 0; i < this.times * multiplytimes; i++) {
            x = (cw / 2) + (figureShadowLayer * imgScale/3) * light_distanceX / multiplytimes;
            y = (ch / 2) + (figureShadowLayer * imgScale/3) * light_distanceY / multiplytimes + y_offset;
            ctx.globalAlpha = (1 - ghostEffect/100)/5;
            ctx.setTransform(1, 0, 0, 1, x, y);
            ctx.rotate(Math.atan2(figureRotationY - (y - (figureShadowLayer* imgScale/3) * light_distanceY / multiplytimes), figureRotationX - (x - (figureShadowLayer* imgScale/3) * light_distanceX / multiplytimes)) - Math.PI / 2);
            ctx.drawImage(ctx2.canvas, -imgWidth / 2, -imgHeight / 2);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            figureShadowLayer++;
        }
    }

    invertColors(data) {
        for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] == 255 && data[i] == 170 && data[i + 1] == 170 && data[i + 2] == 170) {
                data[i] = 170;
                data[i + 1] = 170;
                data[i + 2] = 170;
            } else {
                data[i] = 15;
                data[i + 1] = 15;
                data[i + 2] = 15;
            }
        }
    }

    update() {
        this.draw();
    }
}

function animate() {

    requestAnimationFrame(animate);
    // calc elapsed time since last loop
    now = Date.now();
    elapsed = now - then;
    // if enough time has elapsed, draw the next frame
    if (elapsed > fpsInterval && mouse.changed) {
        // Get ready for next frame by setting then=now, but also adjust for your
        // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
        then = now - (elapsed % fpsInterval);
        // Put your drawing code here

        mouse.changed = false;

        drawCanvas();
        switch (selectedFigure) {
            case "shelf":
                figures = [
                    "img/shelf/1.png", 10,
                    "img/shelf/2.png", 10,
                    "img/shelf/3_1.png", 5,
                    "img/shelf/3_2.png", 10,
                    "img/shelf/3_3.png", 3,
                    "img/shelf/5.png", 5,
                    "img/shelf/3.png", 15,
                    "img/shelf/4.png", 2,
                    "img/shelf/6.png", 5
                ];
                break;

            case "balloon":
                figures = [
                    "img/balloon/1.png", 100,
                    "img/balloon/2.png", 2,
                    "img/balloon/3.png", 30,
                    "img/balloon/4.png", 40,
                    "img/balloon/5.png", 40
                ];
                break;

            case "doughnut":
                figures = [
                    "img/doughnut/1.png", 10,
                    "img/doughnut/2.png", 2,
                    "img/doughnut/3.png", 2,
                    "img/doughnut/4.png", 5,
                    "img/doughnut/5.png", 2
                ];
                break;

            case "chair":
                figures = [
                    "img/chair/1.png", 50,
                    "img/chair/2.png", 5,
                    "img/chair/1.png", 20,
                    "img/chair/3.png", 5,
                    "img/chair/4.png", 10,
                    "img/chair/5.png", 10,
                    "img/chair/4.png", 20,
                    "img/chair/5.png", 5
                ];
                break;

            default:
                figures = [];
                break;
        }
        figureLayer = 0;
        figureShadowLayer = 0;
        if (settingEnableShadow) {
            for (let i = 0; i < figures.length; i += 2) {
                let figureShadow = new FigureShadow({
                    image: figures[i],
                    times: figures[i + 1]
                });
                figureShadow.update();
            }
        }
        for (let i = 0; i < figures.length; i += 2) {
            let figure = new Figure({
                image: figures[i],
                times: figures[i + 1]
            });
            figure.update();
        }
        if (settingEnableShadow) {
            let light = new Light({
                image: lightImage,
                x: lightX,
                y: lightY
            });
            light.update();
        }
    }
}

startAnimating(60);

var stop = false;
var frameCount = 0;
var $results = $("#results");
var fps, fpsInterval, startTime, now, then, elapsed;
// initialize the timer variables and start the animation
function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    mouse.changed = true;
    animate();
}

function drawCanvas() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    cw = innerWidth;
    ch = innerHeight
    ctx.canvas.width = cw;
    ctx.canvas.height = ch;
    ctx.fillStyle = "#AAA";
    ctx.fillRect(0, 0, innerWidth, innerHeight);
}

function drawShadowCanvas() {
    ctx2.clearRect(0, 0, innerWidth, innerHeight);
}

function mouseEvent(e) { // get the mouse coordinates relative to the canvas top left
    let bounds = canvas.getBoundingClientRect();
    mouse.x = e.pageX - bounds.left;
    mouse.y = e.pageY - bounds.top;
    mouse.cx = e.clientX - bounds.left; // to compare the difference between client and page coordinates
    mouse.cy = e.clienY - bounds.top;
    mouse.changed = true;
    mouse.changeCount += 1;
}

function setShadowOffset() {
    light_distanceX = -(mouse.x - cw / 2) / 50;
    light_distanceY = -(mouse.y - ch / 2 - y_offset) / 50;
}

function keydownEvent(e) {
    switch (e.which) {
        case 32:
            if (settingEnableShadow) {
                lightX = mouse.x;
                lightY = mouse.y;
                lightImage = "move";
                settingChangeLight = true;
                setShadowOffset();
                mouse.changed = true;
            }
            break;
        case 83:
            if (!keySDown && settingEnableShadow) {
                settingEnableShadow = false;
                keySDown = true;
                console.log("shadow: " + settingEnableShadow);
            } else if (!keySDown && !settingEnableShadow) {
                settingEnableShadow = true;
                keySDown = true;
                console.log("shadow: " + settingEnableShadow);
            }
            mouse.changed = true;
            break;
        default:
            break;
    }
}

function keyupEvent(e) {
    switch (e.which) {
        case 32:
            lightImage = "still";
            settingChangeLight = false;
            mouse.changed = true;
            break;
        case 83:
            keySDown = false;
            break;
        default:
            break;
    }
}