import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
  Text,
  Alert,
  Platform,
} from "react-native";
import Screen from "../components/Screen";
import { 
  addExpense, 
  getExpenses, 
  getExpenseCategories,
  updateExpense,
  deleteExpense,
  getTotalExpenses
} from "../db/database";
import DateTimePicker from '@react-native-community/datetimepicker';
import Picker from "../components/Picker";
import { ModalPicker } from "../components/Picker";
import RequiredStar from "../components/RequiredStar";

const PickerComponent = Platform.OS === 'ios' ? ModalPicker : Picker;

const categories = [
  { label: "Animal Feed", value: "feed" },
  { label: "Veterinary", value: "veterinary" },
  { label: "Labor", value: "labor" },
  { label: "Equipment", value: "equipment" },
  { label: "Fodder", value: "fodder" },
  { label: "Other", value: "other" },
];

const units = [
  { label: "Kg", value: "kg" },
  { label: "Liter", value: "liter" },
  { label: "Bale", value: "bale" },
  { label: "Bag", value: "bag" },
  { label: "Unit", value: "unit" },
];

export default function ExpenseScreen() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const data = await getExpenses();
      setExpenses(data);
      applyFilters(data, searchQuery, categoryFilter, startDate, endDate);
      
      // Calculate total expenses
      const total = await getTotalExpenses({
        startDate,
        endDate,
        category: categoryFilter !== "all" ? categoryFilter : null
      });
      setTotalExpenses(total);
    } catch (error) {
      console.error("Failed to load expenses:", error);
      Alert.alert("Error", "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (data, query, category, start, end) => {
    let filtered = [...data];
    
    // Apply search filter
    if (query) {
      filtered = filtered.filter(expense => 
        expense.name.toLowerCase().includes(query.toLowerCase()) ||
        (expense.description && expense.description.toLowerCase().includes(query.toLowerCase()))
      );
    }
    
    // Apply category filter
    if (category !== "all") {
      filtered = filtered.filter(expense => expense.category === category);
    }
    
    // Apply date range filter
    if (start && end) {
      filtered = filtered.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= new Date(start) && expenseDate <= new Date(end);
      });
    }
    
    setFilteredExpenses(filtered);
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  useEffect(() => {
    applyFilters(expenses, searchQuery, categoryFilter, startDate, endDate);
  }, [searchQuery, categoryFilter, startDate, endDate]);

  const handleSaveExpense = async () => {
    try {
      const expenseData = {
        name,
        category: selectedCategory,
        cost: parseFloat(cost),
        quantity: quantity ? parseFloat(quantity) : null,
        unit: selectedUnit,
        description,
        date: date.toISOString().split('T')[0]
      };

      if (editingId) {
        await updateExpense(editingId, expenseData);
        Alert.alert("Success", "Expense updated successfully");
      } else {
        await addExpense(expenseData);
        Alert.alert("Success", "Expense added successfully");
      }

      setShowModal(false);
      resetForm();
      loadExpenses();
    } catch (error) {
      console.error("Error saving expense:", error);
      Alert.alert("Error", error.message || "Failed to save expense");
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this expense?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteExpense(id);
              loadExpenses();
              Alert.alert("Success", "Expense deleted successfully");
            } catch (error) {
              Alert.alert("Error", "Failed to delete expense");
            }
          },
        },
      ]
    );
  };

  const handleEdit = (expense) => {
    setEditingId(expense.id);
    setName(expense.name);
    setSelectedCategory(expense.category);
    setCost(expense.cost.toString());
    setQuantity(expense.quantity?.toString() || "");
    setSelectedUnit(expense.unit || "");
    setDescription(expense.description || "");
    setDate(new Date(expense.date));
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setCost("");
    setQuantity("");
    setDescription("");
    setDate(new Date());
    setSelectedCategory(categories[0].value);
    setSelectedUnit(units[0].value);
  };

  const renderItem = ({ item }) => (
    <View style={styles.expenseItem}>
      <View style={styles.expenseInfo}>
        <Text style={styles.expenseName}>{item.name}</Text>
        <Text style={styles.expenseCategory}>
          {categories.find(c => c.value === item.category)?.label || item.category}
        </Text>
        {item.description && (
          <Text style={styles.expenseDescription}>{item.description}</Text>
        )}
        {item.quantity && (
          <Text style={styles.expenseQuantity}>
            {item.quantity} {item.unit}
          </Text>
        )}
        <Text style={styles.expenseDate}>{item.date}</Text>
      </View>
      <View style={styles.expenseAmount}>
        <Text style={styles.expenseCost}>KSH {item.cost.toFixed(2)}</Text>
        <View style={styles.expenseActions}>
          <TouchableOpacity onPress={() => handleEdit(item)}>
            <MaterialCommunityIcons name="pencil" size={20} color="#FFA500" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <MaterialCommunityIcons name="delete" size={20} color="#F44336" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <Screen style={styles.container}>
      {/* Filter Section */}
      <View style={styles.filterSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search expenses..."
          placeholderTextColor='gray'
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Category:</Text>
          <PickerComponent
            items={[{ label: "All Categories", value: "all" }, ...categories]}
            selectedValue={categoryFilter}
            onValueChange={setCategoryFilter}
            containerStyle={{ flex: 1 }}
          />
        </View>
        
        <View style={styles.filterRow}>
          <TouchableOpacity 
            style={styles.dateFilterButton}
            onPress={() => setShowDatePicker('start')}
          >
            <Text>{startDate || "Start Date"}</Text>
          </TouchableOpacity>
          <Text style={styles.dateSeparator}>to</Text>
          <TouchableOpacity 
            style={styles.dateFilterButton}
            onPress={() => setShowDatePicker('end')}
          >
            <Text>{endDate || "End Date"}</Text>
          </TouchableOpacity>
          {(startDate || endDate) && (
            <TouchableOpacity 
              style={styles.clearDateButton}
              onPress={() => {
                setStartDate(null);
                setEndDate(null);
              }}
            >
              <MaterialCommunityIcons name="close" size={16} color="#F44336" />
            </TouchableOpacity>
          )}
        </View>
        
        {showDatePicker && (
          <DateTimePicker
            value={new Date(showDatePicker === 'start' && startDate || endDate || new Date())}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(null);
              if (selectedDate) {
                const dateStr = selectedDate.toISOString().split('T')[0];
                if (showDatePicker === 'start') {
                  setStartDate(dateStr);
                } else {
                  setEndDate(dateStr);
                }
              }
            }}
          />
        )}
      </View>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Total Expenses</Text>
        <Text style={styles.summaryAmount}>KSH {totalExpenses.toFixed(2)}</Text>
        <Text style={styles.summaryCount}>
          {filteredExpenses.length} {filteredExpenses.length === 1 ? "record" : "records"}
        </Text>
      </View>

      {/* Expenses List */}
      <FlatList
        data={filteredExpenses}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="clipboard-text-outline"
              size={50}
              color="#ccc"
            />
            <Text style={styles.emptyText}>No expenses found</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        refreshing={loading}
        onRefresh={loadExpenses}
      />

      {/* Add Expense Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          resetForm();
          setShowModal(true);
        }}
      >
        <MaterialCommunityIcons name="plus" size={24} color="white" />
      </TouchableOpacity>

      {/* Expense Form Modal */}
      <Modal visible={showModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingId ? "Edit Expense" : "Add New Expense"}
            </Text>

            <Text style={styles.inputLabel}>Expense Name <RequiredStar /></Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Napier Grass"
              placeholderTextColor='gray'
            />

            <Text style={styles.inputLabel}>Category <RequiredStar /></Text>
            <PickerComponent
              items={categories}
              selectedValue={selectedCategory}
              onValueChange={setSelectedCategory}
            />

            <Text style={styles.inputLabel}>Cost (KSH) <RequiredStar /></Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={cost}
              onChangeText={setCost}
              placeholder="Enter amount"
              placeholderTextColor='gray'
            />

            <Text style={styles.inputLabel}>Quantity (optional)</Text>
            <View style={styles.quantityContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
                placeholder="Enter quantity"
                placeholderTextColor='gray'
              />
              <PickerComponent
                items={units}
                selectedValue={selectedUnit}
                onValueChange={setSelectedUnit}
                containerStyle={{ width: 100, marginLeft: 10 }}
              />
            </View>

            <Text style={styles.inputLabel}>Description (optional)</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              multiline
              value={description}
              onChangeText={setDescription}
              placeholder="Additional details"
              placeholderTextColor='gray'
            />

            <Text style={styles.inputLabel}>Date <RequiredStar /></Text>
            <Pressable onPress={() => setShowDatePicker('form')}>
              <Text style={styles.dateInput}>
                {date.toISOString().split('T')[0]}
              </Text>
            </Pressable>
            {showDatePicker === 'form' && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(null);
                  if (selectedDate) {
                    setDate(selectedDate);
                  }
                }}
              />
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveExpense}
                disabled={!name || !cost || !selectedCategory}
              >
                <Text style={styles.buttonText}>
                  {editingId ? "Update" : "Save"} Expense
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  filterSection: {
    backgroundColor: "white",
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  filterLabel: {
    marginRight: 10,
    fontWeight: "bold",
  },
  dateFilterButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
  },
  dateSeparator: {
    marginHorizontal: 10,
  },
  clearDateButton: {
    marginLeft: 10,
    padding: 10,
  },
  summaryCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
    margin: 15,
    marginBottom: 10,
    elevation: 2,
    alignItems: "center",
  },
  summaryTitle: {
    fontSize: 16,
    color: "#666",
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#F44336",
    marginVertical: 5,
  },
  summaryCount: {
    fontSize: 14,
    color: "#999",
  },
  listContent: {
    paddingBottom: 80,
  },
  expenseItem: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 1,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  expenseCategory: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  expenseDescription: {
    fontSize: 13,
    color: "#666",
    marginTop: 5,
    fontStyle: "italic",
  },
  expenseQuantity: {
    fontSize: 13,
    color: "#2196F3",
    marginTop: 5,
  },
  expenseDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
  },
  expenseAmount: {
    alignItems: "flex-end",
    marginLeft: 10,
  },
  expenseCost: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F44336",
  },
  expenseActions: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
    width: 50,
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
  dateInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    color: "#333",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
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