import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Dashboard from "../screens/Dashboard";
import CowsScreen from "../screens/CowsScreen";

const Tab = createBottomTabNavigator();
export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Welcome"
        component={Dashboard}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Cows"
        component={CowsScreen}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="cow" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
