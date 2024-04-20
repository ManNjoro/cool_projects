import { useEffect } from "react";
import { useState } from "react";

export default function ScrollIndicator({ url }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scroolPercentage, setScrollPercentage] = (0)

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
  useEffect(()=> {
    fetchData(url)
}, [url])

const handleScrollPercentage = () => {
    
}

useEffect(()=>{
    window.addEventListener('scroll', handleScrollPercentage)
    return () => {
        window.removeEventListener('scroll', ()=>{})
    }
}, [])


  return <div>
    <h1>Custom Scroll Indicator</h1>
    <div className="data-container">
        {
            (data && data.length > 0) &&
            data.map(dataItem => <p key={dataItem.id}>{dataItem.title}</p>)
        }
    </div>
  </div>;
}
