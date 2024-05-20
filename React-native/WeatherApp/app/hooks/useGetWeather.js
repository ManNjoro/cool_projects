import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { WEATHER_API_KEY } from "@env";
import axios from "axios";
function useGetWeather() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weather, setWeather] = useState([]);
  const [lat, setLat] = useState([]);
  const [long, setLong] = useState([]);

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("permission to access location was denied");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLat(loc.coords.latitude);
      setLong(loc.coords.longitude);
    } catch (error) {
      setError("Couldn't get the Location");
    }
  };
  console.log(long);
  console.log(lat);

  const fetchWeatherData = async () => {
    try {
      const res = await axios.get(
        `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${WEATHER_API_KEY}&units=metric`
      );
      if (res.data) {
        setWeather(res.data);
      }
    } catch (error) {
      setError("Could not fetch weather");
    } finally {
      setLoading(false);
    }
  };

  console.log(weather);

  useEffect(() => {
    getLocation();
    fetchWeatherData();
  }, [lat, long]);
  return [loading, error, weather];
}

export default useGetWeather;
