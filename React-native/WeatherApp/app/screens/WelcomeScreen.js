import React from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "../config/colors";

function WelcomeScreen(props) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Text style={styles.temp}>6</Text>
        <Text style={styles.feels}>Feels like 5</Text>
        <View style={styles.highLowWrapper}>
          <Text style={styles.highLow}>High: 8</Text>
          <Text style={styles.highLow}>Low: 6</Text>
        </View>
      </View>
        <View style={styles.bodyWrapper}>
          <Text style={styles.description}>Its sunny</Text>
          <Text style={styles.message}>Its perfect T-shirt weather</Text>
        </View>
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
    alignItems: "flex-start"
  },
  container: {
    
    flex: 1,
    alignItems: "center", // horizontal
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
    flexDirection: 'row'
  },
  description: {
    fontSize: 48
  },
  message: {
    fontSize: 30
  },
});

export default WelcomeScreen;
