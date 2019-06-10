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

    constructor(x: number, y: number, width: number, height: number){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    createRect(){
        c.fillRect(this.x, this.y, this.width, this.height);
    }
}

let rectangle = new rect(50, 80, 200, 400);
    rectangle.createRect();