import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Screen from "../components/Screen";

export default function MilkRecordScreen({ navigation }) {
  return (
    <Screen style={styles.container}>
      <Text style={styles.title}>Milk Records</Text>

      <TouchableOpacity
        style={styles.optionCard}
        onPress={() => navigation.navigate("CreameryRecords")}
      >
        <MaterialCommunityIcons name="factory" size={24} color="#4CAF50" />
        <View style={styles.textContainer}>
          <Text style={styles.optionText}>Creamery Entries</Text>
          <Text style={styles.optionSubtext}>
            Record milk sold to creameries
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.optionCard}
        onPress={() => navigation.navigate("ProductionRecords")}
      >
        <MaterialCommunityIcons name="bottle-tonic" size={24} color="#2196F3" />
        <View style={styles.textContainer}>
          <Text style={styles.optionText}>Overall Production</Text>
          <Text style={styles.optionSubtext}>View complete milk records</Text>
        </View>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  textContainer: {
    display: "flex",
    flexDirection: "column",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
    textAlign: "center",
  },
  optionCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginLeft: 15,
    //   flex: 1,
  },
  optionSubtext: {
    fontSize: 14,
    color: "#666",
    marginLeft: 15,
    marginTop: 3,
  },
  // For the first option (Creamery)
  "optionCard:first-child": {
    borderLeftColor: "#4CAF50", // Green border
  },
  // For the second option (Production)
  "optionCard:last-child": {
    borderLeftColor: "#2196F3", // Blue border
  },
});
