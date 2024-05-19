import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import colors from "../config/colors";
import Item from "../components/Item";




function UpcomingWeather({ weatherData }) {
  const renderItem = ({ item }) => (
    <Item
      condition={item.weather[0].main}
      dt_txt={item.dt_txt}
      min={item.main.temp_min}
      max={item.main.temp_max}
    />
  );
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require('../assets/sunset.jpg')} style={styles.image}>
      <FlatList
        data={weatherData}
        renderItem={renderItem}
        keyExtractor={(item) => item.dt_txt}
      />
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: Platform.OS === "android" ? 20 : 0,
    // marginTop: StatusBar.currentHeight || 0,
    backgroundColor: "royalblue",
  },
  image : {
    flex: 1
    
  }
});

export default UpcomingWeather;
