import { FlatList, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import React from "react";
import Screen from "../components/Screen";
import Card from "../components/Card";
import colors from "../config/colors";
import { useNavigation } from "@react-navigation/native";

const listings = [
  {
    id: 1,
    title: "Red jacket for sale",
    price: 100,
    image: require("../assets/jacket.jpg"),
  },
  {
    id: 2,
    title: "Couch in great condition",
    price: 1000,
    image: require("../assets/couch.jpg"),
  },
];

export default function ListingsScreen() {
  const navigation = useNavigation();
  return (
    <Screen style={styles.screen}>
      <FlatList
        data={listings}
        keyExtractor={(listing) => listing.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={()=>navigation.navigate("ListingDetails", {id: item.id})}>

          <Card
            title={item.title}
            subTitle={"$" + item.price}
            image={item.image}
            />
            </TouchableOpacity>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
    screen: {
        padding: 20,
        backgroundColor: colors.light
    }
});
