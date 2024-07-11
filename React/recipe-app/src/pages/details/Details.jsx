import { useContext, useEffect } from "react"
import { useParams } from "react-router-dom"
import { GlobalContext } from "../../context/GlobalState"
import axios from "axios"


export default function Details() {
  const {id} = useParams()
  const {recipeDetailsData, setRecipeDetailsData, setError, error,} = useContext(GlobalContext)
  
  const getRecipeDetails = async() =>{
    try {
      const { data } = await axios.get(
        `https://forkify-api.herokuapp.com/api/v2/recipes?${id}`
      );
      if (data?.data) {
        setRecipeDetailsData(data?.data);

      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    getRecipeDetails()
  }, [id])
  return (
    <div className="container mx-auto py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="row-start-2 lg:row-start-auto">
        <div className="h-96 overflow-hidden rounded-xl group"></div>
      </div>
    </div>
  )
}
