import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker as RNPicker } from '@react-native-picker/picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Picker = ({
  items,
  selectedValue,
  onValueChange,
  placeholder = 'Select an option',
  containerStyle = {},
  icon = 'chevron-down',
}) => {
  return (
    <View style={[styles.pickerContainer, containerStyle]}>
      <RNPicker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={styles.picker}
        dropdownIconColor="#666"
      >
        {placeholder && (
          <RNPicker.Item label={placeholder} value={null} enabled={true} />
        )}
        {items.map((item) => (
          <RNPicker.Item
            key={item.value}
            label={item.label}
            value={item.value}
          />
        ))}
      </RNPicker>
      {/* <MaterialCommunityIcons
        name={icon}
        size={24}
        color="#666"
        style={styles.icon}
      /> */}
    </View>
  );
};

// Alternative Picker using Modal for better iOS experience
const ModalPicker = ({
  items,
  selectedValue,
  onValueChange,
  placeholder = 'Select an option',
  containerStyle = {},
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const selectedItem = items.find(item => item.value === selectedValue) || { label: placeholder };

  return (
    <>
      <TouchableOpacity
        style={[styles.modalPickerContainer, containerStyle]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.modalPickerText}>
          {selectedItem.label}
        </Text>
        <MaterialCommunityIcons
          name="chevron-down"
          size={24}
          color="#666"
        />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={items}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalPickerItem,
                    item.value === selectedValue && styles.selectedItem
                  ]}
                  onPress={() => {
                    onValueChange(item.value);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.modalPickerItemText}>
                    {item.label}
                  </Text>
                  {item.value === selectedValue && (
                    <MaterialCommunityIcons
                      name="check"
                      size={20}
                      color="#4CAF50"
                    />
                  )}
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  // For RNPicker
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
    overflow: 'hidden',
    position: 'relative',
  },
  picker: {
    width: '100%',
    color: '#333',
  },
  icon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },

  // For ModalPicker
  modalPickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalPickerText: {
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    maxHeight: '50%',
  },
  modalPickerItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedItem: {
    backgroundColor: '#f5f5f5',
  },
  modalPickerItemText: {
    fontSize: 16,
    color: '#333',
  },
  modalCloseButton: {
    padding: 15,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  modalCloseButtonText: {
    color: '#F44336',
    fontWeight: 'bold',
  },
});

export default Picker;
export { ModalPicker };