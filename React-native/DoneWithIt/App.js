import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { StatusBar } from "expo-status-bar";
import {
  Platform,
  StatusBar,
  StyleSheet,
} from "react-native";

import Screen from "./app/components/Screen";
import { useCallback, useEffect, useState } from "react";
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./app/navigation/AuthNavigator";
import navigationTheme from "./app/navigation/navigationTheme";
import AppNavigator from "./app/navigation/AppNavigator";
import OfflineNotice from "./app/components/OfflineNotice";
import AuthContext from "./app/auth/context";
import authStorage from "./app/auth/storage"

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [user, setUser] = useState()
  const [isReady, setIsReady] =useState(false)

  
  const restoreUser = async()=>{
    const user = await authStorage.getUser()
    if(user) setUser(user)
  }
  
  const prepare = ()=>{
    restoreUser()
    setIsReady(true)
  }

  useEffect(()=>{
    prepare()
  }, [])
  const onLayoutRootView = useCallback(()=>{
    if (isReady) {
      SplashScreen.hide()
    }
  }, [isReady])
  
  console.log(user)
  if(!isReady)
    return null
  console.log(isReady)
  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <AuthContext.Provider value={{user, setUser}}>

      <Screen>
        {/* <WelcomeScreen /> */}
        {/* <Demo /> */}
        <OfflineNotice />
        <NavigationContainer theme={navigationTheme}>
          {user?<AppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
      </Screen>
      </AuthContext.Provider>
    </GestureHandlerRootView>
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
