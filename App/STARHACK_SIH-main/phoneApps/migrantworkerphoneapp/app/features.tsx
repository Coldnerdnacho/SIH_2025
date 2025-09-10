import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from './constants/colors';

const { width } = Dimensions.get('window');

const schemes = [
  {
    title: "Jyothi Scheme",
    year: "2025",
    description: "Enrols migrant children into schools & anganwadis. Includes health check-ups, hygiene awareness, and cultural activities.",
    icon: "school-outline",
    backgroundColor: '#8b5cf6',
  },
  {
    title: "AWAZ Health Insurance",
    year: "2017",
    description: "Free medical cover up to ₹15,000 + ₹2 lakh accidental death benefit. Over 5 lakh migrant workers already registered.",
    icon: "medical-outline",
    backgroundColor: '#06b6d4',
  },
  {
    title: "Santhwana Scheme",
    year: "Since 2016",
    description: "Financial relief for NRKs abroad during crises. Over ₹200 crore disbursed to 33,000+ families in emergencies.",
    icon: "people-outline",
    backgroundColor: '#ec4899',
  },
];

const Features = ({ onDocumentsPress, onAbhaPress }) => {
  const router = useRouter();
  const [currentScheme, setCurrentScheme] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      changeScheme((currentScheme + 1) % schemes.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentScheme]);

  const changeScheme = (newIndex) => {
    if (newIndex === currentScheme) return;

    // Animate out current card
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      // Change to new scheme
      setCurrentScheme(newIndex);
      
      // Reset position and animate in
      slideAnim.setValue(50);
      
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    });
  };

  const handleSchemePress = (index) => {
    changeScheme(index);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Government Schemes Section */}
      <View style={styles.schemesSection}>
        <Text style={styles.schemesTitle}>Government Schemes</Text>
        
        <View style={styles.cardContainer}>
          <Animated.View 
            style={[
              styles.schemeCard,
              { 
                backgroundColor: schemes[currentScheme].backgroundColor,
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.schemeHeader}>
              <Text style={styles.schemeTitle}>{schemes[currentScheme].title}</Text>
              <View style={styles.yearBadge}>
                <Text style={styles.yearText}>{schemes[currentScheme].year}</Text>
              </View>
            </View>
            
            <Text style={styles.schemeDescription}>
              {schemes[currentScheme].description}
            </Text>
            
            <View style={styles.schemeFooter}>
              <View style={styles.schemeIconContainer}>
                <Ionicons 
                  name={schemes[currentScheme].icon} 
                  size={28} 
                  color="white" 
                />
              </View>
              <TouchableOpacity 
                style={styles.learnMoreButton}
                activeOpacity={0.8}
                onPress={() => {
                  // Navigate to scheme details or open web link
                  console.log(`Learn more about ${schemes[currentScheme].title}`);
                }}
              >
                <Text style={styles.learnMoreText}>Learn More</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>

        {/* Navigation Dots */}
        <View style={styles.dotsContainer}>
          {schemes.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSchemePress(index)}
              style={[
                styles.dot,
                {
                  backgroundColor: index === currentScheme ? Colors.darkBlue : Colors.gray,
                  width: index === currentScheme ? 24 : 10,
                }
              ]}
              activeOpacity={0.7}
            />
          ))}
        </View>
      </View>

      {/* Feature Buttons */}
      <View style={styles.featuresSection}>
        <Text style={styles.featuresTitle}>Quick Access</Text>
        
        {/* Add Biometric Setup Button */}
        <TouchableOpacity
          style={styles.featureRow}
          onPress={() => router.push('/biometricSetup')}
          activeOpacity={0.8}
        >
          <View style={styles.featureIconContainer}>
            <Ionicons name="finger-print" size={24} color={Colors.lightBlue} />
          </View>
          <Text style={styles.featureText}>Biometric Setup</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.featureRow}
          onPress={() => router.push('/featureScreens/hospitalsNearby')}
          activeOpacity={0.8}
        >
          <View style={styles.featureIconContainer}>
            <Ionicons name="medkit-outline" size={24} color={Colors.lightBlue} />
          </View>
          <Text style={styles.featureText}>Hospitals Nearby</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.featureRow} 
          onPress={() => router.push('/featureScreens/medicalRecords')}
          activeOpacity={0.8}
        >
          <View style={styles.featureIconContainer}>
            <MaterialIcons name="folder-open" size={24} color={Colors.lightBlue} />
          </View>
          <Text style={styles.featureText}>Medical Records</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.featureRow} 
          onPress={() => router.push('/featureScreens/emergencyNumbers')}
          activeOpacity={0.8}
        >
          <View style={styles.featureIconContainer}>
            <Ionicons name="call-outline" size={24} color={Colors.lightBlue} />
          </View>
          <Text style={styles.featureText}>Emergency Numbers</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.featureRow} 
          onPress={onAbhaPress}
          activeOpacity={0.8}
        >
          <View style={styles.featureIconContainer}>
            <Ionicons name="id-card-outline" size={24} color={Colors.lightBlue} />
          </View>
          <Text style={styles.featureText}>View ABHA ID</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
        </TouchableOpacity>
      </View>

      {/* Bottom spacing for scroll */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGray,
  },
  
  // Schemes Section
  schemesSection: {
    margin: 20,
    marginBottom: 10,
  },
  schemesTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.darkBlue,
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  cardContainer: {
    height: 220, // Fixed height to prevent layout jumps
    marginBottom: 20,
  },
  schemeCard: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    padding: 24,
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  schemeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  schemeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    flex: 1,
    marginRight: 12,
  },
  yearBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  yearText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  schemeDescription: {
    fontSize: 14,
    color: 'white',
    lineHeight: 20,
    marginBottom: 20,
    opacity: 0.95,
    flex: 1,
  },
  schemeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  schemeIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  learnMoreButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  learnMoreText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    transition: 'all 0.3s ease',
  },

  // Features Section
  featuresSection: {
    margin: 20,
    marginTop: 10,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.darkBlue,
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 18,
    borderRadius: 15,
    marginBottom: 12,
    elevation: 4,
    shadowColor: Colors.darkBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: `${Colors.lightBlue}20`,
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.bluishWhite,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureText: {
    fontSize: 16,
    color: Colors.darkBlue,
    fontWeight: '600',
    flex: 1,
    letterSpacing: 0.2,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default Features;