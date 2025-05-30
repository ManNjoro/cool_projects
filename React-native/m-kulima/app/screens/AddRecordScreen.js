import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import AppTextInput from "../components/AppTextInput";
import { addMilkRecord, getCows } from "../db/database";

export default function AddRecordScreen({ route, navigation }) {
  const { cowId = null } = route?.params || {};
  const [cows, setCows] = useState([]);
  const isFocused = useIsFocused();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCowId, setSelectedCowId] = useState(cowId);
  const [dayTime, setDayTime] = useState("Morning");
  const [date, setDate] = useState(new Date());
  const [litres, setLitres] = useState("");
  const [notes, setNotes] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (isFocused) loadCows();
  }, [cowId, isFocused]);

  const loadCows = async () => {
    try {
      const loadedCows = await getCows();
      setCows(loadedCows);
      if (loadedCows.length > 0 && !selectedCowId)
        setSelectedCowId(loadedCows[0].id);
    } catch (error) {
      Alert.alert("Please add a cow record first");
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedCowId || !litres) {
      alert("Please select a cow and enter liters");
      return;
    }

    const record = {
      cowId: selectedCowId,
      dayTime,
      date: date.toISOString().split("T")[0],
      litres: parseFloat(litres),
      notes,
    };

    setIsSubmitting(true);
    try {
      await addMilkRecord(record);
      Alert.alert("Success", "Record added successfully");
      navigation.goBack();
    } catch (error) {
      if (error.message.includes('already exists')) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "Failed to save record");
        console.error(error);
      }
    } finally {
      setIsSubmitting(false);
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
          {cows.map((cow) => (
            <Picker.Item key={cow.id} label={cow.name} value={cow.id} />
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

      <AppTextInput
        color="#9C27B0"
        icon="bottle-tonic"
        placeholder="Liters (e.g. 5.2)"
        keyboardType="decimal-pad"
        value={litres}
        onChangeText={setLitres}
      />

      <AppTextInput
        color="#607D8B"
        icon="note"
        height={80}
        placeholder="Notes (optional)"
        multiline
        value={notes}
        onChangeText={setNotes}
      />

      <TouchableOpacity
        style={[styles.saveButton, isSubmitting && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <MaterialCommunityIcons
              name="content-save"
              size={24}
              color="white"
            />
            <Text style={styles.saveButtonText}>Save Milking Record</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    flexGrow: 1,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
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
    color: "#000",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  disabledButton: {
    backgroundColor: "#81C784",
    opacity: 0.8,
  },
});
