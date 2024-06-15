import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns'; 
import { API_URL, TOKEN_SECRET } from '@env';

const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        const userData = await AsyncStorage.getItem('authenticatedUser');
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          setUser(parsedUserData);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.error('Erro ao carregar dados do usuário:', error);
        Alert.alert('Erro', 'Não foi possível carregar os dados do usuário.');
      }
    };

    loadUserData();
  }, []);

  const logout = async () => {
    try {
      setLoading(true);
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('authenticatedUser');
      Alert.alert('Logout', 'Você foi deslogado com sucesso.');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      });
    } catch (error) {
      setLoading(false);
      console.error('Erro ao fazer logout:', error);
      Alert.alert('Erro', 'Não foi possível deslogar. Tente novamente.');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy'); 
    } catch (error) {
      console.error('Erro ao formatar a data:', error);
      return dateString; 
    }
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando dados do usuário...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seus Dados</Text>
      <View style={styles.profileContainer}>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>Nome:</Text>
          <Text style={styles.value}>{user.name}</Text>
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>E-mail:</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>Data de Nascimento:</Text>
          <Text style={styles.value}>{formatDate(user.birthDate)}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={logout} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Sair'}</Text>
      </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0F7FA',
  },
  loadingText: {
    fontSize: 18,
    color: '#6366F1',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
  },
  profileContainer: {
    width: '100%',
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#FFF',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 5,
  },
  infoBlock: {
    marginBottom: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    color: '#777',
  },
  button: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: '#FF6347',
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
