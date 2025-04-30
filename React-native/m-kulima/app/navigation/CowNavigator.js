import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CowsScreen from "../screens/CowsScreen";
import CowDetailsScreen from "../screens/CowDetailsScreen";
import AddRecordScreen from "../screens/AddRecordScreen";

const Stack = createNativeStackNavigator()

const CowNavigator = () => (
    <Stack.Navigator>
        <Stack.Screen name="CowsList" component={CowsScreen} options={{headerShown: false}} />
        <Stack.Screen name="CowDetails" component={CowDetailsScreen} options={{headerShown: false}} />
        <Stack.Screen name="AddMilkRecord" component={AddRecordScreen} options={{headerShown: true, title: 'Add Milking Record'}} />
    </Stack.Navigator>
)

export default CowNavigator;