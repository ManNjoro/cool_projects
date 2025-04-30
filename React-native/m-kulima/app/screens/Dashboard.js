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
        borderRadius: 10,
        display: flex,
        flexDirection: "column"
    },
    title: {
        fontSize: 16
    },
    subTitle: {
        fontSize: 10
    }
})