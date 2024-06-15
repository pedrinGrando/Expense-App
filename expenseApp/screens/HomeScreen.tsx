import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker'; 

const HomeScreen: React.FC = () => {
  const [scenario, setScenario] = React.useState<'saved' | 'notSaved' | 'noExpenses'>('noExpenses');
  const [user, setUser] = useState<any>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>('January');

  const [token, setToken] = useState<any>('');
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('authenticatedUser');
        const token = await AsyncStorage.getItem('token');
        setToken(token);
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

  //Logica ver se economizou
  useEffect(() => {
    const checkSavings = async () => {
      const savingsMonths = ['January', 'March', 'June'];

      if (savingsMonths.includes(selectedMonth)) {
        setScenario('saved');
      } else {
        setScenario('notSaved');
      }
    };

    checkSavings();
  }, [selectedMonth]);

  const renderScenario = () => {
    switch (scenario) {
      case 'saved':
        return <Text style={styles.scenarioText}>Parabés🎉, Você economizou! </Text>;
      case 'notSaved':
        return <Text style={styles.scenarioText}>Uma pena👎, não economizou.</Text>;
      case 'noExpenses':
      default:
        return <Text style={styles.scenarioText}>Você não possui despesas registradas ainda.</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greetingText}>
        Olá, {user ? user.name : 'Usuário'}👋
      </Text>
      <Picker
        selectedValue={selectedMonth}
        style={styles.picker}
        onValueChange={(itemValue: string) => setSelectedMonth(itemValue)}
      >
        <Picker.Item label="Consulte o mês" value={null} />
        <Picker.Item label="Janeiro/2024" value="January" />
        <Picker.Item label="Fevereiro/2024" value="February" />
        <Picker.Item label="Março/2024" value="March" />
        <Picker.Item label="Abril/2024" value="April" />
        <Picker.Item label="Maio/2024" value="May" />
        <Picker.Item label="Junho/2024" value="June" />
        <Picker.Item label="Julho/2024" value="July" />
        <Picker.Item label="Agosto/2024" value="August" />
        <Picker.Item label="Setembro/2024" value="September" />
        <Picker.Item label="Outubro/2024" value="October" />
        <Picker.Item label="Novembro/2024" value="November" />
        <Picker.Item label="Dezembro/2024" value="December" />
      </Picker>
      {renderScenario()}
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
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  picker: {
    height: 50,
    width: '80%',
    marginBottom: 50,
  },
  scenarioText: {
    fontSize: 20,
    padding: 10,
    backgroundColor: '#007AFF',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 200,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});

export default HomeScreen;
