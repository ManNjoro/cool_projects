import { Button, StyleSheet } from "react-native";
import NetInfo, {useNetInfo} from '@react-native-community/netinfo'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import Screen from "./Screen";


Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
export default function Demo() {
  async function schedulePushNotification() {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "You've got mail! 📬",
            body: 'Here is the notification body',
            data: { data: 'goes here', test: { test1: 'more data' } },
          },
          // trigger: null,
          trigger: {
            seconds: 2,
          },
        });
      }
  return (
    <Screen>
      <Button title="Tap me" onPress={schedulePushNotification} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  
});
