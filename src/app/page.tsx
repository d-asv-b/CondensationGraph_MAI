import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

export default function HomePage() {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">Graph Condensation</h1>
            <p className="text-sm text-gray-500">Выполнил студент 8 института МАИ - <span className="font-semibold">Синькин Андрей</span>, группа - <span className="font-semibold">М8О-115БВ-24</span></p>
            <p className="text-sm mb-8 text-gray-500"><a className="text-blue-500 hover:text-blue-600 active:text-blue-800" href="https://github.com/d-asv-b/CondensationGraph_MAI">Репозиторий проекта</a></p>
            <p className="text-lg">Граф конденсации для графа заданного матрицей смежности</p>

            <hr
                className="w-full my-8 border-0 h-0.5"
                style={{
                    background: "linear-gradient(to right, transparent, #d1d5db 40%, #d1d5db 60%, #d1d5db 40%, transparent)",
                }}
            />

            <div className="flex flex-col w-full px-30">
                <div className="flex-col grow justify-start">
                    <h2 className="text-xl font-semibold">Определения</h2>
                    <div className="flex flex-col gap-2 pl-2 text-md text-gray-600">
                        <p>
                            <span className="font-semibold">Компонентой сильной связности</span> называется такое подмножество вершин <InlineMath math="C"/>,
                            что любые две вершины этого подмножества достижимы друг из друга, т.е. для <InlineMath math="\forall u, v \in C"/> существует
                            путь из <InlineMath math="u"/> в <InlineMath math="v"/> и из <InlineMath math="v"/> в <InlineMath math="u"/>.
                        </p>

                        <p>
                            <span className="font-semibold">Орграфом конденсации</span> для ориентированного графа <InlineMath math="D=(V,X)"/> называется ориентированный граф
                            <InlineMath math="D_0=(V_0,X_0)"/>, в котором каждая вершина представляет собой компоненту сильной связности графа <InlineMath math="D"/>, 
                            а множество его дуг <InlineMath math="X_0"/> определяется условием: <InlineMath math="x_0=(v_0,w_0) \in X_0"/> тогда и только тогда, когда в компонентах
                            сильной связности <InlineMath math="v_0"/> и <InlineMath math="w_0"/> существуют вершины <InlineMath math="v \in v_0"/> и <InlineMath math="w \in w_0"/>,
                            для которых <InlineMath math="x=(v,w) \in X"/>.
                        </p>

                        <p>
                            Более формально, если <InlineMath math="G"/> - ориентированный граф, то его <span className="font-semibold">граф конденсации</span> <InlineMath math="C(G)"/> - это
                            ориентированный граф полученный из <InlineMath math="G"/> путём сжатия всех вершин, принадлежащих одной компоненте сильной связности, в одну вершину. 
                            Ребро между двумя вершинами <InlineMath math="u"/> и <InlineMath math="v"/> в графе конденсации существует тогда и только тогда, когда в графе <InlineMath math="G"/> существует
                            хотя бы одно ребро из вершины <InlineMath math="u"/> в вершину <InlineMath math="v"/>.
                        </p>
                    </div>
                </div>
                <div className="flex-col grow justify-start mt-4">
                    <h2 className="text-xl font-semibold">Алгоритм нахождения графа конденсации</h2>
                    <div className="flex flex-col gap-2 pl-2 text-md text-gray-600">
                        <p>
                            Для нахождения графа конденсации ориентированного графа <InlineMath math="G"/> в данной работе будем использовать <span className="font-semibold">алгоритм Косарайю</span>.
                            Алгоритм имеет алгоритмическую сложность <InlineMath math="O(V + E)"/>, где <InlineMath math="V"/> - количество вершин, а <InlineMath math="E"/> - количество рёбер в исходном графе <InlineMath math="G"/>.
                        </p>
                        <p>
                            Алгоритм состоит из следующих шагов:
                        </p>
                        <ol className="list-decimal pl-6">
                            <li>
                                Выполнить обход в глубину (далее, <a className="text-blue-500 hover:text-blue-600 active:text-blue-800" href="http://e-maxx.ru/algo/dfs">DFS</a>) по графу <InlineMath math="G"/> и сохранить порядок завершения вершин;
                            </li>
                            <li>
                                Транспонировать граф <InlineMath math="G"/> (развернуть все рёбра);
                            </li>
                            <li>
                                Выполнить DFS по транспонированному графу, начиная с вершин в порядке, полученном на первом шаге. Каждая итерация DFS будет находить одну компоненту сильной связности;
                            </li>
                            <li>
                                Построить граф конденсации, где каждая компонента сильной связности становится вершиной, а рёбра определяются по исходному графу.
                            </li>
                        </ol>
                    </div>
                    <div className="flex-col grow justify-start mt-4">
                        <h2 className="text-xl font-semibold">Где это используется?</h2>
                        <p className="text-md text-gray-600 pl-2">
                            Графы конденсации полезны для:
                        </p>
                        <ul className="list-disc pl-8 text-md text-gray-600">
                            <li>Анализа структуры больших графов.</li>
                            <li>Выявления циклов и зависимостей в системах.</li>
                            <li>Упрощения графа перед применением других алгоритмов, которые эффективны на ациклических графах.</li>
                            <li>И другие...</li>
                        </ul>
                    </div>

                    <hr
                        className="w-full my-8 border-0 h-0.5"
                        style={{
                            background: "linear-gradient(to right, transparent, #d1d5db 40%, #d1d5db 60%, #d1d5db 40%, transparent)",
                        }}
                    />

                    <div className="flex-col grow justify-start items-center text-center">
                        <a href="/editor" className="bg-blue-500 hover:bg-blue-600 active:hover:bg-blue-800 text-white font-bold py-4 px-8 rounded">
                            Перейти к редактору
                        </a>
                    </div>
                </div>
            </div>

        </div>
    );
}