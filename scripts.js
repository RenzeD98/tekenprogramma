"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var drawObjects_js_1 = require("./modules/drawObjects.js");
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
    Canvas.prototype.pencilEventListener = function () {
        var _this = this;
        window.addEventListener('mousemove', function (event) {
            if (_this.currentTool == tools.pencil && event.target === _this.canvas) {
                if (event.buttons === 1) {
                    if (_this.startOfObject) {
                        _this.objects.push(new drawObjects_js_1.Line(_this.c, _this.mouse.x, _this.mouse.y, _this.currentColor, 3));
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
                        _this.objects.push(new drawObjects_js_1.Line(_this.c, _this.mouse.x, _this.mouse.y, _this.currentColor, 10));
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
                        _this.objects.push(new drawObjects_js_1.Line(_this.c, _this.mouse.x, _this.mouse.y, '#FFFFFF', 5));
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
                    _this.objects.push(new drawObjects_js_1.Arc(_this.c, _this.mouse.x, _this.mouse.y, false, 'green', 3, true, _this.currentColor));
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
                    _this.objects.push(new drawObjects_js_1.Rect(_this.c, _this.mouse.x, _this.mouse.y, false, 'green', 5, true, _this.currentColor));
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
//Create Paint Programm
// new ConstructProgram(1000, 600);
new ConstructProgram(window.innerWidth - 150, window.innerHeight - 184);
//# sourceMappingURL=scripts.js.map