import axios from "axios";
import { useEffect, useState } from "react";
import { Circles } from "react-loader-spinner";
import ProductTile from "../components/product-tile/ProductTile";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchListOfProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://fakestoreapi.com/products");
      if (res.data) setProducts(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListOfProducts();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="min-h-screen w-full flex justify-center items-center">
          <Circles
            height={"120"}
            width={"120"}
            color="rgb(127, 29, 29"
            visible={true}
          />
        </div>
      ) : 
      <div className="min-h-[80vh] grid sm:grid-cols-2 md:grid-cols-3 space-x-5 space-y-10 lg:grid-cols-4 max-w-6xl mx-auto p-3">
        {
            products && products.length > 0 &&
            products.map(productItem => <ProductTile key={productItem.id} product={productItem} />)
        }
      </div>
      }
    </div>
  );
}
