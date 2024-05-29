import React from "react";
import { Text, View } from "react-native";

export default function Die({ dieValue, holdDie, isHeld, tenzies, rollLimit }) {
  const isDisabled = tenzies || rollLimit === 0;

  return (
    <View
      style={[
        {
          backgroundColor: isHeld ? "#59E391" : "#FFF",
          opacity: isDisabled ? 0.5 : 1,
        },
      ]}
      className="justify-center items-center px-3 py-2 m-2 border border-gray-100 rounded-md"
      onTouchStart={isDisabled ? null : holdDie}
      disabled={isDisabled}
    >
      <Text className="text-2xl font-bold">{dieValue}</Text>
    </View>
  );
}
