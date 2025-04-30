import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Button, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addMilkRecord } from '../database';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function AddRecordScreen({ navigation }) {
  const [cowName, setCowName] = useState('');
  const [dayTime, setDayTime] = useState('Morning');
  const [date, setDate] = useState(new Date());
  const [liters, setLiters] = useState('');
  const [notes, setNotes] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = async () => {
    const record = {
      cowName,
      dayTime,
      date: date.toISOString().split('T')[0], // Format as YYYY-MM-DD
      liters: parseFloat(liters),
      notes
    };

    try {
      await addMilkRecord(record);
      navigation.goBack();
    } catch (error) {
      alert('Failed to save record: ' + error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.inputGroup}>
        <MaterialCommunityIcons name="cow" size={20} color="#4CAF50" />
        <TextInput
          style={styles.input}
          placeholder="Cow's Name (e.g. Daisy)"
          value={cowName}
          onChangeText={setCowName}
        />
      </View>

      <View style={styles.inputGroup}>
        <MaterialCommunityIcons name="clock" size={20} color="#2196F3" />
        <Picker
          selectedValue={dayTime}
          style={styles.picker}
          onValueChange={(itemValue) => setDayTime(itemValue)}
        >
          <Picker.Item label="Morning" value="Morning" />
          <Picker.Item label="Afternoon" value="Afternoon" />
          <Picker.Item label="Evening" value="Evening" />
        </Picker>
      </View>

      <View style={styles.inputGroup}>
        <MaterialCommunityIcons name="calendar" size={20} color="#FF9800" />
        <Button 
          title={date.toDateString()} 
          onPress={() => setShowDatePicker(true)} 
          color="#666"
        />
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}
      </View>

      <View style={styles.inputGroup}>
        <MaterialCommunityIcons name="bottle-tonic" size={20} color="#9C27B0" />
        <TextInput
          style={styles.input}
          placeholder="Liters (e.g. 5.2)"
          keyboardType="decimal-pad"
          value={liters}
          onChangeText={setLiters}
        />
      </View>

      <View style={styles.inputGroup}>
        <MaterialCommunityIcons name="note" size={20} color="#607D8B" />
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Notes (optional)"
          multiline
          value={notes}
          onChangeText={setNotes}
        />
      </View>

      <Button 
        title="Save Record" 
        onPress={handleSubmit} 
        color="#4CAF50"
        disabled={!cowName || !liters}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    flexGrow: 1,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  picker: {
    flex: 1,
    marginLeft: 10,
  },
});