import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

export default function Accordion() {
  const [selected, setSelected] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enableMultiSelection, setEnableMultiSelection] = useState(false);
  const [multiple, setMultiple] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/data")
      .then((res) => setData(res.data))
      .catch((e) => console.log(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSingleSelection = (id) => {
    setSelected(id === selected ? null : id);
  };

  const handleMultiSelection = (id) => {
    let cpyMultiple = [...multiple];
    const findIndexOfCurrentId = cpyMultiple.indexOf(id);
    if (findIndexOfCurrentId == -1) cpyMultiple.push(id);
    else cpyMultiple.splice(findIndexOfCurrentId, 1);
    setMultiple(cpyMultiple);
  };
  console.log(selected, multiple, enableMultiSelection);

  return (
    <div className="wrapper">
      {loading && <div className="loader"></div>}
      <button onClick={() => setEnableMultiSelection(!enableMultiSelection)}>
        Enable Multi Selection
      </button>
      <div className="accordion">
        {data && data.length > 0 ? (
          data.map((dataItem) => (
            <div className="item" key={dataItem.id}>
              <div
                onClick={
                  enableMultiSelection
                    ? () => handleMultiSelection(dataItem.id)
                    : () => handleSingleSelection(dataItem.id)
                }
                className="title"
              >
                <h3>{dataItem.question}</h3>
                <span>+</span>
              </div>
              {/* {
                enableMultiSelection ? multiple.indexOf(dataItem.id) !== 1 && (
                  <div className="content">{dataItem.answer}</div>
                ) : selected === dataItem.id &&
                  <div className="content">{dataItem.answer}</div>
              } */}
              {selected === dataItem.id ||
              multiple.indexOf(dataItem.id) !== -1 ? (
                <div className="content">{dataItem.answer}</div>
              ) : null}
            </div>
          ))
        ) : (
          <div>No data found</div>
        )}
      </div>
    </div>
  );
}
