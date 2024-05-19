import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import WelcomeScreen from "../screens/WelcomeScreen";
import UpcomingWeather from "../screens/UpcomingWeather";
import City from "../screens/City";

const Tab = createBottomTabNavigator();
function Tabs({ weather }) {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "grey",
        tabBarStyle: {
          backgroundColor: "lightblue",
        },
        headerStyle: {
          backgroundColor: "lightblue",
        },
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 25,
          color: "tomato",
        },
      }}
    >
      <Tab.Screen
        name="Welcome"
        options={{
          tabBarIcon: ({ focused }) => (
            <Feather
              name="droplet"
              size={25}
              color={focused ? "tomato" : "black"}
            />
          ),
        }}
      >
        {()=> <WelcomeScreen weatherData={weather.list[0]} />}
      </Tab.Screen>
      <Tab.Screen
        name="Upcoming"
        options={{
          tabBarIcon: ({ focused }) => (
            <Feather
              name="clock"
              size={25}
              color={focused ? "tomato" : "black"}
            />
          ),
        }}
      >
        {()=> <UpcomingWeather weatherData={weather.list} />}
      </Tab.Screen>
      <Tab.Screen
        name="City"
        options={{
          tabBarIcon: ({ focused }) => (
            <Feather
              name="home"
              size={25}
              color={focused ? "tomato" : "black"}
            />
          ),
        }}
      >
        {()=> <City weatherData={weather.city} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default Tabs;
