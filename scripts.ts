//initializing size and the context of the canvas
let canvas:HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('canvas');
let c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//tool type listeren
let usedTool:number = 0;
function changeTool(radio){
    usedTool = radio.value;
}

// Mouse event listener
let mouse = {
    x: undefined,
    y: undefined
};

window.addEventListener('mousemove', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
});

class DrawObject
{
    x:number;
    y:number;

    constructor(x:number, y:number) {
        this.x = x;
        this.y = y;
    }
}

class Rect
{
    x:number;
    y:number;
    width:number;
    height:number;
    color:string;
    lineWidth:number = 5;

    constructor(x:number, y:number, width:number, height:number, color:string){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    createRect(){
        c.fillStyle = this.color;
        c.lineWidth = this.lineWidth;
        c.fillRect(this.x, this.y, this.width, this.height);
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


// /**
//  * Create rectangle with variables in constructor
//  */
// let rectangle = new Rect(500, 500, 200, 400, 'green');
//     rectangle.createRect();
//
// /**
//  * Create Line with different anchorpoints
//  */
// let newLine = new Line(40, 50, 'blue');
//     newLine.createAnchor(100, 150);
//     newLine.createAnchor(130, 80);
//
// /**
//  * Create arc
//  */
// let newArc = new Arc(400, 400, 40, 0, Math.PI * 2, false, 'yellow', 'green');
//     newArc.createArc(true, true);


/**
 * Free draw
 */
let beginLine:boolean = true;
let line:Line;
window.addEventListener('mousemove', function (event) {
    if (usedTool == 1) {
        if (event.buttons === 1) {
            if (beginLine) {
                line = new Line(mouse.x, mouse.y, 'black');
                beginLine = false;
            } else {
                line.createAnchor(mouse.x, mouse.y);
            }
        } else {
            beginLine = true;
        }
    }
});



