/* eslint-disable react/prop-types */

export default function Suggestions({ data, handleClick }) {
  return (
    <ul>
      {data &&
        data.length &&
        data.map((item, index) => (
          <li onClick={handleClick} key={index}>
            {item}
          </li>
        ))}
    </ul>
  );
}
