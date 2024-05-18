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

function City() {
  const {
    cityName,
    countryName,
    cityText,
    populationWrapper,
    populationText,
    riseSetWrapper,
    riseSetText,
    rowLayout,
  } = styles;
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../assets/background.jpg")}
        style={styles.imageLayout}
      >
        <Text style={[cityName, cityText]}>London</Text>
        <Text style={[countryName, cityText]}>UK</Text>
        <View style={[populationWrapper, rowLayout]}>
          <IconText
            iconName="user"
            iconColor={colors.red}
            bodyText="8000"
            bodyTextStyles={populationText}
          />
        </View>
        <View style={[riseSetWrapper, rowLayout]}>
          <IconText
            iconName="sunrise"
            iconColor={colors.white}
            bodyText="10:46:58am"
            bodyTextStyles={riseSetText}
          />
          <IconText
            iconName="sunset"
            iconColor={colors.white}
            bodyText="5:28:15pm"
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
    marginTop: StatusBar.currentHeight || 0,
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
