import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MilkRecordScreen from "../screens/MilkRecordScreen";

const Stack = createNativeStackNavigator()

const MilkRecordsNavigator = () => (
    <Stack.Navigator>
        <Stack.Screen name="Mainmenu" component={MilkRecordScreen} />
    </Stack.Navigator>
)

export default MilkRecordsNavigator;