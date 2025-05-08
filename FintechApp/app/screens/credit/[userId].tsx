import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  Alert
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

interface CreditDetails {
  creditLimit: number;
  approvalProbability: number;
  history: Array<{
    date: string;
    limit: number;
  }>;
}

const UserCreditDetails = () => {
  const { userId } = useLocalSearchParams();
  const [creditDetails, setCreditDetails] = useState<CreditDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreditDetails = async () => {
      try {
        const baseURL = Platform.select({
          ios: 'http://127.0.0.1:8000',
          android: 'http://10.0.2.2:8000',
          default: 'http://127.0.0.1:8000',
        });

        const response = await fetch(`${baseURL}/api/history/${userId}/`);
        const data = await response.json();

        if (response.ok) {
          setCreditDetails({
            creditLimit: data.latest?.creditLimit || 0,
            approvalProbability: data.latest?.approvalProbability || 0,
            history: data.history || []
          });
        } else {
          Alert.alert('Error', data.error || 'Failed to fetch credit details');
        }
      } catch (error) {
        console.error('Error:', error);
        Alert.alert('Error', 'Failed to connect to server');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchCreditDetails();
    }
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!creditDetails) {
    return (
      <View style={styles.container}>
        <Text>No credit details found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Credit Details</Text>
      
      <View style={styles.detailsContainer}>
        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Approved Credit Limit</Text>
          <Text style={styles.detailValue}>
            ${creditDetails.creditLimit.toLocaleString()}
          </Text>
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Approval Probability</Text>
          <Text style={styles.detailValue}>
            {(creditDetails.approvalProbability * 100).toFixed(1)}%
          </Text>
        </View>
      </View>

      {creditDetails.history.length > 0 && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Credit Limit History</Text>
          <LineChart
            data={{
              labels: creditDetails.history.map(d => d.date.split('T')[0]),
              datasets: [{
                data: creditDetails.history.map(d => d.limit)
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
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailCard: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6200ee',
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

export default UserCreditDetails; 