/* eslint-disable react/prop-types */

export default function Die({ dieValue, holdDie, isHeld, tenzies, rollLimit }) {
  const styles = {
    backgroundColor: isHeld ? "#59E391" : "#FFF",
    pointerEvents: tenzies || rollLimit === 0 ? "none" : "auto",
    opacity: tenzies || rollLimit === 0 ? 0.5 : 1,
  };

  const handleClick = () => {
    if (!tenzies && rollLimit !== 0) {
      holdDie();
    }
  };
  return (
    <div
      className="die-container"
      style={styles}
      onClick={holdDie}
      aria-disabled={handleClick}
    >
      <h2>{dieValue}</h2>
    </div>
  );
}
