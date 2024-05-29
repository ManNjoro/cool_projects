import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import Dice from './components/Dice';

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-100">
      <Dice />
      <StatusBar style="auto" />
    </View>
  );
}
