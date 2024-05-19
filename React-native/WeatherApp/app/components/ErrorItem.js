import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "../config/colors";

function ErrorItem(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.errorMessage}>Sorry something went wrong</Text>
      <Feather name="frown" size={100} color={colors.white} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.red,
    justifyContent: "center",
    alignItems: "center",
  },
  errorMessage: {
    fontSize: 30,
    color: colors.white,
    marginHorizontal: 10,
    textAlign: "center",
  },
});

export default ErrorItem;
