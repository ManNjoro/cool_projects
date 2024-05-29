import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import Die from "./Die";
import Confetti from "react-confetti";
import { Button, Text, View } from "react-native";

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
    <View className="container">
      <View className="instructions">
        <Text>Tenzies</Text>
        <Text>
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls.
        </Text>
      </View>
      <View className="level">
        <View className="difficulty">
          <Button
            title="Easy"
            disabled={gameStarted}
            onPress={() => handleDifficulty("easy")}
            className={difficulty === "easy" ? "selected" : ""}
          />
          <Button
            title="Medium"
            disabled={gameStarted}
            onPress={() => handleDifficulty("medium")}
            className={difficulty === "medium" ? "selected" : ""}
          />
          <Button
            title="Hard"
            disabled={gameStarted}
            onClick={() => handleDifficulty("hard")}
            className={difficulty === "hard" ? "selected" : ""}
          />
        </View>
      </View>
      {message && (
        <View className={tenzies ? "success" : "fail"}>{message}</View>
      )}
      <View className="new-reset-btns">
        <Button title="New Game" onPress={newGame} />
        <Button title="Reset" onPress={ResetGame} />
      </View>
      {difficulty && (
        <View className="limit">
          <View className="diff">
            <Text>Difficulty selected:</Text>
            <View>{difficulty}</View>
          </View>
          <View className="diff">
            <Text>Rolls remaining:</Text>
            <View>{rollLimit}</View>
          </View>
        </View>
      )}
      {difficulty && gameStarted && (
        <>
          <View className="dice-container">
            {dice.map((die) => (
              <Die
                key={die.id}
                dieValue={die.dieValue}
                holdDie={() => holdDie(die.id)}
                isHeld={die.isHeld}
                tenzies={tenzies}
                rollLimit={rollLimit}
              />
            ))}
          </View>
          <Button
            title={"Roll"}
            disabled={tenzies || rollLimit === 0}
            onClick={handleRollDice}
          />
          {tenzies && <Confetti />}
        </>
      )}
    </View>
  );
}
