import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  Alert,
  ScrollView
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { 
  addCreameryRecord, 
  getCreameryRecords, 
  updateCreameryRecord, 
  deleteCreameryRecord 
} from '../db/database';
import Screen from '../components/Screen';

const CreameryRecordsScreen = () => {
  const [records, setRecords] = useState([]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState('Morning');
  const [litres, setLitres] = useState('');
  const [price, setPrice] = useState('42');
  const [notes, setNotes] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRecords();
  }, []);

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

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSubmit = async () => {
    if (!litres || isNaN(parseFloat(litres))) {
      Alert.alert("Error", "Please enter valid litres");
      return;
    }

    try {
      const recordData = {
        dayTime: time,
        date: date.toISOString().split('T')[0],
        litres: parseFloat(litres),
        pricePerLitre: price ? parseFloat(price) : null,
        notes: notes
      };

      if (editingId) {
        await updateCreameryRecord(editingId, recordData);
        Alert.alert("Success", "Record updated successfully");
      } else {
        await addCreameryRecord(recordData);
        Alert.alert("Success", "Record added successfully");
      }

      resetForm();
      loadRecords();
    } catch (error) {
      Alert.alert("Error", "Failed to save record");
      console.error(error);
    }
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    setDate(new Date(record.date));
    setTime(record.day_time);
    setLitres(record.litres.toString());
    setPrice(record.price_per_litre?.toString() || '');
    setNotes(record.notes || '');
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
          }
        }
      ]
    );
  };

  const resetForm = () => {
    setEditingId(null);
    setDate(new Date());
    setTime('Morning');
    setLitres('');
    setPrice('');
    setNotes('');
  };

  const renderItem = ({ item }) => (
    <View style={styles.recordItem}>
      <View style={styles.recordInfo}>
        <Text style={styles.recordDate}>{item.date}</Text>
        <Text style={styles.recordTime}>{item.day_time}</Text>
        <Text style={styles.recordLitres}>{item.litres} L</Text>
        {item.price_per_litre && (
          <Text style={styles.recordPrice}>${item.price_per_litre}/L</Text>
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

  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Creamery Milk Sales</Text>
        
        <View style={styles.formContainer}>
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
          >
            <Picker.Item label="Morning" value="Morning" />
            <Picker.Item label="Afternoon" value="Afternoon" />
          </Picker>

          <TextInput
            style={styles.input}
            placeholder="Litres sold"
            value={litres}
            onChangeText={setLitres}
            keyboardType="numeric"
          />

          <TextInput
            style={styles.input}
            placeholder="Price per litre (optional)"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />

          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Notes (optional)"
            value={notes}
            onChangeText={setNotes}
            multiline
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>
                {editingId ? "Update Record" : "Add Record"}
              </Text>
            </TouchableOpacity>

            {editingId && (
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={resetForm}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recent Sales</Text>
        {loading ? (
          <Text>Loading records...</Text>
        ) : records.length > 0 ? (
          <FlatList
            data={records}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            style={styles.recordsList}
          />
        ) : (
          <Text style={styles.noRecords}>No records found</Text>
        )}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  recordItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  recordInfo: {
    flex: 1,
  },
  recordDate: {
    fontWeight: 'bold',
    color: '#333',
  },
  recordTime: {
    color: '#555',
  },
  recordLitres: {
    fontWeight: 'bold',
    color: '#2196F3',
    marginTop: 5,
  },
  recordPrice: {
    color: '#4CAF50',
  },
  recordActions: {
    flexDirection: 'row',
    gap: 15,
  },
  noRecords: {
    textAlign: 'center',
    color: '#777',
    marginTop: 20,
  },
});

export default CreameryRecordsScreen;