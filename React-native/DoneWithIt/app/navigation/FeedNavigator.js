import { createStackNavigator } from "@react-navigation/stack";

const { default: ListingsScreen } = require("../screens/ListingsScreen");
const {
  default: ListingDetailsScreen,
} = require("../screens/ListingDetailsScreen");

const Stack = createStackNavigator();

const FeedNavigator = () => (
  <Stack.Navigator screenOptions={{
    presentation: 'modal',
    animation: 'slide_from_bottom',
    headerShown: false,
    gestureDirection: 'vertical',
    gestureEnabled: true,
  }}>
    <Stack.Screen
      name="Listings"
      component={ListingsScreen}
    />
    <Stack.Screen name="ListingDetails" component={ListingDetailsScreen} />
  </Stack.Navigator>
);

export default FeedNavigator;
