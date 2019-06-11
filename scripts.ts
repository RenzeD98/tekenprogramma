//initializing size and the context of the canvas
let canvas:HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('canvas');
let c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//wacthing the change in a tool used
let usedTool:number = 1;
function changeTool(radio){
    if(radio) {
        usedTool = radio.value;
        console.log('current tool is: ' + usedTool);
    }
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
    color:string = 'green';
    lineWidth:number = 5;

    constructor(x:number, y:number, color:string){
        super(x, y);
        this.color = color;
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

class Line
{
    xStart:number;
    yStart:number;
    color:string;

    constructor(x:number, y:number, color:string) {
        this.xStart = x;
        this.yStart = y;
        this.color = color;

        c.beginPath();
        c.moveTo(this.xStart, this.yStart);
        c.strokeStyle = color;
    }


    createAnchor(x:number, y:number){
        c.lineTo(x, y);
        c.stroke();
    }
}

class Arc
{
    x:number;
    y:number;
    radius:number;
    startAngle:number;
    endAngle:number;
    counterClockWise:boolean;
    fillColor:string;
    outlinecolor:string;
    lineWidth:number = 5;

    constructor(x:number, y:number, radius:number, startAngle:number, endAngle:number, counterClockWise:boolean, fillColor:string, outlineColor:string){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this.counterClockWise = counterClockWise;
        this.fillColor = fillColor;
        this.outlinecolor = outlineColor;
    }

    createArc(outline:boolean, fill:boolean){
        c.beginPath();
        c.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle, this.counterClockWise);
        c.lineWidth = this.lineWidth;

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

// function animate(){
//     requestAnimationFrame(animate)
// }

// animate();


// /**
//  * Create arc
//  */
// let newArc = new Arc(400, 400, 40, 0, Math.PI * 2, false, 'yellow', 'green');
//     newArc.createArc(true, true);

/**
 * Free draw
 */
window.addEventListener('mousemove', function (event) {
    if (usedTool == 1) {
        if (event.buttons === 1) {
            if (startOfObject) {
                objects.push(new Line(mouse.x, mouse.y, 'black'));
                startOfObject = false;
            } else {
                objects[objects.length-1].createAnchor(mouse.x, mouse.y);
            }
        } else {
            startOfObject = true;
        }
    }
});

window.addEventListener('mouseup', function(event){
   if(usedTool == 3){
       if(startOfObject){
           objects.push(new Rect(mouse.x, mouse.y,  'green'));
           startOfObject = false;
       } else {
           console.log(objects);
           objects[objects.length-1].createRect(mouse.x, mouse.y);
           startOfObject = true;
       }
   }
});



