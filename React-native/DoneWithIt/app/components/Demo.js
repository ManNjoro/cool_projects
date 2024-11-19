import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Card from "./Card";
import Screen from "./Screen";
import Icon from "./Icon";
import ListItem from "./ListItem";

export default function Demo() {
  return (
    <Screen>
      <ListItem title="My title" IconComponent={<Icon name="email" />} />
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
