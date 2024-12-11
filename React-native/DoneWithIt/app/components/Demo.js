import { Button, StyleSheet } from "react-native";
import NetInfo, {useNetInfo} from '@react-native-community/netinfo'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Demo() {
  const storeData = async () => {
    try{
      await AsyncStorage.setItem('person', JSON.stringify({id: 1}))
      const value = await AsyncStorage.getItem('person')
      const person = JSON.parse(value)
      console.log(person)
    } catch (error) {
      console.log(error)
    }
  }
  storeData()
  return (
    null
  );
}

const styles = StyleSheet.create({
  
});
