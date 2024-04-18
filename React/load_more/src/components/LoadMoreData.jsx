/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

export default function LoadMoreData() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [disableButton, setDisableButton] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://dummyjson.com/products?limit=20&skip=${
          count === 0 ? 0 : count * 20
        }`
      );
      console.log(response.data);
      const result = response.data.products;

      if (response.data && result && result.length) {
        setProducts((prevData) => [...prevData, ...result]);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [count]);

  useEffect(() => {
    products && products.length === 100 && setDisableButton(true);
  }, [products]);
  return (
    <>
      {loading && <div>Loading data! Please wait.</div>}
      <div className="container">
        <div className="product-container">
          {products && products.length
            ? products.map((item) => (
                <div className="product" key={item.id}>
                  <img src={item.thumbnail} alt={item.title} />
                  <p>{item.title}</p>
                </div>
              ))
            : null}
        </div>
        <div className="button-container">
          <button disabled={disableButton} onClick={() => setCount(count + 1)}>
            Load More Products
          </button>
          {disableButton && <p>You have reached to 100 products. The max!</p>}
        </div>
      </div>
      
    </>
  );
}
