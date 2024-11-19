import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import Card from "./Card";
import Screen from "./Screen";
import Icon from "./Icon";
import ListItem from "./ListItem";

export default function Demo() {
  const [firstName, setFirstName] = useState("");
  return (
    <Screen>
      <Text>{firstName}</Text>
      <TextInput
      secureTextEntry={true}
        onChangeText={(text) => setFirstName(text)}
        placeholder="First Name"
        style={{
          borderBottomColor: "#ccc",
          borderBottomWidth: 1,
        }}
      />
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
