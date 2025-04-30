import { StyleSheet, Text, View } from "react-native";

export default function SummaryCard({ title, subTitle }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subTitle}>{subTitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    display: "flex",
    flexDirection: "column",
    borderColor: "gray",
    borderWidth: 1,
    fontWeight: "bold",
    width: 120,
    // height: 50
  },
  title: {
    fontSize: 20,
    textAlign: "center",
  },
  subTitle: {
    fontSize: 16,
    textAlign: "center",
    color: "gold",
  },
});
