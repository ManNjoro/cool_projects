import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Picker } from "@react-native-picker/picker";
import colors from "../config/colors";

export default function AppPicker({
  items = [],
  onSelectItem,
  selectedItem,
  placeholder,
  width = '100%',
}) {
  return (
    <View style={[styles.container, {width}]}>
      <Picker
        selectedValue={selectedItem}
        onValueChange={(item) => onSelectItem(item)}
      >
        {!selectedItem && (
          <Picker.Item
            style={styles.placeholder}
            label={placeholder}
            value={null}
          />
        )}
        {items.map((item, index) => (
          <Picker.Item key={index} label={item.label} value={item.value} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.light,
    borderRadius: 45,
    // flexDirection: "row",
    // width: "100%",
    padding: 10,
    marginVertical: 10,
    // alignItems: "center",
  },
  placeholder: {
    color: colors.medium,
  },
});
