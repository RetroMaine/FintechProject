import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { getCreditLimit, getApprovalProbability } from '../../services/api';

export default function CreditEstimatorScreen() {
  const [formData, setFormData] = useState({
    Income: '',
    Rating: '',
    Cards: '',
    Age: '',
    Balance: '',
    Ethnicity: '',
    Education: '',
    Student: '',
    Married: '',
  });

  const [creditLimit, setCreditLimit] = useState<number | null>(null);
  const [approvalProbability, setApprovalProbability] = useState<number | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreditLimit = async () => {
    try {
      const data = {
        Income: parseFloat(formData.Income),
        Rating: parseFloat(formData.Rating),
        Cards: parseInt(formData.Cards),
        Age: parseInt(formData.Age),
        Balance: parseFloat(formData.Balance),
        Ethnicity: formData.Ethnicity,
      };
      const response = await getCreditLimit(data);
      setCreditLimit(response.predicted_limit);
    } catch (error) {
      Alert.alert('Error', 'Failed to get credit limit prediction');
    }
  };

  const handleApprovalProbability = async () => {
    try {
      const data = {
        Income: parseFloat(formData.Income),
        Rating: parseFloat(formData.Rating),
        Cards: parseInt(formData.Cards),
        Age: parseInt(formData.Age),
        Balance: parseFloat(formData.Balance),
        Education: formData.Education,
        Student: formData.Student,
        Married: formData.Married,
        Ethnicity: formData.Ethnicity,
      };
      const response = await getApprovalProbability(data);
      setApprovalProbability(response.approval_probability);
    } catch (error) {
      Alert.alert('Error', 'Failed to get approval probability');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Credit Estimator</Text>
      
      {/* Input Form */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Income"
          keyboardType="numeric"
          value={formData.Income}
          onChangeText={(text) => handleInputChange('Income', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Credit Rating"
          keyboardType="numeric"
          value={formData.Rating}
          onChangeText={(text) => handleInputChange('Rating', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Number of Cards"
          keyboardType="numeric"
          value={formData.Cards}
          onChangeText={(text) => handleInputChange('Cards', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Age"
          keyboardType="numeric"
          value={formData.Age}
          onChangeText={(text) => handleInputChange('Age', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Balance"
          keyboardType="numeric"
          value={formData.Balance}
          onChangeText={(text) => handleInputChange('Balance', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Ethnicity"
          value={formData.Ethnicity}
          onChangeText={(text) => handleInputChange('Ethnicity', text)}
        />
      </View>

      {/* Results Display */}
      {creditLimit !== null && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>Predicted Credit Limit:</Text>
          <Text style={styles.resultValue}>${creditLimit.toFixed(2)}</Text>
        </View>
      )}

      {approvalProbability !== null && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>Approval Probability:</Text>
          <Text style={styles.resultValue}>{(approvalProbability * 100).toFixed(2)}%</Text>
        </View>
      )}

      {/* Action Buttons */}
      <TouchableOpacity style={styles.button} onPress={handleCreditLimit}>
        <Text style={styles.buttonText}>Get Credit Limit Prediction</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleApprovalProbability}>
        <Text style={styles.buttonText}>Get Approval Probability</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  resultContainer: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  resultLabel: {
    fontSize: 16,
    color: '#666',
  },
  resultValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    backgroundColor: '#4e54c8',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});