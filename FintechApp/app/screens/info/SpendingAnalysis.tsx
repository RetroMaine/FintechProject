import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const SpendingAnalysisScreen = () => {
  // Days of week for calendar header
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  // Monthly spending categories
  const monthlySpending = [
    { 
      id: '1',
      category: 'Groceries', 
      amount: '$54',
      date: '05 August, 10:00AM'
    },
    { 
      id: '2',
      category: 'Entertainment', 
      amount: '$200',
      date: '12 August, 11:00 PM'
    },
    { 
      id: '3',
      category: 'Eating out', 
      amount: '$330',
      date: '13 August, 02:00 AM'
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Spending Analysis</Text>
      
      {/* Total Spending */}
      <View style={styles.totalSpendingContainer}>
        <Text style={styles.totalSpendingLabel}>Total Spendings</Text>
        <Text style={styles.totalSpendingAmount}>$1000.00</Text>
      </View>
      
      {/* Month selector */}
      <View style={styles.monthContainer}>
        <Text style={styles.monthText}>Month</Text>
        
        {/* Days of week */}
        <View style={styles.daysOfWeekContainer}>
          {daysOfWeek.map((day, index) => (
            <Text key={index} style={styles.dayText}>{day}</Text>
          ))}
        </View>
        
        {/* Spends statistic placeholder */}
        <View style={styles.spendsStatisticPlaceholder}>
          <Text style={styles.placeholderText}>- Spends statistic -</Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      {/* This Month section */}
      <Text style={styles.sectionHeader}>This Month</Text>
      
      {/* Spending categories list */}
      <FlatList
        data={monthlySpending}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.spendingItem}>
            <View style={styles.spendingHeader}>
              <Text style={styles.spendingCategory}>{item.category}</Text>
              <Text style={styles.spendingAmount}>{item.amount}</Text>
            </View>
            <Text style={styles.spendingDate}>{item.date}</Text>
          </View>
        )}
      />
      
      {/* Bottom Navigation - Simplified */}
      <View style={styles.bottomNav}>
        <Text style={styles.navItem}>Home</Text>
      </View>
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
  totalSpendingContainer: {
    marginBottom: 20,
  },
  totalSpendingLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  totalSpendingAmount: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  monthContainer: {
    marginBottom: 20,
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  daysOfWeekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dayText: {
    width: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  spendsStatisticPlaceholder: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 10,
  },
  placeholderText: {
    color: '#999',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  spendingItem: {
    marginBottom: 20,
  },
  spendingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  spendingCategory: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  spendingAmount: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  spendingDate: {
    color: '#666',
  },
  bottomNav: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    marginTop: 'auto',
    alignItems: 'center',
  },
  navItem: {
    fontSize: 16,
    color: '#007AFF',
  },
});

export default SpendingAnalysisScreen;