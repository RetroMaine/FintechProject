import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const PaymentPlansScreen = () => {
  // Payment data
  const payments = [
    {
      id: '1',
      title: 'BOFA Credit Card',
      date: '05 August, 10:00AM',
      amount: '+ $250',
    },
    {
      id: '2',
      title: 'BOFA Credit Card',
      date: '05 September, 10:00 AM',
      amount: '+ $250',
    },
    {
      id: '3',
      title: 'BOFA Credit Card',
      date: '05 October, 10:00 AM',
      amount: '+ $250',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Payment Plans</Text>
      
      {/* Payments Completed Section */}
      <Text style={styles.sectionHeader}>Payments Completed</Text>
      <View style={styles.divider} />
      
      {/* Monthly Payment Section */}
      <View style={styles.monthlyPaymentHeader}>
        <Text style={styles.subsectionHeader}>Monthly Payment</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>
      
      {/* Payments List */}
      <FlatList
        data={payments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.paymentItem}>
            <Text style={styles.paymentTitle}>{item.title}</Text>
            <Text style={styles.paymentDate}>{item.date}</Text>
            <Text style={styles.paymentAmount}>{item.amount}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },
  monthlyPaymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  subsectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  seeAll: {
    color: '#007AFF',
    fontSize: 14,
  },
  paymentItem: {
    paddingVertical: 12,
  },
  paymentTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  paymentDate: {
    color: '#666',
    fontSize: 14,
    marginBottom: 4,
  },
  paymentAmount: {
    color: '#4CAF50', // Green color for positive amounts
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemSeparator: {
    height: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default PaymentPlansScreen;