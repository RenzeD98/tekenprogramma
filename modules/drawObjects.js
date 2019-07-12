"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
/** -----------------------------------------------------------------------
 * DrawObject
 */
var DrawObject = /** @class */ (function () {
    function DrawObject(canvasContext, xStart, yStart, lineColor, lineWidth) {
        this.c = canvasContext;
        this.xStart = xStart;
        this.yStart = yStart;
        this.lineColor = lineColor;
        this.lineWidth = lineWidth;
    }
    DrawObject.prototype.drawObject = function () { };
    return DrawObject;
}());
exports.DrawObject = DrawObject;
/** -----------------------------------------------------------------------
 * Line
 */
var Line = /** @class */ (function (_super) {
    __extends(Line, _super);
    function Line(c, x, y, lineColor, lineWidth) {
        var _this = _super.call(this, c, x, y, lineColor, lineWidth) || this;
        _this.anchorPoints = [];
        return _this;
    }
    Line.prototype.createAnchor = function (x, y) {
        this.anchorPoints.push([x, y]);
    };
    Line.prototype.drawObject = function () {
        this.c.beginPath();
        this.c.lineWidth = this.lineWidth;
        this.c.moveTo(this.xStart, this.yStart);
        this.c.strokeStyle = this.lineColor;
        for (var i = 0; i < this.anchorPoints.length; i++) {
            this.c.lineTo(this.anchorPoints[i][0], this.anchorPoints[i][1]);
        }
        this.c.stroke();
        _super.prototype.drawObject.call(this);
    };
    return Line;
}(DrawObject));
exports.Line = Line;
/** -----------------------------------------------------------------------
 * Rect
 */
var Rect = /** @class */ (function (_super) {
    __extends(Rect, _super);
    function Rect(c, x, y, hasLine, lineColor, lineWidth, hasFill, fillColor) {
        var _this = _super.call(this, c, x, y, lineColor, lineWidth) || this;
        _this.hasline = hasLine;
        _this.innerColor = fillColor;
        return _this;
    }
    Rect.prototype.createObject = function (x, y) {
        this.c.fillStyle = this.innerColor;
        this.width = x - this.xStart;
        this.height = y - this.yStart;
    };
    Rect.prototype.drawObject = function () {
        this.c.fillStyle = this.innerColor;
        this.c.fillRect(this.xStart, this.yStart, this.width, this.height);
        _super.prototype.drawObject.call(this);
    };
    return Rect;
}(DrawObject));
exports.Rect = Rect;
/** -----------------------------------------------------------------------
 * Arc
 */
var Arc = /** @class */ (function (_super) {
    __extends(Arc, _super);
    function Arc(c, x, y, line, lineColor, lineWidth, hasFill, fillColor) {
        var _this = _super.call(this, c, x, y, lineColor, lineWidth) || this;
        _this.fillColor = fillColor;
        _this.hasOutline = line;
        _this.hasFill = hasFill;
        _this.startAngle = 0;
        _this.endAngle = Math.PI * 2;
        _this.counterClockWise = false;
        return _this;
    }
    Arc.prototype.createObject = function (x, y) {
        this.radius = Math.sqrt(Math.pow((x - this.xStart), 2) + Math.pow((y - this.yStart), 2));
    };
    Arc.prototype.drawObject = function () {
        this.c.beginPath();
        this.c.lineWidth = this.lineWidth;
        this.c.arc(this.xStart, this.yStart, this.radius, this.startAngle, this.endAngle, this.counterClockWise);
        if (this.hasOutline) {
            this.c.strokeStyle = this.lineColor;
            this.c.stroke();
        }
        if (this.hasFill) {
            this.c.fillStyle = this.fillColor;
            this.c.fill();
        }
        _super.prototype.drawObject.call(this);
    };
    return Arc;
}(DrawObject));
exports.Arc = Arc;
//# sourceMappingURL=drawObjects.js.map