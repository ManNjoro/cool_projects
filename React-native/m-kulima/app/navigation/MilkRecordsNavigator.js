import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MilkRecordScreen from "../screens/MilkRecordScreen";
import CreameryRecordsScreen from "../screens/CreameryRecordsScreen";

const Stack = createNativeStackNavigator()

const MilkRecordsNavigator = () => (
    <Stack.Navigator>
        <Stack.Screen name="Mainmenu" component={MilkRecordScreen} />
        <Stack.Screen name="CreameryRecords" component={CreameryRecordsScreen} options={{title: 'Creamery Milk Sales', headerShown:false}} />
    </Stack.Navigator>
)

export default MilkRecordsNavigator;