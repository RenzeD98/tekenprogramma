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
    tools[tools["freeFormSelect"] = 0] = "freeFormSelect";
    tools[tools["select"] = 1] = "select";
    tools[tools["eraser"] = 2] = "eraser";
    tools[tools["bucket"] = 3] = "bucket";
    tools[tools["pipet"] = 4] = "pipet";
    tools[tools["magnifier"] = 5] = "magnifier";
    tools[tools["pencil"] = 6] = "pencil";
    tools[tools["brush"] = 7] = "brush";
    tools[tools["sprayCan"] = 8] = "sprayCan";
    tools[tools["text"] = 9] = "text";
    tools[tools["line"] = 10] = "line";
    tools[tools["curve"] = 11] = "curve";
    tools[tools["rectangle"] = 12] = "rectangle";
    tools[tools["polygon"] = 13] = "polygon";
    tools[tools["elipse"] = 14] = "elipse";
    tools[tools["roundedRectangle"] = 15] = "roundedRectangle";
})(tools || (tools = {}));
/** -----------------------------------------------------------------------
 * ConstructProgram
 * - Superclass?
 *
 */
var ConstructProgram = /** @class */ (function () {
    function ConstructProgram(width, height) {
        this.canvas = new Canvas(width, height);
        this.toolbox = new Toolbox(this, height);
        this.colorbox = new Colorbox(this);
    }
    ConstructProgram.prototype.toolChanged = function (tool) {
        this.canvas.currentTool = tool;
    };
    ConstructProgram.prototype.colorChanged = function (color) {
        this.canvas.currentColor = color;
    };
    return ConstructProgram;
}());
/** -----------------------------------------------------------------------
 * Canvas
 */
var Canvas = /** @class */ (function () {
    function Canvas(width, height) {
        this.objects = [];
        this.undoneObjects = [];
        this.startOfObject = true;
        this.width = width;
        this.height = height;
        this.mouse = {
            x: undefined,
            y: undefined
        };
        this.drawCanvas();
        this.animate();
        this.mouseMovementEventListener();
        this.pencilEventListener();
        this.brushEventListener();
        this.eraserEventListener();
        this.circleEventListener();
        this.squareEventListener();
        this.buttonsEventListeners();
        this.undoEventListener();
        this.redoEventListener();
    }
    Canvas.prototype.drawCanvas = function () {
        //initializing size and the context of the canvas
        this.canvas = document.createElement('canvas');
        this.c = this.canvas.getContext('2d');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        var canvasContainer = document.getElementById("canvasContainer");
        canvasContainer.appendChild(this.canvas);
    };
    Canvas.prototype.animate = function () {
        var _this = this;
        requestAnimationFrame(function () { _this.animate(); });
        this.c.clearRect(0, 0, this.width, this.height);
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].drawObject();
        }
    };
    Canvas.prototype.mouseMovementEventListener = function () {
        var _this = this;
        window.addEventListener('mousemove', function (event) {
            _this.mouse.x = event.offsetX;
            _this.mouse.y = event.offsetY;
        });
    };
    Canvas.prototype.undoEventListener = function () {
        var _this = this;
        window.addEventListener('keypress', function (event) {
            if (event.code === "KeyZ" && event.ctrlKey === true && _this.objects[_this.objects.length - 1] !== undefined) {
                _this.undoneObjects.push(_this.objects[_this.objects.length - 1]);
                _this.objects.pop();
            }
        });
    };
    Canvas.prototype.redoEventListener = function () {
        var _this = this;
        window.addEventListener('keypress', function (event) {
            if (event.code === "KeyY" && event.ctrlKey === true && _this.undoneObjects[_this.undoneObjects.length - 1] !== undefined) {
                _this.objects.push(_this.undoneObjects[_this.undoneObjects.length - 1]);
                _this.undoneObjects.pop();
            }
        });
        window.addEventListener('mousedown', function (event) {
            _this.undoneObjects = [];
        });
    };
    Canvas.prototype.pencilEventListener = function () {
        var _this = this;
        window.addEventListener('mousemove', function (event) {
            if (_this.currentTool == tools.pencil && event.target === _this.canvas) {
                if (event.buttons === 1) {
                    if (_this.startOfObject) {
                        _this.objects.push(new Line(_this.c, _this.mouse.x, _this.mouse.y, _this.currentColor, 3));
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
    //TODO: Deze Functie is letterlijk een clone van pencilEventListener(), dit even netjes maken
    Canvas.prototype.brushEventListener = function () {
        var _this = this;
        window.addEventListener('mousemove', function (event) {
            if (_this.currentTool == tools.brush && event.target === _this.canvas) {
                if (event.buttons === 1) {
                    if (_this.startOfObject) {
                        _this.objects.push(new Line(_this.c, _this.mouse.x, _this.mouse.y, _this.currentColor, 10));
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
    //TODO: Deze Functie is letterlijk een clone van pencilEventListener(), dit even netjes maken
    Canvas.prototype.eraserEventListener = function () {
        var _this = this;
        window.addEventListener('mousemove', function (event) {
            if (_this.currentTool == tools.eraser && event.target === _this.canvas) {
                if (event.buttons === 1) {
                    if (_this.startOfObject) {
                        _this.objects.push(new Line(_this.c, _this.mouse.x, _this.mouse.y, '#FFFFFF', 5));
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
    Canvas.prototype.circleEventListener = function () {
        var _this = this;
        window.addEventListener('mousemove', function (event) {
            if (_this.currentTool == tools.elipse && event.target === _this.canvas) {
                if (!_this.startOfObject) {
                    var lastObjectItem = _this.objects.length - 1;
                    _this.objects[lastObjectItem].createObject(_this.mouse.x, _this.mouse.y);
                }
            }
        });
        window.addEventListener('mousedown', function (event) {
            if (_this.currentTool == tools.elipse && event.target === _this.canvas) {
                if (_this.startOfObject) {
                    //TODO: Deze fillColor heeft nu de value die de lineColor eigenlijks moet hebben
                    _this.objects.push(new Arc(_this.c, _this.mouse.x, _this.mouse.y, false, 'green', 3, true, _this.currentColor));
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
    Canvas.prototype.squareEventListener = function () {
        var _this = this;
        window.addEventListener('mousemove', function (event) {
            if (_this.currentTool == tools.rectangle && event.target === _this.canvas) {
                if (!_this.startOfObject) {
                    var lastObjectItem = _this.objects.length - 1;
                    _this.objects[lastObjectItem].createObject(_this.mouse.x, _this.mouse.y);
                }
            }
        });
        window.addEventListener('mousedown', function (event) {
            if (_this.currentTool == tools.rectangle && event.target === _this.canvas) {
                if (_this.startOfObject) {
                    //TODO: Deze fillColor heeft nu de value die de lineColor eigenlijks moet hebben
                    _this.objects.push(new Rect(_this.c, _this.mouse.x, _this.mouse.y, false, 'green', 5, true, _this.currentColor));
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
    Canvas.prototype.buttonsEventListeners = function () {
        var _this = this;
        var downloadButton = document.getElementById('downloadButton');
        downloadButton.setAttribute('download', 'mijn mooie creatie');
        downloadButton.addEventListener('click', function () {
            downloadButton.setAttribute('href', _this.canvas.toDataURL("image/png"));
        });
    };
    return Canvas;
}());
/** -----------------------------------------------------------------------
 *  Toolbox
 */
var Toolbox = /** @class */ (function () {
    function Toolbox(delegate, height) {
        var _this = this;
        this.changeTool = function (item) {
            _this.selectedTool = item.target.value;
            _this.updateTool();
        };
        this.delegate = delegate;
        this.height = height;
        this.totalTools = 16;
        this.selectedTool = 6;
        this.updateTool();
        this.appendToolbox();
    }
    Toolbox.prototype.appendToolbox = function () {
        this.toolbox = document.createElement('ul');
        this.toolbox.className = 'tool-bar-ul';
        for (var i = 0; i < this.totalTools; i++) {
            var itemLi = document.createElement('li');
            var itemInput = document.createElement('input');
            var itemIcon = document.createElement('div');
            itemLi.className = 'tool-bar-li';
            itemInput.setAttribute('type', 'radio');
            itemInput.setAttribute('name', 'tool');
            itemInput.setAttribute('value', i.toString());
            itemInput.addEventListener('change', this.changeTool);
            this.selectedTool === i ? itemInput.setAttribute('checked', 'checked') : '';
            itemIcon.className = 'tool-bar-icon';
            itemIcon.setAttribute('style', 'background-image: url("icons/' + i + '.png")');
            itemLi.appendChild(itemInput);
            itemLi.appendChild(itemIcon);
            this.toolbox.appendChild(itemLi);
        }
        var toolbar = document.getElementById('toolBar');
        toolbar.style.height = this.height + 22 + "px";
        toolbar.appendChild(this.toolbox);
    };
    Toolbox.prototype.updateTool = function () {
        this.delegate.toolChanged(this.selectedTool);
    };
    return Toolbox;
}());
/** -----------------------------------------------------------------------
 *  Colorbox
 */
var Colorbox = /** @class */ (function () {
    function Colorbox(delegate) {
        var _this = this;
        this.changeColor = function (item) {
            _this.selectedColor = item.target.value;
            _this.updateColor();
        };
        this.delegate = delegate;
        this.selectedColor = '#000000';
        this.colors = [
            '#000000', '#7C7E7C', '#7C0204', '#7C7E04', '#047E04', '#047E7C', '#04027C',
            '#7C027C', '#7C7E3C', '#043E3C', '#047EFC', '#043E7C', '#3C02FC', '#7C3E04',
            '#FFFFFF', '#BCBEBC', '#FC0204', '#FCFE04', '#04FE04', '#181818', '#0402FC',
            '#FC02FC', '#FCFE7C', '#04FE7C', '#7CFEFC', '#7C7EFC', '#FC027C', '#FC7E3C'
        ];
        this.colorbar = document.getElementById('colorbar');
        this.colorbox = document.createElement('div');
        this.colorbox.className = 'color-preview';
        this.appendColorbox();
        this.appendColorpicker();
        this.updateColor();
    }
    Colorbox.prototype.appendColorbox = function () {
        this.colorbox = document.createElement('div');
        this.colorbox.className = 'color-preview';
        this.colorbox1 = document.createElement('div');
        this.colorbox2 = document.createElement('div');
        this.colorbox1.className = 'color-preview-1 color';
        this.colorbox1.setAttribute('style', 'background-color: ' + this.selectedColor);
        this.colorbox2.className = 'color-preview-2 color';
        this.colorbox.appendChild(this.colorbox1);
        this.colorbox.appendChild(this.colorbox2);
        this.colorbar.appendChild(this.colorbox);
    };
    Colorbox.prototype.appendColorpicker = function () {
        this.colorpicker = document.createElement('ul');
        this.colorpicker.className = 'color-picker';
        for (var i = 0; i < this.colors.length; i++) {
            var itemLi = document.createElement('li');
            var itemInput = document.createElement('input');
            itemLi.className = 'color';
            itemLi.setAttribute('style', 'background-color: ' + this.colors[i]);
            itemInput.setAttribute('type', 'radio');
            itemInput.setAttribute('name', 'color');
            itemInput.setAttribute('value', this.colors[i]);
            itemInput.addEventListener('change', this.changeColor);
            this.selectedColor === this.colors[i] ? itemInput.setAttribute('checked', 'checked') : '';
            itemLi.appendChild(itemInput);
            this.colorpicker.appendChild(itemLi);
        }
        this.colorbar.appendChild(this.colorpicker);
    };
    Colorbox.prototype.updateColor = function () {
        this.delegate.colorChanged(this.selectedColor);
        this.colorbox1.setAttribute('style', 'background-color: ' + this.selectedColor);
    };
    return Colorbox;
}());
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
//Create Paint Programm
// new ConstructProgram(1000, 600);
new ConstructProgram(window.innerWidth - 150, window.innerHeight - 184);
//# sourceMappingURL=scripts.js.map