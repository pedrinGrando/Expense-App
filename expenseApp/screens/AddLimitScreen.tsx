import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import { format } from 'date-fns'; 

const AddLimitScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [limit, setLimit] = useState('');
  const [month, setMonth] = useState('Janeiro');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('authenticatedUser');
        const token = await AsyncStorage.getItem('token');
        setToken(token || '');
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

  const saveLimit = async () => {
    try {
      if (!limit || !month) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos.');
        return;
      }

      setLoading(true);

      const yearMonth = format(new Date(), 'yyyy') + '-' + formatMonth(month);

      const limitData = {
        value: parseFloat(limit), 
        date: yearMonth
      };

      const response = await fetch('http://192.168.0.21:8080/api/limit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwZWRyb2dyYW5kbzZAZ21haWwuY29tIiwiaWF0IjoxNzE4NDc0MjU3LCJleHAiOjE3MTkwNzkwNTd9.fPl8-rbCnGdQ6QEy9Ot1oRtdHObDp3ysj3AqUqkI7jM"}`,
        },
        body: JSON.stringify(limitData),
      });

      if (response.ok) {
        const responseData = await response.json();
        setLimit('');
        setMonth('');
        console.log('Limite adicionado:', responseData);
        Alert.alert('Sucesso', 'Limite de gasto adicionado com sucesso!');
        navigation.goBack();
      } else {
        const errorData = await response.json();
        console.error('Erro ao adicionar limite:', errorData);
        Alert.alert('Erro', errorData.message || 'Não foi possível adicionar o limite. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao fazer a requisição:', error);
      Alert.alert('Erro', 'Não foi possível adicionar o limite. Verifique sua conexão com a internet e tente novamente.');
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
        <Text style={styles.title}>Adicionar Limite de Gasto Mensal</Text>
        <TextInput
          style={styles.input}
          placeholder="Valor R$ 0,00"
          value={limit}
          onChangeText={setLimit}
          keyboardType="numeric"
        />
        <Picker
          selectedValue={month}
          style={styles.picker}
          onValueChange={(itemValue: string) => setMonth(itemValue)}
        >
          <Picker.Item style={styles.title} label="Mês para o limite" value={null} />
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
        <TouchableOpacity style={styles.buttonContainer} onPress={saveLimit} disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? 'Salvando...' : 'Salvar Limite'}
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

export default AddLimitScreen;
