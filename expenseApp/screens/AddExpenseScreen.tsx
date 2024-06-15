import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import { format } from 'date-fns'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, TOKEN_SECRET } from '@env';

const AddExpenseScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string>(''); 
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState('Janeiro');
  const [loading, setLoading] = useState(false);

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

  const saveExpense = async () => {
    try {
      if (!name || !description || !amount || !month) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos.');
        return;
      }

      setLoading(true);
      const yearMonth = format(new Date(), 'yyyy') + '-' + formatMonth(month);

      const expense = {
        name,
        description,
        value: parseFloat(amount), 
        date: yearMonth, 
      };

      const response = await fetch(`${API_URL}/api/expense`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TOKEN_SECRET}`, 
        },
        body: JSON.stringify(expense),
      });

      if (response.ok) {
        const responseData = await response.json();
        setAmount('');
        setName('');
        setDescription('');
        setMonth('Janeiro');
        console.log('Despesa adicionada:', responseData);
        Alert.alert('Sucesso', 'Despesa adicionada com sucesso!');
        navigation.goBack();
      } else {
        const errorData = await response.json();
        console.error('Erro ao adicionar despesa:', errorData);
        Alert.alert('Erro', errorData.message || 'Não foi possível adicionar a despesa. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao fazer a requisição:', error);
      Alert.alert('Erro', 'Não foi possível adicionar a despesa. Verifique sua conexão com a internet e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Adicionar Despesa</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Descrição"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Valor R$ 0,00"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        <Picker
          selectedValue={month}
          style={styles.picker}
          onValueChange={(itemValue: string) => setMonth(itemValue)}
          placeholder='Mês para a despesa'
        >
          <Picker.Item style={styles.title} label="Mês para a despesa" value={null} />
          <Picker.Item label="Janeiro" value="Janeiro" />
          <Picker.Item label="Fevereiro" value="Fevereiro" />
          <Picker.Item label="Março" value="Março" />
          <Picker.Item label="Abril" value="Abril" />
          <Picker.Item label="Maio" value="Maio" />
          <Picker.Item label="Junho" value="Junho" />
          <Picker.Item label="Julho" value="Julho" />
          <Picker.Item label="Agosto" value="Agosto" />
          <Picker.Item label="Setembro" value="Setembro" />
          <Picker.Item label="Outubro" value="Outubro" />
          <Picker.Item label="Novembro" value="Novembro" />
          <Picker.Item label="Dezembro" value="Dezembro" />
        </Picker>
        <TouchableOpacity style={styles.buttonContainer} onPress={saveExpense} disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? 'Salvando...' : 'Salvar Despesa'}
          </Text>
        </TouchableOpacity>
        {loading && <Text style={styles.loadingText}>Salvando...</Text>}
      </View>
    </TouchableWithoutFeedback>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#FFF',
  },
  picker: {
    width: '100%',
    marginBottom: 16,
    backgroundColor: '#6366F1',
    borderRadius: 15,
  },
  buttonContainer: {
    backgroundColor: '#6366F1',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6366F1',
  },
});

export default AddExpenseScreen;
