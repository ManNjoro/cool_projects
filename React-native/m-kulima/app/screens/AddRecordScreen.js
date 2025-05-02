import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, Button, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { addMilkRecord, getCows } from '../db/database';
import { useIsFocused } from '@react-navigation/native';

export default function AddRecordScreen({ route, navigation }) {
    const { cowId = null, } = route?.params || {};
    const [cows, setCows] = useState([]);
    const isFocused = useIsFocused();
    const [selectedCowId, setSelectedCowId] = useState(cowId);
    const [dayTime, setDayTime] = useState('Morning');
    const [date, setDate] = useState(new Date());
    const [litres, setLitres] = useState('');
    const [notes, setNotes] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
  
    useEffect(() => {
      if(isFocused) loadCows();
    }, [cowId, isFocused]);
  
    const loadCows = async () => {
      try {
        const loadedCows = await getCows();
        setCows(loadedCows);
        if (loadedCows.length > 0 && !selectedCowId) setSelectedCowId(loadedCows[0].id);
      } catch (error) {
        Alert.alert("Please add a cow record first")
        console.error(error);
      }
    };
  
    const handleSubmit = async () => {
      if (!selectedCowId || !litres) {
        alert('Please select a cow and enter liters');
        return;
      }
  
      const record = {
        cowId: selectedCowId,
        dayTime,
        date: date.toISOString().split('T')[0],
        litres: parseFloat(litres),
        notes
      };
  
      try {
        await addMilkRecord(record);
        Alert.alert("Success", "Record added successfully")
        navigation.goBack();
      } catch (error) {
        alert('Failed to save record: ' + error.message);
      }
    };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.inputGroup}>
        <MaterialCommunityIcons name="cow" size={20} color="#4CAF50" />
        <Picker
          selectedValue={selectedCowId}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedCowId(itemValue)}
        >
          {cows.map(cow => (
            <Picker.Item 
              key={cow.id} 
              label={cow.name} 
              value={cow.id} 
            />
          ))}
        </Picker>
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
          value={litres}
          onChangeText={setLitres}
          placeholderTextColor={'gray'}
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
        title="Save Milking Record" 
        onPress={handleSubmit} 
        color="#4CAF50"
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
    fontSize: 16
  },
  picker: {
    flex: 1,
    marginLeft: 10,
  },
});