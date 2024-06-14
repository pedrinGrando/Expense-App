// screens/HomeScreen.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';

const HomeScreen: React.FC = () => {
  const [scenario, setScenario] = React.useState<'saved' | 'notSaved' | 'noExpenses'>('noExpenses');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('authenticatedUser');
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          setUser(parsedUserData);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        Alert.alert('Erro', 'Não foi possível carregar os dados do usuário.');
      }
    };

    loadUserData();
  }, []);

  const renderScenario = () => {
    switch (scenario) {
      case 'saved':
        return <Text style={styles.scenarioText}>Congratulations! You've saved money this month!</Text>;
      case 'notSaved':
        return <Text style={styles.scenarioText}>Unfortunately, you didn't save money this month.</Text>;
      case 'noExpenses':
      default:
        return <Text style={styles.scenarioText}>You have no expenses recorded yet.</Text>;
    }
  };

  return (
    <View style={styles.container}>
      Hello, {user.name}!
      <View style={styles.buttonContainer}>
        
      </View>
      <View>
        <Button title="Logout"/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#E0F7FA', // Azul muito claro
  },
  scenarioText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  }
});

export default HomeScreen;
