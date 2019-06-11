//initializing size and the context of the canvas
let canvas:HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('canvas');
let c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//wacthing the change in a tool used
let usedTool:number = 1;
function changeTool(radio){
    usedTool = radio.value;
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
class DrawObject
{
    xStart:number;
    yStart:number;

    constructor(xStart:number, yStart:number) {
        this.xStart = xStart;
        this.yStart = yStart;
    }
}

class Rect extends DrawObject
{
    color:string;
    lineWidth:number;

    constructor(x:number, y:number, color:string){
        super(x, y);
        this.color = color;
        this.lineWidth = 5;
    }

    createRect(x:number, y:number){
        c.fillStyle = this.color;
        c.lineWidth = this.lineWidth;

        //xStart = 20 | x = 1
        //yStart = 1 | y = 20

        let width = x - this.xStart;
        let height = y - this.yStart;

        c.fillRect(this.xStart, this.yStart, width, height);
    }
}

class Line extends DrawObject
{
    color:string;
    lineWidth:number;

    constructor(x:number, y:number, color:string) {
        super(x,y);
        this.color = color;
        this.lineWidth = 5;

        c.beginPath();
        c.moveTo(this.xStart, this.yStart);
        c.strokeStyle = color;
    }


    createAnchor(x:number, y:number){
        c.lineWidth = this.lineWidth;
        c.lineTo(x, y);
        c.stroke();
    }
}

class Arc extends DrawObject
{
    fillColor:string;
    outlinecolor:string;
    startAngle:number;
    endAngle:number;
    counterClockWise:boolean;
    lineWidth:number;

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
        
        let radius = Math.sqrt(Math.pow((x - this.xStart), 2) + Math.pow((y - this.yStart), 2));

        c.beginPath();
        c.lineWidth = this.lineWidth;
        c.arc(this.xStart, this.yStart, radius, this.startAngle, this.endAngle, this.counterClockWise);

        if(outline){
            c.strokeStyle = this.outlinecolor;
            c.stroke();
        }
        if(fill){
            c.fillStyle = this.fillColor;
            c.fill();
        }
    }
}

// animate canvas for animation while making a square, not yet in use
function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0,0, innerWidth, innerHeight);
}
// animate();

// Event Listeners ----------------------------------------------------------------------------

/**
 * Free draw
 * - While holding mouse down
 */
window.addEventListener('mousemove', function (event) {
    if (usedTool == 1) {
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
    if(usedTool == 2){
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

/**
 * Draw rectangle
 * - With 2 mouse clicks
 */
window.addEventListener('mousedown', function(event){
   if(usedTool == 3){
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