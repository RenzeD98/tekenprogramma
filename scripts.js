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
var tools;
(function (tools) {
    tools[tools["Freedraw"] = 0] = "Freedraw";
    tools[tools["Circle"] = 1] = "Circle";
    tools[tools["Rectangle"] = 2] = "Rectangle";
})(tools || (tools = {}));
// Classes -------------------------------------------------------------------------
/**
 * DrawCanvas
 */
var DrawCanvas = /** @class */ (function () {
    function DrawCanvas(width, height) {
        this.startOfObject = true;
        this.objects = [];
        this.width = width;
        this.height = height;
        this.mouse = {
            x: undefined,
            y: undefined
        };
        this.drawToolbox();
        this.drawCanvas();
        this.animate();
        this.mouseMovementEventListener();
        this.pencilEventListener();
        this.cirlceEventListener();
        this.squireEventListener();
        this.buttonsEventListeners();
    }
    DrawCanvas.prototype.drawToolbox = function () {
        this.toolbox = new Toolbox;
    };
    DrawCanvas.prototype.drawCanvas = function () {
        //initializing size and the context of the canvas
        this.canvas = document.createElement('canvas');
        this.c = this.canvas.getContext('2d');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        var canvasContainer = document.getElementById("canvasContainer");
        canvasContainer.appendChild(this.canvas);
        var toolBar = document.getElementById("toolBar");
        toolBar.style.height = this.height + 22 + "px";
    };
    DrawCanvas.prototype.animate = function () {
        var _this = this;
        requestAnimationFrame(function () { _this.animate(); });
        this.c.clearRect(0, 0, innerWidth, innerHeight);
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].drawObject();
        }
    };
    DrawCanvas.prototype.mouseMovementEventListener = function () {
        var _this = this;
        window.addEventListener('mousemove', function (event) {
            // console.log('Tool in Canvas object '+this.toolbox.getSelectedTool);
            _this.mouse.x = event.offsetX;
            _this.mouse.y = event.offsetY;
        });
    };
    DrawCanvas.prototype.pencilEventListener = function () {
        var _this = this;
        window.addEventListener('mousemove', function (event) {
            if (_this.toolbox.selectedTool === 0 && event.target === _this.canvas) {
                if (event.buttons === 1) {
                    if (_this.startOfObject) {
                        _this.objects.push(new Line(_this.c, _this.mouse.x, _this.mouse.y, 'black', 5));
                        _this.startOfObject = false;
                    }
                    else {
                        var lastObjectItem = _this.objects.length - 1;
                        _this.objects[lastObjectItem].createAnchor(_this.mouse.x, _this.mouse.y);
                    }
                }
                else {
                    _this.startOfObject = true;
                }
            }
        });
    };
    DrawCanvas.prototype.cirlceEventListener = function () {
        var _this = this;
        window.addEventListener('mousemove', function (event) {
            if (_this.toolbox.selectedTool === 1 && event.target === _this.canvas) {
                if (!_this.startOfObject) {
                    var lastObjectItem = _this.objects.length - 1;
                    _this.objects[lastObjectItem].createObject(_this.mouse.x, _this.mouse.y);
                }
            }
        });
        window.addEventListener('mousedown', function (event) {
            if (_this.toolbox.selectedTool == 1 && event.target === _this.canvas) {
                if (_this.startOfObject) {
                    _this.objects.push(new Arc(_this.c, _this.mouse.x, _this.mouse.y, false, 'green', 3, true, 'grey'));
                    _this.startOfObject = false;
                }
                else {
                    var lastObjectItem = _this.objects.length - 1;
                    _this.objects[lastObjectItem].createObject(_this.mouse.x, _this.mouse.y);
                    _this.startOfObject = true;
                }
            }
        });
    };
    DrawCanvas.prototype.squireEventListener = function () {
        var _this = this;
        window.addEventListener('mousemove', function (event) {
            if (_this.toolbox.selectedTool == 2 && event.target === _this.canvas) {
                if (!_this.startOfObject) {
                    var lastObjectItem = _this.objects.length - 1;
                    _this.objects[lastObjectItem].createObject(_this.mouse.x, _this.mouse.y);
                }
            }
        });
        window.addEventListener('mousedown', function (event) {
            if (_this.toolbox.selectedTool == 2 && event.target === _this.canvas) {
                if (_this.startOfObject) {
                    console.log(event);
                    _this.objects.push(new Rect(_this.c, _this.mouse.x, _this.mouse.y, false, 'green', 5, true, 'black'));
                    _this.startOfObject = false;
                }
                else {
                    var lastObjectItem = _this.objects.length - 1;
                    _this.objects[lastObjectItem].createObject(_this.mouse.x, _this.mouse.y);
                    _this.startOfObject = true;
                }
            }
        });
    };
    DrawCanvas.prototype.buttonsEventListeners = function () {
        var _this = this;
        this.toolbox.downloadButton.addEventListener('click', function () {
            var dataURL = _this.canvas.toDataURL("image/png");
            _this.toolbox.downloadButton.href = dataURL;
        });
    };
    return DrawCanvas;
}());
var Toolbox = /** @class */ (function () {
    function Toolbox() {
        this.tools = ['pencil', 'circle', 'squire'];
        this.selectedTool = 0;
        this.toolbox = document.createElement('ul');
        /**
         * SETTING UP THE TOOLS
         */
        for (var i = 0; i < this.tools.length; i++) {
            var itemLi = document.createElement('li');
            var itemInput = document.createElement('input');
            itemInput.setAttribute('type', 'radio');
            itemInput.setAttribute('name', 'tool');
            itemInput.setAttribute('value', i.toString());
            itemInput.setAttribute('id', this.tools[i]);
            this.selectedTool === i ? itemInput.setAttribute('checked', 'checked') : '';
            itemInput.addEventListener('change', this.change);
            var itemLabel = document.createElement('label');
            itemLabel.setAttribute('for', this.tools[i]);
            itemLabel.innerHTML = this.tools[i];
            itemLi.appendChild(itemInput);
            itemLi.appendChild(itemLabel);
            this.toolbox.appendChild(itemLi);
        }
        /**
          * SETTING UP BUTTONS (download button)
          */
        this.downloadButton = document.createElement('a');
        this.downloadButton.setAttribute('download', 'Mijn mooie ding');
        this.downloadButton.innerHTML = 'Download as PNG';
        this.toolbox.appendChild(this.downloadButton);
        // set the toolbox in the body of the programm.
        document.body.appendChild(this.toolbox);
    }
    Toolbox.prototype.change = function (item) {
        this.selectedTool = item.target.value;
        console.log('Tool in Toolbox object ' + this.selectedTool);
    };
    Object.defineProperty(Toolbox.prototype, "getSelectedTool", {
        get: function () {
            return this.selectedTool;
        },
        enumerable: true,
        configurable: true
    });
    return Toolbox;
}());
/**
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
/**
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
        this.c.lineWidth = this.lineWidth;
        this.anchorPoints.push([x, y]);
        this.drawObject(); //misschien overbodig
    };
    Line.prototype.drawObject = function () {
        this.c.beginPath();
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
/**
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
        this.drawObject();
    };
    Rect.prototype.drawObject = function () {
        this.c.fillStyle = this.innerColor;
        this.c.fillRect(this.xStart, this.yStart, this.width, this.height);
        _super.prototype.drawObject.call(this);
    };
    return Rect;
}(DrawObject));
/**
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
        this.drawObject();
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
//create Canvas
// new DrawCanvas(window.innerWidth, window.innerHeight);
new DrawCanvas(1000, 550);
//# sourceMappingURL=scripts.js.map