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
  const [rollLimit, setRollLimit] = useState(9)
  const [message, setMessage] = useState('')
  const [tenzies, setTenzies] = useState(false)

  const handleRollDice = () => {
    setDice((oldDice) =>
      oldDice.map((die) => (die.isHeld ? die : generateNewDie()))
    );
    setRollLimit(prev => (rollLimit > 0) && prev - 1)
  };

  const holdDie = (id) => {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  };

  const newGame = () => {
    setDice(generateAllDice())
    setRollLimit(9)
    setMessage('')
    setTenzies(false)
  }



  useEffect(()=>{
    console.log(rollLimit);
    if (rollLimit === 0) {
      setMessage("OOPS! You ran out of limits")
    }
    
    const allHeld = dice.every(die => die.isHeld)
    const allSameValue = dice.every(die => die.dieValue === dice[0].dieValue)
    if (allHeld && allSameValue) {
      setTenzies(true)
      setMessage("You won!")
    }
  }, [rollLimit, dice])

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
            tenzies={tenzies}
            rollLimit={rollLimit}
          />
        ))}
      </div>
      <button onClick={tenzies || rollLimit===0 ? newGame : handleRollDice}>{tenzies || rollLimit===0 ? "New Game":"Roll"}</button>
    </div>
  );
}
