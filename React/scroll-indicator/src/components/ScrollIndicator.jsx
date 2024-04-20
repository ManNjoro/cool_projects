import { useState } from "react";

export default function ScrollIndicator({ url }) {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchData(getUrl) {
    try {
      setLoading(true);
      const res = await fetch(getUrl);
      const data = await res.json();
      setData(data);
      setLoading(false);
      console.log(data);
    } catch (e) {
      console.log(e);
      setError(e.message);
    }
  }
  return <div>ScrollIndicator</div>;
}
