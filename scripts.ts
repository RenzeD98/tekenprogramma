enum tools {
    freeFormSelect,
    select,
    eraser,
    bucket,
    pipet,
    magnifier,
    pencil,
    brush,
    sprayCan,
    text,
    line,
    curve,
    rectangle,
    polygon,
    elipse,
    roundedRectangle
}

interface IMousePosition {
    x:number,
    y:number
}

interface IToolboxObserver {
    toolChanged(tool:number):void
    colorChanged(color:string):void
}


/** -----------------------------------------------------------------------
 * ConstructProgram
 * - Superclass?
 *
 */
class ConstructProgram implements IToolboxObserver
{
    canvas:Canvas;
    toolbox:Toolbox;
    colorbox:Colorbox;

    constructor(width: number, height:number){
        this.canvas = new Canvas(width, height);
        this.toolbox = new Toolbox(this, height);
        this.colorbox = new Colorbox(this);
    }

    toolChanged(tool: number){
        this.canvas.currentTool = tool;
    }

    colorChanged(color:string) {
        this.canvas.currentColor = color;
    }
}

/** -----------------------------------------------------------------------
 * Canvas
 */
class Canvas
{
    canvas:HTMLCanvasElement;
    c:any;

    width:number;
    height:number;

    currentTool:number;
    currentColor:string;

    objects = [];
    startOfObject:boolean = true;

    mouse:IMousePosition;

    constructor(width:number, height:number){
        this.width = width;
        this.height = height;
        this.mouse = {
            x:undefined,
            y:undefined
        };

        this.drawCanvas();
        this.animate();
        this.mouseMovementEventListener();
        this.pencilEventListener();
        this.brushEventListener();
        this.eraserEventListener();
        this.cirlceEventListener();
        this.squareEventListener();
        this.buttonsEventListeners();
    }

    drawCanvas(){
        //initializing size and the context of the canvas
        this.canvas = <HTMLCanvasElement> document.createElement('canvas');
        this.c = this.canvas.getContext('2d');
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        let canvasContainer = document.getElementById("canvasContainer");
        canvasContainer.appendChild(this.canvas);
    }

    animate(){
        requestAnimationFrame(() => {this.animate();});
        this.c.clearRect(0,0, this.width, this.height);

        for (let i = 0; i < this.objects.length; i++ ){
            this.objects[i].drawObject();
        }
    }

    mouseMovementEventListener(){
        window.addEventListener('mousemove', event => {
            this.mouse.x = event.offsetX;
            this.mouse.y = event.offsetY;
        });
    }

    pencilEventListener(){
        window.addEventListener('mousemove', event => {
            if (this.currentTool == tools.pencil && event.target === this.canvas) {
                if (event.buttons === 1) {
                    if (this.startOfObject) {
                        this.objects.push(new Line(this.c, this.mouse.x, this.mouse.y, this.currentColor, 3));
                        this.startOfObject = false;
                    } else {
                        let lastObjectItem = this.objects.length - 1;
                        this.objects[lastObjectItem].createAnchor(this.mouse.x, this.mouse.y);
                    }
                } else {
                    this.startOfObject = true;
                }
            }
        });
    }

    //TODO: Deze Functie is letterlijk een clone van pencilEventListener(), dit even netjes maken
    brushEventListener(){
        window.addEventListener('mousemove', event => {
            if (this.currentTool == tools.brush && event.target === this.canvas) {
                if (event.buttons === 1) {
                    if (this.startOfObject) {
                        this.objects.push(new Line(this.c, this.mouse.x, this.mouse.y, this.currentColor, 10));
                        this.startOfObject = false;
                    } else {
                        let lastObjectItem = this.objects.length - 1;
                        this.objects[lastObjectItem].createAnchor(this.mouse.x, this.mouse.y);
                    }
                } else {
                    this.startOfObject = true;
                }
            }
        });
    }

    //TODO: Deze Functie is letterlijk een clone van pencilEventListener(), dit even netjes maken
    eraserEventListener(){
        window.addEventListener('mousemove', event => {
            if (this.currentTool == tools.eraser && event.target === this.canvas) {
                if (event.buttons === 1) {
                    if (this.startOfObject) {
                        this.objects.push(new Line(this.c, this.mouse.x, this.mouse.y, '#FFFFFF', 5));
                        this.startOfObject = false;
                    } else {
                        let lastObjectItem = this.objects.length - 1;
                        this.objects[lastObjectItem].createAnchor(this.mouse.x, this.mouse.y);
                    }
                } else {
                    this.startOfObject = true;
                }
            }
        });
    }

    cirlceEventListener(){
        window.addEventListener('mousemove', event => {
            if (this.currentTool == tools.elipse && event.target === this.canvas) {
                if(!this.startOfObject){
                    let lastObjectItem = this.objects.length - 1;
                    this.objects[lastObjectItem].createObject(this.mouse.x, this.mouse.y);
                }
            }
        });

        window.addEventListener('mousedown', event => {
            if(this.currentTool == tools.elipse && event.target === this.canvas){
                if(this.startOfObject){
                    //TODO: Deze fillColor heeft nu de value die de lineColor eigenlijks moet hebben
                    this.objects.push(new Arc(
                        this.c, this.mouse.x, this.mouse.y, false,
                        'green', 3, true, this.currentColor)
                    );
                    this.startOfObject = false;
                } else {
                    let lastObjectItem = this.objects.length - 1;
                    this.objects[lastObjectItem].createObject(this.mouse.x, this.mouse.y);
                    this.startOfObject = true;
                }
            }
        });
    }

    squareEventListener(){
        window.addEventListener('mousemove', event => {
            if (this.currentTool == tools.rectangle && event.target === this.canvas) {
                if(!this.startOfObject){
                    let lastObjectItem = this.objects.length - 1;
                    this.objects[lastObjectItem].createObject(this.mouse.x, this.mouse.y);
                }
            }
        });

        window.addEventListener('mousedown', event => {
            if(this.currentTool == tools.rectangle && event.target === this.canvas){
                if(this.startOfObject){
                    //TODO: Deze fillColor heeft nu de value die de lineColor eigenlijks moet hebben
                    this.objects.push( new Rect(
                            this.c, this.mouse.x, this.mouse.y,
                            false,  'green', 5,
                            true, this.currentColor)
                    );
                    this.startOfObject = false;
                } else {
                    let lastObjectItem = this.objects.length - 1;
                    this.objects[lastObjectItem].createObject(this.mouse.x, this.mouse.y);
                    this.startOfObject = true;
                }
            }
        });
    }

    buttonsEventListeners(){
        let downloadButton = document.getElementById('downloadButton');
        downloadButton.setAttribute('download', 'mijn mooie creatie');
        downloadButton.addEventListener('click', () => {
            downloadButton.setAttribute('href', this.canvas.toDataURL("image/png"));
        });
    }
}

/** -----------------------------------------------------------------------
 *  Toolbox
 */
class Toolbox
{
    toolbox:HTMLElement;
    _selectedTool:number;
    totalTools:number;
    delegate:IToolboxObserver;
    height:number;

    constructor(delegate:IToolboxObserver, height:number){
        this.delegate = delegate;
        this.height = height;
        this.totalTools = 16;
        this._selectedTool = 6;
        this.updateTool();
        this.appendToolbox();
    }

    appendToolbox() {
        this.toolbox = document.createElement('ul');
        this.toolbox.className = 'tool-bar-ul';

        for(let i = 0; i < this.totalTools; i++){
            let itemLi = document.createElement('li');
            let itemInput = document.createElement('input');
            let itemIcon = document.createElement('div');

            itemLi.className = 'tool-bar-li';
            itemInput.setAttribute('type', 'radio');
            itemInput.setAttribute('name', 'tool');
            itemInput.setAttribute('value', i.toString());
            itemInput.addEventListener('change', this.changeTool);
            this._selectedTool === i ? itemInput.setAttribute('checked', 'checked') : '';
            itemIcon.className = 'tool-bar-icon';
            itemIcon.setAttribute('style', 'background-image: url("icons/'+ i +'.png")');

            itemLi.appendChild(itemInput);
            itemLi.appendChild(itemIcon);
            this.toolbox.appendChild(itemLi);
        }

        let toolbar = document.getElementById('toolBar');
        toolbar.style.height = this.height + 22 + "px";
        toolbar.appendChild(this.toolbox);

    }

    changeTool = item => {
        this._selectedTool = item.target.value;
        this.updateTool();
    };

    updateTool() {
        this.delegate.toolChanged(this._selectedTool);
    }
}

/** -----------------------------------------------------------------------
 *  Colorbox
 */
class Colorbox {
    colorbox:HTMLElement;
    colorbox1:HTMLElement;
    colorbox2:HTMLElement;
    colorpicker:HTMLElement;
    colorbar:HTMLElement;
    _selectedColor:string;
    colors:string[];
    delegate:IToolboxObserver;

    constructor(delegate:IToolboxObserver){
        this.delegate = delegate;
        this._selectedColor = '#000000';
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

    appendColorbox(){
        this.colorbox = document.createElement('div');
        this.colorbox.className = 'color-preview';

        this.colorbox1 = document.createElement('div');
        this.colorbox2 = document.createElement('div');

        this.colorbox1.className = 'color-preview-1 color';
        this.colorbox1.setAttribute('style', 'background-color: '+this._selectedColor);
        this.colorbox2.className = 'color-preview-2 color';

        this.colorbox.appendChild(this.colorbox1);
        this.colorbox.appendChild(this.colorbox2);

        this.colorbar.appendChild(this.colorbox);

    }

    appendColorpicker(){
        this.colorpicker = document.createElement('ul');
        this.colorpicker.className = 'color-picker';

        for(let i = 0; i < this.colors.length; i++){
            let itemLi = document.createElement('li');
            let itemInput = document.createElement('input');

            itemLi.className = 'color';
            itemLi.setAttribute('style', 'background-color: '+this.colors[i]);
            itemInput.setAttribute('type', 'radio');
            itemInput.setAttribute('name', 'color');
            itemInput.setAttribute('value', this.colors[i]);
            itemInput.addEventListener('change', this.changeColor);
            this._selectedColor === this.colors[i] ? itemInput.setAttribute('checked', 'checked') : '';

            itemLi.appendChild(itemInput);
            this.colorpicker.appendChild(itemLi);
        }

        this.colorbar.appendChild(this.colorpicker);
    }

    changeColor = item => {
        this._selectedColor = item.target.value;
        this.updateColor();
    };

    updateColor() {
        this.delegate.colorChanged(this._selectedColor);
        this.colorbox1.setAttribute('style', 'background-color: '+this._selectedColor);
    }
}

/** -----------------------------------------------------------------------
 * DrawObject
 */
class DrawObject
{
    c:any;
    xStart:number;
    yStart:number;
    lineColor:string;
    lineWidth:number;

    constructor(canvasContext:any ,xStart:number, yStart:number, lineColor:string, lineWidth:number) {
        this.c = canvasContext;
        this.xStart = xStart;
        this.yStart = yStart;
        this.lineColor = lineColor;
        this.lineWidth = lineWidth;
    }

    drawObject(){}
}


/** -----------------------------------------------------------------------
 * Line
 */
class Line extends DrawObject
{
    anchorPoints = [];

    constructor(c:any, x:number, y:number, lineColor:string, lineWidth:number) {
        super(c, x, y, lineColor, lineWidth);
    }

    createAnchor(x:number, y:number){
        this.anchorPoints.push([x,y]);
    }

    drawObject(){
        this.c.beginPath();
        this.c.lineWidth = this.lineWidth;
        this.c.moveTo(this.xStart, this.yStart);
        this.c.strokeStyle = this.lineColor;

        for(let i = 0; i < this.anchorPoints.length; i++){
            this.c.lineTo(this.anchorPoints[i][0], this.anchorPoints[i][1]);
        }
        this.c.stroke();

        super.drawObject();

    }
}

/** -----------------------------------------------------------------------
 * Rect
 */
class Rect extends DrawObject
{
    width:number;
    height:number;
    hasline:boolean;
    innerColor:string;

    constructor(c:any, x:number, y:number, hasLine:boolean, lineColor:string, lineWidth:number, hasFill:boolean, fillColor:string){
        super(c, x, y, lineColor, lineWidth);
        this.hasline = hasLine;
        this.innerColor = fillColor;
    }

    createObject(x:number, y:number){
        this.c.fillStyle = this.innerColor;

        this.width = x - this.xStart;
        this.height = y - this.yStart;
    }

    drawObject(){
        this.c.fillStyle = this.innerColor;
        this.c.fillRect(this.xStart, this.yStart, this.width, this.height);

        super.drawObject();

    }
}

/** -----------------------------------------------------------------------
 * Arc
 */
class Arc extends DrawObject
{
    hasOutline:boolean;
    hasFill:boolean;
    fillColor:string;

    startAngle:number;
    endAngle:number;
    counterClockWise:boolean;
    radius:number;

    constructor(c:any, x:number, y:number, line:boolean, lineColor:string, lineWidth:number, hasFill:boolean, fillColor:string){
        super(c, x, y, lineColor, lineWidth);
        this.fillColor = fillColor;
        this.hasOutline = line;
        this.hasFill = hasFill;
        this.startAngle = 0;
        this.endAngle = Math.PI * 2;
        this.counterClockWise = false;
    }

    createObject(x:number, y:number){
        this.radius = Math.sqrt(Math.pow((x - this.xStart), 2) + Math.pow((y - this.yStart), 2));
    }

    drawObject(){
        this.c.beginPath();
        this.c.lineWidth = this.lineWidth;
        this.c.arc(this.xStart, this.yStart, this.radius, this.startAngle, this.endAngle, this.counterClockWise);

        if(this.hasOutline){
            this.c.strokeStyle = this.lineColor;
            this.c.stroke();
        }
        if(this.hasFill){
            this.c.fillStyle = this.fillColor;
            this.c.fill();
        }

        super.drawObject();
    }
}

//Create Paint Programm
// new ConstructProgram(1000, 600);
new ConstructProgram(window.innerWidth - 150, window.innerHeight - 184);