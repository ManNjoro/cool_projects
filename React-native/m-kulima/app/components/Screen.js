import { SafeAreaView, StyleSheet, View } from "react-native";
import Constants from "expo-constants";
import React from "react";

export default function Screen({ children, style }) {
  return (
    <SafeAreaView style={[styles.screen, style]}>
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    // paddingTop: Constants.statusBarHeight,
    flex: 1,
  },
  content: {
    flex: 1,
  },
});