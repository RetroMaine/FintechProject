import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';

const HomePage = () => {
  // Mock data - replace with your actual data
  const userData = {
    name: "User",
    activeLoans: 3,
    upcomingPayments: 2,
    budget: 620,
    accounts: [
      { id: 1, lastDigits: "xxx", lastAccess: "05 August, 10:00AM", balance: "Total balance" },
      { id: 2, lastDigits: "XXXX", lastAccess: "12 August, 11:00 PM" },
      { id: 3, lastDigits: "XXXX", lastAccess: "13 August, 02:00 AM" }
    ]
  };

  const handleServicePress = (serviceName: string) => {
    console.log(`${serviceName} pressed`);
    // Navigate to respective service screen
  };

  const handleAccountPress = (accountId: number) => {
    console.log(`Account ${accountId} pressed`);
    // Navigate to account details
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          {/* Header */}
          <Text style={styles.header}>Homepage</Text>
          <Text style={styles.welcomeText}>Welcome, {userData.name}!</Text>
          
          {/* Service Buttons */}
          <View style={styles.servicesContainer}>
            <TouchableOpacity 
              style={styles.serviceButton}
              onPress={() => handleServicePress("Loantech")}
            >
              <Text style={styles.serviceTitle}>Loantech (Loan advisory)</Text>
              <Text style={styles.serviceDetail}>{userData.activeLoans} active loans</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.serviceButton}
              onPress={() => handleServicePress("PaySafe")}
            >
              <Text style={styles.serviceTitle}>PaySafe (Payment Planner)</Text>
              <Text style={styles.serviceDetail}>{userData.upcomingPayments} upcoming payments</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.serviceButton}
              onPress={() => handleServicePress("Budget")}
            >
              <Text style={styles.serviceTitle}>Budget and Expenses</Text>
              <Text style={styles.budgetAmount}>${userData.budget}</Text>
            </TouchableOpacity>
          </View>
          
          {/* Accounts Section */}
          <Text style={styles.sectionTitle}>Accounts</Text>
          <View style={styles.accountsContainer}>
            {userData.accounts.map(account => (
              <TouchableOpacity 
                key={account.id}
                style={styles.accountCard}
                onPress={() => handleAccountPress(account.id)}
              >
                <View style={styles.accountInfo}>
                  <Text style={styles.accountDigits}>*******{account.lastDigits}</Text>
                  <Text style={styles.accountDate}>{account.lastAccess}</Text>
                </View>
                {account.balance && (
                  <Text style={styles.accountBalance}>{account.balance}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
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
    marginBottom: 5,
    color: '#333',
  },
  welcomeText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 25,
  },
  servicesContainer: {
    marginBottom: 30,
  },
  serviceButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 5,
  },
  serviceDetail: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  budgetAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  accountsContainer: {
    marginBottom: 20,
  },
  accountCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  accountInfo: {
    flex: 1,
  },
  accountDigits: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  accountDate: {
    fontSize: 14,
    color: '#666',
  },
  accountBalance: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});

export default HomePage;