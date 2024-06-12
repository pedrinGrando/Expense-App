// screens/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const HistorySreen: React.FC = () => {
  const [scenario, setScenario] = React.useState<'saved' | 'notSaved' | 'noExpenses'>('noExpenses');

  const renderScenario = () => {
    switch (scenario) {
      case 'saved':
        return <Text style={styles.scenarioText}>Congratulations! You've saved money this month!</Text>;
      case 'notSaved':
        return <Text style={styles.scenarioText}>Unfortunately, you didn't save money this month.</Text>;
      case 'noExpenses':
      default:
        return <Text style={styles.scenarioText}>History.</Text>;
    }
  };

  return (
    <View style={styles.container}>
      {renderScenario()}
      <View style={styles.buttonContainer}>
      
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#E0F7FA', // Azul muito claro
  },
  scenarioText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  }
});

export default HistorySreen;
