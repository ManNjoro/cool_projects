import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Card from "./Card";

export default function Demo() {
  return (
    <View style={styles.container}>
      <Card
        title="Red jacket for sale"
        subTitle="$100"
        image={require("../assets/jacket.jpg")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f4f4",
    padding: 20,
    paddingTop: 100,
  },
});
