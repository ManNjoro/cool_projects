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
} from "react-native";
import Screen from "../components/Screen";
import { addExpense, getExpenses, getExpenseCategories } from "../db/database";
import DateTimePicker from '@react-native-community/datetimepicker';
import Picker from "../components/Picker";
import { Platform } from 'react-native';
import { ModalPicker } from "../components/Picker";
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
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categories[0].value);
  const [selectedUnit, setSelectedUnit] = useState(units[0].value);
  const [loading, setLoading] = useState(true);

  const loadExpenses = async () => {
    try {
      const data = await getExpenses();
      setExpenses(data);
    } catch (error) {
      console.error("Failed to load expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const handleAddExpense = async () => {
    try {
      await addExpense({
        name,
        category: selectedCategory,
        cost: parseFloat(cost),
        quantity: quantity ? parseFloat(quantity) : null,
        unit: selectedUnit,
        description,
        date: date.toISOString().split('T')[0]
      });
      setShowModal(false);
      resetForm();
      loadExpenses();
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const resetForm = () => {
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
      </View>
      <View style={styles.expenseAmount}>
        <Text style={styles.expenseCost}>KSH {item.cost.toFixed(2)}</Text>
        <Text style={styles.expenseDate}>{item.date}</Text>
      </View>
    </View>
  );

  return (
    <Screen style={styles.container}>
      <FlatList
        data={expenses}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="clipboard-text-outline"
              size={50}
              color="#ccc"
            />
            <Text style={styles.emptyText}>No expenses recorded yet</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        refreshing={loading}
        onRefresh={loadExpenses}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowModal(true)}
      >
        <MaterialCommunityIcons name="plus" size={24} color="white" />
      </TouchableOpacity>

      <Modal visible={showModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Expense</Text>

            <Text style={styles.inputLabel}>Expense Name*</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Napier Grass"
            />

            <Text style={styles.inputLabel}>Category*</Text>
            <PickerComponent
              items={categories}
              selectedValue={selectedCategory}
              onValueChange={setSelectedCategory}
            />

            <Text style={styles.inputLabel}>Cost (KSH)*</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={cost}
              onChangeText={setCost}
              placeholder="Enter amount"
            />

            <Text style={styles.inputLabel}>Quantity (optional)</Text>
            <View style={styles.quantityContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
                placeholder="Enter quantity"
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
            />

            <Text style={styles.inputLabel}>Date*</Text>
            <Pressable onPress={() => setShowDatePicker(true)}>
              <Text style={styles.dateInput}>
                {date.toISOString().split('T')[0]}
              </Text>
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
                onPress={handleAddExpense}
                disabled={!name || !cost}
              >
                <Text style={styles.buttonText}>Save Expense</Text>
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
  listContent: {
    padding: 15,
  },
  expenseItem: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
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
  expenseAmount: {
    alignItems: "flex-end",
  },
  expenseCost: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F44336",
  },
  expenseDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
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