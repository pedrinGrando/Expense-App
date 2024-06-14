import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';

const AddExpenseScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState('Janeiro'); 
  const [loading, setLoading] = useState(false);

  const saveExpense = async () => {
    try {
      if (!description || !amount || !month) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos.');
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
      <View style={styles.buttonContainer}>
        <Button title="Salvar Despesa" onPress={saveExpense} disabled={loading} />
      </View>
      {loading && <Text style={styles.loadingText}>Saving...</Text>}
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
    marginTop: 16,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6366F1',
  },
});

export default AddExpenseScreen;
