import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';

const SpendScreen = () => {
  // Mock data - replace with your actual data
  const spendData = {
    monthlyBudget: {
      totalSpends: 472.55,
    },
    transactions: [
      { 
        name: 'Shopping product', 
        date: '05 August, 10:00AM', 
        account: 'Bank Account #1234',
        amount: 125.75
      },
      { 
        name: 'Seblak Hot Yummy', 
        date: '12 August, 11:00 PM', 
        account: 'Bank Account #1234',
        amount: 8.50
      }
    ]
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          {/* Header */}
          <Text style={styles.header}>Spend</Text>
          
          {/* Budget & Expenses Section */}
          <Text style={styles.sectionHeader}>Budget & Expenses</Text>
          
          {/* Monthly Budget Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Monthly Budget:</Text>
            <View style={styles.budgetRow}>
              <Text style={styles.budgetLabel}>Total spends</Text>
              <Text style={styles.budgetAmount}>{formatCurrency(spendData.monthlyBudget.totalSpends)}</Text>
            </View>
          </View>
          
          {/* Divider */}
          <View style={styles.divider} />
          
          {/* Calendar Header */}
          <View style={styles.calendarHeader}>
            <Text style={styles.calendarTitle}>Month</Text>
            <Text style={styles.calendarDays}>S M T W T F S</Text>
            <Text style={styles.calendarSubtitle}>Spends statistic</Text>
          </View>
          
          {/* Divider */}
          <View style={styles.divider} />
          
          {/* This Month Section */}
          <View style={styles.monthHeader}>
            <Text style={styles.monthTitle}>This Month</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          
          {/* Transactions List */}
          {spendData.transactions.map((transaction, index) => (
            <View key={index} style={styles.transactionCard}>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionName}>{transaction.name}</Text>
                <Text style={styles.transactionDetails}>
                  {transaction.date} - ({transaction.account})
                </Text>
              </View>
              <Text style={styles.transactionAmount}>{formatCurrency(transaction.amount)}</Text>
            </View>
          ))}
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
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#000000',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333333',
  },
  card: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budgetLabel: {
    fontSize: 16,
    color: '#666666',
  },
  budgetAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 20,
  },
  calendarHeader: {
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  calendarDays: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
  calendarSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  seeAllText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 4,
  },
  transactionDetails: {
    fontSize: 14,
    color: '#666666',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
});

export default SpendScreen;