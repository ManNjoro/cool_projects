import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  addCreameryRecord,
  getCreameryRecords,
  updateCreameryRecord,
  deleteCreameryRecord,
} from "../db/database";
import Screen from "../components/Screen";

const CreameryRecords = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState("Morning");
  const [litres, setLitres] = useState("");
  const [price, setPrice] = useState("42");
  const [notes, setNotes] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTime, setFilterTime] = useState("All");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [page, setPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    loadRecords();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [records, searchQuery, filterTime, startDate, endDate, page]);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const data = await getCreameryRecords();
      setRecords(data);
    } catch (error) {
      Alert.alert("Error", "Failed to load records");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...records];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (record) =>
          record.notes?.toLowerCase().includes(query) ||
          record.date.includes(query) ||
          record.litres.toString().includes(query) ||
          record.price_per_litre?.toString().includes(query)
      );
    }

    // Apply time filter
    if (filterTime !== "All") {
      result = result.filter((record) => record.day_time === filterTime);
    }

    // Apply date range filter
    if (startDate) {
      result = result.filter(
        (record) => new Date(record.date) >= new Date(startDate)
      );
    }
    if (endDate) {
      result = result.filter(
        (record) => new Date(record.date) <= new Date(endDate)
      );
    }

    // Apply pagination
    const startIndex = (page - 1) * recordsPerPage;
    const paginatedResult = result.slice(
      startIndex,
      startIndex + recordsPerPage
    );

    setFilteredRecords(paginatedResult);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate.toISOString().split("T")[0]);
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate.toISOString().split("T")[0]);
    }
  };

  const handleSubmit = async () => {
    if (!litres || isNaN(parseFloat(litres))) {
      Alert.alert("Error", "Please enter valid litres");
      return;
    }

    try {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const dateString = `${year}-${month}-${day}`;

      const recordData = {
        dayTime: time,
        date: dateString, // Use our formatted date string instead of toISOString
        litres: parseFloat(litres),
        pricePerLitre: price ? parseFloat(price) : 42,
        notes: notes,
      };

      if (editingId) {
        await updateCreameryRecord(editingId, recordData);
        Alert.alert("Success", "Record updated successfully");
      } else {
        await addCreameryRecord(recordData);
        Alert.alert("Success", "Record added successfully");
      }

      resetForm();
      setShowForm(false);
      loadRecords();
    } catch (error) {
      if (error.message.includes('already exists')) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "Failed to save record");
        console.error(error);
      }
      console.error(error);
    }
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    // Parse the date string directly without timezone conversion
    const [year, month, day] = record.date.split("-");
    setDate(new Date(year, month - 1, day));
    setTime(record.day_time);
    setLitres(record.litres.toString());
    setPrice(record.price_per_litre?.toString() || "42");
    setNotes(record.notes || "");
    setShowForm(true);
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this record?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCreameryRecord(id);
              loadRecords();
              Alert.alert("Success", "Record deleted successfully");
            } catch (error) {
              Alert.alert("Error", "Failed to delete record");
              console.error(error);
            }
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setEditingId(null);
    setDate(new Date());
    setTime("Morning");
    setLitres("");
    setPrice("42");
    setNotes("");
  };

  const resetFilters = () => {
    setSearchQuery("");
    setFilterTime("All");
    setStartDate(null);
    setEndDate(null);
    setPage(1);
  };

  const renderItem = ({ item }) => (
    <View style={styles.recordItem}>
      <View style={styles.recordInfo}>
        <Text style={styles.recordDate}>{item.date}</Text>
        <Text style={styles.recordTime}>{item.day_time}</Text>
        <Text style={styles.recordLitres}>{item.litres} L</Text>
        {item.price_per_litre && (
          <Text style={styles.recordPrice}>KSH {item.price_per_litre}/L</Text>
        )}
        {item.notes && (
          <Text style={styles.recordNotes} numberOfLines={1}>
            {item.notes}
          </Text>
        )}
      </View>
      <View style={styles.recordActions}>
        <TouchableOpacity onPress={() => handleEdit(item)}>
          <MaterialCommunityIcons name="pencil" size={24} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <MaterialCommunityIcons name="delete" size={24} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (loading) {
      return <ActivityIndicator size="small" color="#0000ff" />;
    }
    return null;
  };

  const totalPages = Math.ceil(records.length / recordsPerPage);

  return (
    <Screen style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Creamery Milk Sales</Text>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search records by date..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <MaterialCommunityIcons
              name="filter"
              size={24}
              color={showFilters ? "#4CAF50" : "#555"}
            />
          </TouchableOpacity>
        </View>

        {showFilters && (
          <View style={styles.filterContainer}>
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Time of Day:</Text>
              <Picker
                selectedValue={filterTime}
                onValueChange={setFilterTime}
                style={styles.filterPicker}
                dropdownIconColor="#555"
              >
                <Picker.Item label="All Times" value="All" />
                <Picker.Item label="Morning" value="Morning" />
                <Picker.Item label="Afternoon" value="Afternoon" />
              </Picker>
            </View>

            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Date Range:</Text>
              <View style={styles.dateRangeContainer}>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <Text>{startDate || "Start Date"}</Text>
                  <MaterialCommunityIcons
                    name="calendar"
                    size={20}
                    color="#555"
                  />
                </TouchableOpacity>
                <Text style={styles.dateRangeSeparator}>to</Text>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => setShowEndDatePicker(true)}
                >
                  <Text>{endDate || "End Date"}</Text>
                  <MaterialCommunityIcons
                    name="calendar"
                    size={20}
                    color="#555"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={resetFilters}
            >
              <Text style={styles.clearFiltersText}>Clear Filters</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {showStartDatePicker && (
        <DateTimePicker
          value={startDate ? new Date(startDate) : new Date()}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={endDate ? new Date(endDate) : new Date()}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
        />
      )}

      {loading && records.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : filteredRecords.length > 0 ? (
        <>
          <FlatList
            data={filteredRecords}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.recordsList}
            ListFooterComponent={renderFooter}
          />
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              style={[
                styles.paginationButton,
                page === 1 && styles.disabledButton,
              ]}
              onPress={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <Text style={styles.paginationText}>Previous</Text>
            </TouchableOpacity>
            <Text style={styles.pageText}>
              Page {page} of {totalPages}
            </Text>
            <TouchableOpacity
              style={[
                styles.paginationButton,
                page === totalPages && styles.disabledButton,
              ]}
              onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <Text style={styles.paginationText}>Next</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.noRecordsContainer}>
          <MaterialCommunityIcons
            name="database-remove"
            size={50}
            color="#888"
          />
          <Text style={styles.noRecordsText}>No records found</Text>
          {records.length > 0 && (
            <Text style={styles.noRecordsSubText}>
              Try adjusting your filters
            </Text>
          )}
        </View>
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          resetForm();
          setShowForm(true);
        }}
      >
        <MaterialCommunityIcons name="plus" size={24} color="white" />
      </TouchableOpacity>

      <Modal
        visible={showForm}
        animationType="slide"
        onRequestClose={() => {
          resetForm();
          setShowForm(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingId ? "Edit Record" : "Add New Record"}
            </Text>
            <TouchableOpacity
              onPress={() => {
                resetForm();
                setShowForm(false);
              }}
            >
              <MaterialCommunityIcons name="close" size={24} color="#555" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalContent}>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{date.toDateString()}</Text>
              <MaterialCommunityIcons name="calendar" size={20} color="#555" />
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}

            <Picker
              selectedValue={time}
              onValueChange={(itemValue) => setTime(itemValue)}
              style={styles.picker}
              dropdownIconColor="#555"
            >
              {!time && <Picker.Item label="Select time" value={null} style={styles.placeholder} />}
              <Picker.Item label="Morning" value="Morning" />
              <Picker.Item label="Afternoon" value="Afternoon" />
            </Picker>

            <Text style={styles.inputLabel}>Litres sold</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter litres"
              placeholderTextColor="gray"
              value={litres}
              onChangeText={setLitres}
              keyboardType="numeric"
            />

            <Text style={styles.inputLabel}>Price per litre (KSH)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter price per litre"
              placeholderTextColor="gray"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />

            <Text style={styles.inputLabel}>Notes (optional)</Text>
            <TextInput
              style={[styles.input, styles.notesInput]}
              placeholder="Add any notes here"
              placeholderTextColor="gray"
              value={notes}
              onChangeText={setNotes}
              multiline
            />
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                resetForm();
                setShowForm(false);
              }}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>
                {editingId ? "Update" : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingBottom: 70,
  },
  header: {
    padding: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "white",
    color: "#333",
  },
  filterButton: {
    marginLeft: 10,
    padding: 10,
  },
  filterContainer: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  filterLabel: {
    width: 100,
    fontWeight: "bold",
    color: "#555",
  },
  filterPicker: {
    flex: 1,
    backgroundColor: "white",
  },
  dateRangeContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  dateInput: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "white",
  },
  dateRangeSeparator: {
    marginHorizontal: 8,
    color: "#555",
  },
  clearFiltersButton: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 5,
  },
  clearFiltersText: {
    color: "#555",
    fontWeight: "bold",
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
  recordDate: {
    fontWeight: "bold",
    color: "#333",
  },
  recordTime: {
    color: "#555",
    fontSize: 14,
  },
  recordLitres: {
    fontWeight: "bold",
    color: "#2196F3",
    marginTop: 5,
  },
  recordPrice: {
    color: "#4CAF50",
    marginTop: 2,
  },
  recordNotes: {
    color: "#777",
    fontSize: 12,
    marginTop: 5,
    fontStyle: "italic",
  },
  recordActions: {
    flexDirection: "row",
    gap: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noRecordsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noRecordsText: {
    fontSize: 18,
    color: "#555",
    marginTop: 10,
  },
  noRecordsSubText: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 0,
    backgroundColor: "#4CAF50",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    zIndex: 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  modalContent: {
    padding: 20,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: "white",
    color: '#000'
  },
  placeholder: {
    color: 'gray'
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "white",
    color: "#333",
  },
  inputLabel: {
    color: "#555",
    fontWeight: "600",
    marginBottom: 5,
    fontSize: 14,
  },
  notesInput: {
    height: 80,
    textAlignVertical: "top",
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
  },
  cancelButton: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    position: "absolute", // Make it stick to the bottom
    bottom: -70, // Position above the FAB
    left: 0,
    right: 0,
  },
  paginationButton: {
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  paginationText: {
    color: "white",
    fontWeight: "bold",
  },
  pageText: {
    color: "#555",
  },
});

export default CreameryRecords;
