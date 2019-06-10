var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext('2d');
var rect = /** @class */ (function () {
    function rect(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    rect.prototype.createRect = function () {
        c.fillRect(this.x, this.y, this.width, this.height);
    };
    return rect;
}());
var rectangle = new rect(50, 80, 200, 400);
rectangle.createRect();
//# sourceMappingURL=scripts.js.map