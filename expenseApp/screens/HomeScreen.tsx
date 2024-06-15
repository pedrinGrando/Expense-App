import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { API_URL, TOKEN_SECRET } from '@env';

const HomeScreen: React.FC = () => {
  const [scenario, setScenario] = useState<'saved' | 'notSaved' | 'noExpenses'>('noExpenses');
  const [user, setUser] = useState<any>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>('Janeiro');
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [monthLimit, setMonthLimit] = useState<number>(0);
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('authenticatedUser');
        const jwtToken = await AsyncStorage.getItem('token');
        if (jwtToken) setToken(jwtToken.trim());
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

  useEffect(() => {
    const checkSavings = async () => {
      if (!token) {
        Alert.alert('Erro', 'Token não encontrado. Por favor, faça login novamente.');
        return;
      }

      const yearMonth = new Date().getFullYear() + '-' + formatMonth(selectedMonth);
      try {
        const response = await fetch(`${API_URL}/api/limit/month-result?date=${yearMonth}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${TOKEN_SECRET}`,  // Use o token corretamente
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Resposta da API:', data);
          setTotalExpenses(data.expensesSum || 0);
          setMonthLimit(data.expenseLimit || 0);

          if (data.isSavingsAchieved) {
            setScenario('saved');
          } else {
            setScenario('notSaved');
          }
        } else {
          const errorData = await response.json();
          console.error('Erro ao verificar economia:', errorData);
          setScenario('noExpenses');
        }
      } catch (error) {
        setScenario('noExpenses');
      }
    };

    checkSavings();
  }, [selectedMonth, token]);

  const formatMonth = (monthName: string): string => {
    const months: { [key: string]: string } = {
      'Janeiro': '01',
      'Fevereiro': '02',
      'Março': '03',
      'Abril': '04',
      'Maio': '05',
      'Junho': '06',
      'Julho': '07',
      'Agosto': '08',
      'Setembro': '09',
      'Outubro': '10',
      'Novembro': '11',
      'Dezembro': '12',
    };
    return months[monthName] || '01';
  };

  const renderScenario = () => {
    switch (scenario) {
      case 'saved':
        return <Text style={styles.scenarioText}>Parabéns🎉, Você economizou!</Text>;
      case 'notSaved':
        return <Text style={styles.scenarioText}>Uma pena👎, não economizou.</Text>;
      case 'noExpenses':
      default:
        return <Text style={styles.scenarioText}>Você não possui despesas registradas ainda.</Text>;
    }
  };

  const renderProgressBar = () => {
    if (monthLimit > 0) {
      const progress = Math.min(totalExpenses / monthLimit, 1);
      return (
        <View style={styles.progressBarContainer}>
          <Text style={styles.progressText}>Despesas: R$ {totalExpenses.toFixed(2)} / Limite: R$ {monthLimit.toFixed(2)}</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.progressPercentage}>{(progress * 100).toFixed(2)}%</Text>
        </View>
      );
    }
    return null;
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
        <Picker.Item label="Janeiro/2024" value="Janeiro" />
        <Picker.Item label="Fevereiro/2024" value="Fevereiro" />
        <Picker.Item label="Março/2024" value="Março" />
        <Picker.Item label="Abril/2024" value="Abril" />
        <Picker.Item label="Maio/2024" value="Maio" />
        <Picker.Item label="Junho/2024" value="Junho" />
        <Picker.Item label="Julho/2024" value="Julho" />
        <Picker.Item label="Agosto/2024" value="Agosto" />
        <Picker.Item label="Setembro/2024" value="Setembro" />
        <Picker.Item label="Outubro/2024" value="Outubro" />
        <Picker.Item label="Novembro/2024" value="Novembro" />
        <Picker.Item label="Dezembro/2024" value="Dezembro" />
      </Picker>
      {renderScenario()}
      {renderProgressBar()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#E0F7FA',
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  picker: {
    width: '100%',
    marginBottom: 16,
    backgroundColor: '#6366F1',
    borderRadius: 15,
  },
  scenarioText: {
    width: 350,
    fontSize: 20,
    padding: 15,
    backgroundColor: '#6366F1',
    textAlign: 'center',
    marginBottom: 10,
    borderRadius: 30,
    color: '#FFF',
  },
  progressBarContainer: {
    width: '80%',
    marginTop: 20,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 16,
    marginBottom: 10,
  },
  progressBar: {
    height: 20,
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  progressPercentage: {
    marginTop: 10,
    fontSize: 16,
    color: '#000',
  },
});

export default HomeScreen;
