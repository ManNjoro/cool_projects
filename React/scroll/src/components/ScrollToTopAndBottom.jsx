import { useEffect, useRef, useState } from "react";

export default function ScrollToTopAndBottom() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);
  const fetchData = async () => {
    try {
      const response = await fetch("https://dummyjson.com/products?limit=100");
      const data = await response.json();
      setData(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
    // console.log(data);
  };
  function handleScrollToTop() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }

  function handleScrollToBottom() {
    bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    fetchData();
  }, []);
  if (error) {
    return <h1>Error occured! Please try again. {error}</h1>;
  }
  if (loading) return <h1>Loading!Please wait...</h1>;

  return (
    <div>
      <h1>Scroll To Top And Bottom Feature</h1>
      <h3>This is the top section</h3>
      <button onClick={handleScrollToBottom}>Scroll To Bottom</button>
      <ul style={{ listStyle: "none" }}>
        {data && data.products && data.products.length
          ? data.products.map((item, index) => (
              <li key={index}>{item.title}</li>
            ))
          : null}
      </ul>
      <button onClick={handleScrollToTop}>Scroll To Top</button>
      <div ref={bottomRef}></div>
      <h3>This is the bottom section</h3>
    </div>
  );
}
