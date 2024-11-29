import { Button, Image, StyleSheet, Text } from "react-native";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import Screen from "./Screen";
import ImageInput from "./ImageInput";
import ImageInputList from "./ImageInputList";
import ListingEditScreen from "../screens/ListingEditScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import AppButton from "./AppButton";

const Link = () => {
  const navigation = useNavigation()
  return (
    <AppButton title="Click" onPress={()=> navigation.navigate('TweetDetails')} />
  )
}

const Tweets = ({ navigation }) => (
  <Screen>
    <Text>Tweets</Text>
    <Link />
  </Screen>
);
 
const TweetDetails = () => (
  <Screen>
    <Text>Tweets</Text>    
  </Screen>
);

const Stack = createNativeStackNavigator();
const StackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Tweets" component={Tweets} />
    <Stack.Screen name="TweetDetails" component={TweetDetails} />
  </Stack.Navigator>
);

export default function Demo() {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f4f4",
    padding: 20,
    paddingTop: 100,
  },
  image: {
    width: 200,
    height: 200,
  },
});
