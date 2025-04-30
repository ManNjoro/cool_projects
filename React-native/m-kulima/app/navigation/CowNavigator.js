import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CowsScreen from "../screens/CowsScreen";
import CowDetailsScreen from "../screens/CowDetailsScreen";

const Stack = createNativeStackNavigator()

const CowNavigator = () => (
    <Stack.Navigator>
        <Stack.Screen name="CowsList" component={CowsScreen} options={{headerShown: false}} />
        <Stack.Screen name="CowDetails" component={CowDetailsScreen} options={{headerShown: false}} />
    </Stack.Navigator>
)

export default CowNavigator;