import { useEffect, useState } from "react";

export default function FileHandling() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [image, setImage] = useState("");

  async function fetchImage() {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/image");
      if (res.ok) {
        const blob = await res.blob();
        setImage(URL.createObjectURL(blob));
      } else {
        setError(new Error(`HTTP error! Status: ${res.status}`));
      }
    } catch (error) {
      console.error("Error fetching image:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchImage();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div>
      <div>
        <img src={image} alt="image" />
      </div>
    </div>
  );
}
