import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Picker } from "@react-native-picker/picker";
import { deleteCow, getCowById, getMilkRecordsByCow, updateCow } from "../db/database";
import Screen from "../components/Screen";

const statuses = [
  {
    id: 1,
    label: "Active",
    value: "active",
  },
  {
    id: 2,
    label: "Inactive",
    value: "inactive",
  },
];

export default function CowDetailsScreen({ route, navigation }) {
  const { cowId } = route.params;
  console.log(cowId)
  const [cow, setCow] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("active");
  const [isEditing, setIsEditing] = useState(false);
  const [milkRecords, setMilkRecords] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    status: "",
  });

  // Load cow data
  useEffect(() => {
    const loadData = async () => {
      try {
        const cowData = await getCowById(cowId);
        const records = await getMilkRecordsByCow(cowId);

        setCow(cowData);
        setMilkRecords(records);
        setFormData({
          name: cowData.name,
          status: cowData.status || "",
        });
      } catch (error) {
        Alert.alert("Error", "Failed to load cow data" + error);
      }
    };

    loadData();
  }, [cowId]);

  const handleUpdate = async () => {
    try {
      await updateCow(cowId, {
        name: formData.name,
        status: formData.status,
      });

      setIsEditing(false);
      const updatedCow = await getCowById(cowId);
      setCow(updatedCow);
      Alert.alert("Success", "Cow details updated");
    } catch (error) {
      Alert.alert("Error", "Failed to update: " + error.message);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to remove this cow? All milk records will also be deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCow(cowId);
              navigation.goBack();
              Alert.alert("Success", "Cow removed successfully");
            } catch (error) {
              Alert.alert("Error", "Failed to delete cow");
            }
          },
        },
      ]
    );
  };

  const handleAddRecord = () => {
    navigation.navigate("AddMilkRecord", { cowId });
  };

  if (!cow) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading cow details...</Text>
      </View>
    );
  }

  return (
    <Screen>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Header Section */}
          <View style={styles.header}>
            <MaterialCommunityIcons name="cow" size={40} color="#4CAF50" />
            <Text style={styles.cowName}>{cow.name}</Text>
            <Text style={styles.cowId}>ID: {cow.id || "N/A"}</Text>
          </View>
          {/* Details Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cow Details</Text>
            {isEditing ? (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Name</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.name}
                    onChangeText={(text) =>
                      setFormData({ ...formData, name: text })
                    }
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Status</Text>
                  <Picker
                    selectedValue={selectedStatus}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSelectedStatus(itemValue)}
                  >
                    {statuses.map((status) => (
                      <Picker.Item
                        key={status.id}
                        label={status.label}
                        value={status.value}
                      />
                    ))}
                  </Picker>
                </View>
              </>
            ) : (
              <>
                <View style={styles.detailRow}>
                  <MaterialCommunityIcons name="cow" size={20} color="#666" />
                  <Text style={styles.detailText}>
                    Status: {cow.status || "Not specified"}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <MaterialCommunityIcons
                    name="clipboard-list"
                    size={20}
                    color="#666"
                  />
                  <Text style={styles.detailText}>
                    Milk Records: {milkRecords.length}
                  </Text>
                </View>
              </>
            )}
          </View>
          {/* Action Buttons */}
          <View style={styles.buttonGroup}>
            {isEditing ? (
              <>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={handleUpdate}
                >
                  <Text style={styles.buttonText}>Save Changes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setIsEditing(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.button, styles.editButton]}
                  onPress={() => setIsEditing(true)}
                >
                  <Text style={styles.buttonText}>Edit Details</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.addRecordButton]}
                  onPress={handleAddRecord}
                >
                  <MaterialCommunityIcons name="plus" size={20} color="white" />
                  <Text style={styles.buttonText}>Add Milk Record</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={handleDelete}
            >
              <Text style={styles.buttonText}>Remove Cow</Text>
            </TouchableOpacity>
          </View>
          {/* Milk Records Preview */}
          {milkRecords.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Milk Records</Text>
              {milkRecords.slice(0, 3).map((record) => (
                <View key={record.id} style={styles.recordItem}>
                  <Text style={styles.recordDate}>{record.date}</Text>
                  <Text style={styles.recordDetail}>
                    {record.day_time}: {record.litres}L
                  </Text>
                </View>
              ))}
              {milkRecords.length > 3 && (
                <TouchableOpacity
                  onPress={() => navigation.navigate("CowMilkRecords", { cowId })}
                >
                  <Text style={styles.viewAllText}>
                    View all {milkRecords.length} records →
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </ScrollView>
    </Screen>
  );
}

function calculateAge(dateString) {
  const birthDate = new Date(dateString);
  const ageDiff = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDiff);
  return Math.abs(ageDate.getUTCFullYear() - 1970) + " years";
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 2,
  },
  cowName: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  cowId: {
    color: "#666",
    fontSize: 16,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#555",
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    color: "#666",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    padding: 8,
    fontSize: 16,
  },
  buttonGroup: {
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    flexDirection: "row",
  },
  editButton: {
    backgroundColor: "#FF9800",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  cancelButton: {
    backgroundColor: "#9E9E9E",
  },
  addRecordButton: {
    backgroundColor: "#2196F3",
  },
  deleteButton: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
  picker: {
    flex: 1,
    marginLeft: 10,
  },
  recordItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  recordDate: {
    color: "#666",
  },
  recordDetail: {
    fontWeight: "bold",
  },
  viewAllText: {
    color: "#2196F3",
    textAlign: "right",
    marginTop: 10,
  },
});
