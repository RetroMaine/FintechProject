import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

import { useFocusEffect } from '@react-navigation/native';

const Homepage = () => {
  const router = useRouter();

  const [creditLimit, setCreditLimit] = useState<number | null>(null);
  const [approvalProb, setApprovalProb] = useState<number | null>(null);
  const [loanCount,   setLoanCount]   = useState<number>(0);
  // useEffect(() => {
  //   const loadEstimates = async () => {
  //     const storedLimit = await AsyncStorage.getItem('creditLimit');
  //     const storedApproval = await AsyncStorage.getItem('approvalProbability');

  //     if (storedLimit) setCreditLimit(parseFloat(storedLimit));
  //     if (storedApproval) setApprovalProb(parseFloat(storedApproval));
  //   };

  //   loadEstimates();
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      const loadEstimates = async () => {
        const storedLimit = await AsyncStorage.getItem('creditLimit');
        const storedApproval = await AsyncStorage.getItem('approvalProbability');
        const rawLoans = await AsyncStorage.getItem('loans');

        setLoanCount(rawLoans ? JSON.parse(rawLoans).length : 0);

        if (storedLimit) setCreditLimit(parseFloat(storedLimit));
        if (storedApproval) setApprovalProb(parseFloat(storedApproval));
      };
  
      loadEstimates();
    }, [])
  );
  

  const handleButtonPress = (buttonName: string) => {
    console.log(`${buttonName} pressed`);
  
    if (buttonName === 'Creditech') {
      router.push('/screens/credit/Estimator');
    } else if (buttonName === 'Loan Dashboard') {
      router.push('/screens/credit/ApprovalRate');
    } else if (buttonName === 'AI Chatbot'){
      router.push('/screens/advise/Chatbot'); 
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Overview</Text>
      
      <View style={styles.buttonContainer}>
        {/* Creditech Results */}
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => handleButtonPress('Creditech')}
        >
          <Text style={styles.buttonTitle}>Creditech</Text>
          <Text style={styles.buttonSubText}>
            {creditLimit !== null ? `Credit Line: $${creditLimit.toLocaleString()}` : 'No estimate yet'}
          </Text>
          <Text style={styles.buttonSubText}>
            {approvalProb !== null ? `Approval Chance: ${(approvalProb * 100).toFixed(1)}%` : ''}
          </Text>
        </TouchableOpacity>

        {/* Loan Dashboard */}
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => handleButtonPress('Loan Dashboard')}
        >
          <Text style={styles.buttonTitle}>Loan Dashboard</Text>
          <Text style={styles.buttonSubText}>View your loan status</Text>
          <Text style={styles.buttonSubText}>
            {loanCount === 0
            ? 'No active loans'
            : `${loanCount} active loan${loanCount > 1 ? 's' : ''}`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => handleButtonPress('AI Chatbot')}
        >
          <Text style={styles.buttonTitle}>AI Chatbot</Text>
          <Text style={styles.buttonSubText}>Ask financial questions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/screens/advise/InsightPage')}
        >
          <Text style={styles.buttonTitle}>Financial Analysis</Text>
          <Text style={styles.buttonSubText}>AI-generated insights</Text>
        </TouchableOpacity>



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
    backgroundColor: '#C7EFFF',
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
  buttonSubText: {
    fontSize: 14,
    color: 'black',
  },
});

export default Homepage;
