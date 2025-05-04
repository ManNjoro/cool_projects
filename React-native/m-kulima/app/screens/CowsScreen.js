import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Screen from "../components/Screen";
import { addCow, getCows, initDatabase } from "../db/database";

export default function CowsScreen({ navigation }) {
  const [allCows, setAllCows] = useState([]);
  const [filteredCows, setFilteredCows] = useState([]);
  const [newCowName, setNewCowName] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showInactive, setShowInactive] = useState(false);
  const [error, setError] = useState(null);
  const isFocused = useIsFocused();

  // Load cows from database
  const loadCows = async () => {
    try {
      setError(null);
      const cowsData = await getCows();
      setAllCows(cowsData);
      filterCows(cowsData, showInactive);
    } catch (error) {
      console.error("Failed to load cows:", error);
      setError("Failed to load cows. Please try again.");
      setAllCows([]);
      setFilteredCows([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Filter cows based on showInactive state
  const filterCows = (cows, showInactive) => {
    if (showInactive) {
      setFilteredCows(cows);
    } else {
      setFilteredCows(cows.filter((cow) => cow.status === "active"));
    }
  };

  // Toggle inactive cows visibility
  const toggleInactive = () => {
    const newState = !showInactive;
    setShowInactive(newState);
    filterCows(allCows, newState);
  };

  // Initialize and load data
  useEffect(() => {
    const initialize = async () => {
      try {
        await initDatabase();
        await loadCows();
      } catch (error) {
        setError("Failed to initialize database");
      }
    };
    initialize();
  }, []);

  // Reload when screen comes into focus
  useEffect(() => {
    if (isFocused) {
      loadCows();
    }
  }, [isFocused]);

  // Handle adding a new cow
  const handleAddCow = async () => {
    if (!newCowName.trim()) {
      Alert.alert("Error", "Cow name cannot be empty");
      return;
    }

    try {
      await addCow({ name: newCowName.trim() });
      setNewCowName("");
      await loadCows(); // Refresh the list
    } catch (error) {
      Alert.alert("Error", "Failed to add cow: " + error.message);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCows();
  };

  // Render each cow item with status-based styling
  const renderCowItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.cowItem,
        item.status !== "active" && styles.inactiveCowItem,
      ]}
      onPress={() => navigation.navigate("CowDetails", { cowId: item.id })}
    >
      <MaterialCommunityIcons
        name="cow"
        size={24}
        color={item.status === "active" ? "#4CAF50" : "#9E9E9E"}
      />
      <View style={styles.cowInfo}>
        <Text
          style={[
            styles.cowName,
            item.status !== "active" && styles.inactiveCowName,
          ]}
        >
          {item.name}
        </Text>
        <Text
          style={[
            styles.cowStatus,
            item.status === "active"
              ? styles.activeStatus
              : styles.inactiveStatus,
          ]}
        >
          {item.status}
        </Text>
      </View>
      <MaterialCommunityIcons
        name="chevron-right"
        size={24}
        color={item.status === "active" ? "#888" : "#CCC"}
      />
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <Screen>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading cows...</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.container}>
        {/* Header with filter toggle */}
        <View style={styles.header}>
          <Text style={styles.screenTitle}>
            My Cows ({filteredCows.length})
          </Text>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={toggleInactive}
          >
            <Text style={styles.filterButtonText}>
              {showInactive ? "Hide Inactive" : "Show All"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Error message and retry button */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadCows}>
              <MaterialCommunityIcons name="reload" size={20} color="white" />
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Add Cow Form */}
        <View style={styles.addForm}>
          <TextInput
            style={styles.input}
            placeholder="Enter cow name"
            value={newCowName}
            onChangeText={setNewCowName}
            onSubmitEditing={handleAddCow}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddCow}>
            <MaterialCommunityIcons name="plus" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Cows List */}
        <FlatList
          data={filteredCows}
          renderItem={renderCowItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {showInactive ? "No cows found" : "No active cows found"}
            </Text>
          }
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  filterButton: {
    backgroundColor: "#E0E0E0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  filterButtonText: {
    color: "#333",
    fontSize: 14,
  },
  errorContainer: {
    backgroundColor: "#FFEBEE",
    padding: 15,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  errorText: {
    color: "#D32F2F",
    flex: 1,
  },
  retryButton: {
    backgroundColor: "#D32F2F",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  retryButtonText: {
    color: "white",
    marginLeft: 5,
    fontWeight: "bold",
  },
  addForm: {
    flexDirection: "row",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    elevation: 2,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    elevation: 2,
  },
  listContent: {
    paddingBottom: 20,
  },
  cowItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    elevation: 1,
  },
  inactiveCowItem: {
    opacity: 0.7,
    backgroundColor: "#FAFAFA",
  },
  cowInfo: {
    flex: 1,
    marginLeft: 15,
  },
  cowName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  inactiveCowName: {
    color: "#9E9E9E",
  },
  cowStatus: {
    fontSize: 14,
    marginTop: 2,
  },
  activeStatus: {
    color: "#4CAF50",
  },
  inactiveStatus: {
    color: "#F44336",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
});
