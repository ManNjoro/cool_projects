const {
  createNativeStackNavigator,
} = require("@react-navigation/native-stack");
const { default: ListingsScreen } = require("../screens/ListingsScreen");
const {
  default: ListingDetailsScreen,
} = require("../screens/ListingDetailsScreen");

const Stack = createNativeStackNavigator();

const FeedNavigator = () => (
  <Stack.Navigator screenOptions={{
    presentation: 'modal',
    animation: 'slide_from_bottom',
    animationTypeForReplace: 'pop',
    headerShown: false,
    gestureDirection: 'vertical-inverted',
    gestureEnabled: true,
    // gestureResponseDistance: 140
  }}>
    <Stack.Screen
      name="Listings"
      component={ListingsScreen}
    />
    <Stack.Screen name="ListingDetails" component={ListingDetailsScreen} />
  </Stack.Navigator>
);

export default FeedNavigator;
