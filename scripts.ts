//initializing size and the context of the canvas
let canvas:HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('canvas');
let c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//wacthing the change in a tool used
let usedTool:number = 1;
function changeTool(radio){
    usedTool = radio.value;
    console.log(objects);
}

// Mouse event listener and object
let mouse = {
    x: undefined,
    y: undefined
};

window.addEventListener('mousemove', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
});

//objects array
let startOfObject:boolean = true;
let objects = [];
let lastObjectItem:number = 0;

// Classes -------------------------------------------------------------------------
/**
 * DrawObject
 */
class DrawObject
{
    xStart:number;
    yStart:number;
    color:string; //TODO: toevoegen als super

    constructor(xStart:number, yStart:number) {
        this.xStart = xStart;
        this.yStart = yStart;
    }
}

/**
 * ShapedObject
 */
class ShapedObject extends DrawObject
{
    outlineColor: string; //TODO:toevoegen als super van subclass
    outlineWidth: number;

    constructor(x:number, y:number, outlineColor:string, outlineWidth: number){
        super(x,y);
        this.outlineColor = outlineColor;
        this.outlineWidth = outlineWidth;
    }
}

/**
 * Line
 */
class Line extends DrawObject
{
    color:string;
    lineWidth:number;
    anchorPoints = [];

    constructor(x:number, y:number, color:string) {
        super(x,y);
        this.color = color;
        this.lineWidth = 5;
    }

    createAnchor(x:number, y:number){
        c.lineWidth = this.lineWidth;
        this.anchorPoints.push([x,y]);

        this.drawObject(); //misschien overbodig
    }

    drawObject(){
        c.beginPath();
        c.moveTo(this.xStart, this.yStart);
        c.strokeStyle = this.color;

        for(let i = 0; i < this.anchorPoints.length; i++){
            c.lineTo(this.anchorPoints[i][0], this.anchorPoints[i][1]);
        }
        c.stroke();

    }
}

/**
 * Rect
 */
class Rect extends DrawObject
{
    color:string;
    width:number;
    height:number;

    constructor(x:number, y:number, color:string){
        super(x, y);
        this.color = color;
    }

    createRect(x:number, y:number){
        c.fillStyle = this.color;

        this.width = x - this.xStart;
        this.height = y - this.yStart;

        this.drawObject(); //mischien niet nodig omdat de animate() dit al doet
    }

    drawObject(){
        c.fillStyle = this.color;
        c.fillRect(this.xStart, this.yStart, this.width, this.height);
    }
}

/**
 * Arc
 */
class Arc extends DrawObject
{
    fillColor:string;
    outlinecolor:string;
    startAngle:number;
    endAngle:number;
    counterClockWise:boolean;
    lineWidth:number;
    radius:number;
    hasOutline:boolean;
    hasFill:boolean;

    constructor(x:number, y:number){
        super(x, y);
        this.fillColor = "blue";
        this.outlinecolor = "black";
        this.startAngle = 0;
        this.endAngle = Math.PI * 2;
        this.counterClockWise = false;
        this.lineWidth = 5;
    }

    createArc(x:number, y:number, outline:boolean, fill:boolean){
        this.hasOutline = outline;
        this.hasFill = fill;
        this.radius = Math.sqrt(Math.pow((x - this.xStart), 2) + Math.pow((y - this.yStart), 2));

        this.drawObject(); //mischien niet nodig omdat de animate() dit al doet
    }

    drawObject(){
        c.beginPath();
        c.lineWidth = this.lineWidth;
        c.arc(this.xStart, this.yStart, this.radius, this.startAngle, this.endAngle, this.counterClockWise);

        if(this.hasOutline){
            c.strokeStyle = this.outlinecolor;
            c.stroke();
        }
        if(this.hasFill){
            c.fillStyle = this.fillColor;
            c.fill();
        }
    }
}

// animate canvas for animation while making a square, not yet in use
function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0,0, innerWidth, innerHeight);

    for (let i = 0; i < objects.length; i++ ){
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
            } else {
                lastObjectItem = objects.length - 1;
                objects[lastObjectItem].createAnchor(mouse.x, mouse.y);
            }
        } else {
            startOfObject = true;
        }
    }
});

/**
 * Draw circle
 * - With 2 mouse clicks
 */
window.addEventListener('mousedown', function(event){
    if(usedTool == 2 && event.toElement === canvas){
        if(startOfObject){
            objects.push(new Arc(mouse.x, mouse.y));
            startOfObject = false;
        } else {
            lastObjectItem = objects.length - 1;
            objects[lastObjectItem].createArc(mouse.x, mouse.y, false, true);
            startOfObject = true;
        }
    }
});
window.addEventListener('mousemove', function (event) {
    if (usedTool == 2 && event.toElement === canvas) {
        if(!startOfObject){
            lastObjectItem = objects.length - 1;
            objects[lastObjectItem].createArc(mouse.x, mouse.y, false, true);
        }
    }
});

/**
 * Draw rectangle
 * - With 2 mouse clicks
 */
window.addEventListener('mousedown', function(event){
   if(usedTool == 3 && event.toElement === canvas){
       if(startOfObject){
           objects.push(new Rect(mouse.x, mouse.y,  'green'));
           startOfObject = false;
       } else {
           lastObjectItem = objects.length - 1;
           objects[lastObjectItem].createRect(mouse.x, mouse.y);
           startOfObject = true;
       }
   }
});
window.addEventListener('mousemove', function (event) {
    if (usedTool == 3 && event.toElement === canvas) {
        if(!startOfObject){
            lastObjectItem = objects.length - 1;
            objects[lastObjectItem].createRect(mouse.x, mouse.y);
        }
    }
});

function removeLast(){
    objects.pop();
}