/** -----------------------------------------------------------------------
 * DrawObject
 */
export class DrawObject
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
export class Line extends DrawObject
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
export class Rect extends DrawObject
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
export class Arc extends DrawObject
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