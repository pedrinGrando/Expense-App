// Importações necessárias
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity, View } from 'react-native';

// Importações das telas
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/Profile';
import AddExpenseScreen from './screens/AddExpenseScreen';
import AddLimitScreen from './screens/AddLimitScreen';
import ExpenseHistory from './screens/ExpenseHistory';
import HistoricoLimitsScreen from './screens/LimitHistory';

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

const headerIcons = (navigation: any) => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <TouchableOpacity onPress={() => navigation.navigate('HistoricoExpense')}>
      <Icon name="document-text-outline" size={25} color="#000" style={{ marginRight: 15 }} />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('HistoricoLimits')}>
      <Icon name="document-attach-outline" size={25} color="#000" />
    </TouchableOpacity>
  </View>
);

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
      options={({ navigation }) => ({ 
        tabBarLabel: '', 
        title: 'Perfil',
        headerStyle: { backgroundColor: '#E0F7FA' }, 
        headerTitleStyle: { color: '#000' },
        headerRight: () => headerIcons(navigation), 
      })} 
    />
    <Tab.Screen 
      name="Home" 
      component={HomeScreen} 
      options={({ navigation }) => ({ 
        tabBarLabel: '', 
        title: 'Home',
        headerStyle: { backgroundColor: '#E0F7FA' }, 
        headerTitleStyle: { color: '#000' },
        headerRight: () => headerIcons(navigation), 
      })} 
    />
    <Tab.Screen 
      name="Expense" 
      component={AddExpenseScreen} 
      options={({ navigation }) => ({ 
        tabBarLabel: '', 
        title: 'Despesa',
        headerStyle: { backgroundColor: '#E0F7FA' }, 
        headerTitleStyle: { color: '#000' },
        headerRight: () => headerIcons(navigation), 
      })} 
    />
    <Tab.Screen 
      name="Limit" 
      component={AddLimitScreen} 
      options={({ navigation }) => ({ 
        tabBarLabel: '', 
        title: 'Limite',
        headerStyle: { backgroundColor: '#E0F7FA' }, 
        headerTitleStyle: { color: '#000' },
        headerRight: () => headerIcons(navigation), 
      })} 
    />
  </Tab.Navigator>
);

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthStack} />
        <Stack.Screen name="Main" component={MainTab} />
        <Stack.Screen 
          name="HistoricoExpense" 
          component={ExpenseHistory} 
          options={({ navigation }) => ({
            title: 'Histórico de Despesas',
            headerStyle: { backgroundColor: '#E0F7FA' },
            headerTitleStyle: { color: '#000' },
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
                <Icon name="arrow-back-outline" size={25} color="#000" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen 
          name="HistoricoLimits" 
          component={HistoricoLimitsScreen} 
          options={({ navigation }) => ({
            title: 'Histórico de Limites',
            headerStyle: { backgroundColor: '#E0F7FA' },
            headerTitleStyle: { color: '#000' },
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
                <Icon name="arrow-back-outline" size={25} color="#000" />
              </TouchableOpacity>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
