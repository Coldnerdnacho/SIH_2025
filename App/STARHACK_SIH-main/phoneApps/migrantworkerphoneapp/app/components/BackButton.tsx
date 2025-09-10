import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';

const BackButton = ({ style = {} }) => {
  const router = useRouter();

  return (
    <TouchableOpacity 
      style={[styles.backButton, style]} 
      onPress={() => router.back()}
      activeOpacity={0.8}
    >
      <Ionicons name="arrow-back" size={22} color={Colors.white} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: Colors.darkBlue,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    elevation: 8,
    shadowColor: Colors.darkBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});

export default BackButton;