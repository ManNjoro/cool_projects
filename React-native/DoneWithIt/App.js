import { StatusBar } from "expo-status-bar";
import {
  Alert,
  Button,
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";

import { useDeviceOrientation } from "@react-native-community/hooks"

export default function App() {
  // console.log("App executed");
  // console.log(Dimensions.get("screen"));
  // const orientation = useDeviceOrientation();
  return (
    <View style={{
      backgroundColor: "#fff",
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      alignItems:"center"
    }}>
      <View style={{
        backgroundColor:"dodgerblue",
        width: 100,
        height: 100,
        // alignSelf: "flex-start"
      }}/>
      <View style={{
        backgroundColor:"gold",
        width: 100,
        height: 100,
      }}/>
      <View style={{
        backgroundColor:"tomato",
        width: 100,
        height: 100,
      }}/>
    </View>
    // <View style={styles.container}>
    //   <View style={{
    //     backgroundColor: "dodgerblue",
    //     width: "100%",
    //     height: orientation === "landscape" ? "100%":"30%", 
    //   }}></View>
    // </View>

    // <SafeAreaView style={[styles.container, containerStyle]}>
    //   <Text numberOfLines={1} onPress={() => console.log("Text clicked")}>
    //     Hello world. Lorem ipsum dolor sit amet consectetur adipisicing elit.
    //     Illum suscipit id illo provident labore neque ea culpa rerum et,
    //     reprehenderit sapiente corporis eaque quam nisi facilis hic ex
    //     dignissimos cupiditate?
    //   </Text>
    //   <TouchableHighlight onPress={() => console.log("Image clicked")}>
    //     <Image
    //       source={require("./assets/icon.png")}
    //       style={{ width: 200, height: 200 }}
    //     />
    //   </TouchableHighlight>
    //   <TouchableNativeFeedback onPress={() => console.log("Native feedback")}>
    //     <View
    //       style={{ width: 200, height: 70, backgroundColor: "dodgerblue" }}
    //     ></View>
    //   </TouchableNativeFeedback>
    //   <Button
    //     onPress={() => {
    //       Alert.alert("My title", "Alert component", [
    //         {
    //           text: "Yes",
    //           onPress: () => console.log("Yes")
    //         },
    //         {
    //           text: "No",
    //           onPress: () => console.log("No")
    //         },
    //       ]);
    //       // Alert.prompt("My title", "Alert component", (text) =>
    //       //   console.log(text)
    //       // );
    //     }}
    //     title="Press Me"
    //   />
    //   <StatusBar style="auto" />
    // </SafeAreaView>
  );
}

const containerStyle = {backgroundColor: "dodgerblue"}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center"
    // paddingTop: Platform.OS === "android" ? 20 : 0
  },
});
