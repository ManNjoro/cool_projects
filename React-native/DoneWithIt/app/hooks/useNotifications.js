import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import expoPushTokensApi from "../api/expoPushTokens";


Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
export default useNotifications= (notificationListenerParam) => {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [channels, setChannels] = useState([]);
    const [notification, setNotification] = useState(
      undefined
    );
    const notificationListener = useRef();
    const responseListener = useRef();
  
    async function schedulePushNotification() {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "You've got mail! 📬",
          body: 'Here is the notification body',
          data: { data: 'goes here', test: { test1: 'more data' } },
        },
        trigger: {
          type: SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 2,
        },
      });
    }
    
    async function registerForPushNotificationsAsync() {
      let token;
    
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('myNotificationChannel', {
          name: 'A channel is needed for the permissions prompt to appear',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          alert('Failed to get push token for push notification!');
          return;
        }
        // Learn more about projectId:
        // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
        // EAS projectId is used here.
        try {
          const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
          if (!projectId) {
            throw new Error('Project ID not found');
          }
          token = (
            await Notifications.getExpoPushTokenAsync({
              projectId,
            })
          ).data;
          expoPushTokensApi.register(token)
        } catch (e) {
          token = `${e}`;
        }
      } else {
        alert('Must use physical device for Push Notifications');
      }
    
      return token;
    }
  
    useEffect(() => {
      registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));
  
      if (Platform.OS === 'android') {
        Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
      }
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
      });
  
      if (notificationListenerParam)
        responseListener.current = Notifications.addNotificationResponseReceivedListener(notificationListenerParam);
  
      return () => {
        notificationListener.current &&
          Notifications.removeNotificationSubscription(notificationListener.current);
        responseListener.current &&
          Notifications.removeNotificationSubscription(responseListener.current);
      };
    }, []);
}