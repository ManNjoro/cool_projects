import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Screen from '../components/Screen';
import {
  getDailyProductionSummary,
  getMilkRecordsByDateRange
} from '../db/database';

const ProductionRecordsScreen = ({ navigation }) => {
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [viewMode, setViewMode] = useState('daily'); // 'daily' or 'detailed'
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadProductionData();
  }, [startDate, endDate, viewMode]);

  const handleRefresh = async () => {
    setLoading(true);
    await loadProductionData();
  };
  const loadProductionData = async () => {
    try {
      setLoading(true);
      
      if (viewMode === 'daily') {
        const summaryData = await getDailyProductionSummary(startDate, endDate);
        setSummary(summaryData);
      } else {
        const recordsData = await getMilkRecordsByDateRange(startDate, endDate);
        setRecords(recordsData);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load production data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate.toISOString().split('T')[0]);
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate.toISOString().split('T')[0]);
    }
  };

  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const renderSummaryItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.summaryItem}
      onPress={() => {
        setStartDate(item.date);
        setEndDate(item.date);
        setViewMode('detailed');
      }}
    >
      <Text style={styles.summaryDate}>{item.date}</Text>
      <View style={styles.summaryValues}>
        <Text style={styles.summaryTotal}>{item.total_litres} L</Text>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#888" />
      </View>
    </TouchableOpacity>
  );

  const renderRecordItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.recordItem}
      onPress={() => {
        setSelectedRecord(item);
        setShowDetailModal(true);
      }}
    >
      <View style={styles.recordInfo}>
        <Text style={styles.recordDate}>{item.date}</Text>
        <Text style={styles.recordTime}>{item.day_time}</Text>
        <Text style={styles.recordCow}>{item.cow_name}</Text>
      </View>
      <View style={styles.recordValues}>
        <Text style={styles.recordLitres}>{item.litres} L</Text>
        {item.cow_daily_total && (
          <Text style={styles.dailyTotal}>(Daily: {item.cow_daily_total} L)</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderDetailModal = () => (
    <Modal
      visible={showDetailModal}
      animationType="slide"
      onRequestClose={() => setShowDetailModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Milk Production Details</Text>
          <TouchableOpacity onPress={() => setShowDetailModal(false)}>
            <MaterialCommunityIcons name="close" size={24} color="#555" />
          </TouchableOpacity>
        </View>
        
        {selectedRecord && (
          <ScrollView contentContainerStyle={styles.modalContent}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date:</Text>
              <Text style={styles.detailValue}>{selectedRecord.date}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Time:</Text>
              <Text style={styles.detailValue}>{selectedRecord.day_time}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Cow:</Text>
              <Text style={styles.detailValue}>{selectedRecord.cow_name}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Session Litres:</Text>
              <Text style={styles.detailValue}>{selectedRecord.litres} L</Text>
            </View>
            {selectedRecord.cow_daily_total && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Daily Total:</Text>
                <Text style={styles.detailValue}>{selectedRecord.cow_daily_total} L</Text>
              </View>
            )}
            {selectedRecord.notes && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Notes:</Text>
                <Text style={styles.detailValue}>{selectedRecord.notes}</Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </Modal>
  );

  return (
    <Screen style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Milk Production Records</Text>
        
        <View style={styles.viewToggle}>
          <TouchableOpacity 
            style={[styles.toggleButton, viewMode === 'daily' && styles.activeToggle]}
            onPress={() => setViewMode('daily')}
          >
            <Text style={[styles.toggleText, viewMode === 'daily' && styles.activeToggleText]}>
              Daily Summary
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleButton, viewMode === 'detailed' && styles.activeToggle]}
            onPress={() => setViewMode('detailed')}
          >
            <Text style={[styles.toggleText, viewMode === 'detailed' && styles.activeToggleText]}>
              Detailed View
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <MaterialCommunityIcons 
            name="filter" 
            size={24} 
            color={showFilters ? '#4CAF50' : '#555'} 
          />
          <Text style={styles.filterButtonText}>
            {startDate || endDate ? 'Filters Applied' : 'Filters'}
          </Text>
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filterContainer}>
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Date Range:</Text>
            <View style={styles.dateRangeContainer}>
              <TouchableOpacity 
                style={styles.dateInput}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Text>{startDate || 'Start Date'}</Text>
                <MaterialCommunityIcons name="calendar" size={20} color="#555" />
              </TouchableOpacity>
              <Text style={styles.dateRangeSeparator}>to</Text>
              <TouchableOpacity 
                style={styles.dateInput}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Text>{endDate || 'End Date'}</Text>
                <MaterialCommunityIcons name="calendar" size={20} color="#555" />
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

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : viewMode === 'daily' ? (
        summary?.length > 0 ? (
          <FlatList
            data={summary}
            renderItem={renderSummaryItem}
            keyExtractor={item => item.date}
            contentContainerStyle={styles.listContent}
            refreshing={loading}
          onRefresh={handleRefresh}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="database-remove" size={50} color="#888" />
            <Text style={styles.emptyText}>No production data found</Text>
          </View>
        )
      ) : records.length > 0 ? (
        <FlatList
          data={records}
          renderItem={renderRecordItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshing={loading}
          onRefresh={handleRefresh}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="database-remove" size={50} color="#888" />
          <Text style={styles.emptyText}>No records found</Text>
        </View>
      )}

      {renderDetailModal()}
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  viewToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 3,
  },
  toggleButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  activeToggle: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleText: {
    color: '#666',
    fontWeight: '600',
  },
  activeToggleText: {
    color: '#4CAF50',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginTop: 10,
  },
  filterButtonText: {
    marginLeft: 5,
    color: '#555',
    fontWeight: '500',
  },
  filterContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  filterLabel: {
    width: 100,
    fontWeight: 'bold',
    color: '#555',
  },
  dateRangeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateInput: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    backgroundColor: 'white',
  },
  dateRangeSeparator: {
    marginHorizontal: 5,
    color: '#555',
  },
  clearFiltersButton: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5,
  },
  clearFiltersText: {
    color: '#555',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 15,
    paddingBottom: 80,
  },
  summaryItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
  },
  summaryDate: {
    fontWeight: 'bold',
    color: '#333',
  },
  summaryValues: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryTotal: {
    fontWeight: 'bold',
    color: '#2196F3',
    marginRight: 10,
  },
  recordItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
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
    fontSize: 14,
  },
  recordCow: {
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
  },
  recordLitres: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#555',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContent: {
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  detailLabel: {
    width: 100,
    fontWeight: 'bold',
    color: '#555',
  },
  detailValue: {
    flex: 1,
    color: '#333',
  },
  recordValues: {
    alignItems: 'flex-end',
  },
  dailyTotal: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

export default ProductionRecordsScreen;