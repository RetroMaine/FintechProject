import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';

const AccountSetupScreen = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    dependentCount: '',
    educationLevel: '',
    incomeCategory: '',
    maritalStatus: ''
  });

  const handleInputChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Handle form submission
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.mainTitle}>Account Setup</Text>
          <Text style={styles.sectionTitle}>Bank information</Text>
          
          {/* Email/Phone Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email or phone number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email or phone"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={formData.password}
              onChangeText={(text) => handleInputChange('password', text)}
              secureTextEntry
            />
          </View>
          
          {/* Dependent Count */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Dependent count</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter number of dependents"
              value={formData.dependentCount}
              onChangeText={(text) => handleInputChange('dependentCount', text)}
              keyboardType="numeric"
            />
          </View>
          
          {/* Education Level */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Educational level</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your education level"
              value={formData.educationLevel}
              onChangeText={(text) => handleInputChange('educationLevel', text)}
            />
          </View>
          
          {/* Income Category */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Income Category</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your income range"
              value={formData.incomeCategory}
              onChangeText={(text) => handleInputChange('incomeCategory', text)}
            />
          </View>
          
          {/* Marital Status */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Marital status</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your marital status"
              value={formData.maritalStatus}
              onChangeText={(text) => handleInputChange('maritalStatus', text)}
            />
          </View>
          
          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Complete Setup</Text>
          </TouchableOpacity>
          
          {/* Sign In Link */}
          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Have another account? </Text>
            <TouchableOpacity>
              <Text style={styles.signInLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#000000',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
    color: '#333333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
    color: '#333333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signInText: {
    fontSize: 16,
    color: '#666666',
  },
  signInLink: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
});

export default AccountSetupScreen;