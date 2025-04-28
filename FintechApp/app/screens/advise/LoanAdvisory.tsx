import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';

const LoanAdvisoryScreen = () => {
  // Mock data - replace with your actual data
  const loanData = {
    creditLine: { used: 18000, total: 25000 },
    budget: 20000,
    savingsLoans: 3000,
    expenditure: 17000,
    currentLoan: {
      balance: 32900.50,
      paymentDueDate: 'Apr 2 2025',
      requiredPayment: 1001.90,
      nextAutoPay: 'Mar 28 2025'
    },
    transactions: [
      { account: 'Checking Acc', amount: 1001.90, date: '05 August, 10:00AM' },
      { account: 'Checking Acc', amount: 1001.90, date: '12 August, 11:00 PM' }
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
          <Text style={styles.header}>Loan Advisory</Text>
          
          {/* Credit Line */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>your credit line</Text>
            <Text style={styles.creditLineText}>
              {formatCurrency(loanData.creditLine.used)} of {formatCurrency(loanData.creditLine.total)}
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { 
                width: `${(loanData.creditLine.used / loanData.creditLine.total) * 100}%` 
              }]} />
            </View>
          </View>
          
          {/* Budget Overview */}
          <View style={styles.budgetContainer}>
            <View style={styles.budgetItem}>
              <Text style={styles.budgetLabel}>Budget</Text>
              <Text style={styles.budgetAmount}>{formatCurrency(loanData.budget)}</Text>
            </View>
            <View style={styles.budgetItem}>
              <Text style={styles.budgetLabel}>Savings/Loans</Text>
              <Text style={styles.budgetAmount}>{formatCurrency(loanData.savingsLoans)}</Text>
            </View>
            <View style={styles.budgetItem}>
              <Text style={styles.budgetLabel}>Expenditure</Text>
              <Text style={styles.budgetAmount}>{formatCurrency(loanData.expenditure)}</Text>
            </View>
          </View>
          
          {/* Current Loan */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Current Loan</Text>
            <Text style={styles.loanBalance}>{formatCurrency(loanData.currentLoan.balance)}</Text>
            <Text style={styles.loanBalanceLabel}>Balance</Text>
            
            <View style={styles.loanDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Payment Due Date</Text>
                <Text style={styles.detailValue}>{loanData.currentLoan.paymentDueDate}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Required Payment Due</Text>
                <Text style={styles.detailValue}>{formatCurrency(loanData.currentLoan.requiredPayment)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Next Auto Pay</Text>
                <Text style={styles.detailValue}>{loanData.currentLoan.nextAutoPay}</Text>
              </View>
            </View>
          </View>
          
          {/* Recent Transactions */}
          <View style={styles.transactionsHeader}>
            <Text style={styles.sectionTitle}>Recent transactions</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          
          {loanData.transactions.map((transaction, index) => (
            <View key={index} style={styles.transactionCard}>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionAccount}>{transaction.account}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
              <Text style={styles.transactionAmount}>- {formatCurrency(transaction.amount)}</Text>
            </View>
          ))}
          
          {/* New Loan Button */}
          <TouchableOpacity style={styles.newLoanButton}>
            <Text style={styles.newLoanButtonText}>New loan</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 25,
    color: '#333',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  creditLineText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  budgetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  budgetItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    width: '30%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  budgetLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  budgetAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  loanBalance: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  loanBalanceLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  loanDetails: {
    marginTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  seeAllText: {
    fontSize: 16,
    color: '#007AFF',
  },
  transactionCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionAccount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  transactionDate: {
    fontSize: 14,
    color: '#666',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
  newLoanButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 16,
    marginTop: 20,
    alignItems: 'center',
  },
  newLoanButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default LoanAdvisoryScreen;