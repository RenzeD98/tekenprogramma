let canvas : HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let c = canvas.getContext('2d');


class rect
{
    x:number;
    y:number;
    width:number;
    height:number;
    color:string;

    // constructor(x:number, y:number, width:number, height:number){
    //     this.x = x;
    //     this.y = y;
    //     this.width = width;
    //     this.height = height;
    // }
    //
    // createRect(){
    //     c.fillRect(this.x, this.y, this.width, this.height);
    // }

    createRect(x:number, y:number, width:number, height:number, color:string){
        c.fillStyle = color;
        c.fillRect(x, y, width, height);
    }
}

class line
{
    xStart: number;
    yStart: number;
    color: string;

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
    createStrokeArc(){

    }

    createFilledArc(x:number, y:number, radius:number, startAngle:number, endAngle:number, counterClockWise: boolean){
        c.beginPath();

        c.arc(x,y,radius,startAngle,endAngle,counterClockWise);
    }
}

// Create rectangle with variables in constructor
// let rectangle = new rect(50, 80, 200, 400);
//     rectangle.createRect();


// Create rectangle with variables in function
let rectangle = new rect();
    rectangle.createRect(50, 80, 200, 400, 'green');

// Create Line with different anchorpoints
let newLine = new line(40, 50, 'blue');
    newLine.createAnchor(100, 150);
    newLine.createAnchor(130, 80);

