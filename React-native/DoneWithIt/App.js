import { StatusBar } from "expo-status-bar";
import { Button, Image, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";

export default function App() {
  // console.log("App executed");
  return (
    <SafeAreaView style={styles.container}>
      <Text numberOfLines={1} onPress={() => console.log("Text clicked")}>
        Hello world. Lorem ipsum dolor sit amet consectetur adipisicing elit.
        Illum suscipit id illo provident labore neque ea culpa rerum et,
        reprehenderit sapiente corporis eaque quam nisi facilis hic ex
        dignissimos cupiditate?
      </Text>
      {/* <Image source={require('./assets/icon.png')} /> */}
      <Button
        onPress={() => {
          alert("You tapped the button!");
        }}
        title="Press Me"
      />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
