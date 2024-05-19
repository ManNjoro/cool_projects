import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import colors from "../config/colors";
import IconText from "../components/IconText";
import moment from "moment";

function City({ weatherData }) {
  const {
    cityName,
    countryName,
    cityText,
    imageLayout,
    populationWrapper,
    populationText,
    riseSetWrapper,
    riseSetText,
    rowLayout,
  } = styles;
  const { name, country, population, sunrise, sunset } = weatherData
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../assets/city.jpg")}
        style={imageLayout}
      >
        <Text style={[cityName, cityText]}>{name}</Text>
        <Text style={[countryName, cityText]}>{country}</Text>
        <View style={[populationWrapper, rowLayout]}>
          <IconText
            iconName="user"
            iconColor={colors.red}
            bodyText={`Population: ${population}`}
            bodyTextStyles={populationText}
          />
        </View>
        <View style={[riseSetWrapper, rowLayout]}>
          <IconText
            iconName="sunrise"
            iconColor={colors.white}
            bodyText={moment(sunrise).format('h:mm:ss a')}
            bodyTextStyles={riseSetText}
          />
          <IconText
            iconName="sunset"
            iconColor={colors.white}
            bodyText={moment(sunset).format('h:mm:ss a')}
            bodyTextStyles={riseSetText}
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: StatusBar.currentHeight || 0,
  },
  imageLayout: {
    flex: 1,
  },
  cityName: {
    fontSize: 40,
  },
  countryName: {
    fontSize: 30,
  },
  cityText: {
    justifyContent: "center",
    alignSelf: "center",
    color: colors.white,
    fontWeight: "bold",
  },
  populationWrapper: {
    justifyContent: "center",
  },
  populationText: {
    fontSize: 25,
    marginLeft: 7.5,
    color: "red",
  },
  riseSetWrapper: {
    justifyContent: "space-around",
  },
  riseSetText: {
    fontSize: 20,
    color: colors.white,
  },
  rowLayout: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
  }
});

export default City;
