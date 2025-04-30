import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import Screen from "../components/Screen";
import SummaryCard from "../components/SummaryCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Dashboard() {
  return (
    <Screen style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/farmer.png")}
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.greeting}>Hello, Farmer!</Text>
          <Text style={styles.date}>{new Date().toDateString()}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.cardRow}>
          <SummaryCard
            title={"Total Cows"}
            subTitle={6}
            icon="cow"
            color="#4CAF50"
          />
          <SummaryCard
            title={"Total Litres"}
            subTitle={700}
            icon="water"
            color="#2196F3"
            unit="L"
          />
        </View>

        <View style={styles.cardRow}>
          <SummaryCard
            title={"Total Sales"}
            subTitle={500}
            icon="cash"
            color="#FF9800"
            unit="KSH"
          />
          <SummaryCard
            title={"Expected Salary"}
            subTitle={500}
            icon="wallet"
            color="#9C27B0"
            unit="KSH"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("AddRecord")}
            >
              <MaterialCommunityIcons name="plus" size={24} color="white" />
              <Text style={styles.actionText}>Add Record</Text>
            </TouchableOpacity>
            <View style={styles.actionButton}>
              <MaterialCommunityIcons
                name="chart-line"
                size={24}
                color="white"
              />
              <Text style={styles.actionText}>Reports</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityItem}>
            <MaterialCommunityIcons name="cow" size={20} color="#4CAF50" />
            <Text style={styles.activityText}>Milked 50L today</Text>
          </View>
          <View style={styles.activityItem}>
            <MaterialCommunityIcons name="alert" size={20} color="#F44336" />
            <Text style={styles.activityText}>Cow #3 needs vet attention</Text>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    marginBottom: 10,
    elevation: 2,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  date: {
    fontSize: 14,
    color: "#666",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  section: {
    backgroundColor: "white",
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 10,
    padding: 15,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  actionText: {
    color: "white",
    marginLeft: 10,
    fontWeight: "bold",
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  activityText: {
    marginLeft: 10,
    color: "#555",
  },
});
