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
    usedTool = radio.value;
    console.log(objects);
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
var lastObjectItem = 0;
// Classes -------------------------------------------------------------------------
/**
 * DrawObject
 */
var DrawObject = /** @class */ (function () {
    function DrawObject(xStart, yStart) {
        this.xStart = xStart;
        this.yStart = yStart;
    }
    return DrawObject;
}());
/**
 * ShapedObject
 */
var ShapedObject = /** @class */ (function (_super) {
    __extends(ShapedObject, _super);
    function ShapedObject(x, y, outlineColor, outlineWidth) {
        var _this = _super.call(this, x, y) || this;
        _this.outlineColor = outlineColor;
        _this.outlineWidth = outlineWidth;
        return _this;
    }
    return ShapedObject;
}(DrawObject));
/**
 * Line
 */
var Line = /** @class */ (function (_super) {
    __extends(Line, _super);
    function Line(x, y, color) {
        var _this = _super.call(this, x, y) || this;
        _this.anchorPoints = [];
        _this.color = color;
        _this.lineWidth = 5;
        return _this;
    }
    Line.prototype.createAnchor = function (x, y) {
        c.lineWidth = this.lineWidth;
        this.anchorPoints.push([x, y]);
        this.drawObject(); //misschien overbodig
    };
    Line.prototype.drawObject = function () {
        c.beginPath();
        c.moveTo(this.xStart, this.yStart);
        c.strokeStyle = this.color;
        for (var i = 0; i < this.anchorPoints.length; i++) {
            c.lineTo(this.anchorPoints[i][0], this.anchorPoints[i][1]);
        }
        c.stroke();
    };
    return Line;
}(DrawObject));
/**
 * Rect
 */
var Rect = /** @class */ (function (_super) {
    __extends(Rect, _super);
    function Rect(x, y, color) {
        var _this = _super.call(this, x, y) || this;
        _this.color = color;
        return _this;
    }
    Rect.prototype.createRect = function (x, y) {
        c.fillStyle = this.color;
        this.width = x - this.xStart;
        this.height = y - this.yStart;
        this.drawObject(); //mischien niet nodig omdat de animate() dit al doet
    };
    Rect.prototype.drawObject = function () {
        c.fillStyle = this.color;
        c.fillRect(this.xStart, this.yStart, this.width, this.height);
    };
    return Rect;
}(DrawObject));
/**
 * Arc
 */
var Arc = /** @class */ (function (_super) {
    __extends(Arc, _super);
    function Arc(x, y) {
        var _this = _super.call(this, x, y) || this;
        _this.fillColor = "blue";
        _this.outlinecolor = "black";
        _this.startAngle = 0;
        _this.endAngle = Math.PI * 2;
        _this.counterClockWise = false;
        _this.lineWidth = 5;
        return _this;
    }
    Arc.prototype.createArc = function (x, y, outline, fill) {
        this.hasOutline = outline;
        this.hasFill = fill;
        this.radius = Math.sqrt(Math.pow((x - this.xStart), 2) + Math.pow((y - this.yStart), 2));
        this.drawObject(); //mischien niet nodig omdat de animate() dit al doet
    };
    Arc.prototype.drawObject = function () {
        c.beginPath();
        c.lineWidth = this.lineWidth;
        c.arc(this.xStart, this.yStart, this.radius, this.startAngle, this.endAngle, this.counterClockWise);
        if (this.hasOutline) {
            c.strokeStyle = this.outlinecolor;
            c.stroke();
        }
        if (this.hasFill) {
            c.fillStyle = this.fillColor;
            c.fill();
        }
    };
    return Arc;
}(DrawObject));
// animate canvas for animation while making a square, not yet in use
function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);
    for (var i = 0; i < objects.length; i++) {
        objects[i].drawObject();
    }
}
animate();
// Event Listeners ----------------------------------------------------------------------------
/**
 * Free draw
 * - While holding mouse down
 */
window.addEventListener('mousemove', function (event) {
    if (usedTool == 1 && event.toElement === canvas) {
        if (event.buttons === 1) {
            if (startOfObject) {
                objects.push(new Line(mouse.x, mouse.y, 'black'));
                startOfObject = false;
            }
            else {
                lastObjectItem = objects.length - 1;
                objects[lastObjectItem].createAnchor(mouse.x, mouse.y);
            }
        }
        else {
            startOfObject = true;
        }
    }
});
/**
 * Draw circle
 * - With 2 mouse clicks
 */
window.addEventListener('mousedown', function (event) {
    if (usedTool == 2 && event.toElement === canvas) {
        if (startOfObject) {
            objects.push(new Arc(mouse.x, mouse.y));
            startOfObject = false;
        }
        else {
            lastObjectItem = objects.length - 1;
            objects[lastObjectItem].createArc(mouse.x, mouse.y, false, true);
            startOfObject = true;
        }
    }
});
window.addEventListener('mousemove', function (event) {
    if (usedTool == 2 && event.toElement === canvas) {
        if (!startOfObject) {
            lastObjectItem = objects.length - 1;
            objects[lastObjectItem].createArc(mouse.x, mouse.y, false, true);
        }
    }
});
/**
 * Draw rectangle
 * - With 2 mouse clicks
 */
window.addEventListener('mousedown', function (event) {
    if (usedTool == 3 && event.toElement === canvas) {
        if (startOfObject) {
            objects.push(new Rect(mouse.x, mouse.y, 'green'));
            startOfObject = false;
        }
        else {
            lastObjectItem = objects.length - 1;
            objects[lastObjectItem].createRect(mouse.x, mouse.y);
            startOfObject = true;
        }
    }
});
window.addEventListener('mousemove', function (event) {
    if (usedTool == 3 && event.toElement === canvas) {
        if (!startOfObject) {
            lastObjectItem = objects.length - 1;
            objects[lastObjectItem].createRect(mouse.x, mouse.y);
        }
    }
});
function removeLast() {
    objects.pop();
}
//# sourceMappingURL=scripts.js.map