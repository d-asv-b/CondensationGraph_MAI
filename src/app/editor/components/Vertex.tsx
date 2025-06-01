export default class Vertex {
    positionX: number;
    positionY: number;

    strokeColor: string;
    textColor: string;

    vertexRadius: number = 20;


    constructor(posX: number, posY: number, stroke: string, labelColor: string = "black") {
        this.positionX = posX;
        this.positionY = posY;

        this.strokeColor = stroke;

        this.textColor = labelColor;
    }

    draw(canvasContext: CanvasRenderingContext2D, label: string = "", fillColor: string = "white") {
        canvasContext.beginPath();
        canvasContext.arc(this.positionX, this.positionY, this.vertexRadius, 0, 2 * Math.PI, false);
        canvasContext.fillStyle = fillColor;
        canvasContext.fill();
        canvasContext.strokeStyle = this.strokeColor;
        canvasContext.lineWidth = 1;
        canvasContext.stroke();

        canvasContext.font = "12pt Calibri";
        canvasContext.fillStyle = this.textColor;
        canvasContext.textAlign = "center";
        canvasContext.fillText(label, this.positionX, this.positionY + 3);
    }
}