import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CowNavigator from "./CowNavigator";
import HomeNavigator from "./HomeNavigator";
import MilkRecordsNavigator from "./MilkRecordsNavigator";

const Tab = createBottomTabNavigator();
export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Cows"
        component={CowNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="cow" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Records"
        component={MilkRecordsNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="file" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
