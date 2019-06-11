var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
//initializing size and the context of the canvas
var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
//wacthing the change in a tool used
var usedTool = 1;
function changeTool(radio) {
    if (radio) {
        usedTool = radio.value;
        console.log('current tool is: ' + usedTool);
    }
}
// Mouse event listener and object
var mouse = {
    x: undefined,
    y: undefined
};
window.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
});
//objects array
var startOfObject = true;
var objects = [];
var DrawObject = /** @class */ (function () {
    function DrawObject(xStart, yStart) {
        this.xStart = xStart;
        this.yStart = yStart;
    }
    return DrawObject;
}());
var Rect = /** @class */ (function (_super) {
    __extends(Rect, _super);
    function Rect(x, y, color) {
        var _this = _super.call(this, x, y) || this;
        _this.color = 'green';
        _this.lineWidth = 5;
        _this.color = color;
        return _this;
    }
    Rect.prototype.createRect = function (x, y) {
        c.fillStyle = this.color;
        c.lineWidth = this.lineWidth;
        //xStart = 20 | x = 1
        //yStart = 1 | y = 20
        var width = x - this.xStart;
        var height = y - this.yStart;
        c.fillRect(this.xStart, this.yStart, width, height);
    };
    return Rect;
}(DrawObject));
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
// function animate(){
//     requestAnimationFrame(animate)
// }
// animate();
// /**
//  * Create arc
//  */
// let newArc = new Arc(400, 400, 40, 0, Math.PI * 2, false, 'yellow', 'green');
//     newArc.createArc(true, true);
/**
 * Free draw
 */
window.addEventListener('mousemove', function (event) {
    if (usedTool == 1) {
        if (event.buttons === 1) {
            if (startOfObject) {
                objects.push(new Line(mouse.x, mouse.y, 'black'));
                startOfObject = false;
            }
            else {
                objects[objects.length - 1].createAnchor(mouse.x, mouse.y);
            }
        }
        else {
            startOfObject = true;
        }
    }
});
window.addEventListener('mouseup', function (event) {
    if (usedTool == 3) {
        if (startOfObject) {
            objects.push(new Rect(mouse.x, mouse.y, 'green'));
            startOfObject = false;
        }
        else {
            console.log(objects);
            objects[objects.length - 1].createRect(mouse.x, mouse.y);
            startOfObject = true;
        }
    }
});
//# sourceMappingURL=scripts.js.map