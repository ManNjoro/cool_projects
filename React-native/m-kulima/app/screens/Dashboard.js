import { StyleSheet, Text, View } from "react-native";
import Screen from "../components/Screen";
import SummaryCard from "../components/SummaryCard";

export default function Dashboard() {
  return (
    <Screen>
        <Text>Welcome to M-kulima Dashboard</Text>
      <SummaryCard title={"Total Cows"} subTitle={6} />
      <SummaryCard title={"Total Litres"} subTitle={700} />
      <SummaryCard title={"Total Sales"} subTitle={500} />
      <SummaryCard title={"Expected Salary (KSH)"} subTitle={500} />
    </Screen>
  );
}


