import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Dashboard from "../screens/Dashboard";
import AddRecordScreen from "../screens/AddRecordScreen";
import ReportsScreen from "../screens/ReportsScreen";

const Stack = createNativeStackNavigator()

const HomeNavigator = () => (
    <Stack.Navigator>
        <Stack.Screen name="Welcome" component={Dashboard} options={{headerShown: false}} />
        <Stack.Screen name="AddRecord" component={AddRecordScreen} options={{headerShown: true, title: 'Add Milking Record'}} />
        <Stack.Screen name="Reports" component={ReportsScreen} options={{headerShown: true}} />
    </Stack.Navigator>
)

export default HomeNavigator;