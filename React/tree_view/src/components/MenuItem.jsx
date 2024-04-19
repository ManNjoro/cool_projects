/* eslint-disable react/prop-types */
import MenuList from "./MenuList";
import { useState } from "react";

export default function MenuItem({ item }) {
  const [displayCurrentChildren, setDisplayCurrentChildren] = useState({});

  const handleToggleChildren = (label) => {
    setDisplayCurrentChildren({
      ...displayCurrentChildren,
      [label]: !displayCurrentChildren[label],
    });
  };
  console.log(displayCurrentChildren);
  return (
    <li>
      <div style={{ display: "flex", gap: "20px" }}>
        <p>{item.label}</p>
        {item && item.children && item.children.length ? (
          <span onClick={() => handleToggleChildren(item.label)}>+</span>
        ) : null}
      </div>
      {item && item.children && item.children.length > 0 ? (
        <MenuList list={item.children} />
      ) : null}
    </li>
  );
}
