import { useState } from "react";
import "./App.css";
import Search from "./components/search/Search";
import Weather from "./components/weather/Weather";
import axios from "axios";

function App() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);

  const fetchWeatherData = async (param) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${param}&appid=${
          import.meta.env.VITE_API
        }`
      );
      console.log("data", res.data);
      setWeatherData(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchWeatherData(search);
  };

  if (loading) {
    return (
      <div className="loader">
        <div data-glitch="Loading..." className="glitch">
          Lo
        </div>
      </div>
    );
  }
  return (
    <>
      <Search
        search={search}
        setSearch={setSearch}
        handleSearch={handleSearch}
      />
      <Weather />
    </>
  );
}

export default App;
