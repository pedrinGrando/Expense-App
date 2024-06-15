import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';

const AddExpenseScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState('Janeiro'); 
  const [loading, setLoading] = useState(false);

  const saveExpense = async () => {
    try {
      if (!description || !amount || !month) {
        Alert.alert('Error', 'Please, fill all fields.');
        return;
      }

      setLoading(true);

      const expense = {
        description,
        amount: parseFloat(amount),
        month,
      };

      const response = await fetch('http://192.168.0.21:8080/api/expenses/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expense), 
      });

      if (response.ok) {
        const responseData = await response.json();
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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Adicionar Despesa</Text>
        <TextInput
          style={styles.input}
          placeholder="Descrição"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Valor"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        <Picker
          selectedValue={month}
          style={styles.picker}
          onValueChange={(itemValue: string) => setMonth(itemValue)}
        >
          <Picker.Item label="Janeiro" value="January" />
          <Picker.Item label="Fevereiro" value="February" />
          <Picker.Item label="Março" value="March" />
          <Picker.Item label="Abril" value="April" />
          <Picker.Item label="Maio" value="May" />
          <Picker.Item label="Junho" value="June" />
          <Picker.Item label="Julho" value="July" />
          <Picker.Item label="Agosto" value="August" />
          <Picker.Item label="Setembro" value="September" />
          <Picker.Item label="Outubro" value="October" />
          <Picker.Item label="Novembro" value="November" />
          <Picker.Item label="Dezembro" value="December" />
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
    borderRadius: 15 
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
