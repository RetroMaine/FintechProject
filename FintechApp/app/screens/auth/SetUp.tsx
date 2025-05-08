import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FormData {
  email: string;
  password: string;
  dependent_count: string;
  education_level: string;
  income_category: string;
  marital_status: string;
}

const AccountSetupScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    dependent_count: '',
    education_level: '',
    income_category: '',
    marital_status: ''
  });

  useEffect(() => {
    if (params.email && params.password && params.userId) {
      setFormData(prev => ({
        ...prev,
        email: params.email as string,
        password: params.password as string
      }));
    }
  }, [params]);

  const validateForm = (): boolean => {
    if (!formData.email || !formData.email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }
    if (!formData.dependent_count || isNaN(Number(formData.dependent_count))) {
      Alert.alert('Error', 'Please enter a valid number of dependents');
      return false;
    }
    if (!formData.education_level) {
      Alert.alert('Error', 'Please enter your education level');
      return false;
    }
    if (!formData.income_category) {
      Alert.alert('Error', 'Please enter your income category');
      return false;
    }
    if (!formData.marital_status) {
      Alert.alert('Error', 'Please enter your marital status');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const baseURL = Platform.select({
        ios: 'http://127.0.0.1:8000',
        android: 'http://10.0.2.2:8000',
        default: 'http://127.0.0.1:8000',
      });

      const setupResponse = await fetch(`${baseURL}/api/setup/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: params.userId,
          ...formData,
          dependent_count: Number(formData.dependent_count)
        }),
      });

      const setupData = await setupResponse.json();

      if (!setupResponse.ok) {
        Alert.alert('Error', setupData.error || 'Failed to create account');
        return;
      }

      // Store user ID
      await AsyncStorage.setItem('userId', setupData.userId);

      // Get initial credit estimate based on profile
      const incomeValue = parseFloat(formData.income_category.replace(/[^0-9.]/g, ''));
      const educationYears = formData.education_level.toLowerCase().includes('bachelor') ? 16 :
                           formData.education_level.toLowerCase().includes('master') ? 18 :
                           formData.education_level.toLowerCase().includes('phd') ? 20 : 12;

      const creditResponse = await fetch(`${baseURL}/api/estimate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: setupData.userId,
          Income: incomeValue,
          Rating: 650, // Default starting credit score
          Cards: 1,    // Assume new user starts with 1 card
          Age: 25,     // Default age if not provided
          Balance: 0,  // Assume new user starts with 0 balance
          Education: educationYears,
          Student: formData.education_level.toLowerCase().includes('student'),
          Married: formData.marital_status.toLowerCase().includes('married'),
          Ethnicity: 'Not Specified' // Default value for privacy
        }),
      });

      const creditData = await creditResponse.json();

      if (creditResponse.ok) {
        // Navigate to credit estimator with initial prediction
        router.replace({
          pathname: '/screens/home/HomePage',
          // pathname: '/screens/credit/Estimator',
          params: {
            initialCreditLimit: creditData.credit_limit,
            initialApprovalProbability: creditData.approval_probability
          }
        });
      } else {
        Alert.alert('Warning', 'Account created but failed to get initial credit estimate');
        router.replace('/screens/credit/Estimator');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to connect to server. Please try again.');
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={styles.mainTitle}>Account Setup</Text>
          <Text style={styles.sectionTitle}>Bank information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>
          
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
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Number of Dependents</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter number of dependents"
              value={formData.dependent_count}
              onChangeText={(text) => handleInputChange('dependent_count', text)}
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Education Level</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Bachelor's Degree"
              value={formData.education_level}
              onChangeText={(text) => handleInputChange('education_level', text)}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Income Category</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. $50,000-$75,000"
              value={formData.income_category}
              onChangeText={(text) => handleInputChange('income_category', text)}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Marital Status</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Single, Married"
              value={formData.marital_status}
              onChangeText={(text) => handleInputChange('marital_status', text)}
            />
          </View>
          
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Complete Setup</Text>
          </TouchableOpacity>
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