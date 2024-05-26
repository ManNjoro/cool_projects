import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import Float from "../components/Float";
import Card from "../components/Card";

export default function App() {
  return (
    <View className="flex-1 relative">
      <StatusBar style="auto" backgroundColor="#fde321" />
      <Card />
      <View className="absolute right-5 bottom-10">
        <Link href="/note">
          <Float />
        </Link>
      </View>
    </View>
  );
}
