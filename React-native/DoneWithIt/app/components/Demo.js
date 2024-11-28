import { Button, Image, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import Screen from "./Screen";
import ImageInput from "./ImageInput";
import ImageInputList from "./ImageInputList";

export default function Demo() {
  const [imageUris, setImageUris] = useState([]);

  const handleAdd = uri => {
    setImageUris([...imageUris, uri]);
  }

  const handleRemove = uri => {
    setImageUris(imageUris.filter(imageUri => imageUri!== uri));
  }

  return (
    <Screen>
      <ImageInputList
        imageUris={imageUris}
        onAddImage={handleAdd}
        onRemoveImage={handleRemove}
      />
    </Screen>
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
