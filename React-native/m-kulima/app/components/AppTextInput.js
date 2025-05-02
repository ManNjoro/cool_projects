import { StyleSheet, TextInput, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function AppTextInput({
  icon,
  color,
  height = "auto",
  ...otherProps
}) {
  return (
    <View style={styles.inputGroup}>
      <MaterialCommunityIcons name={icon} size={20} color={color} />
      <TextInput
        style={[styles.input, { height }]}
        placeholderTextColor={"gray"}
        {...otherProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
});
