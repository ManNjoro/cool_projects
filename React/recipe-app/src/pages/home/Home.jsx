import { useContext } from "react";
import { GlobalContext } from "../../context/GlobalState";
import RecipeItem from "../../components/recipe-item/RecipeItem";

export default function Home() {
  const { error, loading, recipeList } = useContext(GlobalContext);
console.log("recipelist", recipeList);
  return (
    <div className="py-8 container mx-auto flex flex-wrap justify-center gap-10">
      {loading && <p className="font-semibold">Loading...</p>}
      {error && <p className="bg-red-600 text-white">{error}</p>}
      {recipeList && recipeList.length > 0 ? (
        recipeList.map((recipe, index) => (
          <RecipeItem key={index} item={recipe} />
        ))
      ) : (
        <div>
          <p className="lg:text-4xl text-xl text-center text-black font-extrabold">
            No recipes found
          </p>
        </div>
      )}
    </div>
  );
}
