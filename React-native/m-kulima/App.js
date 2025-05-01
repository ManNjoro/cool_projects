import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Dashboard from "./app/screens/Dashboard";
import { NavigationContainer } from "@react-navigation/native";
import HomeNavigator from "./app/navigation/HomeNavigator";
import { navigationRef } from "./app/navigation/rootNavigation";
import { useEffect } from "react";
import { initDatabase } from "./app/db/database";
import AppNavigator from "./app/navigation/AppNavigator";
import 'expo-dev-client';

export default function App() {
  async function prepare() {
    try {
      await initDatabase();
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    prepare();
  }, []);
  return (
    <NavigationContainer ref={navigationRef}>
      <AppNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
