import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Screen from "../components/Screen";
import SummaryCard from "../components/SummaryCard";
import {
  getActiveCowsCount,
  getAverageProductionPerCow,
  getCreamerySalesToday,
  getDailyProductionTotal,
  getMonthlyCreameryRevenue,
} from "../db/database";

export default function Dashboard({ navigation }) {
  const [metrics, setMetrics] = useState({
    dailyProduction: 0,
    creamerySalesToday: 0,
    monthlyRevenue: 0,
    activeCows: 0,
    avgPerCow: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dbReady, setDbReady] = useState(false);

  const loadMetrics = async () => {
    try {
      setError(null);
      const today = new Date().toISOString().split("T")[0];
      const monthStart = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      )
        .toISOString()
        .split("T")[0];
      console.log(today);
      const [dailyProd, creameryToday, monthlyRev, activeCows, avgProduction] =
        await Promise.all([
          getDailyProductionTotal(today),
          getCreamerySalesToday(today),
          getMonthlyCreameryRevenue(monthStart, today),
          getActiveCowsCount(),
          getAverageProductionPerCow(),
        ]);

      setMetrics({
        dailyProduction: dailyProd,
        creamerySalesToday: creameryToday,
        monthlyRevenue: monthlyRev,
        activeCows: activeCows,
        avgPerCow: avgProduction,
      });
      setDbReady(true);
    } catch (error) {
      console.error("Failed to load metrics:", error);
      setError("Failed to load data. Please try again.");
      setDbReady(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadMetrics();
    const unsubscribe = navigation.addListener("focus", loadMetrics);
    return unsubscribe;
  }, [navigation]);

  if (!dbReady && loading) {
    return (
      <Screen style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading data...</Text>
      </Screen>
    );
  }

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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadMetrics} />
        }
      >
        {error && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: "#D32F2F" }]}>
              Error
            </Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: "#D32F2F", marginTop: 10 },
              ]}
              onPress={loadMetrics}
            >
              <Text style={styles.actionText}>Retry Loading Data</Text>
            </TouchableOpacity>
          </View>
        )}
        {/* Production Metrics Row */}
        <View style={styles.cardRow}>
          <SummaryCard
            title={"Today's Production"}
            subTitle={loading ? "--" : metrics.dailyProduction}
            icon="water-pump"
            color="#2196F3"
            unit="L"
          />
          <SummaryCard
            title={"Creamery Sales Today"}
            subTitle={loading ? "--" : metrics.creamerySalesToday}
            icon="factory"
            color="#4CAF50"
            unit="L"
          />
        </View>

        {/* Financial Metrics Row */}
        <View style={styles.cardRow}>
          <SummaryCard
            title={"Monthly Revenue (Creamery)"}
            subTitle={loading ? "--" : metrics.monthlyRevenue.toFixed(2)}
            icon="cash"
            color="#FF9800"
            unit="KSH"
          />
          <SummaryCard
            title={"Avg/Cow/Day"}
            subTitle={loading ? "--" : metrics.avgPerCow.toFixed(1)}
            icon="chart-line"
            color="#9C27B0"
            unit="L"
          />
        </View>

        {/* Herd Metrics Row */}
        <View style={styles.cardRow}>
          <SummaryCard
            title={"Active Cows"}
            subTitle={loading ? "--" : metrics.activeCows}
            icon="cow"
            color="#607D8B"
          />
          <SummaryCard
            title={"Yield Efficiency"}
            subTitle={
              loading ? "--" : `${((metrics.avgPerCow / 15) * 100).toFixed(1)}%`
            }
            icon="speedometer"
            color="#E91E63"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#4CAF50" }]}
              onPress={() => navigation.navigate("AddRecord")}
            >
              <MaterialCommunityIcons name="plus" size={24} color="white" />
              <Text style={styles.actionText}>Add Record</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#2196F3" }]}
              onPress={() => navigation.navigate("Reports")}
            >
              <MaterialCommunityIcons
                name="chart-line"
                size={24}
                color="white"
              />
              <Text style={styles.actionText}>Reports</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityItem}>
            <MaterialCommunityIcons name="water" size={20} color="#2196F3" />
            <Text style={styles.activityText}>
              Produced {loading ? "--" : metrics.dailyProduction}L today
            </Text>
          </View>
          <View style={styles.activityItem}>
            <MaterialCommunityIcons name="factory" size={20} color="#4CAF50" />
            <Text style={styles.activityText}>
              Sold {loading ? "--" : metrics.creamerySalesToday}L to creamery
              today
            </Text>
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

  errorContainer: {
    backgroundColor: "#FFEBEE",
    padding: 15,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
});
