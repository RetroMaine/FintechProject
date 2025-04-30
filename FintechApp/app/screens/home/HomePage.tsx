import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

const Homepage = () => {
  const handleButtonPress = (buttonName: string) => {
    console.log(`${buttonName} pressed`);
    // Add navigation or other logic here
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Homepage</Text>
      
      <View style={styles.buttonContainer}>
        {/* Creditech Button */}
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => handleButtonPress('Creditech')}
        >
          <Text style={styles.buttonTitle}>Creditech</Text>
          <Text style={styles.buttonContainer}>Approval and credit estimator</Text>
          <Text style={styles.buttonSubText}>620</Text>
        </TouchableOpacity>

        {/* Loan Dashboard Button */}
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => handleButtonPress('Loan Dashboard')}
        >
          <Text style={styles.buttonTitle}>Loan Dashboard</Text>
          <Text style={styles.buttonSubText}>3 active loans</Text>
        </TouchableOpacity>

        {/* Budget Analysis Button */}
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => handleButtonPress('Budget Analysis')}
        >
          <Text style={styles.buttonTitle}>Budget Analysis</Text>
          <Text style={styles.buttonSubText}>$4.7k remaining</Text>
        </TouchableOpacity>

        {/* Spending Analysis Button */}
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => handleButtonPress('Spending Analysis')}
        >
          <Text style={styles.buttonTitle}>Spending Analysis</Text>
          <Text style={styles.buttonSubText}>620</Text>
        </TouchableOpacity>

        {/* Home Button
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => handleButtonPress('Home')}
        >
          <Text style={styles.buttonTitle}>Home</Text>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  buttonContainer: {
    gap: 20,
  },
  button: {
    backgroundColor: '#C7EFFF', // Dodger blue color
    borderRadius: 10,
    padding: 25,
    width: '100%',
    alignItems: 'flex-start',
  },
  buttonTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 8,
  },
  buttonLargeNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  buttonSubText: {
    fontSize: 14,
    color: 'black',
  },
});

export default Homepage;