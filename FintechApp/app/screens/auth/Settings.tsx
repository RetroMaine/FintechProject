import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const ProfileSettingsScreen = () => {
  // Profile data
  const profile = {
    name: 'Brooklyn Simmons',
    username: '@Broklyn',
    // Add profile image path if available
  };

  // Settings menu items
  const menuItems = [
    { id: '1', title: 'Your Card' },
    { id: '2', title: 'Security' },
    { id: '3', title: 'Account Details' },
    { id: '4', title: 'Notification' },
    { id: '5', title: 'Help and Support' },
    { id: '6', title: 'Logout', isRed: true },
  ];

  // Bottom navigation items
  const bottomNavItems = [
    { id: '1', title: 'Home' },
    { id: '2', title: 'My Booking' },
    { id: '3', title: 'Message' },
    { id: '4', title: 'Profile', isActive: true },
  ];

  return (
    <View style={styles.container}>
      {/* Header with time */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings/Profile</Text>
        <Text style={styles.time}>19:27</Text>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Text style={styles.profileHeader}>Profile</Text>
        <View style={styles.profileInfo}>
          {/* Replace with Image component if you have profile picture */}
          <View style={styles.profileImagePlaceholder}>
            <Text style={styles.profileInitials}>
              {profile.name.split(' ').map(name => name[0]).join('')}
            </Text>
          </View>
          <View style={styles.profileText}>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileUsername}>{profile.username}</Text>
          </View>
        </View>
      </View>

      {/* Settings Menu */}
      <View style={styles.menuContainer}>
        <Text style={styles.sectionHeader}>Setting</Text>
        {menuItems.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.menuItem}
            onPress={() => console.log(item.title + ' pressed')}
          >
            <Text style={[styles.menuText, item.isRed && styles.logoutText]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {bottomNavItems.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.navItem}
            onPress={() => console.log(item.title + ' pressed')}
          >
            <Text style={[styles.navText, item.isActive && styles.activeNavText]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 16,
    color: '#666',
  },
  profileSection: {
    marginBottom: 24,
  },
  profileHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInitials: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#555',
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileUsername: {
    fontSize: 14,
    color: '#666',
  },
  menuContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  menuItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuText: {
    fontSize: 16,
  },
  logoutText: {
    color: 'red',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
    paddingBottom: 8,
    marginTop: 'auto',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navText: {
    fontSize: 14,
    color: '#666',
  },
  activeNavText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default ProfileSettingsScreen;