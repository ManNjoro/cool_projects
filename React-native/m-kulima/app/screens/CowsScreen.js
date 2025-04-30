import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getCows, addCow, initDatabase } from '../database';

export default function CowsScreen({ navigation }) {
  const [cows, setCows] = useState([]);
  const [newCowName, setNewCowName] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load cows from database
  const loadCows = async () => {
    try {
      const cowsData = await getCows();
      setCows(cowsData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load cows: ' + error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initialize and load data on first render
  useEffect(() => {
    const initialize = async () => {
      await initDatabase();
      await loadCows();
    };
    initialize();
  }, []);

  // Handle adding a new cow
  const handleAddCow = async () => {
    if (!newCowName.trim()) {
      Alert.alert('Error', 'Cow name cannot be empty');
      return;
    }

    try {
      await addCow({ name: newCowName.trim() });
      setNewCowName('');
      await loadCows(); // Refresh the list
    } catch (error) {
      Alert.alert('Error', 'Failed to add cow: ' + error.message);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCows();
  };

  // Render each cow item
  const renderCowItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.cowItem}
      onPress={() => navigation.navigate('CowDetails', { cowId: item.id })}
    >
      <MaterialCommunityIcons name="cow" size={24} color="#4CAF50" />
      <View style={styles.cowInfo}>
        <Text style={styles.cowName}>{item.name}</Text>
        <Text style={styles.cowStatus}>{item.status}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color="#888" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading cows...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Add Cow Form */}
      <View style={styles.addForm}>
        <TextInput
          style={styles.input}
          placeholder="Enter cow name"
          value={newCowName}
          onChangeText={setNewCowName}
          onSubmitEditing={handleAddCow}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddCow}>
          <MaterialCommunityIcons name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Cows List */}
      <FlatList
        data={cows}
        renderItem={renderCowItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No cows found. Add your first cow!</Text>
        }
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addForm: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    elevation: 2,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    elevation: 2,
  },
  listContent: {
    paddingBottom: 20,
  },
  cowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    elevation: 1,
  },
  cowInfo: {
    flex: 1,
    marginLeft: 15,
  },
  cowName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cowStatus: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});