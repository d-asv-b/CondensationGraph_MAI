import Vertex from "./Vertex";

export default class Edge {
    vertex_1: Vertex;
    vertex_2: Vertex;

    color: string = "black";

    constructor(firstVertex: Vertex, secondVertex: Vertex, color?: string) {
        this.vertex_1 = firstVertex;
        this.vertex_2 = secondVertex;

        this.color = color || "black";
    }

    private getIntersectionPoint(center: Vertex, otherCenter: Vertex, radius: number): { x: number, y: number } {
        const dx = otherCenter.positionX - center.positionX;
        const dy = otherCenter.positionY - center.positionY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const ratio = radius / distance;
        return {
            x: center.positionX + dx * ratio,
            y: center.positionY + dy * ratio
        };
    }

    private drawArrow(ctx: CanvasRenderingContext2D, from: { x: number, y: number }, to: { x: number, y: number }) {
        const headLength = 10;
        const angle = Math.atan2(to.y - from.y, to.x - from.x);

        ctx.moveTo(to.x, to.y);
        ctx.lineTo(
            to.x - headLength * Math.cos(angle - Math.PI / 6),
            to.y - headLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(to.x, to.y);
        ctx.lineTo(
            to.x - headLength * Math.cos(angle + Math.PI / 6),
            to.y - headLength * Math.sin(angle + Math.PI / 6)
        );
    }

    draw(canvasContext: CanvasRenderingContext2D) {
        // находим точки пересечения ребра с окружностью вершин
        const start = this.getIntersectionPoint(this.vertex_1, this.vertex_2, this.vertex_1.vertexRadius);
        const end = this.getIntersectionPoint(this.vertex_2, this.vertex_1, this.vertex_2.vertexRadius);

        canvasContext.beginPath();
        canvasContext.moveTo(start.x, start.y);
        canvasContext.lineTo(end.x, end.y);
        
        // рисуем стрелочку
        this.drawArrow(canvasContext, start, end);

        canvasContext.lineWidth = 3;
        canvasContext.strokeStyle = this.color;

        canvasContext.stroke();
    }
}