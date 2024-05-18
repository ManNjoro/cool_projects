import WelcomeScreen from "./app/screens/WelcomeScreen";
import UpcomingWeather from "./app/screens/UpcomingWeather";
import City from "./app/screens/City";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Welcome" component={<WelcomeScreen />} />
        <Tab.Screen name="Upcoming" component={<UpcomingWeather />} />
        <Tab.Screen name="City" component={<City />} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

