import { FlatList, StyleSheet, View } from "react-native";
import ListItem from "../components/ListItem";
import Screen from "../components/Screen";
import ListItemSeparator from "../components/ListItemSeparator";
import ListItemDeleteAction from "../components/ListItemDeleteAction";
import { useState } from "react";

const initialMessages = [
  {
    id: 1,
    title:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt similique, nemo impedit doloremque architecto unde ea eius facere reiciendis aliquam? Aspernatur, saepe consequuntur incidunt maxime ut possimus vero totam, libero error aliquid nesciunt. Excepturi quo voluptate deleniti neque sed ea aliquid ducimus voluptatem pariatur ut a commodi culpa dicta modi, recusandae vero minima enim adipisci sint. Ipsum natus officiis cum?",
    description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt similique, nemo impedit doloremque architecto unde ea eius facere reiciendis aliquam? Aspernatur, saepe consequuntur incidunt maxime ut possimus vero totam, libero error aliquid nesciunt. Excepturi quo voluptate deleniti neque sed ea aliquid ducimus voluptatem pariatur ut a commodi culpa dicta modi, recusandae vero minima enim adipisci sint. Ipsum natus officiis cum?",
    image: require("../assets/mosh.jpg"),
  },
  {
    id: 2,
    title: "T2",
    description: "D2",
    image: require("../assets/mosh.jpg"),
  },
];

export default function MessagesScreen() {
  const [messages, setMessages] = useState(initialMessages);
  const [refreshing, setRefreshing] = useState(false);
  const handleDelete = (message) => {
    setMessages(messages.filter((m) => m.id !== message.id));
  };
  return (
    <Screen>
      <FlatList
        data={messages}
        keyExtractor={(message) => message.id.toString()}
        renderItem={({ item }) => (
          <ListItem
            title={item.title}
            subTitle={item.description}
            image={item.image}
            onPress={() => console.log("Message selected", item)}
            renderRightActions={() => (
              <ListItemDeleteAction onPress={() => handleDelete(item)} />
            )}
          />
        )}
        ItemSeparatorComponent={ListItemSeparator}
        refreshing={refreshing}
        onRefresh={() =>
          setMessages([
            {
              id: 2,
              title: "T2",
              description: "D2",
              image: require("../assets/mosh.jpg"),
            },
          ])
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({});
