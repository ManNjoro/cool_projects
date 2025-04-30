import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function SummaryCard({ title, subTitle, icon, color, unit }) {
  return (
    <View style={[styles.container, { borderLeftColor: color }]}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subTitle}>
        {subTitle} 
        {unit && <Text style={styles.unit}> {unit}</Text>}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    flex: 1,
    marginHorizontal: 5,
    borderLeftWidth: 4,
    elevation: 2,
  },
  iconContainer: {
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  unit: {
    fontSize: 14,
    color: '#888',
  },
});