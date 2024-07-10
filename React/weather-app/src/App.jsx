import { useState } from "react";
import "./App.css";
import Search from "./components/search/Search";
import Weather from "./components/weather/Weather";

function App() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false)
  const [weatherData, setWeatherData] = useState(null)
  const handleSearch = async () => {};
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
