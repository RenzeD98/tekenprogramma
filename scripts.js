//initializing size and the context of the canvas
var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
//tool type listeren
var usedTool = 0;
function changeTool(radio) {
    usedTool = radio.value;
}
// Mouse event listener
var mouse = {
    x: undefined,
    y: undefined
};
window.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
});
var DrawObject = /** @class */ (function () {
    function DrawObject(x, y) {
        this.x = x;
        this.y = y;
    }
    return DrawObject;
}());
var Rect = /** @class */ (function () {
    function Rect(x, y, width, height, color) {
        this.lineWidth = 5;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }
    Rect.prototype.createRect = function () {
        c.fillStyle = this.color;
        c.lineWidth = this.lineWidth;
        c.fillRect(this.x, this.y, this.width, this.height);
    };
    return Rect;
}());
var Line = /** @class */ (function () {
    function Line(x, y, color) {
        this.xStart = x;
        this.yStart = y;
        this.color = color;
        c.beginPath();
        c.moveTo(this.xStart, this.yStart);
        c.strokeStyle = color;
    }
    Line.prototype.createAnchor = function (x, y) {
        c.lineTo(x, y);
        c.stroke();
    };
    return Line;
}());
var Arc = /** @class */ (function () {
    function Arc(x, y, radius, startAngle, endAngle, counterClockWise, fillColor, outlineColor) {
        this.lineWidth = 5;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this.counterClockWise = counterClockWise;
        this.fillColor = fillColor;
        this.outlinecolor = outlineColor;
    }
    Arc.prototype.createArc = function (outline, fill) {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle, this.counterClockWise);
        c.lineWidth = this.lineWidth;
        if (outline) {
            c.strokeStyle = this.outlinecolor;
            c.stroke();
        }
        if (fill) {
            c.fillStyle = this.fillColor;
            c.fill();
        }
    };
    return Arc;
}());
// /**
//  * Create rectangle with variables in constructor
//  */
// let rectangle = new Rect(500, 500, 200, 400, 'green');
//     rectangle.createRect();
//
// /**
//  * Create Line with different anchorpoints
//  */
// let newLine = new Line(40, 50, 'blue');
//     newLine.createAnchor(100, 150);
//     newLine.createAnchor(130, 80);
//
// /**
//  * Create arc
//  */
// let newArc = new Arc(400, 400, 40, 0, Math.PI * 2, false, 'yellow', 'green');
//     newArc.createArc(true, true);
/**
 * Free draw
 */
var beginLine = true;
var line;
window.addEventListener('mousemove', function (event) {
    if (usedTool == 1) {
        if (event.buttons === 1) {
            if (beginLine) {
                line = new Line(mouse.x, mouse.y, 'black');
                beginLine = false;
            }
            else {
                line.createAnchor(mouse.x, mouse.y);
            }
        }
        else {
            beginLine = true;
        }
    }
});
//# sourceMappingURL=scripts.js.map