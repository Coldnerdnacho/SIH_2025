import * as Device from 'expo-device';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { supabase } from '../config/supabase';

export class BiometricService {
  static async checkBiometricAvailability() {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      
      return {
        hasHardware,
        isEnrolled,
        supportedTypes,
        isAvailable: hasHardware && isEnrolled
      };
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return {
        hasHardware: false,
        isEnrolled: false,
        supportedTypes: [],
        isAvailable: false
      };
    }
  }

  static async registerBiometric(userId) {
    try {
      const availability = await this.checkBiometricAvailability();
      
      if (!availability.isAvailable) {
        throw new Error('Biometric authentication is not available');
      }

      // Authenticate to ensure user can use biometrics
      const authResult = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Register your biometric authentication',
        fallbackLabel: 'Use passcode',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      if (!authResult.success) {
        throw new Error('Biometric authentication failed');
      }

      // Get device information
      const deviceId = await this.getDeviceId();
      const biometricType = this.getBiometricType(availability.supportedTypes);
      const securityLevel = this.getSecurityLevel(availability.supportedTypes);

      // Store registration in Supabase
      const { data, error } = await supabase
        .from('biometric_registrations')
        .insert([
          {
            user_id: userId,
            device_id: deviceId,
            biometric_type: biometricType,
            security_level: securityLevel,
            is_active: true
          }
        ])
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to register biometric: ${error.message}`);
      }

      // Store local registration flag
      await SecureStore.setItemAsync(
        `biometric_registered_${userId}`,
        JSON.stringify({
          registered: true,
          registrationId: data.id,
          deviceId: deviceId,
          registeredAt: new Date().toISOString()
        })
      );

      return {
        success: true,
        registration: data,
        message: 'Biometric authentication registered successfully'
      };

    } catch (error) {
      console.error('Error registering biometric:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async authenticateWithBiometric(userId) {
    try {
      // Check if biometric is registered for this user
      const localRegistration = await SecureStore.getItemAsync(`biometric_registered_${userId}`);
      
      if (!localRegistration) {
        throw new Error('Biometric authentication not registered for this user');
      }

      const registrationData = JSON.parse(localRegistration);

      // Perform biometric authentication
      const authResult = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate with your biometric',
        fallbackLabel: 'Use passcode',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      if (!authResult.success) {
        throw new Error('Biometric authentication failed');
      }

      // Update last authenticated timestamp in Supabase
      const { error } = await supabase
        .from('biometric_registrations')
        .update({ 
          last_authenticated_at: new Date().toISOString() 
        })
        .eq('id', registrationData.registrationId)
        .eq('is_active', true);

      if (error) {
        console.warn('Failed to update authentication timestamp:', error.message);
      }

      return {
        success: true,
        message: 'Authentication successful',
        authenticationTime: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error during biometric authentication:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async checkBiometricRegistration(userId) {
    try {
      const localRegistration = await SecureStore.getItemAsync(`biometric_registered_${userId}`);
      
      if (!localRegistration) {
        return { isRegistered: false };
      }

      const registrationData = JSON.parse(localRegistration);
      
      // Verify with Supabase
      const { data, error } = await supabase
        .from('biometric_registrations')
        .select('*')
        .eq('id', registrationData.registrationId)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        // Clean up invalid local registration
        await SecureStore.deleteItemAsync(`biometric_registered_${userId}`);
        return { isRegistered: false };
      }

      return {
        isRegistered: true,
        registration: data,
        localData: registrationData
      };

    } catch (error) {
      console.error('Error checking biometric registration:', error);
      return { isRegistered: false };
    }
  }

  static async removeBiometricRegistration(userId) {
    try {
      const registrationCheck = await this.checkBiometricRegistration(userId);
      
      if (!registrationCheck.isRegistered) {
        return { success: true, message: 'No biometric registration found' };
      }

      // Deactivate in Supabase
      const { error } = await supabase
        .from('biometric_registrations')
        .update({ is_active: false })
        .eq('id', registrationCheck.registration.id);

      if (error) {
        throw new Error(`Failed to remove biometric registration: ${error.message}`);
      }

      // Remove local storage
      await SecureStore.deleteItemAsync(`biometric_registered_${userId}`);

      return {
        success: true,
        message: 'Biometric registration removed successfully'
      };

    } catch (error) {
      console.error('Error removing biometric registration:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async getDeviceId() {
    try {
      let deviceId = await SecureStore.getItemAsync('device_id');
      
      if (!deviceId) {
        // Generate a unique device ID
        deviceId = `${Device.modelName || 'unknown'}_${Device.osName || 'unknown'}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        await SecureStore.setItemAsync('device_id', deviceId);
      }
      
      return deviceId;
    } catch (error) {
      console.error('Error getting device ID:', error);
      return `fallback_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    }
  }

  static getBiometricType(supportedTypes) {
    if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return 'FACIAL_RECOGNITION';
    } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return 'FINGERPRINT';
    } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      return 'IRIS';
    } else {
      return 'UNKNOWN';
    }
  }

  static getSecurityLevel(supportedTypes) {
    // Higher number = more secure
    if (supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      return 3;
    } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return 2;
    } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return 2;
    } else {
      return 1;
    }
  }
}