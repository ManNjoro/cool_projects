import { ScrollView, StyleSheet, View } from "react-native";
import ImageInput from "./ImageInput";
import { useRef } from "react";

export default function ImageInputList({
  imageUris = [],
  onRemoveImage,
  onAddImage,
}) {
  const scrollView = useRef();

  return (
    <View>
      <ScrollView
        ref={scrollView}
        horizontal
        onContentSizeChange={() => scrollView.current.scrollToEnd()}
      >
        <View style={styles.container}>
          {imageUris.map((uri) => (
            <ImageInput
              imageUri={uri}
              key={uri}
              onChangeImage={() => onRemoveImage(uri)}
            />
          ))}
          <ImageInput onChangeImage={(uri) => onAddImage(uri)} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
});
