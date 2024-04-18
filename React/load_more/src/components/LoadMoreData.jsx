import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

export default function LoadMoreData() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `https://dummyjson.com/products?limit=10&skip=${count === 0 ? 0 : count * 20}`
      );
      console.log(response.data);
      setProducts(response.data.products)
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {fetchProducts()}, []);
  return <div></div>;
}
