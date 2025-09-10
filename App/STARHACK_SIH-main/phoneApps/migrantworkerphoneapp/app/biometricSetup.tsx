import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import TopNavbar from './components/TopNavbar';
import { Colors } from './constants/colors';
import { BiometricService } from './services/biometricService';

const BiometricSetup = () => {
  const [loading, setLoading] = useState(true);
  const [biometricStatus, setBiometricStatus] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Mock user ID - replace with actual user ID from your auth system
  const userId = 'user_123';

  useEffect(() => {
    checkBiometricStatus();
  }, []);

  const checkBiometricStatus = async () => {
    try {
      setLoading(true);
      
      // Check device biometric availability
      const availability = await BiometricService.checkBiometricAvailability();
      setBiometricStatus(availability);

      // Check if already registered
      const registration = await BiometricService.checkBiometricRegistration(userId);
      setIsRegistered(registration.isRegistered);
      setRegistrationData(registration.registration);

    } catch (error) {
      console.error('Error checking biometric status:', error);
      Alert.alert('Error', 'Failed to check biometric status');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterBiometric = async () => {
    try {
      setProcessing(true);
      
      const result = await BiometricService.registerBiometric(userId);
      
      if (result.success) {
        Alert.alert(
          'Success!',
          result.message,
          [{ text: 'OK', onPress: () => checkBiometricStatus() }]
        );
      } else {
        Alert.alert('Registration Failed', result.error);
      }

    } catch (error) {
      console.error('Error registering biometric:', error);
      Alert.alert('Error', 'Failed to register biometric authentication');
    } finally {
      setProcessing(false);
    }
  };

  const handleTestAuthentication = async () => {
    try {
      setProcessing(true);
      
      const result = await BiometricService.authenticateWithBiometric(userId);
      
      if (result.success) {
        Alert.alert('Success!', 'Authentication successful');
      } else {
        Alert.alert('Authentication Failed', result.error);
      }

    } catch (error) {
      console.error('Error testing authentication:', error);
      Alert.alert('Error', 'Failed to test authentication');
    } finally {
      setProcessing(false);
    }
  };

  const handleRemoveBiometric = () => {
    Alert.alert(
      'Remove Biometric',
      'Are you sure you want to remove biometric authentication?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: removeBiometric }
      ]
    );
  };

  const removeBiometric = async () => {
    try {
      setProcessing(true);
      
      const result = await BiometricService.removeBiometricRegistration(userId);
      
      if (result.success) {
        Alert.alert(
          'Success!',
          result.message,
          [{ text: 'OK', onPress: () => checkBiometricStatus() }]
        );
      } else {
        Alert.alert('Error', result.error);
      }

    } catch (error) {
      console.error('Error removing biometric:', error);
      Alert.alert('Error', 'Failed to remove biometric authentication');
    } finally {
      setProcessing(false);
    }
  };

  const getBiometricIcon = () => {
    if (!biometricStatus?.supportedTypes?.length) return 'finger-print';
    
    if (biometricStatus.supportedTypes.includes(1)) return 'finger-print';
    if (biometricStatus.supportedTypes.includes(2)) return 'eye';
    if (biometricStatus.supportedTypes.includes(3)) return 'scan';
    return 'finger-print';
  };

  const getBiometricTypeName = () => {
    if (!biometricStatus?.supportedTypes?.length) return 'Biometric';
    
    if (biometricStatus.supportedTypes.includes(1)) return 'Fingerprint';
    if (biometricStatus.supportedTypes.includes(2)) return 'Facial Recognition';
    if (biometricStatus.supportedTypes.includes(3)) return 'Iris Recognition';
    return 'Biometric';
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <TopNavbar title="Biometric Setup" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.darkBlue} />
          <Text style={styles.loadingText}>Checking biometric availability...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopNavbar title="Biometric Setup" />
      
      <ScrollView style={styles.content}>
        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.statusIconContainer}>
              <Ionicons 
                name={getBiometricIcon()} 
                size={32} 
                color={biometricStatus?.isAvailable ? Colors.green : Colors.red} 
              />
            </View>
            <View style={styles.statusInfo}>
              <Text style={styles.statusTitle}>{getBiometricTypeName()}</Text>
              <Text style={[
                styles.statusSubtitle,
                { color: biometricStatus?.isAvailable ? Colors.green : Colors.red }
              ]}>
                {biometricStatus?.isAvailable ? 'Available' : 'Not Available'}
              </Text>
            </View>
          </View>

          {!biometricStatus?.hasHardware && (
            <Text style={styles.warningText}>
              Your device doesn't support biometric authentication.
            </Text>
          )}

          {biometricStatus?.hasHardware && !biometricStatus?.isEnrolled && (
            <Text style={styles.warningText}>
              Please set up {getBiometricTypeName().toLowerCase()} in your device settings first.
            </Text>
          )}
        </View>

        {/* Registration Status */}
        {biometricStatus?.isAvailable && (
          <View style={styles.registrationCard}>
            <Text style={styles.cardTitle}>Registration Status</Text>
            
            {isRegistered ? (
              <View style={styles.registeredSection}>
                <View style={styles.registeredHeader}>
                  <Ionicons name="checkmark-circle" size={24} color={Colors.green} />
                  <Text style={styles.registeredText}>Biometric authentication is active</Text>
                </View>
                
                {registrationData && (
                  <View style={styles.registrationDetails}>
                    <Text style={styles.detailText}>
                      Type: {registrationData.biometric_type}
                    </Text>
                    <Text style={styles.detailText}>
                      Registered: {new Date(registrationData.registered_at).toLocaleDateString()}
                    </Text>
                    {registrationData.last_authenticated_at && (
                      <Text style={styles.detailText}>
                        Last used: {new Date(registrationData.last_authenticated_at).toLocaleDateString()}
                      </Text>
                    )}
                  </View>
                )}

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.testButton}
                    onPress={handleTestAuthentication}
                    disabled={processing}
                    activeOpacity={0.8}
                  >
                    {processing ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <>
                        <Ionicons name="scan" size={20} color="white" />
                        <Text style={styles.testButtonText}>Test Authentication</Text>
                      </>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={handleRemoveBiometric}
                    disabled={processing}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="trash" size={20} color="white" />
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.unregisteredSection}>
                <Text style={styles.unregisteredText}>
                  Biometric authentication is not set up for your account.
                </Text>
                <Text style={styles.benefitsText}>
                  Enable biometric authentication for:
                </Text>
                <View style={styles.benefitsList}>
                  <Text style={styles.benefitItem}>• Quick and secure access</Text>
                  <Text style={styles.benefitItem}>• Enhanced security</Text>
                  <Text style={styles.benefitItem}>• Convenient login</Text>
                </View>

                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={handleRegisterBiometric}
                  disabled={processing}
                  activeOpacity={0.8}
                >
                  {processing ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <>
                      <Ionicons name="add-circle" size={20} color="white" />
                      <Text style={styles.registerButtonText}>
                        Register {getBiometricTypeName()}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Security Info */}
        <View style={styles.securityCard}>
          <Text style={styles.cardTitle}>Security Information</Text>
          <View style={styles.securityList}>
            <View style={styles.securityItem}>
              <Ionicons name="shield-checkmark" size={20} color={Colors.lightBlue} />
              <Text style={styles.securityText}>
                Your biometric data is stored securely on your device
              </Text>
            </View>
            <View style={styles.securityItem}>
              <Ionicons name="lock-closed" size={20} color={Colors.lightBlue} />
              <Text style={styles.securityText}>
                Registration data is encrypted and stored on our secure servers
              </Text>
            </View>
            <View style={styles.securityItem}>
              <Ionicons name="eye-off" size={20} color={Colors.lightBlue} />
              <Text style={styles.securityText}>
                We never store your actual biometric templates
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGray,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.gray,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statusCard: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: Colors.darkBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.bluishWhite,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.darkBlue,
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  warningText: {
    fontSize: 14,
    color: Colors.red,
    backgroundColor: Colors.red + '20',
    padding: 12,
    borderRadius: 8,
    textAlign: 'center',
  },
  registrationCard: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: Colors.darkBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.darkBlue,
    marginBottom: 16,
  },
  registeredSection: {
    alignItems: 'center',
  },
  registeredHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  registeredText: {
    fontSize: 16,
    color: Colors.green,
    fontWeight: '600',
    marginLeft: 8,
  },
  registrationDetails: {
    width: '100%',
    backgroundColor: Colors.bluishWhite,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  detailText: {
    fontSize: 14,
    color: Colors.darkGray,
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  testButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.lightBlue,
    padding: 14,
    borderRadius: 25,
    gap: 8,
  },
  testButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.red,
    padding: 14,
    borderRadius: 25,
    gap: 8,
    minWidth: 100,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  unregisteredSection: {
    alignItems: 'center',
  },
  unregisteredText: {
    fontSize: 16,
    color: Colors.darkGray,
    textAlign: 'center',
    marginBottom: 16,
  },
  benefitsText: {
    fontSize: 16,
    color: Colors.darkBlue,
    fontWeight: '600',
    marginBottom: 12,
  },
  benefitsList: {
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  benefitItem: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 4,
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.darkBlue,
    padding: 16,
    borderRadius: 25,
    gap: 8,
    minWidth: 200,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  securityCard: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: 20,
    elevation: 4,
    shadowColor: Colors.darkBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  securityList: {
    gap: 12,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  securityText: {
    flex: 1,
    fontSize: 14,
    color: Colors.darkGray,
    lineHeight: 20,
  },
});

export default BiometricSetup;