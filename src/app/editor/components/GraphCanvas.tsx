"use client";

import Vertex from "./Vertex";
import Edge from "./Edge";
import { useEffect, useRef, useState } from "react";
import { getVertexesFromAdjacencyMatrix, getEdgesFromAdjacencyMatrix, getAdjacencyMatrix } from "../functionality";
import { useAdjacencyMatrix } from "@/app/contexts/AdjacencyMatrixContext";

export const MouseState = {
    // действие не выбрано / перемещение вершины
    Idle: 0,

    // создание вершины
    CreatingVertex: 2,

    // создание ребра
    CreatingEdge: 3,

    // удаление ребра/вершины
    Deleting: 4,
};

interface GraphCanvasProps {
    width?: number;
    height?: number;
    updateAdjacencyMatrix?: (matrix: number[][]) => void;
    colors: string[];
    stronglyConnectedComponents: number[];
    mouseState?: number;
}

export default function GraphCanvas({ updateAdjacencyMatrix, colors, stronglyConnectedComponents = [], mouseState = MouseState.Idle }: GraphCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { adjacencyMatrix } = useAdjacencyMatrix();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const vertexesRef = useRef<Vertex[]>(getVertexesFromAdjacencyMatrix(adjacencyMatrix));
    const edgesRef = useRef<Edge[]>(getEdgesFromAdjacencyMatrix(vertexesRef.current, adjacencyMatrix));
    const initializedRef = useRef(false);

    const [creatingEdgeHelper, setCreatingEdgeHelper] = useState<number | null>(null);

    useEffect(() => {
        if (vertexesRef.current && creatingEdgeHelper !== null) {
                vertexesRef.current[creatingEdgeHelper].strokeColor = "black";
        }
        setCreatingEdgeHelper(null);
    }, [mouseState]);

    useEffect(() => {
        if (!initializedRef.current && adjacencyMatrix.length > 0) {
            vertexesRef.current = getVertexesFromAdjacencyMatrix(adjacencyMatrix);
            edgesRef.current = getEdgesFromAdjacencyMatrix(vertexesRef.current, adjacencyMatrix);
            initializedRef.current = true;
        }
    }, [adjacencyMatrix]);

    useEffect(() => {
        const intervalId = setInterval(redraw, 1000 / 120); // 120 кадров в секунду
        return () => clearInterval(intervalId);
    }, [colors, stronglyConnectedComponents]);

    useEffect(() => {
        function updateCanvasSize() {
            if (canvasRef.current) {
                canvasRef.current.style.width = "100%";
                canvasRef.current.style.height = "100%";
                canvasRef.current.width = canvasRef.current.offsetWidth;
                canvasRef.current.height = canvasRef.current.offsetHeight;
            }
        }

        updateCanvasSize();
        window.addEventListener("resize", updateCanvasSize);

        return () => window.removeEventListener("resize", updateCanvasSize);
    }, []);

    function triggerGraphUpdate() {
        const matrix = getAdjacencyMatrix(vertexesRef.current, edgesRef.current);
        updateAdjacencyMatrix?.(matrix);
    }

    function handleMouseDown(event: React.MouseEvent<HTMLCanvasElement>) {
        const getCanvRect = event.currentTarget.getBoundingClientRect();

        const posX = event.clientX - getCanvRect.x;
        const posY = event.clientY - getCanvRect.y;

        const vertexes = vertexesRef.current;
        const edges = edgesRef.current;

        // создаем новую вершину
        if (mouseState === MouseState.CreatingVertex) {
            const newVertex = new Vertex(posX, posY, "black", "black");
            vertexes.push(newVertex);
            triggerGraphUpdate();
            return;
        }

        // проверяем, попала ли мышка на какую-либо вершину
        for (const vertex of vertexes) {
            if (
                Math.hypot(vertex.positionX - posX, vertex.positionY - posY) <= vertex.vertexRadius
            ) {
                if (mouseState === MouseState.Deleting) {
                    vertexesRef.current = vertexes.filter(v => v !== vertex);
                    edgesRef.current = edges.filter(e => e.vertex_1 !== vertex && e.vertex_2 !== vertex);
                    triggerGraphUpdate();
                    return;
                } else if (mouseState === MouseState.Idle) {
                    setCreatingEdgeHelper(vertexes.indexOf(vertex));
                } else if (mouseState === MouseState.CreatingEdge) {
                    if (
                        creatingEdgeHelper !== null &&
                        creatingEdgeHelper !== vertexes.indexOf(vertex)
                    ) {
                        const newEdge = new Edge(vertexes[creatingEdgeHelper], vertex);
                        edges.push(newEdge);
                        vertexes[creatingEdgeHelper].strokeColor = "black";
                        setCreatingEdgeHelper(null);
                        triggerGraphUpdate();
                        return;
                    } else {
                        vertex.strokeColor = "red";
                        setCreatingEdgeHelper(vertexes.indexOf(vertex));
                    }
                }

                return;
            }
        }

        // проверяем, попала ли мышка на какое-либо ребро
       if (mouseState === MouseState.Deleting) {
            for (const edge of edges) {
                const dx = edge.vertex_2.positionX - edge.vertex_1.positionX;
                const dy = edge.vertex_2.positionY - edge.vertex_1.positionY;

                const px = posX - edge.vertex_1.positionX;
                const py = posY - edge.vertex_1.positionY;

                const cross = dx * py - dy * px;
                const squareLength = dx * dx + dy * dy;
                const dotProjection = (px * dx + py * dy) / squareLength;

                const distance = Math.abs(cross) / Math.sqrt(squareLength);

                if (distance < 5 && dotProjection >= 0 && dotProjection <= 1) {
                    edgesRef.current = edges.filter(e => e !== edge);
                    triggerGraphUpdate();
                    return;
                }
            }
        }
    }

    function handleMouseUp() {
        // если мышка отпущена, то отпускаем вершину
        if (mouseState === MouseState.Idle) {
            if (vertexesRef.current && creatingEdgeHelper !== null) {
                vertexesRef.current[creatingEdgeHelper].strokeColor = "black";
            }
            setCreatingEdgeHelper(null);
        }
    }

    function handleMouseLeave() {
        // если мышка ушла за границу холста, то отпускаем вершину
        if (mouseState === MouseState.Idle) {
            if (vertexesRef.current && creatingEdgeHelper !== null) {
                vertexesRef.current[creatingEdgeHelper].strokeColor = "black";
            }
            setCreatingEdgeHelper(null);
        }
    }

    function handleMouseMove(event: React.MouseEvent<HTMLCanvasElement>) {
        // мышка тащит вершину
        if (mouseState === MouseState.Idle && creatingEdgeHelper !== null) {
            const rect = event.currentTarget.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const vertex = vertexesRef.current[creatingEdgeHelper];
            if (vertex) {
                vertex.positionX = x;
                vertex.positionY = y;
            }
        }
    }

    function redraw() {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const canvasContext = canvas.getContext("2d");
        if (!canvasContext) {
            return;
        }

        // очищаем холст
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        canvasContext.fillStyle = "white";
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);

        for (const edge of edgesRef.current) {
            edge.draw(canvasContext);
        }

        for (let i = 0; i < vertexesRef.current.length; i++) {
            vertexesRef.current[i].draw(canvasContext, `V${i + 1}`, colors[stronglyConnectedComponents[i]] || "white");
        }
    }

    return (
        <div className="grow" ref={containerRef}>
            <canvas
                ref={canvasRef}
                className="w-full h-full"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
            />
        </div>
    );
}