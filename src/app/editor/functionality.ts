import Edge from "./components/Edge";
import Vertex from "./components/Vertex";

// получаем матрицу смежности из списка вершин и рёбер
export function getAdjacencyMatrix(vertexes: Vertex[], edges: Edge[]): number[][] {
    const size = vertexes.length;
    const matrix: number[][] = Array.from({ length: size }, () => Array(size).fill(0));

    for (const edge of edges) {
        const index1 = vertexes.indexOf(edge.vertex_1);
        const index2 = vertexes.indexOf(edge.vertex_2);
        if (index1 !== -1 && index2 !== -1) {
            matrix[index1][index2] = 1;
        }
    }

    return matrix;
}

// получаем список вершин из матрицы смежности, располагаем их по кругу
export function getVertexesFromAdjacencyMatrix(matrix: number[][]): Vertex[] {
    const vertexes: Vertex[] = [];
    const centerX = 400;
    const centerY = 300;
    const radius = 200;

    for (let i = 0; i < matrix.length; i++) {
        const angle = (2 * Math.PI * i) / matrix.length;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        vertexes.push(new Vertex(x, y, "black", "black"));
    }

    return vertexes;
}

// получаем список рёбер из матрицы смежности и списка вершин
export function getEdgesFromAdjacencyMatrix(vertexes: Vertex[], matrix: number[][]): Edge[] {
    const edges: Edge[] = [];

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] === 1) {
                edges.push(new Edge(vertexes[i], vertexes[j]));
            }
        }
    }

    return edges;
}

// генерируем случайную матрицу смежности заданного размера и вероятности появления рёбер
export function generateRndAdjacencyMatrix(size: number, edgeProbability: number): number[][] {
    const matrix: number[][] = Array.from({ length: size }, () => Array(size).fill(0));

    for (let i = 0; i < size; i++) {
        for (let j = i + 1; j < size; j++) {
            if (Math.random() < edgeProbability) {
                matrix[i][j] = 1;
            }
        }
    }

    return matrix;
}

// конвертируем матрицу смежности в список смежности
export function convertAdjacencyMatrixToAdjacencyList(adjacencyMatrix: number[][]): Map<number, number[]> {
    const adjacencyList = new Map<number, number[]>();

    for (let i = 0; i < adjacencyMatrix.length; i++) {
        const neighbors: number[] = [];

        for (let j = 0; j < adjacencyMatrix[i].length; j++) {
            if (adjacencyMatrix[i][j] === 1) {
                neighbors.push(j);
            }
        }
        adjacencyList.set(i, neighbors);
    }

    return adjacencyList;
}

// транспонируем матрицу смежности
export function transposeAdjacencyMatrix(matrix: number[][]): number[][] {
    const transposed: number[][] = Array.from({ length: matrix.length }, () => Array(matrix.length).fill(0));

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            transposed[j][i] = matrix[i][j];
        }
    }
    return transposed;
}

// находим комопненты сильной связности
export function findScc(adjacencyMatrix: number[][]): number[] {
    const adjacencyList = convertAdjacencyMatrixToAdjacencyList(adjacencyMatrix);
    const visited: number[] = Array(adjacencyMatrix.length).fill(0);

    const inversedMatrix = transposeAdjacencyMatrix(adjacencyMatrix);
    const inversedAdjacencyList = convertAdjacencyMatrixToAdjacencyList(inversedMatrix);

    const topologicalOrder: number[] = [];
    function dfs(graph: Map<number, number[]>, vertex: number, visited: number[]) {
        visited[vertex] = 1;

        for (const neighbor of graph.get(vertex) || []) {
            if (!visited[neighbor]) {
                dfs(graph, neighbor, visited);
            }
        }
        topologicalOrder.push(vertex);
    }

    for (let i = 0; i < adjacencyMatrix.length; i++) {
        if (!visited[i]) {
            dfs(adjacencyList, i, visited);
        }
    }
    
    visited.fill(0);
    function dfsScc(graph: Map<number, number[]>, vertex: number, visited: number[], component: number) {
        visited[vertex] = component;

        for (const neighbor of graph.get(vertex) || []) {
            if (!visited[neighbor]) {
                dfsScc(graph, neighbor, visited, component);
            }
        }
    }

    let sccCount = 0;
    for (let i = topologicalOrder.length - 1; i >= 0; i--) {
        const vertex = topologicalOrder[i];
        if (!visited[vertex]) {
            dfsScc(inversedAdjacencyList, vertex, visited, ++sccCount);
        }
    }
    return visited;
}

// генерируем случайные цвета
export function generateRandomColors(count: number): string[] {
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
        const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        colors.push(color);
    }
    return colors;
}

export function getCondensationAdjMatrix(srcAdjMatrix: number[][], scc: number[]): number[][] {
    const sccCount = Math.max(...scc);
    const condensationMatrix: number[][] = Array.from({ length: sccCount }, () => Array(sccCount).fill(0));

    for (let i = 0; i < srcAdjMatrix.length; ++i) {
        let component = scc[i];
        for (let j = 0; j < srcAdjMatrix[i].length; ++j) {
            if (srcAdjMatrix[i][j] === 1) {
                let neighborComponent = scc[j];
                if (component !== neighborComponent) {
                    condensationMatrix[component - 1][neighborComponent - 1] = 1;
                }
            }
        }
    }

    return condensationMatrix;
}