/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useState } from "react";

export default function ScrollIndicator({ url }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scrollPercentage, setScrollPercentage] = useState(0);

  async function fetchData(getUrl) {
    try {
      setLoading(true);
      const res = await fetch(getUrl);
      const data = await res.json();
      if (data && data.products && data.products.length > 0) {
        setData(data.products);
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
      setError(e.message);
    }
  }
  useEffect(() => {
    fetchData(url);
  }, [url]);

  const handleScrollPercentage = () => {
    console.log(
      document.body.scrollTop,
      document.documentElement.scrollTop,
      document.documentElement.scrollHeight,
      document.documentElement.clientHeight
    );
    const howMuchScrolled =
      document.body.scrollTop || document.documentElement.scrollTop;
    const totalHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    const percentage = (howMuchScrolled / totalHeight) * 100;
    setScrollPercentage(percentage);
  };

  console.log(scrollPercentage + "%");

  useEffect(() => {
    window.addEventListener("scroll", handleScrollPercentage);
    return () => {
      window.removeEventListener("scroll", () => {});
    };
  }, []);

  return (
    <div>
      {loading && <div>Loading data...</div>}
      {error && <div>{error}</div>}
      <div className="top-container">
        <h1>Custom Scroll Indicator</h1>
        <div className="scroll-progress-tracking-container">
          <div
            className="current-progress-bar"
            style={{ width: `${scrollPercentage}%` }}
          ></div>
        </div>
      </div>
      <div className="data-container">
        {data &&
          data.length > 0 &&
          data.map((dataItem) => <p key={dataItem.id}>{dataItem.title}</p>)}
      </div>
    </div>
  );
}
