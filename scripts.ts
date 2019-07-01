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

/** -----------------------------------------------------------------------
 * DrawCanvas
 */
class DrawCanvas
{
    canvas:HTMLCanvasElement;
    c:any;
    width:number;
    height:number;
    startOfObject:boolean = true;
    toolbox:any;
    currentTool:number;
    objects = [];
    mouse:IMousePosition;

    constructor(width:number, height:number){
        this.width = width;
        this.height = height;
        this.mouse = {
            x:undefined,
            y:undefined
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

    drawToolbox(){
        this.toolbox = new Toolbox;
    }

    drawCanvas(){
        //initializing size and the context of the canvas
        this.canvas = <HTMLCanvasElement> document.createElement('canvas');
        this.c = this.canvas.getContext('2d');
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        let canvasContainer = document.getElementById("canvasContainer");
        canvasContainer.appendChild(this.canvas);

        let toolBar = document.getElementById("toolBar");
        toolBar.style.height = this.height+ 22 +"px";
    }

    animate(){
        requestAnimationFrame(() => {this.animate();});
        this.c.clearRect(0,0, innerWidth, innerHeight);

        for (let i = 0; i < this.objects.length; i++ ){
            this.objects[i].drawObject();
        }
    }

    mouseMovementEventListener(){
        window.addEventListener('mousemove', event => {

            console.log('Tool in Canvas object '+this.toolbox.getSelectedTool);

            this.mouse.x = event.offsetX;
            this.mouse.y = event.offsetY;
        });
    }

    pencilEventListener(){
        window.addEventListener('mousemove', event => {
            if (this.toolbox.selectedTool === 0 && event.target === this.canvas) {
                if (event.buttons === 1) {
                    if (this.startOfObject) {
                        this.objects.push(new Line(this.c, this.mouse.x, this.mouse.y, 'black', 5));
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
            if (this.toolbox.selectedTool === 1 && event.target === this.canvas) {
                if(!this.startOfObject){
                    let lastObjectItem = this.objects.length - 1;
                    this.objects[lastObjectItem].createObject(this.mouse.x, this.mouse.y);
                }
            }
        });

        window.addEventListener('mousedown', event => {
            if(this.toolbox.selectedTool == 1 && event.target === this.canvas){
                if(this.startOfObject){
                    this.objects.push(new Arc(this.c, this.mouse.x, this.mouse.y, false, 'green', 3, true, 'grey'));
                    this.startOfObject = false;
                } else {
                    let lastObjectItem = this.objects.length - 1;
                    this.objects[lastObjectItem].createObject(this.mouse.x, this.mouse.y);
                    this.startOfObject = true;
                }
            }
        });
    }

    squireEventListener(){
        window.addEventListener('mousemove', event => {
            if (this.toolbox.selectedTool == 2 && event.target === this.canvas) {
                if(!this.startOfObject){
                    let lastObjectItem = this.objects.length - 1;
                    this.objects[lastObjectItem].createObject(this.mouse.x, this.mouse.y);
                }
            }
        });

        window.addEventListener('mousedown', event => {
            if(this.toolbox.selectedTool == 2 && event.target === this.canvas){
                if(this.startOfObject){
                    console.log(event);
                    this.objects.push(new Rect(this.c, this.mouse.x, this.mouse.y, false,  'green', 5, true, 'black'));
                    this.startOfObject = false;
                } else {
                    let lastObjectItem = this.objects.length - 1;
                    this.objects[lastObjectItem].createObject(this.mouse.x, this.mouse.y);
                    this.startOfObject = true;
                }
            }
        });
    }

    updateCurrentTool(currentTool:number){
        console.log('The current tool used is:  '+currentTool);
    }

    buttonsEventListeners(){
        this.toolbox.downloadButton.addEventListener('click', () => {
            var dataURL = this.canvas.toDataURL("image/png");
            this.toolbox.downloadButton.href = dataURL;
        });
    }
}

/** -----------------------------------------------------------------------
 *  Toolbox
 */
class Toolbox
{
    toolbox:HTMLElement;
    selectedTool:number;
    tools:string[];
    downloadButton:HTMLElement;

    constructor(){
        this.tools = ['pencil', 'circle', 'squire'];
        this.selectedTool = 0;
        this.toolbox = document.createElement('ul');

        /**
         * SETTING UP THE TOOLS
         */
        for(let i = 0; i < this.tools.length; i++){
            let itemLi = document.createElement('li');

            let itemInput = document.createElement('input');
            itemInput.setAttribute('type', 'radio');
            itemInput.setAttribute('name', 'tool');
            itemInput.setAttribute('value', i.toString());
            itemInput.setAttribute('id', this.tools[i]);
            this.selectedTool === i ? itemInput.setAttribute('checked', 'checked') : '';
            itemInput.addEventListener('change', this.changeTool);

            let itemLabel = document.createElement('label');
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

    changeTool(item){
        this.selectedTool = item.target.value;
        console.log('Tool in Toolbox object ' + this.selectedTool);
    }

    get getSelectedTool() {
        return this.selectedTool;
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
        this.c.lineWidth = this.lineWidth;
        this.anchorPoints.push([x,y]);

        this.drawObject(); //misschien overbodig
    }

    drawObject(){
        this.c.beginPath();
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

        this.drawObject();
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

        this.drawObject();
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


//create Canvas
// new DrawCanvas(window.innerWidth, window.innerHeight);
new DrawCanvas(1000, 550);