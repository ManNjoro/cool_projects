/* eslint-disable react/prop-types */

const Square = ({ value }) => {
  return <button className="square">{value}</button>;
};

export default function TicTacToe() {
  return (
    <div className="tic-tac-toe-container">
      <div className="row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="row"></div>
      <div className="row"></div>
    </div>
  );
}
