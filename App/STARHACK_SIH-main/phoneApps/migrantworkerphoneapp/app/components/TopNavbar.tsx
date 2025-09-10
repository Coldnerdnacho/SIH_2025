import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Colors - replace with import once you create the colors file
const Colors = {
  darkBlue: '#064789',
  lightBlue: '#427aa1',
  bluishWhite: '#ebf2fa',
  white: '#ffffff',
  red: '#e74c3c',
  green: '#27ae60',
  gray: '#666666',
  lightGray: '#f5f5f5',
  darkGray: '#333333',
};

const TopNavbar = ({ title = '', showBackButton = true }) => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.navbar}>
        {showBackButton ? (
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.white} />
          </TouchableOpacity>
        ) : (
          <View style={styles.backButton} />
        )}
        
        <Text style={styles.title}>{title}</Text>
        
        <View style={styles.rightSpace} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.darkBlue,
  },
  navbar: {
    backgroundColor: Colors.darkBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    height: 60,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: `${Colors.lightBlue}40`,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  rightSpace: {
    width: 44,
    height: 44,
  },
});

export default TopNavbar;