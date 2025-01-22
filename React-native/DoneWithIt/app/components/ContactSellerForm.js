import { Keyboard, StyleSheet, View } from 'react-native';
import messagesApi from '../api/messages';
import * as Notifications from 'expo-notifications';


Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

export default function ContactSellerForm({listing}) {
    const handleSubmit = async ({message}, {resetForm}) => {
        Keyboard.dismiss()
        const result = await messagesApi.send(message, listing.id)

        if(!result.ok) {
            console.log("Error", result)
            return Alert.alert("Error", "Could not send the message to")
        }
        resetForm()
        Notifications.scheduleNotificationAsync({
            content: {
              title: 'Awesome!',
              body: "Your message was sent to the seller",
            },
            trigger: null,
          });
    }
return (
<View style={styles.container}></View>
  );
}

const styles = StyleSheet.create({
    container: {}
});