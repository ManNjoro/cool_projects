import React from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "../config/colors";
import { Feather } from "@expo/vector-icons";
import RowText from "../components/RowText";

function WelcomeScreen(props) {
  const {
    bodyWrapper,
    container,
    description,
    feels,
    highLow,
    highLowWrapper,
    message,
    temp,
    wrapper,
  } = styles;
  return (
    <View style={wrapper}>
      <View style={container}>
        <Feather name="sun" size={100} color={colors.black} />
        <Text style={temp}>6</Text>
        <Text style={feels}>Feels like 5</Text>
        <RowText
          messageOne="High: 8"
          messageTwo="Low: 6"
          containerStyles={highLowWrapper}
          messageOneStyles={highLow}
          messageTwoStyles={highLow}
        />
      </View>
      <RowText
        messageOne="Its sunny"
        messageTwo="Its perfect T-shirt weather"
        containerStyles={bodyWrapper}
        messageOneStyles={description}
        messageTwoStyles={message}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.pink,
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
  temp: {
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
    fontSize: 48,
  },
  message: {
    fontSize: 25,
  },
});

export default WelcomeScreen;
