import { StyleSheet, Text, Touchable, TouchableOpacity, View } from "react-native";

export interface CellData {
    isBomb: boolean;
    isFlagged: boolean;
    isOpen: boolean;
    adjacentBombs: number;
}

interface Props {
    onPress: () => void;
    onLongPress: () => void;
    data: CellData;
}

export function Cell({ data, onPress, onLongPress }: Props) {
    const handlePress = () => {
        if (!data.isOpen && !data.isFlagged) {
            onPress();
        }
    }

    const handleLongPress = () => {
        if (!data.isOpen) {
            onLongPress();
        }
    }

    return <TouchableOpacity 
        style={[styles.cell, data.isOpen ? styles.open : styles.closed]}
        onPress={handlePress}
        onLongPress={handleLongPress}
    >
        {data.isOpen
            ? <Text style={styles.cellText}>
                {data.isBomb
                    ? "💥"
                    : data.adjacentBombs> 0
                        ? data.adjacentBombs
                        : ""
                }
            </Text>
            : data.isFlagged
                ? <Text style={styles.cellText}>⚠</Text>
                : null
       }
    </TouchableOpacity>
}

const styles = StyleSheet.create({
    cell: {
        width: 50,
        height: 50,
        borderWidth: 1,
        borderColor: "#333",
        justifyContent: "center",
        alignItems: "center",
    },
    open: {
        backgroundColor: "#ccc",
    },
    closed: {
        backgroundColor: "#999",
    },
    cellText: {
        fontSize: 24,
    },
});