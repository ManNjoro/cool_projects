import { NavigationContainer } from "@react-navigation/native";
import 'expo-dev-client';
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { initDatabase } from "./app/db/database";
import AppNavigator from "./app/navigation/AppNavigator";
import { navigationRef } from "./app/navigation/rootNavigation";

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [initError, setInitError] = useState(null);

  async function prepare() {
    try {
      await initDatabase();
      setIsReady(true);
    } catch (error) {
      console.error(error);
      setInitError(error.message);
    }
  }

  useEffect(() => {
    prepare();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        {initError ? (
          <>
            <Text style={styles.errorText}>Failed to initialize database:</Text>
            <Text style={styles.errorDetail}>{initError}</Text>
            <Text style={styles.retryText}>Restart the app to try again</Text>
          </>
        ) : (
          <>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Initializing database...</Text>
          </>
        )}
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <AppNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    fontSize: 18,
    color: "#D32F2F",
    fontWeight: "bold",
    marginBottom: 10,
  },
  errorDetail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  retryText: {
    fontSize: 14,
    color: "#2196F3",
  },
});