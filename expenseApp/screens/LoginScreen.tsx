// screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://192.168.0.21:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), 
      });

      const textResponse = await response.text();
      console.log('Raw response:', textResponse);

      let data;
      try {
        data = JSON.parse(textResponse); 
        console.log('Parsed response:', data);
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        data = { message: textResponse }; 
      }

      if (response.ok) {
        console.log('Login bem-sucedido:', data);
        await AsyncStorage.setItem('authenticatedUser', JSON.stringify(data.authenticatedUser));
        await AsyncStorage.setItem('jwtToken', JSON.stringify(data));
        Alert.alert('Login bem-sucedido', `Bem-vindo`);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      } else {
        console.error('Erro no login:', data);
        Alert.alert('Email ou Senha inválidos.');
      }
    } catch (error) {
      console.error('Erro de rede:', error);
      Alert.alert('Erro de rede', 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet e tente novamente.');
    } finally {
      setLoading(false); 
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Sign in</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.loginButton} onPress={login} disabled={loading}>
          <Text style={styles.loginButtonText}>
            {loading ? 'Loading...' : 'Login'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.linkContainer}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.linkText}>You don’t have an account? Register now</Text>
        </TouchableOpacity>
        <Image 
          source={require('../assets/images/startPic.png')} 
          style={styles.bottomImage}
          resizeMode="contain"
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#E0F7FA', // Azul muito claro
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 16,
    borderRadius: 12,
  },
  loginButton: {
    backgroundColor: '#6366F1', // Indigo 500
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginVertical: 8,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkContainer: {
    marginVertical: 16,
    alignItems: 'center',
  },
  linkText: {
    color: '#1e90ff',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  bottomImage: {
    position: 'relative',
    bottom: 0,
    width: '100%',
    height: 390, 
  },
});

export default LoginScreen;
