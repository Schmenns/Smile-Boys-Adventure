function drawImage(img, x, y, width, height, deg, flip, flop, center) {

ctx.save();

if(typeof width === "undefined") width = img.width;
if(typeof height === "undefined") height = img.height;
if(typeof center === "undefined") center = false;

// Set rotation point to center of image, instead of top/left
if(center) {
    x -= width/2;
    y -= height/2;
}

// Set the origin to the center of the image
ctx.translate(x + width/2, y + height/2);

// Rotate the canvas around the origin
var rad = 2 * Math.PI - deg * Math.PI / 180;    
ctx.rotate(rad);

// Flip/flop the canvas
if(flip) flipScale = -1; else flipScale = 1;
if(flop) flopScale = -1; else flopScale = 1;
ctx.scale(flipScale, flopScale);

// Draw the image    
ctx.drawImage(img, -width/2, -height/2, width, height);

ctx.restore();
}

if (!CanvasRenderingContext2D.prototype.drawGif) {
    CanvasRenderingContext2D.prototype.drawGif = function (animatedGif, x, y, width, height) {
        this.drawImage(animatedGif.currentImage, x, y, width, height);
    };
}
var AnimatedGif = /** @class */ (function () {
    function AnimatedGif(imageElements, speed) {
        this.imageElements = null;
        this.playing = false;
        this.imageNumber = 0;
        this.speed = 1000 / 60;
        this.currentImage = null;
        this.imageLoop = null;
        if (!imageElements || !Number.isInteger(speed))
            console.error('A list of images and a number must be provided.');
        this.imageElements = imageElements;
        this.speed = speed;
        this.currentImage = this.imageElements[this.imageNumber];
    }
    AnimatedGif.prototype.play = function (speed) {
        var _this = this;
        if (!Number.isInteger(speed))
            console.error('A number must be provided.');
        this.imageNumber = 0;
        this.speed = speed;
        this.currentImage = this.imageElements[this.imageNumber];
        this.playing = true;
        this.imageLoop = window.setInterval(function () {
            _this.currentImage = _this.imageElements[_this.imageNumber];
            _this.imageNumber++;
            _this.imageNumber %= _this.imageElements.length;
        }, this.speed);
    };
    AnimatedGif.prototype.playOnce = function (speed, callback) {
        var _this = this;
        if (!Number.isInteger(speed))
            console.error('A number must be provided.');
        this.imageNumber = 0;
        this.currentImage = this.imageElements[this.imageNumber];
        this.playing = true;
        window.clearInterval(this.imageLoop);
        this.imageLoop = window.setInterval(function () {
            _this.currentImage = _this.imageElements[_this.imageNumber];
            _this.imageNumber++;
            if (_this.imageNumber === _this.imageElements.length) {
                window.clearInterval(_this.imageLoop);
                _this.playing = false;
                if (callback)
                    callback();
            }
        }, speed);
    };
    return AnimatedGif;
}());