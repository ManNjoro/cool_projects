import { View, Text, StyleSheet } from "react-native";
import React from "react";

const CustomButton = ({ value }) => {
  return (
    <View
      style={styles.bgColor}
      className="rounded-full justify-center items-center w-[60px] h-[60px] p-0 m-1 border-none"
    >
      <Text style={styles.textColor} className="font-bold text-3xl">{value}</Text>
    </View>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  bgColor: {
    backgroundColor: "#ecedef",
  },
  textColor: {
    color: "#5E5858"
  }
});
