import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Dashboard from "../screens/Dashboard";
import AddRecordScreen from "../screens/AddRecordScreen";

const Stack = createNativeStackNavigator()

const HomeNavigator = () => (
    <Stack.Navigator>
        <Stack.Screen name="Welcome" component={Dashboard} options={{headerShown: false}} />
        <Stack.Screen name="Add Record" component={AddRecordScreen} options={{headerShown: true}} />
    </Stack.Navigator>
)

export default HomeNavigator;