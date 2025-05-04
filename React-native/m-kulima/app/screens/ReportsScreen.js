import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as XLSX from "xlsx";
import Screen from "../components/Screen";
import { getCows, getMilkRecords } from "../db/database";

export default function ReportsScreen({ navigation }) {
  const [timeRange, setTimeRange] = useState("week");
  const [loading, setLoading] = useState(true);
  const [milkData, setMilkData] = useState([]);
  const [cowData, setCowData] = useState([]);
  const [dailyCowData, setDailyCowData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const loadReportData = async () => {
      try {
        setLoading(true);
        const [records, cows] = await Promise.all([
          getMilkRecords(),
          getCows(),
        ]);

        const processedMilkData = processMilkData(records, timeRange);
        const processedCowData = processCowData(cows, records);
        const processedDailyCowData = processDailyCowData(cows, records);

        setMilkData(processedMilkData);
        setCowData(processedCowData);
        setDailyCowData(processedDailyCowData);
      } catch (error) {
        Alert.alert("Error", "Failed to load report data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadReportData();
  }, [timeRange]);

  const processMilkData = (records, range) => {
    // Group records by date
    const groupedByDate = records.reduce((acc, record) => {
      if (!acc[record.date]) {
        acc[record.date] = {
          morning: 0,
          afternoon: 0,
          evening: 0,
          dailyTotal: 0,
        };
      }
      const time = record.day_time.toLowerCase();
      if (["morning", "afternoon", "evening"].includes(time)) {
        acc[record.date][time] = record.litres;
        acc[record.date].dailyTotal += record.litres;
      }
      return acc;
    }, {});

    return Object.entries(groupedByDate).map(([date, data]) => ({
      date,
      ...data,
    }));
  };

  const processCowData = (cows, records) => {
    return cows
      .map((cow) => ({
        id: cow.id,
        name: cow.name,
        litres: records
          .filter((r) => r.cow_id === cow.id)
          .reduce((sum, r) => sum + r.litres, 0),
      }))
      .sort((a, b) => b.litres - a.litres)
      .slice(0, 5);
  };

  const processDailyCowData = (cows, records) => {
    // Group by date, then by cow
    const grouped = {};

    records.forEach((record) => {
      if (!grouped[record.date]) {
        grouped[record.date] = {};
      }
      if (!grouped[record.date][record.cow_id]) {
        const cow = cows.find((c) => c.id === record.cow_id);
        grouped[record.date][record.cow_id] = {
          name: cow?.name || "Unknown",
          litres: 0,
          entries: [],
        };
      }

      grouped[record.date][record.cow_id].litres += record.litres;
      grouped[record.date][record.cow_id].entries.push({
        time: record.day_time,
        litres: record.litres,
      });
    });

    return Object.entries(grouped).map(([date, cowsData]) => ({
      date,
      cows: Object.values(cowsData).sort((a, b) => b.litres - a.litres),
    }));
  };

  const exportToExcel = async () => {
    try {
      setLoading(true);

      // Create workbook
      const wb = XLSX.utils.book_new();

      // Create milk data worksheet
      const milkWS = XLSX.utils.json_to_sheet(
        milkData.map((entry) => ({
          Date: entry.date,
          Morning: entry.morning,
          Afternoon: entry.afternoon,
          Evening: entry.evening,
          "Daily Total": entry.dailyTotal,
        }))
      );
      XLSX.utils.book_append_sheet(wb, milkWS, "Milk Production");

      // Create cow data worksheet
      const cowWS = XLSX.utils.json_to_sheet(
        cowData.map((cow) => ({
          "Cow Name": cow.name,
          "Total Litres": cow.litres,
        }))
      );
      XLSX.utils.book_append_sheet(wb, cowWS, "Top Cows");

      // Create daily cow production worksheet
      const dailyCowWSData = [];
      dailyCowData.forEach((day) => {
        day.cows.forEach((cow) => {
          dailyCowWSData.push({
            Date: day.date,
            "Cow Name": cow.name,
            "Total Litres": cow.litres,
            Morning:
              cow.entries.find((e) => e.time.toLowerCase() === "morning")
                ?.litres || 0,
            Afternoon:
              cow.entries.find((e) => e.time.toLowerCase() === "afternoon")
                ?.litres || 0,
            Evening:
              cow.entries.find((e) => e.time.toLowerCase() === "evening")
                ?.litres || 0,
          });
        });
      });

      const dailyCowWS = XLSX.utils.json_to_sheet(dailyCowWSData);
      XLSX.utils.book_append_sheet(wb, dailyCowWS, "Daily Cow Production");

      // Generate file
      const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
      const filename = `milk_report_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      const uri = FileSystem.cacheDirectory + filename;

      // Write file to cache
      await FileSystem.writeAsStringAsync(uri, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Show options to user
      Alert.alert("Export Options", "How would you like to save the report?", [
        {
          text: "Download",
          onPress: async () => {
            try {
              if (Platform.OS === "android") {
                // Request permission to access storage
                const permissions =
                  await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
                if (permissions.granted) {
                  // Create the file in the selected directory
                  const downloadUri =
                    await FileSystem.StorageAccessFramework.createFileAsync(
                      permissions.directoryUri,
                      filename,
                      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    );

                  // Copy the file from cache to downloads
                  const fileContent = await FileSystem.readAsStringAsync(uri, {
                    encoding: FileSystem.EncodingType.Base64,
                  });
                  await FileSystem.writeAsStringAsync(
                    downloadUri,
                    fileContent,
                    {
                      encoding: FileSystem.EncodingType.Base64,
                    }
                  );

                  Alert.alert(
                    "Success",
                    "Report downloaded successfully to your Downloads folder"
                  );
                }
              } else {
                // For iOS, save to documents directory
                const documentsDir = FileSystem.documentDirectory + filename;
                await FileSystem.copyAsync({ from: uri, to: documentsDir });
                Alert.alert("Success", "Report saved to your Documents folder");
              }
            } catch (error) {
              Alert.alert("Error", "Failed to download report");
              console.error(error);
            }
          },
        },
        {
          text: "Share",
          onPress: async () => {
            try {
              await Sharing.shareAsync(uri, {
                mimeType:
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                dialogTitle: "Share Milk Report",
                UTI: "com.microsoft.excel.xlsx",
              });
            } catch (error) {
              Alert.alert("Error", "Failed to share report");
              console.error(error);
            }
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to generate report");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.dateButton,
        selectedDate === item.date && styles.selectedDateButton,
      ]}
      onPress={() =>
        setSelectedDate(item.date === selectedDate ? null : item.date)
      }
    >
      <Text style={styles.dateButtonText}>{item.date.split("-")[2]}</Text>
      <Text style={styles.dateButtonTotal}>{item.dailyTotal.toFixed(1)}L</Text>
    </TouchableOpacity>
  );

  const renderDailyCowItem = ({ item }) => (
    <View style={styles.cowProductionItem}>
      <Text style={styles.cowName}>{item.name}</Text>
      <View style={styles.cowProductionDetails}>
        {item.entries.map((entry, idx) => (
          <Text key={idx} style={styles.cowProductionEntry}>
            {entry.time}: {entry.litres}L
          </Text>
        ))}
        <Text style={styles.cowProductionTotal}>Total: {item.litres}L</Text>
      </View>
    </View>
  );

  const renderTopCowItem = ({ item, index }) => (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{item.name}:</Text>
      <Text style={styles.summaryValue}>{item.litres} L</Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.summaryTitle}>Report Summary</Text>

      <View style={styles.timeRangeContainer}>
        {["week", "month", "year"].map((range) => (
          <TouchableOpacity
            key={range}
            style={[
              styles.rangeButton,
              timeRange === range && styles.activeRangeButton,
            ]}
            onPress={() => setTimeRange(range)}
          >
            <Text
              style={[
                styles.rangeButtonText,
                timeRange === range && styles.activeRangeButtonText,
              ]}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.summarySection}>
        <Text style={styles.sectionTitle}>Milk Production</Text>
        <FlatList
          horizontal
          data={milkData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.datesContainer}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );

  const renderDailyCowSection = () => {
    if (!selectedDate) return null;

    const dayData = dailyCowData.find((d) => d.date === selectedDate);
    if (!dayData) return null;

    return (
      <View style={styles.dailyCowContainer}>
        <Text style={styles.sectionTitle}>Production for {selectedDate}</Text>
        <FlatList
          data={dayData.cows}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderDailyCowItem}
        />
      </View>
    );
  };

  const renderTopCowsSection = () => (
    <View style={styles.summarySection}>
      <Text style={styles.sectionTitle}>Top Producing Cows</Text>
      <FlatList
        data={cowData.slice(0, 3)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderTopCowItem}
        ListFooterComponent={
          cowData.length > 3 ? (
            <Text style={styles.moreText}>
              + {cowData.length - 3} more cows
            </Text>
          ) : null
        }
      />
    </View>
  );

  const renderFooter = () => (
    <TouchableOpacity
      style={styles.exportButton}
      onPress={exportToExcel}
      disabled={loading}
    >
      <MaterialCommunityIcons name="file-export" size={24} color="white" />
      <Text style={styles.exportButtonText}>Export Excel Report</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <Screen style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </Screen>
    );
  }

  return (
    <Screen style={styles.container}>
      <SafeAreaView style={styles.flexContainer}>
        <FlatList
          data={[]}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={
            <View style={styles.contentContainer}>
              {renderDailyCowSection()}
              {renderTopCowsSection()}
              {renderFooter()}
            </View>
          }
          renderItem={null}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        />
      </SafeAreaView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 30,
  },
  headerContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  contentContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    elevation: 2,
  },
  timeRangeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  rangeButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
    backgroundColor: "#E0E0E0",
  },
  activeRangeButton: {
    backgroundColor: "#4CAF50",
  },
  rangeButtonText: {
    color: "#666",
    fontWeight: "500",
  },
  activeRangeButtonText: {
    color: "white",
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
    textAlign: "center",
  },
  summarySection: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#4CAF50",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    paddingVertical: 3,
  },
  summaryLabel: {
    color: "#555",
  },
  summaryValue: {
    fontWeight: "600",
    color: "#2196F3",
  },
  moreText: {
    color: "#888",
    fontStyle: "italic",
    marginTop: 5,
  },
  exportButton: {
    backgroundColor: "#2196F3",
    borderRadius: 10,
    padding: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  exportButtonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 10,
    fontSize: 16,
  },
  datesContainer: {
    paddingVertical: 5,
  },
  dateButton: {
    padding: 10,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    minWidth: 60,
  },
  selectedDateButton: {
    backgroundColor: "#4CAF50",
  },
  dateButtonText: {
    fontWeight: "bold",
    color: "#333",
  },
  dateButtonTotal: {
    fontSize: 12,
    color: "#666",
  },
  dailyCowContainer: {
    marginTop: 10,
    marginBottom: 15,
  },
  cowProductionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  cowName: {
    fontWeight: "bold",
    width: "30%",
  },
  cowProductionDetails: {
    width: "70%",
  },
  cowProductionEntry: {
    fontSize: 12,
    color: "#555",
  },
  cowProductionTotal: {
    fontSize: 12,
    color: "#2196F3",
    fontWeight: "bold",
    marginTop: 3,
  },
});
