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
  recipeList: [],
  recipeDetailsData: null,
  setRecipeDetailsData: () => {},
  favoritesList: [],
  setFavoritesList: () => {},
  handleAddToFavorite: () => {},
});

export default function GlobalState({ children }) {
  const [searchParam, setSearchParam] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipeList, setRecipeList] = useState([]);
  const [error, setError] = useState(null);
  const [recipeDetailsData, setRecipeDetailsData] = useState(null);
  const [favoritesList, setFavoritesList] = useState([])
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        setLoading(true);
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
const handleAddToFavorite = (getCurrentItem) => {
  console.log(getCurrentItem);
  let cpyFavoritesList = [...favoritesList]
  const index = cpyFavoritesList.findIndex(item => item.id === getCurrentItem.id)

  if (index === -1) {
    cpyFavoritesList.push(getCurrentItem)
  } else {
    cpyFavoritesList.splice(index)
  }
  setFavoritesList(cpyFavoritesList)
}

  console.log(loading, recipeList);
  return (
    <GlobalContext.Provider
      value={{
        searchParam,
        setSearchParam,
        handleSubmit,
        error,
        recipeList,
        loading,
        recipeDetailsData,
        setRecipeDetailsData,
        favoritesList,
        setFavoritesList,
        handleAddToFavorite
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
