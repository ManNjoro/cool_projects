import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MilkRecordScreen from "../screens/MilkRecordScreen";
import CreameryRecordsScreen from "../screens/CreameryRecordsScreen";
import ProductionRecordsScreen from "../screens/ProductionRecordsScreen";

const Stack = createNativeStackNavigator()

const MilkRecordsNavigator = () => (
    <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Mainmenu" component={MilkRecordScreen} />
        <Stack.Screen name="CreameryRecords" component={CreameryRecordsScreen} options={{title: 'Creamery Milk Sales', headerShown:false}} />
        <Stack.Screen name="ProductionRecords" component={ProductionRecordsScreen} options={{title: 'Creamery Milk Sales', headerShown:false}} />
    </Stack.Navigator>
)

export default MilkRecordsNavigator;