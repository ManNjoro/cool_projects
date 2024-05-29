import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Die({ dieValue, holdDie, isHeld, tenzies, rollLimit }) {
  const isDisabled = tenzies || rollLimit === 0;
  
  return (
    <TouchableOpacity 
      style={[
        styles.dieContainer, 
        { backgroundColor: isHeld ? "#59E391" : "#FFF", opacity: isDisabled ? 0.5 : 1 }
      ]}
      onPress={isDisabled ? null : holdDie}
      disabled={isDisabled}
    >
      <Text style={styles.dieText}>{dieValue}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  dieContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    margin: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dieText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
