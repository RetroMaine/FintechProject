import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  TouchableOpacity
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

interface Prediction {
  creditLimit: number;
  approvalProbability: number;
}

interface FormData {
  Income: string;
  Rating: string;
  Cards: string;
  Age: string;
  Balance: string;
  Education: string;
  Student: string;
  Married: string;
  Ethnicity: string;
}

interface EstimatorFormData {
  Income: number;
  Rating: number;
  Cards: number;
  Age: number;
  Education: number;
  Balance: number;
  Student: boolean;
  Married: boolean;
  Ethnicity: string;
}

const CreditEstimator = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [userId, setUserId] = useState<string | null>(null);
  const [approvalEstimateOnly, setApprovalEstimateOnly] = useState<number | null>(null);
  const [userIdLoaded, setUserIdLoaded] = useState(false);
  const [creditLimit, setCreditLimit] = useState<number>(
    params.initialCreditLimit ? Number(params.initialCreditLimit) : 0
  );
  const [approvalProbability, setApprovalProbability] = useState<number>(
    params.initialApprovalProbability ? Number(params.initialApprovalProbability) : 0
  );
  const [historicalData, setHistoricalData] = useState<{ date: string; limit: number }[]>([]);
  
  const [formData, setFormData] = useState<EstimatorFormData>({
    Income: 0,
    Rating: 650,
    Cards: 1,
    Age: 25,
    Education: 16,
    Balance: 0,
    Student: false,
    Married: false,
    Ethnicity: "Caucasian"
  });

  useEffect(() => {
    const loadUserId = async () => {
        const storedUserId = await AsyncStorage.getItem('userId');
        console.log('[Estimator] Loaded userId:', storedUserId);  // <- Make sure this logs correctly
        setUserId(storedUserId);
        setUserIdLoaded(true);
    };
  
    loadUserId(); // ❗️You forgot to await or didn’t define this right
  }, [])
  const saveFormToStorage = async () => {
    await AsyncStorage.setItem('Income', formData.Income.toString());
    await AsyncStorage.setItem('Rating', formData.Rating.toString());
    await AsyncStorage.setItem('Cards', formData.Cards.toString());
    await AsyncStorage.setItem('Age', formData.Age.toString());
    await AsyncStorage.setItem('Education', formData.Education.toString());
    await AsyncStorage.setItem('Balance', formData.Balance.toString());
    await AsyncStorage.setItem('Ethnicity', formData.Ethnicity);
    await AsyncStorage.setItem('Student', formData.Student ? 'true' : 'false');
    await AsyncStorage.setItem('Married', formData.Married ? 'true' : 'false');
    console.log('✅ Saved to AsyncStorage:', formData);
   };

  const handleEstimate = async () => {
    await saveFormToStorage(); 
    try {
      const baseURL = Platform.select({
        ios: 'http://127.0.0.1:8000',
        android: 'http://10.0.2.2:8000',
        default: 'http://127.0.0.1:8000',
      });

      const fallbackUserId = userId || 'guest_user_123'; 

      console.log('Sending request to:', `${baseURL}/api/estimate/`);
      console.log('With data:', { userId: fallbackUserId, ...formData });

    //   if (!userId) {
    //     Alert.alert('Error', 'User ID is missing — please sign in again');
    //     console.error('[FRONTEND] userId is null — cannot proceed with request');
    //     return;
    //   }
      const response = await fetch(`${baseURL}/api/estimate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: fallbackUserId,
          ...formData
        }),
      });

      const data = await response.json();
      console.log('Received response:', data);

      if (response.ok) {
        setCreditLimit(data.credit_limit);
        setApprovalProbability(data.approval_probability);

        await AsyncStorage.setItem('creditLimit', data.credit_limit.toString());
        await AsyncStorage.setItem('approvalProbability', data.approval_probability.toString());

        // Update historical data
        if (data.history) {
          setHistoricalData(data.history);
        }
      } else {
        Alert.alert('Error', data.error || 'Failed to get estimate');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to connect to server');
    }
  };

  const handleApprovalEstimate = async () => {
    await saveFormToStorage();
    try {
      const baseURL = Platform.select({
        ios: 'http://127.0.0.1:8000',
        android: 'http://10.0.2.2:8000',
        default: 'http://127.0.0.1:8000',
      });
  
      const fallbackUserId = userId || 'guest_user_123';
  
      const response = await fetch(`${baseURL}/api/approval/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: fallbackUserId,
          ...formData
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setApprovalEstimateOnly(data.approval_probability);
      } else {
        Alert.alert('Error', data.error || 'Approval prediction failed');
      }
    } catch (error) {
      console.error('Approval Error:', error);
      Alert.alert('Error', 'Server error while estimating approval.');
    }
  };  

  const handleCreditLimitPress = () => {
    if (userId && creditLimit > 0) {
      router.push(`/screens/credit/${userId}`);
    }
  };

  const getApprovalColor = (prob: number): string => {
    const percent = prob * 100;
    if (percent <= 20) return 'red';
    if (percent <= 40) return '#f1c40f'; // yellow
    return '#28a745'; // green
  };
  

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Credit Limit Estimator</Text>
      
      <View style={styles.form}>
        <TextInput
          mode="outlined"
          label="Annual Income"
          value={formData.Income.toString()}
          onChangeText={(text) => setFormData(prev => ({ ...prev, Income: Number(text) || 0 }))}
          keyboardType="numeric"
          style={styles.input}
        />
        
        <TextInput
          mode="outlined"
          label="Credit Score"
          value={formData.Rating.toString()}
          onChangeText={(text) => setFormData(prev => ({ ...prev, Rating: Number(text) || 0 }))}
          keyboardType="numeric"
          style={styles.input}
        />
        
        <TextInput
          mode="outlined"
          label="Number of Credit Cards"
          value={formData.Cards.toString()}
          onChangeText={(text) => setFormData(prev => ({ ...prev, Cards: Number(text) || 0 }))}
          keyboardType="numeric"
          style={styles.input}
        />
        
        <TextInput
          mode="outlined"
          label="Age"
          value={formData.Age.toString()}
          onChangeText={(text) => setFormData(prev => ({ ...prev, Age: Number(text) || 0 }))}
          keyboardType="numeric"
          style={styles.input}
        />
        
        <TextInput
          mode="outlined"
          label="Years of Education"
          value={formData.Education.toString()}
          onChangeText={(text) => setFormData(prev => ({ ...prev, Education: Number(text) || 0 }))}
          keyboardType="numeric"
          style={styles.input}
        />
        
        <TextInput
          mode="outlined"
          label="Current Balance"
          value={formData.Balance.toString()}
          onChangeText={(text) => setFormData(prev => ({ ...prev, Balance: Number(text) || 0 }))}
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          mode="outlined"
          label="Ethnicity"
          value={formData.Ethnicity}
          onChangeText={(text) => setFormData(prev => ({ ...prev, Ethnicity: text }))}
          style={styles.input}
        />

        
        <Button
          mode="contained"
          onPress={() => setFormData(prev => ({ ...prev, Student: !prev.Student }))}
          style={[styles.button, { backgroundColor: formData.Student ? '#6200ee' : '#e0e0e0' }]}
        >
          Student: {formData.Student ? 'Yes' : 'No'}
        </Button>
        
        <Button
          mode="contained"
          onPress={() => setFormData(prev => ({ ...prev, Married: !prev.Married }))}
          style={[styles.button, { backgroundColor: formData.Married ? '#6200ee' : '#e0e0e0' }]}
        >
          Married: {formData.Married ? 'Yes' : 'No'}
        </Button>
        
        <Button
          mode="contained"
          onPress={handleEstimate}
          style={styles.submitButton}
        //   disabled={!userIdLoaded || !userId}
            disabled={false}
        >
          Estimate Credit Limit
        </Button>

        <Button
            mode="outlined"
            onPress={handleApprovalEstimate}
            style={{ marginTop: 10, borderColor: '#6200ee' }}
            textColor="#6200ee"
            >
            Estimate Approval Chances
        </Button>

      </View>

      {/* {userIdLoaded && !userId && (
        <Text style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>
          Please sign in before estimating your credit limit.
        </Text>
      )} */}

      {typeof creditLimit === 'number' && (
        <TouchableOpacity 
          onPress={handleCreditLimitPress}
          style={styles.creditLimitContainer}
        >
          <Text style={styles.creditLimitText}>
            Your Estimated Credit Limit:
          </Text>
          <Text style={styles.creditLimitAmount}>
            ${creditLimit.toLocaleString()}
          </Text>
          <Text style={styles.tapToView}>
            Tap to view details
          </Text>
        </TouchableOpacity>
      )}

        {approvalEstimateOnly !== null && (
        <View style={styles.creditLimitContainer}>
            <Text style={styles.creditLimitText}>
            Your Estimated Approval Chance:
            </Text>
            <Text style={[styles.creditLimitAmount, { color: getApprovalColor(approvalEstimateOnly) }]}>
            {(approvalEstimateOnly * 100).toFixed(1)}%
            </Text>
        </View>
        )}

        <Button
            mode="contained"
            onPress={() => router.replace('/screens/home/HomePage')}
            style={[styles.submitButton, { backgroundColor: '#007AFF', marginTop: 20 }]}
            >
            Go to Dashboard
        </Button>




      {historicalData.length > 0 && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Credit Limit History</Text>
          <LineChart
            data={{
              labels: historicalData.map(d => d.date.split('T')[0]),
              datasets: [{
                data: historicalData.map(d => d.limit)
              }]
            }}
            width={Dimensions.get('window').width - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
              style: {
                borderRadius: 16
              }
            }}
            bezier
            style={styles.chart}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    gap: 10,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginVertical: 5,
    padding: 5,
  },
  submitButton: {
    marginTop: 20,
    padding: 5,
    backgroundColor: '#6200ee',
  },
  creditLimitContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    alignItems: 'center',
  },
  creditLimitText: {
    fontSize: 18,
    color: '#666',
  },
  creditLimitAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6200ee',
    marginVertical: 10,
  },
  tapToView: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  chartContainer: {
    marginTop: 20,
    padding: 10,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default CreditEstimator;