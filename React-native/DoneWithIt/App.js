import { GestureHandlerRootView } from "react-native-gesture-handler";
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
import AccountScreen from "./app/screens/AccountScreen";
import ListingsScreen from "./app/screens/ListingsScreen";
import AppTextInput from "./app/components/AppTextInput";
import AppPicker from "./app/components/AppPicker";
import Screen from "./app/components/Screen";
import { useEffect, useState } from "react";
import jwtDecode from 'jwt-decode'
import LoginScreen from "./app/screens/LoginScreen";
import ListEditScreen from "./app/screens/ListingEditScreen";
import Test from "./app/components/Test";
import ImageInput from "./app/components/ImageInput";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegisterScreen from "./app/screens/RegisterScreen";
import AuthNavigator from "./app/navigation/AuthNavigator";
import navigationTheme from "./app/navigation/navigationTheme";
import AppNavigator from "./app/navigation/AppNavigator";
import OfflineNotice from "./app/components/OfflineNotice";
import AuthContext from "./app/auth/context";
import authStorage from "./app/auth/storage"

export default function App() {
  const [user, setUser] = useState()

  const restoreToken = async()=>{
    const token = await authStorage.getToken()
    if(!token) return
    setUser(jwtDecode(token))
  }

  useEffect(()=>{
    restoreToken()
  },[])

  console.log(user)
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthContext.Provider value={{user, setUser}}>

      <Screen>
        {/* <WelcomeScreen /> */}
        {/* <Demo /> */}
        <OfflineNotice />
        <NavigationContainer theme={navigationTheme}>
          {user?<AppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
        {/* <RegisterScreen /> */}
        {/* <Test /> */}
        
        {/* <ListingDetailsScreen /> */}
        {/* <ViewImageScreen /> */}

        {/* <MessagesScreen /> */}
        {/* <AccountScreen /> */}
        {/* <ListingsScreen /> */}
        {/* <AppTextInput placeholder='Username' icon='email' /> */}
        {/* <LoginScreen /> */}
        {/* <ListEditScreen /> */}
      </Screen>
      </AuthContext.Provider>
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
