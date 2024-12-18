import { Platform, StyleSheet } from "react-native";
import colors from "./colors";
export default {
  text: {
    color: colors.dark,
    fontSize: 18,
    width: '100%',
    ...Platform.select({
      ios: {
        fontFamily: "Avenir",
      },
      android: {
        fontFamily: "Roboto",
      },
    }),
  },
};
