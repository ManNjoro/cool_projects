import {
  View,
  Text,
  FlatList,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const DropDown = ({ dropDown = [], videoDetails }) => {
    const [urls, setUrls] = useState([])
    const [saved, setSaved] = useState(false)
    const {title, thumbnail, video, creator: { username, avatar }} = videoDetails
    const onPress = (id) =>{
        if(!saved)
            setUrls((prevUrls) => [...prevUrls, videoDetails])
            setSaved(true)
    }
    console.log(urls);

  return (
    <View className="bg-primary w-[150px] border border-gray-300 rounded-md shadow-lg absolute z-50 right-2 top-8">
      <FlatList
        data={dropDown}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={onPress}>
            <View className="p-2 border-b border-gray-100 last:border-b-0">
              <Text className="text-white font-medium">{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default DropDown;
