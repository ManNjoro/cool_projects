import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Card from "./Card";
import Screen from "./Screen";
import Icon from "./Icon";

export default function Demo() {
  return (
    <Screen>
      <Icon name="email" size={50} backgroundColor="red" iconColor="white" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f4f4",
    padding: 20,
    paddingTop: 100,
  },
});
