import { StyleSheet, Text, View } from "react-native";
import Screen from "../components/Screen";

export default function Dashboard() {
  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>Total cows</Text>
        <Text style={styles.subTitle}>5</Text>
      </View>
    </Screen>
  );
}


const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        borderColor: 'gray',
        borderWidth: 1,
        fontWeight: "bold",
        width: 120,
        // height: 50
    },
    title: {
        fontSize: 20,
        textAlign: "center"
    },
    subTitle: {
        fontSize: 16,
        textAlign: "center",
        color: "gold"
    }
})