import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ForgetScreen from './screens/ForgetScreen';
import DashboardScreen from './screens/DashboardScreen';
import CreateListScreen from './screens/CreateListScreen';
import SettingsScreen from './screens/SettingsScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from "react-native-vector-icons/Ionicons";
import CurrentListScreen from './screens/CurrentListScreen';
import SelectStoreScreen  from './screens/SelectStoreScreen';
import UpdateScreen from './screens/UpdateScreen';
import CommentScreen from './screens/CommentScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return(
    <Tab.Navigator 
    initialRouteName='Home'
    screenOptions={
      { headerShown: false}}>
      <Tab.Screen name="Home" component={DashboardScreen} options={{
      tabBarIcon: ({focused}) => (
        <View>
          <Icon name='home' size={20} style={styles.icons}></Icon>
        </View>
      )}}/>
      <Tab.Screen name="Create" component={CreateListScreen} options={{
      tabBarIcon: ({focused}) => (
        <View>
          <Icon name='list-outline' size={20} style={styles.icons}></Icon>
        </View>
      )}}/>
      <Tab.Screen name="Update" component={UpdateScreen} options={{
      tabBarIcon: ({focused}) => (
        <View>
          <Icon name='barcode-outline' size={20} style={styles.icons}></Icon>
        </View>
      )}} />
      <Tab.Screen name="Saved" component={CreateListScreen} options={{
      tabBarIcon: ({focused}) => (
        <View>
          <Icon name='bookmark-outline' size={20} style={styles.icons}></Icon>
        </View>
      )}} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{
      tabBarIcon: ({focused}) => (
        <View>
          <Icon name='settings-outline' size={20} style={styles.icons}></Icon>
        </View>
      )}} />
    </Tab.Navigator>
  );
}
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Tabs" component={HomeTabs} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgetPass" component={ForgetScreen} />
        <Stack.Screen name="CreateList" component={CreateListScreen} />
        <Stack.Screen name="CurrentList" component={CurrentListScreen} />
        <Stack.Screen name="SelectStore" component={SelectStoreScreen} />
        <Stack.Screen name="CommentScreen" component={CommentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
