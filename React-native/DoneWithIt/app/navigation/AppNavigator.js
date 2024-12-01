import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import ListingsScreen from '../screens/ListingsScreen'
import ListingEditScreen from '../screens/ListingEditScreen'
import AccountScreen from '../screens/AccountScreen'
import FeedNavigator from './FeedNavigator'
import AccountNavigator from './AccountNavigator'

const Tab = createBottomTabNavigator()

const AppNavigator = () => (
    <Tab.Navigator screenOptions={{
        headerShown: false
    }} >
        <Tab.Screen name='Feed' component={FeedNavigator} />
        <Tab.Screen name='ListingEdit' component={ListingEditScreen} />
        <Tab.Screen name='Account' component={AccountNavigator} />
    </Tab.Navigator>
)

export default AppNavigator