// import { StatusBar } from "expo-status-bar";
import {
  Alert,
  Button,
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";

import { useDeviceOrientation } from "@react-native-community/hooks";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import ViewImageScreen from "./app/screens/ViewImageScreen";

export default function App() {
  // console.log("App executed");
  console.log(Dimensions.get("screen"));
  const orientation = useDeviceOrientation();
  console.log(orientation);
  
  return (
    // <WelcomeScreen />
      // <ViewImageScreen />
    <SafeAreaView style={styles.container}>
       <View  style={{
      backgroundColor: 'dodgerblue',
      width: 100,
      height: 100,
      shadowColor: 'gray',
      shadowOffset: {width: 10, height: 10},
      shadowOpacity: 1,
      elevation: 20
    }}>

       </View>
    </SafeAreaView>
  );
}

const containerStyle = { backgroundColor: "dodgerblue" };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    alignItems: "center",
    justifyContent: "center"
  },
});
