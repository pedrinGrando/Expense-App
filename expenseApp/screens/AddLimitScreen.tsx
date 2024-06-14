import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Alert, Image, Button } from 'react-native';

const AddLimitScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [month, setMonth] = useState('Janeiro');
  const [limit, setLimit] = useState('');
  const [loading, setLoading] = useState(false);

  const saveLimit = async () => {
    try {
      if (!month || !limit) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos.');
        return;
      }

      setLoading(true);

      const limitData = {
        month,
        limit: parseFloat(limit),
      };

      const response = await fetch('http://10.10.101.180:8080/api/limits/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(limitData),
      });

      if (response.ok) {
        const responseData = await response.json();
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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Add your month limit</Text>
        <TextInput
          style={styles.input}
          placeholder="Month (ex: Janeiro, Fevereiro)"
          value={month}
          onChangeText={setMonth}
        />
        <TextInput
          style={styles.input}
          placeholder="Limit"
          value={limit}
          onChangeText={setLimit}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.buttonContainer} onPress={saveLimit} disabled={loading}>
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

export default AddLimitScreen;
