import "react-native-get-random-values";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import Die from "./Die";
import Confetti from "react-confetti";
import { Button, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Dice() {
  const generateNewDie = () => {
    const randomNumber = Math.floor(Math.random() * 6) + 1;

    return {
      id: nanoid(),
      dieValue: randomNumber,
      isHeld: false,
    };
  };

  const generateAllDice = () => {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  };

  const [dice, setDice] = useState(generateAllDice());
  const [rollLimit, setRollLimit] = useState(13);
  const [message, setMessage] = useState(
    "Please Select the difficulty level. When Ready click New Game"
  );
  const [tenzies, setTenzies] = useState(false);
  const [difficulty, setDifficulty] = useState("");
  const [gameStarted, setGameStarted] = useState(false);

  const handleRollDice = () => {
    setDice((oldDice) =>
      oldDice.map((die) => (die.isHeld ? die : generateNewDie()))
    );
    setRollLimit((prev) => rollLimit > 0 && prev - 1);
  };

  const holdDie = (id) => {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  };

  const newGame = () => {
    setDice(generateAllDice());
    setRollLimit(getRollLimitForDifficulty(difficulty));
    if (!difficulty) {
      // setMessage("Please Select the difficulty level. When Ready click New Game");
      setGameStarted(false);
    } else {
      setMessage("");
      setGameStarted(true);
      setTenzies(false);
    }
  };

  const ResetGame = () => {
    setTenzies(false);
    setGameStarted(false);
    setDifficulty("");
    setMessage("Please Select the difficulty level. When Ready click New Game");
  };

  const handleDifficulty = (difficulty) => {
    if (!gameStarted) {
      setDifficulty(difficulty);
      setRollLimit(getRollLimitForDifficulty(difficulty));
    }
  };

  const getRollLimitForDifficulty = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return 13;
      case "medium":
        return 9;
      case "hard":
        return 5;
      default:
        return 13;
    }
  };

  console.log(gameStarted);

  useEffect(() => {
    console.log(rollLimit);
    if (gameStarted && rollLimit === 0) {
      setMessage("OOPS! You Lose! New Game?");
    }

    const allHeld = dice.every((die) => die.isHeld);
    const allSameValue = dice.every((die) => die.dieValue === dice[0].dieValue);
    if (gameStarted && allHeld && allSameValue) {
      setTenzies(true);
      setMessage("You won!");
    }
  }, [rollLimit, dice, difficulty, gameStarted]);

  return (
    <ScrollView contentContainerStyle="justify-center" className="h-full bg-gray-100">
      <View className="flex flex-col items-center justify-center p-5  rounded-md w-5/5 max-w-lg h-full">
        <View className="flex flex-col items-center">
          <Text className="text-2xl font-bold">Tenzies</Text>
          <Text className="text-center">
            Roll until all dice are the same. Click each die to freeze it at its
            current value between rolls.
          </Text>
        </View>
   
          <View className="flex flex-row gap-3 my-4">
            <TouchableOpacity
              disabled={gameStarted}
              onPress={() => handleDifficulty("easy")}
              className={`px-4 py-2 rounded ${
                difficulty === "easy"
                  ? "bg-gray-600 text-white"
                  : "bg-green-600 text-white"
              }`}
            >
              <Text className="text-white">Easy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={gameStarted}
              onPress={() => handleDifficulty("medium")}
              className={`px-4 py-2 rounded ${
                difficulty === "medium"
                  ? "bg-gray-600 text-white"
                  : "bg-yellow-600 text-white"
              }`}
            >
              <Text className="text-white">Medium</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={gameStarted}
              onPress={() => handleDifficulty("hard")}
              className={`px-4 py-2 rounded ${
                difficulty === "hard"
                  ? "bg-gray-600 text-white"
                  : "bg-red-600 text-white"
              }`}
            >
              <Text className="text-white">Hard</Text>
            </TouchableOpacity>
          </View>
       
        {message && (
          <Text
            className={`font-bold ${
              tenzies ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </Text>
        )}
        <View className="flex flex-row gap-3 my-4">
          <TouchableOpacity
            onPress={newGame}
            className="bg-blue-600 text-white py-2 px-4 rounded"
          >
            <Text className="text-center">New Game</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={ResetGame}
            className="bg-blue-600 text-white py-2 px-4 rounded"
          >
            <Text className="text-center">Reset</Text>
          </TouchableOpacity>
        </View>
        {difficulty && (
          <View className="flex flex-row gap-5 my-4">
            <View className="border p-2 rounded flex items-center">
              <Text className="mr-2">Difficulty selected:</Text>
              <Text className="text-red-600 font-bold">{difficulty}</Text>
            </View>
            <View className="border p-2 rounded flex items-center">
              <Text className="mr-2">Rolls remaining:</Text>
              <Text className="text-red-600 font-bold">{rollLimit}</Text>
            </View>
          </View>
        )}
        {difficulty && gameStarted && (
          <>
            <View className="flex flex-row flex-wrap justify-between">
              {dice.map((die) => (
                <View  key={die.id} className="w-[20%] mb-4">

                <Die
                  dieValue={die.dieValue}
                  holdDie={() => holdDie(die.id)}
                  isHeld={die.isHeld}
                  tenzies={tenzies}
                  rollLimit={rollLimit}
                  />
                  </View>
              ))}
            </View>
            <TouchableOpacity
              disabled={tenzies || rollLimit === 0}
              onPress={handleRollDice}
              className={`bg-blue-600 text-white py-2 px-4 rounded ${
                tenzies || rollLimit === 0 ? "opacity-50" : ""
              }`}
            >
              <Text className="text-white">Roll</Text>
            </TouchableOpacity>
            {tenzies && <Confetti />}
          </>
        )}
      </View>
    </ScrollView>
  );
}
