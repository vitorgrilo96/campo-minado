import { useState } from "react";
import { checkWinCondition, generateEmptyBoard, openAdjacentCells, placeBombs } from "../utils/boardUtils";
import { Cell, CellData } from "./Cell";
import { Alert, StyleSheet, View } from "react-native";
import { GameStatus } from "../App";

type BoardData = Array<Array<CellData>>;

interface Props {
    rows: number;
    cols: number;
    onGameEnd: (status: GameStatus) => void;
}

export function Board({ rows, cols, onGameEnd }: Props) {
    const [board, setBoard] = useState<BoardData>(generateEmptyBoard(rows, cols));
    const [isFirstMove, setIsFirstMove] = useState(true);
    const [gameOver, setGameOver] = useState(false);

    const toggleFlag = (row: number, col: number) => {
        if (gameOver) return;

        const newBoard = [...board]; // Imutabilidade
        newBoard[row][col] = {
            ...newBoard[row][col],
            isFlagged: !newBoard[row][col].isFlagged,
        }
        setBoard(newBoard);
    }

    const openCell = (row: number, col: number) => {
        if (gameOver) return;

        let newBoard = [...board];

        // Verificar se é a primeira jogada
        if (isFirstMove) {
            newBoard = placeBombs(newBoard, 6, row, col);
            setIsFirstMove(false);
        }

        // Abrir a célula
        newBoard[row][col].isOpen = true;

        // Verificar se a célula tem bomba
        if (newBoard[row][col].isBomb) {
            Alert.alert("perdeste", "Você clicou em uma bomba");
            setGameOver(true);
            onGameEnd("LOST");
        } else {
            // Abrir células adjacentes que não possuem bombas
            if (newBoard[row][col].adjacentBombs === 0) {
                openAdjacentCells(newBoard, row, col, rows, cols);
            }

            // Verificar se ganhou
            if (checkWinCondition(newBoard, rows, cols)) {
                Alert.alert("Parabéns", "não fez mais que a sua obrigação");
                setGameOver(true);
                onGameEnd("WON");
            }
        }

        setBoard(newBoard);
    }

    return <View>
        {board.map((row, rowIndex) => (
            <View style={styles.row} key={rowIndex}>
                {row.map((col, colIndex) => (
                    <Cell
                        key={colIndex}
                        data={col}
                        onPress={() => openCell(rowIndex, colIndex)}
                        onLongPress={() => toggleFlag(rowIndex, colIndex)}
                    />
                ))}
            </View>
        ))}
    </View>
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
    },
})