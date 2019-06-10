var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext('2d');
var rect = /** @class */ (function () {
    function rect() {
    }
    // constructor(x:number, y:number, width:number, height:number){
    //     this.x = x;
    //     this.y = y;
    //     this.width = width;
    //     this.height = height;
    // }
    //
    // createRect(){
    //     c.fillRect(this.x, this.y, this.width, this.height);
    // }
    rect.prototype.createRect = function (x, y, width, height, color) {
        c.fillStyle = color;
        c.fillRect(x, y, width, height);
    };
    return rect;
}());
var line = /** @class */ (function () {
    function line(x, y, color) {
        this.xStart = x;
        this.yStart = y;
        this.color = color;
        c.beginPath();
        c.moveTo(this.xStart, this.yStart);
        c.strokeStyle = color;
    }
    line.prototype.createAnchor = function (x, y) {
        c.lineTo(x, y);
        c.stroke();
    };
    return line;
}());
var Arc = /** @class */ (function () {
    function Arc() {
    }
    Arc.prototype.createStrokeArc = function () {
    };
    Arc.prototype.createFilledArc = function (x, y, radius, startAngle, endAngle, counterClockWise) {
        c.beginPath();
        c.arc(x, y, radius, startAngle, endAngle, counterClockWise);
    };
    return Arc;
}());
// Create rectangle with variables in constructor
// let rectangle = new rect(50, 80, 200, 400);
//     rectangle.createRect();
// Create rectangle with variables in function
var rectangle = new rect();
rectangle.createRect(50, 80, 200, 400, 'green');
// Create Line with different anchorpoints
var newLine = new line(40, 50, 'blue');
newLine.createAnchor(100, 150);
newLine.createAnchor(130, 80);
//# sourceMappingURL=scripts.js.map