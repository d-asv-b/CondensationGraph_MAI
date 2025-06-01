"use client";

import React, { use } from 'react';

interface AdjacencyMatrixContextType {
    adjacencyMatrix: number[][];
    updateAdjacencyMatrix: (matrix: number[][]) => void;
}

export const AdjacencyMatrixContext = React.createContext<AdjacencyMatrixContextType>({} as AdjacencyMatrixContextType);

export const AdjacencyMatrixProvider = ({ children }: { children: React.ReactNode }) => {
    const [adjacencyMatrix, setAdjacencyMatrix] = React.useState<number[][]>([]);

    const updateAdjacencyMatrix = (matrix: number[][]) => {
        setAdjacencyMatrix(matrix);
    };

    return (
        <AdjacencyMatrixContext.Provider value={{ adjacencyMatrix, updateAdjacencyMatrix }}>
            {children}
        </AdjacencyMatrixContext.Provider>
    );
}

export const useAdjacencyMatrix = () => use(AdjacencyMatrixContext);
