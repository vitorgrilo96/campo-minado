import { Button, StyleSheet, Text, View } from 'react-native';
import { Board } from './components/Board';
import { useState } from 'react';

export type GameStatus = "IN_PROGRESS" | "WON" | "LOST";

export default function App() {
  const [gameStatus, setGameStatus] = useState<GameStatus>("IN_PROGRESS"); // IN_PROGRESS | WON | LOST
  const [key, setkey] = useState(0);

  const restartGame = () => {
    setGameStatus("IN_PROGRESS");
    setkey(key => key + 1);
  };

  const handleGameEnd = (status: GameStatus) => {
    setGameStatus(status);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Campo Minado</Text>
      { gameStatus === "WON" && <Text>Você venceu!</Text> }
      { gameStatus === "LOST" && <Text>Você perdeu!</Text> }
      <Board key={key} rows={8} cols={8} onGameEnd={handleGameEnd} />
      <Button title="Recomeçar o jogo" onPress={restartGame} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  }
});
