import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns'; 

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
      <View style={styles.container}>
        <Text>Carregando dados do usuário...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seus dados</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Npme:</Text>
        <Text style={styles.value}>{user.name}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>E-mail:</Text>
        <Text style={styles.value}>{user.email}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Data de nascimento:</Text>
        <Text style={styles.value}>{formatDate(user.birthDate)}</Text>
      </View>
      <TouchableOpacity style={styles.buttonContainer} onPress={logout} disabled={loading}>
          <Text style={styles.linkText}>
            {loading ? 'Loading...' : 'Sair'}
          </Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    width: '100%',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 16,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'red', 
    padding: 7,
    borderRadius: 15, 
  },
  linkText: {
    color: '#FFF',
    fontSize: 18,
  },
});

export default ProfileScreen;
