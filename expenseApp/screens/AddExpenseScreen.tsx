import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Alert, Image, Button } from 'react-native';

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

      const response = await fetch('http://10.10.102.205:8080/api/expenses/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`,
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
      <Text style={styles.title}>Add Expense</Text>
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Value"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric" 
      />
      <TouchableOpacity style={styles.buttonContainer} onPress={saveExpense} disabled={loading}>
          <Text style={styles.linkText}>
            {loading ? 'Loading...' : 'Save'}
          </Text>
        </TouchableOpacity>
      {loading && <Text style={styles.loadingText}>Saving...</Text>}
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
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 16,
  },
  buttonContainer: {
    backgroundColor: '#6366F1', // Indigo 500
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginVertical: 8,
  },
  linkText: {
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
