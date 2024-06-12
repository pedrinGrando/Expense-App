// screens/RegisterScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Alert, Image, ActivityIndicator } from 'react-native';

const RegisterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [loading, setLoading] = useState(false);

  const register = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://192.168.0.21:8080/api/auth/signup', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, birthDate: dateOfBirth }),
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
        console.log('Registro bem-sucedido:', data);
        Alert.alert('Registro bem-sucedido', `Bem-vindo, ${data.name}`);
        setEmail('');
        setDateOfBirth('');
        setPassword('');
        setName('');
        setLoading(false);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      } else {
        console.error('Erro no registro:', data);
        setLoading(false);
        Alert.alert('Erro no registro', data.message || 'Algo deu errado, tente novamente.');
      }
    } catch (error) {
      console.error('Erro de rede:', error);
      setLoading(false);
      Alert.alert('Erro de rede', 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet e tente novamente.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Sign up</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
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
        <TextInput
          style={styles.input}
          placeholder="Date of Birth (YYYY-MM-DD)"
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
        />
        {loading ? (
          <ActivityIndicator size="large" color="#6366F1" />
        ) : (
          <TouchableOpacity style={styles.registerButton} onPress={register}>
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.linkContainer}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.linkText}>Already have an account? Sign in</Text>
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
    backgroundColor: '#E0F7FA', 
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
  registerButton: {
    backgroundColor: '#6366F1', // Indigo 500
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginVertical: 8,
  },
  registerButtonText: {
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
    height: 330, 
  },
});

export default RegisterScreen;