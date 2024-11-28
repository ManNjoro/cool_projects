import { Button, Image, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import Screen from "./Screen";
import ImageInput from "./ImageInput";

export default function Demo() {
  const [imageUri, setImageUri] = useState()
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted')
      alert("You need to enable permission to access the library");
  };

  useEffect(() => {
    requestPermission();
  }, []);

  const selectImage = async() => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync()
      if (!result.canceled)
        setImageUri(result.assets[0].uri)
    } catch (error) {
      console.log('Error reading an image', error)
    }
  }
  return <Screen>
    <ImageInput imageUri={imageUri} onChangeImage={(uri) => setImageUri(uri)} />
  </Screen>;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f4f4",
    padding: 20,
    paddingTop: 100,
  },
  image: {
    width: 200,
    height: 200
  }
});
