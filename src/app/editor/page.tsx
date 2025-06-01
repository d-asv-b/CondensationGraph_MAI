"use client";

import { useEffect, useRef, useState } from "react";
import { findScc, generateRandomColors, generateRndAdjacencyMatrix } from "./functionality";
import GraphCanvas, { MouseState } from "./components/GraphCanvas";
import { RiAddCircleLine } from "react-icons/ri";
import { PiGraphLight } from "react-icons/pi";
import { IoTrash } from "react-icons/io5";
import { useAdjacencyMatrix } from "../contexts/AdjacencyMatrixContext";

export default function MainPage() {
    const [mouseState, setMouseState] = useState<number>(MouseState.Idle);
    const { updateAdjacencyMatrix } = useAdjacencyMatrix();
    const [colors, setColors] = useState<string[]>([]);
    const [stronglyConnectedComponents, setStronglyConnectedComponents] = useState<number[]>([]);

    const matrixRef = useRef<number[][]>([]);

    useEffect(() => {
        const initial = generateRndAdjacencyMatrix(5, 0.3);
        matrixRef.current = initial;
        updateAdjacencyMatrix(initial);

        const scc = findScc(initial);
        setStronglyConnectedComponents(scc);
        setColors(generateRandomColors((new Set(scc)).size));
    }, []);

    function updateSrcAdjacencyMatrix(newMatrix: number[][]) {
        // избегаем лишнего обновления
        if (!areMatricesEqual(matrixRef.current, newMatrix)) {
            matrixRef.current = newMatrix;
            updateAdjacencyMatrix(newMatrix);
            const newScc = findScc(newMatrix);
            setStronglyConnectedComponents(newScc);
            setColors([...generateRandomColors((new Set(newScc)).size - colors.length), ...colors]);
        }
    }

    function areMatricesEqual(a: number[][], b: number[][]) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i].length !== b[i].length) return false;
            for (let j = 0; j < a[i].length; j++) {
                if (a[i][j] !== b[i][j]) return false;
            }
        }
        return true;
    }

    function mouseStateToString(state: number): string {
        switch (state) {
            case MouseState.Idle:
                return "Обычный";
            case MouseState.CreatingVertex:
                return "Создание вершины";
            case MouseState.CreatingEdge:
                return "Создание ребра";
            case MouseState.Deleting:
                return "Удаление";
            default:
                return "Неизвестный режим";
        }
    }

    return (
        <div className="flex flex-col h-full w-full items-center bg-gray-100 overflow-auto">
            <h1 className="text-4xl font-bold py-4">Graph Editor</h1>
            <div className="flex flex-col h-full w-full grow items-center">
                <div className="flex flex-col xl:flex-row gap-4 relative w-full h-full items-center p-2">
                    <div className="flex flex-col h-fit w-fit xl:w-1/6 p-4 bg-white shadow-lg rounded-lg items-center">
                        <h2 className="text-xl font-bold mb-2 text-center">Управление графом</h2>
                        <p className="text-gray-600 font-semibold mb-2">
                            {mouseStateToString(mouseState)}
                        </p>
                        <div className="flex flex-col sm:flex-row xl:flex-col gap-2 w-full">
                            <button
                                className="flex flex-row px-4 py-2 w-full text-white rounded-lg items-center bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
                                onClick={() => setMouseState(MouseState.CreatingVertex)}
                            >
                                <RiAddCircleLine size={20} />
                                <div className="grow">Создать вершину</div>
                            </button>
                            <button
                                className="flex flex-row px-4 py-2 bg-green-500 w-full items-center text-white rounded-lg hover:bg-green-600 active:bg-green-700"
                                onClick={() => setMouseState(MouseState.CreatingEdge)}
                            >
                                <PiGraphLight size={20} />
                                <div className="grow">Создать ребро</div>
                            </button>
                            <button
                                className="flex flex-row px-4 py-2 bg-red-500 w-full items-center text-white rounded-lg hover:bg-red-600 active:bg-red-700"
                                onClick={() => setMouseState(MouseState.Deleting)}
                            >
                                <IoTrash size={20} />
                                <div className="grow">Удалить</div>
                            </button>
                            <button
                                className="flex flex-row px-4 py-2 border-2 rounded-lg w-full items-center bg-gray-100 text-black border-red-500 hover:bg-gray-200 active:bg-gray-300"
                                onClick={() => setMouseState(MouseState.Idle)}
                            >
                                <div className="grow">Сбросить режим</div>
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col grow shadow-lg rounded-lg p-4 h-full bg-white">
                        <GraphCanvas
                            mouseState={mouseState}
                            colors={colors}
                            stronglyConnectedComponents={stronglyConnectedComponents}
                            updateAdjacencyMatrix={updateSrcAdjacencyMatrix}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
