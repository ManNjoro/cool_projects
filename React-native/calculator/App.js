import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import CustomButton from "./components/CustomButton";
import Calculator from "./components/Calculator";

export default function App() {
  return (
    <View className="flex-1 justify-center items-center bg-slate-100">
      <Calculator />
      <StatusBar style="auto" />
    </View>
  );
}
