import { NavigationContainer } from "@react-navigation/native";
import Tabs from "./app/components/Tabs";
import { ActivityIndicator, StatusBar, StyleSheet, View } from "react-native";
import useGetWeather from "./app/hooks/useGetWeather";
import ErrorItem from "./app/components/ErrorItem";
// import CustomButton from "./app/components/CustomButton";

// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
export default function App() {
  const [loading, error, weather] = useGetWeather();
  // console.log(loading, error, weather);

  if (weather && weather.list) {
    return (
      <NavigationContainer>
        <Tabs weather={weather} />
      </NavigationContainer>
    );
  }

  return (
    <View style={styles.container}>
      {/* <CustomButton /> */}
      {error ? (
        <ErrorItem />
      ) : (
        <ActivityIndicator size={"large"} color={"blue"} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
});
