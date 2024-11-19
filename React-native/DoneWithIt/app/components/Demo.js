import { StyleSheet, Switch, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import Card from "./Card";
import Screen from "./Screen";
import Icon from "./Icon";
import ListItem from "./ListItem";
import { Picker } from "@react-native-picker/picker";

export default function Demo({ items=[], onSelectItem, selectedItem }) {
  return (
    <Picker
      selectedValue={selectedItem}
      onValueChange={(item) => onSelectItem(item)}
    >
      {items.map(item => <Picker.Item label={item.label} value={item.value} />)}
    </Picker>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f4f4",
    padding: 20,
    paddingTop: 100,
  },
});
