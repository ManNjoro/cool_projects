import { View, Text, FlatList, TextInput, StyleSheet } from "react-native";
import React, { useState } from "react";
import CustomButton from "./CustomButton";

const Calculator = () => {
  const [values, setValues] = useState([
    0,
    1,
    2,
    "DEL",
    3,
    4,
    5,
    "AC",
    6,
    7,
    8,
    9,

    "-",
    "+",
    "*",
    "/",
    "=",
    ".",
    "%",
  ]);
  return (
    <View className="w-[90%] rounded-xl bg-black-200">
      <View style={styles.display} className="py-5 justify-center items-center rounded ">
        <View className="border border-yellow-400 w-[80%]">
          <TextInput
            className="text-white text-base"
            // value={query}
            placeholder="0"
            placeholderTextColor={"#cdcde0"}
            // onChangeText={(e) => setQuery(e)}
          />
        </View>
      </View>
      <View className="flex flex-col items-center justify-center p-5 w-5/5 max-w-lg">
        {/* <FlatList
        className="flex flex-row flex-wrap"
          data={values}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
              <CustomButton value={item} />
          )}
        /> */}

        <View className="flex flex-row flex-wrap justify-between">
          {values.map((value) => (
            <CustomButton key={value} value={value} />
          ))}
        </View>
      </View>
    </View>
  );
};

export default Calculator;

const styles = StyleSheet.create({
  display: {
    backgroundColor: "#FF0509",
  },
});
