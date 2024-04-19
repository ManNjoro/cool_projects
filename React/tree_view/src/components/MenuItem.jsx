/* eslint-disable react/prop-types */
import MenuList from "./MenuList";
import { useState } from "react";
import { FaPlus, FaMinus} from 'react-icons/fa'

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
      <div className="menu-item">
        <p>{item.label}</p>
        {item && item.children && item.children.length ? (
          <span style={{color: "#fff", fontSize: "25px"}} onClick={() => handleToggleChildren(item.label)}>
            {
              displayCurrentChildren[item.label] ? <FaMinus /> : <FaPlus />
            }
          </span>
        ) : null}
      </div>
      {item && item.children && item.children.length > 0 && displayCurrentChildren[item.label] ?  (
        <MenuList list={item.children} />
      ) : null}
    </li>
  );
}
