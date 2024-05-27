/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import CustomButton from "./CustomButton";
import { View, Text, Button } from "react-native";

const Square = ({ value, onClick }) => {
  return <CustomButton value={value} onClick={onClick} />;
};

export default function TicTacToe() {
  const [squares, setSquares] = useState(Array(9).fill(""));
  const [isXTurn, setIsXTurn] = useState(true);
  const [status, setStatus] = useState("");
  const getWinner = (squares) => {
    const winningPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
      [0, 3, 6],
      [1, 4, 7],
    ];
    for (let i = 0; i < winningPatterns.length; i++) {
      const [x, y, z] = winningPatterns[i];
      if (
        squares[x] &&
        squares[x] === squares[y] &&
        squares[x] === squares[z]
      ) {
        return squares[x];
      }
    }
    return null;
  };
  const handleClick = (getCurrentSquare) => {
    let cpySquares = [...squares];
    if (getWinner(cpySquares) || cpySquares[getCurrentSquare]) return;
    cpySquares[getCurrentSquare] = isXTurn ? "X" : "O";
    setIsXTurn(!isXTurn);
    setSquares(cpySquares);
  };

  const handleRestart = () => {
    setIsXTurn(true);
    setSquares(Array(9).fill(""));
  };

  useEffect(() => {
    if (!getWinner(squares) && squares.every((item) => item != "")) {
      setStatus("This is a draw! Please restart the game");
    } else if (getWinner(squares)) {
      setStatus(`Winner is ${getWinner(squares)}.Please restart the game`);
    } else {
      setStatus(`Next player is ${isXTurn ? "X" : "O"}`);
    }
  }, [squares, isXTurn]);
  console.log(squares);
  return (
    <View className="flex-1 justify-center items-center bg-gray-100 p-4 w-full">
      <Text className="text-2xl font-bold mb-4">Tic Tac Toe</Text>
      <View className="flex flex-row">
        <Square value={squares[0]} onClick={() => handleClick(0)} />
        <Square value={squares[1]} onClick={() => handleClick(1)} />
        <Square value={squares[2]} onClick={() => handleClick(2)} />
      </View>
      <View className="flex flex-row">
        <Square value={squares[3]} onClick={() => handleClick(3)} />
        <Square value={squares[4]} onClick={() => handleClick(4)} />
        <Square value={squares[5]} onClick={() => handleClick(5)} />
      </View>
      <View className="flex flex-row">
        <Square value={squares[6]} onClick={() => handleClick(6)} />
        <Square value={squares[7]} onClick={() => handleClick(7)} />
        <Square value={squares[8]} onClick={() => handleClick(8)} />
      </View>
      <Text className="text-xl mt-4">{status}</Text>
      <View className="mt-4">
        <Button title="Restart" onPress={handleRestart} />
      </View>
    </View>
  );
}
