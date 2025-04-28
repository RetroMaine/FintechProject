import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const FinancialInfoScreen = () => {
  // Sample data for bank accounts
  const bankAccounts = [
    { id: '1', name: 'Bank 1', date: '05 August, 10:00AM', balance: '$1001.90' },
    { id: '2', name: 'Bank 2', date: '05 August, 10:00AM', balance: '$1001.90' },
  ];

  // Sample transaction data
  const transactions = [
    { id: '1', date: '05 August, 10:00AM', amount: '- $54', description: 'Seblak Hot Yummy' },
    { id: '2', date: '12 August, 11:00 PM', amount: '- $23', description: 'Kurupuk Kulit' },
    { id: '3', date: '13 August, 02:00 AM', amount: '- $33', description: '' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Financial Information</Text>
      
      {/* Linked Bank Accounts Section */}
      <Text style={styles.sectionHeader}>Linked Bank Accounts</Text>
      <View style={styles.bankAccountsContainer}>
        {bankAccounts.map((account) => (
          <View key={account.id} style={styles.bankAccountItem}>
            <View style={styles.bankAccountHeader}>
              <Text style={styles.bankName}>{account.name}</Text>
              <Text style={styles.bankDate}>{account.date}</Text>
            </View>
            <Text style={styles.bankBalance}>{account.balance}</Text>
          </View>
        ))}
      </View>

      <View style={styles.divider} />

      {/* Transactions Section */}
      <View style={styles.transactionHeader}>
        <Text style={styles.sectionHeader}>Transaction</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.transactionSubheader}>Shopping product</Text>
      
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionDate}>{item.date}</Text>
              <Text style={styles.transactionAmount}>{item.amount}</Text>
            </View>
            {item.description ? (
              <Text style={styles.transactionDescription}>{item.description}</Text>
            ) : null}
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
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bankAccountsContainer: {
    marginBottom: 20,
  },
  bankAccountItem: {
    marginBottom: 15,
  },
  bankAccountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  bankName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  bankDate: {
    color: '#666',
  },
  bankBalance: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 20,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  seeAll: {
    color: '#007AFF',
  },
  transactionSubheader: {
    color: '#666',
    marginBottom: 10,
  },
  transactionItem: {
    marginBottom: 15,
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  transactionDate: {
    color: '#666',
  },
  transactionAmount: {
    fontWeight: 'bold',
  },
  transactionDescription: {
    fontWeight: 'bold',
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

export default FinancialInfoScreen;