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
  const [rollLimit, setRollLimit] = useState(9);
  const [message, setMessage] = useState("");
  const [tenzies, setTenzies] = useState(false);
  const [difficulty, setDifficulty] = useState("easy");

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
    if (difficulty === "easy") setRollLimit(13);
    if (difficulty === "medium") setRollLimit(9);
    if (difficulty === "hard") setRollLimit(5);
    setMessage("");
    setTenzies(false);
  };

  const handleDifficulty = (difficulty) => {
    if (difficulty === "easy") {
      setRollLimit(13);
    }
    if (difficulty === "medium") setRollLimit(9)
    if (difficulty === "hard") setRollLimit(5)
    setDifficulty(difficulty);
  }

  

  useEffect(() => {
    console.log(rollLimit);
    if (rollLimit === 0) {
      setMessage("OOPS! You Lose! New Game?");
    }

    const allHeld = dice.every((die) => die.isHeld);
    const allSameValue = dice.every((die) => die.dieValue === dice[0].dieValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
      setMessage("You won!");
    }
  }, [rollLimit, dice]);

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
          <button onClick={() => handleDifficulty("easy")}>Easy</button>
          <button onClick={() => handleDifficulty("medium")}>Medium</button>
          <button onClick={() => handleDifficulty("hard")}>Hard</button>
        </div>
      </div>
      {message && <div className={tenzies ? "success": "fail"}>{message}</div>}
      <div className="limit">
        <h3>Rolls remaining: {rollLimit}</h3>
      </div>
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
      <button onClick={tenzies || rollLimit === 0 ? newGame : handleRollDice}>
        {tenzies || rollLimit === 0 ? "New Game" : "Roll"}
      </button>
      {tenzies && <Confetti />}
    </div>
  );
}
