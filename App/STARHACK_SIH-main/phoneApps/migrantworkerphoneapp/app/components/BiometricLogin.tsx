import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/colors';
import { BiometricService } from '../services/biometricService';

const BiometricLogin = ({ userId, onSuccess, onError }) => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    checkBiometricStatus();
  }, []);

  const checkBiometricStatus = async () => {
    try {
      const availability = await BiometricService.checkBiometricAvailability();
      const registration = await BiometricService.checkBiometricRegistration(userId);
      
      setIsAvailable(availability.isAvailable);
      setIsRegistered(registration.isRegistered);
    } catch (error) {
      console.error('Error checking biometric status:', error);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const result = await BiometricService.authenticateWithBiometric(userId);
      
      if (result.success) {
        onSuccess?.(result);
      } else {
        onError?.(result.error);
      }
    } catch (error) {
      console.error('Biometric login error:', error);
      onError?.('Biometric authentication failed');
    }
  };

  if (!isAvailable || !isRegistered) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.biometricButton} onPress={handleBiometricLogin}>
        <Ionicons name="finger-print" size={32} color={Colors.white} />
        <Text style={styles.biometricText}>Login with Biometric</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.darkBlue,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 25,
    gap: 12,
    elevation: 4,
    shadowColor: Colors.darkBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  biometricText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BiometricLogin;