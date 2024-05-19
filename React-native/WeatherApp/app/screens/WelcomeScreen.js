import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import colors from "../config/colors";
import { Feather } from "@expo/vector-icons";
import RowText from "../components/RowText";
import { WeatherType } from "../utilities/WeatherType";

function WelcomeScreen({ weatherData }) {
  const {
    bodyWrapper,
    container,
    description,
    feels,
    highLow,
    highLowWrapper,
    message,
    tempStyles,
    wrapper,
  } = styles;
  const {
    main: { temp, feels_like, temp_max, temp_min },
    weather,
  } = weatherData;

  const weatherCondition = weather[0]?.main;
  return (
    <SafeAreaView
      style={[
        wrapper,
        { backgroundColor: WeatherType[weatherCondition]?.backgroundColor },
      ]}
    >
      <View style={container}>
        <Feather
          name={WeatherType[weatherCondition]?.icon}
          size={100}
          color={colors.white}
        />
        <Text style={tempStyles}>{`${temp}°`}</Text>
        <Text style={feels}>{`Feels like ${feels_like}°`}</Text>
        <RowText
          messageOne={`High: ${temp_max}° `}
          messageTwo={`Low: ${temp_min}°`}
          containerStyles={highLowWrapper}
          messageOneStyles={highLow}
          messageTwoStyles={highLow}
        />
      </View>
      <RowText
        messageOne={weather[0]?.description}
        messageTwo={WeatherType[weatherCondition]?.message}
        containerStyles={bodyWrapper}
        messageOneStyles={description}
        messageTwoStyles={message}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  bodyWrapper: {
    justifyContent: "flex-end",
    alignItems: "flex-start",
    paddingLeft: 25,
    marginBottom: 40,
  },
  container: {
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
  },
  tempStyles: {
    color: colors.black,
    fontSize: 48,
  },
  feels: {
    color: colors.black,
    fontSize: 30,
  },
  highLow: {
    color: colors.black,
    fontSize: 20,
  },
  highLowWrapper: {
    flexDirection: "row",
  },
  description: {
    fontSize: 43,
  },
  message: {
    fontSize: 25,
  },
});

export default WelcomeScreen;
