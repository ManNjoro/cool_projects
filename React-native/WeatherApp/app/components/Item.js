import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "../config/colors";
import { WeatherType } from "../utilities/WeatherType";
import moment from "moment/moment";

const Item = (props) => {
  const { dt_txt, min, max, condition } = props;
  const { date, dateTextWrapper, item, temp } = styles;
  return (
    <View style={item}>
      <Feather name={WeatherType[condition].icon} size={50} color={"white"} />
      <View style={dateTextWrapper}>
        <Text style={date}>{moment(dt_txt).format("dddd")}</Text>
        <Text style={date}>{moment(dt_txt).format("h:mm:ss a")}</Text>
      </View>
      <Text style={temp}>{`${Math.round(min)}/${Math.round(max)}°`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderWidth: 5,
    backgroundColor: 'indianred',
  },
  temp: {
    color: "white",
    fontSize: 20,
  },
  date: {
    color: "white",
    fontSize: 15,
  },
  dateTextWrapper: {
    flexDirection: "column",
  },
});
export default Item;
