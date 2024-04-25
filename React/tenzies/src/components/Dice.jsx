import { nanoid } from "nanoid";
import { useState } from "react";
import Die from "./Die";

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

  return (
    <div className="container">
      <div className="dice-container">
        {dice.map((die) => (
          <Die key={die.id} dieValue={die.dieValue} />
        ))}
      </div>
      <button>Roll</button>
    </div>
  );
}
