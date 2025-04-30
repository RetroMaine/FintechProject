import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

const LoanApprovalScreen = () => {
  const [loanData, setLoanData] = useState({
    loanType: '',
    principal: '',
    interest: '',
    term: ''
  });

  const handleInputChange = (field, value) => {
    setLoanData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Submitted Loan Data:', loanData);
    // Add your submission logic here
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Loan Approval</Text>
      
      <View style={styles.content}>
        <Text style={styles.subHeader}>Loan Approval</Text>
        
        {/* Individual Input Fields */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Loan Type</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Personal Loan"
            value={loanData.loanType}
            onChangeText={(text) => handleInputChange('loanType', text)}
          />
          
          <Text style={styles.label}>Principal Amount ($)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 10000"
            keyboardType="numeric"
            value={loanData.principal}
            onChangeText={(text) => handleInputChange('principal', text)}
          />
          
          <Text style={styles.label}>Interest Rate (%)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 5.5"
            keyboardType="numeric"
            value={loanData.interest}
            onChangeText={(text) => handleInputChange('interest', text)}
          />
          
          <Text style={styles.label}>Term (months)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 36"
            keyboardType="numeric"
            value={loanData.term}
            onChangeText={(text) => handleInputChange('term', text)}
          />
        </View>
        
        {/* Action Button */}
        <TouchableOpacity style={styles.actionButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Spin the loan wheel</Text>
          <Text style={styles.buttonSubtext}>(responsibly)!</Text>
        </TouchableOpacity>
      </View>

      {/* Home Button */}
      <TouchableOpacity style={styles.homeButton}>
        <Text style={styles.homeButtonText}>Home</Text>
      </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  content: {
    flex: 1,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 30,
    color: '#555',
  },
  inputContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  actionButton: {
    backgroundColor: '#C7EFFF',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  buttonSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  homeButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  homeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});

export default LoanApprovalScreen;