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
import { MaterialCommunityIcons } from "@expo/vector-icons";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import ViewImageScreen from "./app/screens/ViewImageScreen";
import AppText from "./app/components/AppText";
import AppButton from "./app/components/AppButton";
import Demo from "./app/components/Demo";
import ListingDetailsScreen from "./app/screens/ListingDetailsScreen";
import MessagesScreen from "./app/screens/MessagesScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  // console.log("App executed");
  // console.log(Dimensions.get("screen"));
  // const orientation = useDeviceOrientation();
  // console.log(orientation);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* <WelcomeScreen /> */}
      {/* <Demo /> */}
      {/* <ListingDetailsScreen /> */}
      {/* <ViewImageScreen /> */}

      <MessagesScreen />
    </GestureHandlerRootView>
    // <SafeAreaView style={styles.container}>
    //   <View
    //     style={{
    //       backgroundColor: "dodgerblue",
    //       width: 100,
    //       height: 100,
    //       shadowColor: "gray",
    //       shadowOffset: { width: 10, height: 10 },
    //       shadowOpacity: 1,
    //       elevation: 20,
    //       padding: 20,
    //       paddingHorizontal: 10
    //     }}
    //   >
    //     <View
    //       style={{
    //         backgroundColor: "gold",
    //         width: 50,
    //         height: 50,
    //       }}
    //     ></View>
    //   </View>
    // </SafeAreaView>
    // <View style={{
    //   flex: 1,
    //   justifyContent: "center",
    //   alignItems: "center"
    // }}>
    //   <AppButton title={'Login'} onPress={()=>console.log('pressed')} />
    // </View>
  );
}

const containerStyle = { backgroundColor: "dodgerblue" };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
