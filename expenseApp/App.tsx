// Importações necessárias
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/Profile';
import AddExpenseScreen from './screens/AddExpenseScreen';
import AddLimitScreen from './screens/AddLimitScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack de Autenticação
const AuthStack = () => (
  <Stack.Navigator initialRouteName="Login">
    <Stack.Screen 
      name="Login" 
      component={LoginScreen} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="Register" 
      component={RegisterScreen} 
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

// Tab Principal
const MainTab = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        switch (route.name) {
          case 'Home':
            iconName = focused ? 'home' : 'home-outline';
            break;
          case 'Profile':
            iconName = focused ? 'person' : 'person-outline';
            break;
          case 'Expense':
            iconName = focused ? 'cash' : 'cash-outline';
            break;
          case 'Limit':
            iconName = focused ? 'speedometer' : 'speedometer-outline';
            break;
          default:
            iconName = 'circle';
        }
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#007AFF', 
      tabBarInactiveTintColor: 'gray', 
      tabBarStyle: {
        backgroundColor: '#E0F7FA', 
      },
    })}
  >
    <Tab.Screen 
      name="Profile" 
      component={ProfileScreen} 
      options={{ 
        tabBarLabel: '', 
        title: 'Profile',
        headerStyle: { backgroundColor: '#E0F7FA' }, 
        headerTitleStyle: { color: '#000' }
      }} 
    />
    <Tab.Screen 
      name="Home" 
      component={HomeScreen} 
      options={{ 
        tabBarLabel: '', 
        title: 'Home',
        headerStyle: { backgroundColor: '#E0F7FA' }, 
        headerTitleStyle: { color: '#000' } 
      }} 
    />
    <Tab.Screen 
      name="Expense" 
      component={AddExpenseScreen} 
      options={{ 
        tabBarLabel: '', 
        title: 'Expense',
        headerStyle: { backgroundColor: '#E0F7FA' }, 
        headerTitleStyle: { color: '#000' } 
      }} 
    />
    <Tab.Screen 
      name="Limit" 
      component={AddLimitScreen} 
      options={{ 
        tabBarLabel: '', 
        title: 'Limit',
        headerStyle: { backgroundColor: '#E0F7FA' }, 
        headerTitleStyle: { color: '#000' } 
      }} 
    />
  </Tab.Navigator>
);

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthStack} />
        <Stack.Screen name="Main" component={MainTab} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
