import {
  View,
  Text,
  FlatList,
  TouchableHighlight,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../context/GlobalProvider";
import { download, getFileMetadata, savePost } from "../lib/appwrite";

const DropDown = ({ dropDown = [], videoDetails }) => {
  const { urls, setUrls, savedIds, setSavedIds } = useGlobalContext();
  const {
    $id,
    title,
    thumbnail,
    video,
    creator: { username, avatar },
  } = videoDetails;
  const onPress = async (video, title) => {
    try {
      if (!savedIds.includes(video)) {
        setSavedIds((prevVideos) => [...prevVideos, video]);
        setUrls((prevUrls) => [...prevUrls, videoDetails]);
      }
  
      if (title.toLowerCase() === "save") {
        await savePost(savedIds); // Save the post
        Alert.alert("Success", "Post saved successfully");
      } else if (title.toLowerCase() === "download") {
        const fileId = await getFileMetadata($id);
        await download(fileId);
        console.log("fileId", fileId);
      }
    } catch (error) {
      console.error("Error saving post:", error);
      Alert.alert("Error", "Failed to save post. Please try again later.");
    }
  };
  

  // console.log("urls", savedIds);
  // console.log("hello");

  return (
    <View className="bg-primary w-[150px] border border-gray-300 rounded-md shadow-lg absolute z-50 right-2 top-8">
      <FlatList
        data={dropDown}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onPress(video, item.title)}>
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
