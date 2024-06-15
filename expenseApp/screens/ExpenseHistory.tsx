import { Picker } from '@react-native-picker/picker';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Alert, TouchableOpacity, Modal, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ExpenseHistory: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [month, setMonth] = useState('Janeiro');
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string>('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);

  useEffect(() => {
    const loadToken = async () => {
      const jwtToken = await AsyncStorage.getItem('token');
      if (jwtToken) {
        setToken(jwtToken.trim());
      } else {
        Alert.alert('Erro', 'Token não encontrado. Por favor, faça login novamente.');
        navigation.navigate('Login');
      }
    };

    loadToken();
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [month]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const yearMonth = new Date().getFullYear() + '-' + formatMonth(month);
      const response = await fetch(`http://192.168.0.21:8080/api/expense?date=${yearMonth}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwZWRyb2dyYW5kbzZAZ21haWwuY29tIiwiaWF0IjoxNzE4NDc0MjU3LCJleHAiOjE3MTkwNzkwNTd9.fPl8-rbCnGdQ6QEy9Ot1oRtdHObDp3ysj3AqUqkI7jM"}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setExpenses(data);
      } else {
        const errorData = await response.json();
        console.error('Erro ao buscar despesas:', errorData);
        Alert.alert('Erro', errorData.message || 'Não foi possível buscar as despesas. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao fazer a requisição:', error);
      Alert.alert('Erro', 'Não foi possível buscar as despesas. Verifique sua conexão com a internet e tente novamente.');
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

  const handleEdit = (expense: any) => {
    setSelectedExpense(expense);
    setEditModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    Alert.alert(
      'Confirmação',
      'Você tem certeza de que deseja excluir esta despesa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sim',
          onPress: async () => {
            try {
              const response = await fetch(`http://192.168.0.21:8080/api/expense/${id}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwZWRyb2dyYW5kbzZAZ21haWwuY29tIiwiaWF0IjoxNzE4NDc0MjU3LCJleHAiOjE3MTkwNzkwNTd9.fPl8-rbCnGdQ6QEy9Ot1oRtdHObDp3ysj3AqUqkI7jM"}`,
                },
              });

              if (response.ok) {
                Alert.alert('Sucesso', 'Despesa excluída com sucesso!');
                fetchExpenses();
              } else {
                const errorData = await response.json();
                console.error('Erro ao excluir despesa:', errorData);
                Alert.alert('Erro', errorData.message || 'Não foi possível excluir a despesa. Tente novamente.');
              }
            } catch (error) {
              console.error('Erro ao fazer a requisição:', error);
              Alert.alert('Erro', 'Não foi possível excluir a despesa. Verifique sua conexão com a internet e tente novamente.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleSaveEdit = async () => {
    if (!selectedExpense) return;

    try {
      const response = await fetch(`http://192.168.0.21:8080/api/expense/${selectedExpense.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwZWRyb2dyYW5kbzZAZ21haWwuY29tIiwiaWF0IjoxNzE4NDc0MjU3LCJleHAiOjE3MTkwNzkwNTd9.fPl8-rbCnGdQ6QEy9Ot1oRtdHObDp3ysj3AqUqkI7jM"}`,
        },
        body: JSON.stringify(selectedExpense),
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Despesa atualizada com sucesso!');
        setEditModalVisible(false);
        fetchExpenses();
      } else {
        const errorData = await response.json();
        console.error('Erro ao atualizar despesa:', errorData);
        Alert.alert('Erro', errorData.message || 'Não foi possível atualizar a despesa. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao fazer a requisição:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a despesa. Verifique sua conexão com a internet e tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Despesas</Text>
      <Picker
        selectedValue={month}
        style={styles.picker}
        onValueChange={(itemValue: string) => setMonth(itemValue)}
      >
        <Picker.Item style={styles.title} label="Mês para a consulta" value={null} />
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

      {loading ? (
        <ActivityIndicator size="large" color="#6366F1" />
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.expenseItem}>
                 <Text style={styles.expenseDescription}>{item.name}</Text>
              <Text>{item.description}</Text>
              <Text style={styles.expenseAmount}>R$ {item.value.toFixed(2)}</Text>
              <Text style={styles.expenseDate}>{item.date}</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editButton}>
                  <Text style={styles.editButtonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                  <Text style={styles.deleteButtonText}>Apagar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyMessage}>Nenhuma despesa encontrada para {month}.</Text>}
        />
      )}

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>

      {selectedExpense && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={editModalVisible}
          onRequestClose={() => setEditModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar Despesa</Text>
              <TextInput
                style={styles.input}
                placeholder="Nome"
                value={selectedExpense.name}
                onChangeText={(text) => setSelectedExpense({ ...selectedExpense, name: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Descrição"
                value={selectedExpense.description}
                onChangeText={(text) => setSelectedExpense({ ...selectedExpense, description: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Valor"
                value={selectedExpense.value.toString()}
                onChangeText={(text) => setSelectedExpense({ ...selectedExpense, value: parseFloat(text) })}
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.buttonContainer} onPress={handleSaveEdit}>
                <Text style={styles.buttonText}>Salvar Alterações</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonContainer} onPress={() => setEditModalVisible(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 45,
    padding: 16,
    backgroundColor: '#E0F7FA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  picker: {
    width: '100%',
    marginBottom: 16,
    backgroundColor: '#6366F1',
    borderRadius: 15,
  },
  expenseItem: {
    backgroundColor: '#FFF',
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  expenseAmount: {
    fontSize: 16,
    color: '#FF6347',
    marginTop: 4,
  },
  expenseDate: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#FFF',
    fontSize: 14,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#6366F1',
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
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

export default ExpenseHistory;
