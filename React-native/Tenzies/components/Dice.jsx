import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import Die from "./Die";
import Confetti from "react-confetti";

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
    setDifficulty("")
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
    <div className="container">
      <div className="instructions">
        <h1>Tenzies</h1>
        <p>
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls.
        </p>
      </div>
      <div className="level">
        <div className="difficulty">
          <button
            disabled={gameStarted}
            onClick={() => handleDifficulty("easy")}
            className={difficulty === "easy" ? "selected" : ""}
          >
            Easy
          </button>
          <button
            disabled={gameStarted}
            onClick={() => handleDifficulty("medium")}
            className={difficulty === "medium" ? "selected" : ""}
          >
            Medium
          </button>
          <button
            disabled={gameStarted}
            onClick={() => handleDifficulty("hard")}
            className={difficulty === "hard" ? "selected" : ""}
          >
            Hard
          </button>
        </div>
      </div>
      {message && <div className={tenzies ? "success" : "fail"}>{message}</div>}
      <div className="new-reset-btns">
        <button onClick={newGame}>New Game</button>
        <button onClick={ResetGame}>Reset</button>
      </div>
      {difficulty && (
        <div className="limit">
          <div className="diff">
            <h3>Difficulty selected:</h3>
            <div>{difficulty}</div>
          </div>
          <div className="diff">
            <h3>Rolls remaining:</h3>
            <div>{rollLimit}</div>
          </div>
        </div>
      )}
      {difficulty && gameStarted && (
        <>
          <div className="dice-container">
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
          </div>
          <button
            disabled={tenzies || rollLimit === 0}
            onClick={handleRollDice}
          >
            Roll
          </button>
          {tenzies && <Confetti />}
        </>
      )}
    </div>
  );
}
