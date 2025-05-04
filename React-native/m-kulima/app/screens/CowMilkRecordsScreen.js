import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Modal,
  Pressable,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { getMilkRecordsByCow, deleteMilkRecord, updateMilkRecord } from "../db/database";
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CowMilkRecordsScreen({ route, navigation }) {
  const { cowId, cowName } = route.params;
  const isFocused = useIsFocused();
  const [milkRecords, setMilkRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [litres, setLitres] = useState("");
  const [notes, setNotes] = useState("");
  const [dayTime, setDayTime] = useState("Morning");

  const loadData = async () => {
    try {
      const records = await getMilkRecordsByCow(cowId);
      setMilkRecords(records);
      applyFilters(records, searchQuery, timeFilter);
    } catch (error) {
      Alert.alert("Error", "Failed to load milk records: " + error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadData();
    }
  }, [isFocused]);

  useEffect(() => {
    applyFilters(milkRecords, searchQuery, timeFilter);
  }, [searchQuery, timeFilter]);

  const applyFilters = (records, query, time) => {
    let filtered = [...records];
    
    // Apply search filter
    if (query) {
      filtered = filtered.filter(record => 
        record.date.toLowerCase().includes(query.toLowerCase()) ||
        (record.notes && record.notes.toLowerCase().includes(query.toLowerCase()))
      );
    }
    
    // Apply time filter
    if (time !== "all") {
      filtered = filtered.filter(record => record.day_time.toLowerCase() === time.toLowerCase());
    }
    
    setFilteredRecords(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleDeleteRecord = (recordId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this milk record?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteMilkRecord(recordId);
              loadData();
              Alert.alert("Success", "Milk record deleted successfully");
            } catch (error) {
              Alert.alert("Error", "Failed to delete milk record");
            }
          },
        },
      ]
    );
  };

  const openEditModal = (record) => {
    setEditingRecord(record);
    setDate(new Date(record.date));
    setLitres(record.litres.toString());
    setNotes(record.notes || "");
    setDayTime(record.day_time);
    setShowEditModal(true);
  };

  const handleUpdateRecord = async () => {
    try {
      await updateMilkRecord(editingRecord.id, {
        date: date.toISOString().split('T')[0],
        dayTime,
        litres: parseFloat(litres),
        notes: notes || null
      });
      setShowEditModal(false);
      loadData();
      Alert.alert("Success", "Milk record updated successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to update record: " + error.message);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openEditModal(item)}>
      <View style={styles.recordItem}>
        <View style={styles.recordInfo}>
          <Text style={styles.recordDate}>{item.date}</Text>
          <Text style={styles.recordTime}>
            {getTimeIcon(item.day_time)} {item.day_time}:{" "}
            <Text style={styles.litresText}>{item.litres}L</Text>
          </Text>
          {item.notes && (
            <Text style={styles.recordNotes}>Notes: {item.notes}</Text>
          )}
        </View>
        <View style={styles.recordActions}>
          <TouchableOpacity
            onPress={() => openEditModal(item)}
            style={styles.editButton}
          >
            <MaterialCommunityIcons name="pencil" size={20} color="#FFA500" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeleteRecord(item.id)}
            style={styles.deleteButton}
          >
            <MaterialCommunityIcons name="delete" size={20} color="#F44336" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const getTimeIcon = (time) => {
    switch(time.toLowerCase()) {
      case 'morning': return '🌞';
      case 'afternoon': return '🌤️';
      case 'evening': return '🌙';
      default: return '';
    }
  };

  return (
    <View style={styles.container}>
      {/* Search and Filter Header */}
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by date or notes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Time:</Text>
          <TouchableOpacity
            style={[styles.filterButton, timeFilter === 'all' && styles.activeFilter]}
            onPress={() => setTimeFilter('all')}
          >
            <Text>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, timeFilter === 'morning' && styles.activeFilter]}
            onPress={() => setTimeFilter('morning')}
          >
            <Text>🌞 Morning</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, timeFilter === 'afternoon' && styles.activeFilter]}
            onPress={() => setTimeFilter('afternoon')}
          >
            <Text>🌤️ Afternoon</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, timeFilter === 'evening' && styles.activeFilter]}
            onPress={() => setTimeFilter('evening')}
          >
            <Text>🌙 Evening</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredRecords}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <Text style={styles.cowName}>{cowName}'s Milk Records</Text>
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons
                name="clipboard-text-outline"
                size={50}
                color="#ccc"
              />
              <Text style={styles.emptyText}>No milk records found</Text>
            </View>
          )
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContent}
      />

      {/* Add Record Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddMilkRecord", { cowId, cowName })}
      >
        <MaterialCommunityIcons name="plus" size={24} color="white" />
      </TouchableOpacity>

      {/* Edit Record Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Milk Record</Text>
            
            <Pressable onPress={() => setShowDatePicker(true)}>
              <Text style={styles.inputLabel}>Date: {date.toISOString().split('T')[0]}</Text>
            </Pressable>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setDate(selectedDate);
                  }
                }}
              />
            )}

            <Text style={styles.inputLabel}>Time of Day</Text>
            <View style={styles.timeButtons}>
              {['Morning', 'Afternoon', 'Evening'].map(time => (
                <TouchableOpacity
                  key={time}
                  style={[styles.timeButton, dayTime === time && styles.selectedTimeButton]}
                  onPress={() => setDayTime(time)}
                >
                  <Text>{getTimeIcon(time)} {time}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Litres</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={litres}
              onChangeText={setLitres}
              placeholder="Enter litres"
            />

            <Text style={styles.inputLabel}>Notes</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              multiline
              value={notes}
              onChangeText={setNotes}
              placeholder="Optional notes"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleUpdateRecord}
              >
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  cowName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
    paddingHorizontal: 15,
  },
  filterContainer: {
    backgroundColor: "white",
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  searchInput: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  filterLabel: {
    marginRight: 10,
    fontWeight: "bold",
  },
  filterButton: {
    padding: 8,
    marginRight: 5,
    marginBottom: 5,
    borderRadius: 5,
    backgroundColor: "#eee",
  },
  activeFilter: {
    backgroundColor: "#4CAF50",
  },
  listContent: {
    paddingBottom: 20,
  },
  recordItem: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    marginHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 1,
  },
  recordInfo: {
    flex: 1,
  },
  recordActions: {
    flexDirection: "row",
  },
  editButton: {
    padding: 8,
    marginRight: 5,
  },
  deleteButton: {
    padding: 8,
  },
  recordDate: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  recordTime: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  litresText: {
    fontWeight: "bold",
    color: "#2196F3",
  },
  recordNotes: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: "#999",
    marginTop: 15,
    textAlign: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#4CAF50",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputLabel: {
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  timeButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  timeButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: "#eee",
    alignItems: "center",
  },
  selectedTimeButton: {
    backgroundColor: "#4CAF50",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#9E9E9E",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});