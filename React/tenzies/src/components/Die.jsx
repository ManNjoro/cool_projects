/* eslint-disable react/prop-types */


export default function Die({dieValue, holdDie, isHeld}) {
  const styles = {
    backgroundColor: isHeld ? '#59E391' : '#FFF'
}
  return (
    <div className="die-container" style={styles} onClick={holdDie}>
        <h2>{dieValue}</h2>
    </div>
  )
}
