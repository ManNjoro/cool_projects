import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import TicTacToe from './components/TicTacToe';

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-50">
      <TicTacToe />
      <StatusBar style="auto" />
    </View>
  );
}

