import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CowsScreen from "../screens/CowsScreen";
import CowDetailsScreen from "../screens/CowDetailsScreen";
import AddRecordScreen from "../screens/AddRecordScreen";
import CowMilkRecordsScreen from "../screens/CowMilkRecordsScreen";

const Stack = createNativeStackNavigator()

const CowNavigator = () => (
    <Stack.Navigator>
        <Stack.Screen name="CowsList" component={CowsScreen} options={{headerShown: false}} />
        <Stack.Screen name="CowDetails" component={CowDetailsScreen} options={{headerShown: true}} />
        <Stack.Screen name="AddMilkRecord" component={AddRecordScreen} options={{headerShown: true, title: 'Add Milking Record'}} />
        <Stack.Screen name="CowMilkRecords" component={CowMilkRecordsScreen} options={{headerShown: true, title: 'Cow Milk Records'}} />
    </Stack.Navigator>
)

export default CowNavigator;