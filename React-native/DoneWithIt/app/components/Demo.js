import { StyleSheet, Switch, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import Card from "./Card";
import Screen from "./Screen";
import Icon from "./Icon";
import ListItem from "./ListItem";

export default function Demo() {
  const [isNew, setIsNew] = useState(false);
  return (
    <Screen>
      <Switch value={isNew} onValueChange={(newValue) => setIsNew(newValue)} />
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
