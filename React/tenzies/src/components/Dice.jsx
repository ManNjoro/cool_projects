import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
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
  const [rollLimit, setRollLimit] = useState(5)
  const [message, setMessage] = useState('')

  const handleRollDice = () => {
    setDice((oldDice) =>
      oldDice.map((die) => (die.isHeld ? die : generateNewDie()))
    );
    setRollLimit(prev => prev - 1)
  };

  const holdDie = (id) => {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  };



  useEffect(()=>{
    console.log(rollLimit);
    rollLimit === 0 && setMessage("OOPS! You ran out of limits")
    rollLimit === 0 && setRollLimit(0)
  }, [rollLimit])

  return (
    <div className="container">
      {message && message}
      <div className="dice-container">
        {dice.map((die) => (
          <Die
            key={die.id}
            dieValue={die.dieValue}
            holdDie={() => holdDie(die.id)}
            isHeld={die.isHeld}
          />
        ))}
      </div>
      <button disabled={rollLimit === 0} onClick={handleRollDice}>Roll</button>
    </div>
  );
}
