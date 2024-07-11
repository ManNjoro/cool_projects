/* eslint-disable react/prop-types */
import axios from "axios";
import { createContext, useState } from "react";

export const GlobalContext = createContext({
  searchParam: "",
  setSearchParam: () => {},
  handleSubmit: () => {},
  error: null,
  setError: () => {},
  loading: false,
  recipeList: []
});

export default function GlobalState({ children }) {
  const [searchParam, setSearchParam] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipeList, setRecipeList] = useState([]);
  const [error, setError] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://forkify-api.herokuapp.com/api/v2/recipes?search=${searchParam}`
      );
      if (data?.data?.recipes) {
        setRecipeList(data?.data?.recipes);

        setSearchParam("");
      }
      console.log(data);
    } catch (error) {
      console.log(error);
      setError(error);
      setSearchParam("");
    } finally {
      setLoading(false);
    }
  };
  console.log(loading, recipeList);
  return (
    <GlobalContext.Provider
      value={{ searchParam, setSearchParam, handleSubmit, error, recipeList, loading }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
