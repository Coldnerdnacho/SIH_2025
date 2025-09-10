import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import TopNavbar from '../components/TopNavbar';
import { Colors } from '../constants/colors';

const hospitalsMock = [
  { id: 1, name: 'City Hospital', latitude: 8.5241, longitude: 76.9366, address: 'Medical College Rd, Thiruvananthapuram' },
  { id: 2, name: 'General Hospital', latitude: 8.5200, longitude: 76.9400, address: 'Hospital Rd, Thiruvananthapuram' },
  { id: 3, name: 'Care Clinic', latitude: 8.5260, longitude: 76.9380, address: 'MG Road, Thiruvananthapuram' },
  { id: 4, name: 'SCTIMST', latitude: 8.5470, longitude: 76.9520, address: 'Satellite Rd, Thiruvananthapuram' },
  { id: 5, name: 'Regional Cancer Centre', latitude: 8.5290, longitude: 76.9410, address: 'Medical College Campus, Thiruvananthapuram' },
];

const HospitalsNearby = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredHospitals, setFilteredHospitals] = useState(hospitalsMock);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    // Filter hospitals based on search query
    if (searchQuery.trim() === '') {
      setFilteredHospitals(hospitalsMock);
    } else {
      const filtered = hospitalsMock.filter(hospital =>
        hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hospital.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredHospitals(filtered);
    }
  }, [searchQuery]);

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      
      // Request permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      // Get current position with high accuracy
      let loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 15000,
        maximumAge: 10000,
      });
      
      setLocation(loc.coords);
      setLoading(false);
      
      // Center map on current location
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }, 1000);
      }
      
    } catch (error) {
      console.error('Error getting location:', error);
      setErrorMsg('Failed to get current location');
      setLoading(false);
      
      // Fallback to default location (Thiruvananthapuram)
      setLocation({
        latitude: 8.5241,
        longitude: 76.9366,
      });
    }
  };

  const openInGoogleMaps = (hospital) => {
    const url = Platform.select({
      ios: `maps://app?daddr=${hospital.latitude},${hospital.longitude}`,
      android: `google.navigation:q=${hospital.latitude},${hospital.longitude}`,
    });

    const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`;

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Linking.openURL(webUrl);
      }
    }).catch(() => {
      Linking.openURL(webUrl);
    });
  };

  const handleHospitalPress = (hospital) => {
    Alert.alert(
      hospital.name,
      hospital.address,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Get Directions', onPress: () => openInGoogleMaps(hospital) },
      ]
    );
  };

  const centerOnCurrentLocation = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }, 1000);
    } else {
      getCurrentLocation();
    }
  };

  const centerOnHospital = (hospital) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: hospital.latitude,
        longitude: hospital.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <TopNavbar title="Hospitals Nearby" />
        <View style={styles.center}>
          <Text style={styles.errorText}>Map is not supported on web. Please use mobile device.</Text>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <TopNavbar title="Hospitals Nearby" />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.darkBlue} />
          <Text style={styles.loadingText}>Getting your location...</Text>
        </View>
      </View>
    );
  }

  if (errorMsg && !location) {
    return (
      <View style={styles.container}>
        <TopNavbar title="Hospitals Nearby" />
        <View style={styles.center}>
          <Text style={styles.errorText}>{errorMsg}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={getCurrentLocation}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopNavbar title="Hospitals Nearby" />
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search hospitals..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <Ionicons name="close" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: location?.latitude || 8.5241,
          longitude: location?.longitude || 76.9366,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        showsUserLocation={true}
        showsMyLocationButton={false}
        followsUserLocation={false}
        loadingEnabled={true}
      >
        {filteredHospitals.map(hospital => (
          <Marker
            key={hospital.id}
            coordinate={{
              latitude: hospital.latitude,
              longitude: hospital.longitude,
            }}
            title={hospital.name}
            description={hospital.address}
            pinColor="#e74c3c"
            onPress={() => handleHospitalPress(hospital)}
          />
        ))}
      </MapView>

      <TouchableOpacity style={styles.locationButton} onPress={centerOnCurrentLocation}>
        <Ionicons name="locate" size={24} color="white" />
      </TouchableOpacity>

      {searchQuery.length > 0 && (
        <View style={styles.resultsContainer}>
          <ScrollView style={styles.resultsList}>
            {filteredHospitals.map(hospital => (
              <TouchableOpacity
                key={hospital.id}
                style={styles.hospitalItem}
                onPress={() => {
                  centerOnHospital(hospital);
                  setSearchQuery('');
                }}
              >
                <Ionicons name="medical" size={20} color={Colors.lightBlue} />
                <View style={styles.hospitalInfo}>
                  <Text style={styles.hospitalName}>{hospital.name}</Text>
                  <Text style={styles.hospitalAddress}>{hospital.address}</Text>
                </View>
                <TouchableOpacity
                  style={styles.directionsButton}
                  onPress={() => openInGoogleMaps(hospital)}
                >
                  <Ionicons name="navigate" size={16} color="white" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
            {filteredHospitals.length === 0 && (
              <Text style={styles.noResults}>No hospitals found</Text>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGray,
  },
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  searchContainer: {
    margin: 20,
    backgroundColor: Colors.white,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 8,
    elevation: 8,
    shadowColor: Colors.darkBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: Colors.bluishWhite,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: Colors.darkGray,
  },
  clearButton: {
    padding: 8,
  },
  locationButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.darkBlue,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.darkBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  resultsContainer: {
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20,
    maxHeight: 250,
    backgroundColor: Colors.white,
    borderRadius: 15,
    elevation: 6,
    shadowColor: Colors.darkBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: Colors.bluishWhite,
  },
  resultsList: {
    padding: 10,
  },
  hospitalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bluishWhite,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: Colors.darkBlue,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  hospitalInfo: {
    flex: 1,
    marginLeft: 12,
  },
  hospitalName: {
    fontSize: 16,
    color: Colors.darkGray,
    fontWeight: '600',
  },
  hospitalAddress: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 4,
  },
  directionsButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.darkBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: Colors.red,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.darkGray,
    marginTop: 10,
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: Colors.lightBlue,
    alignItems: 'center',
  },
  retryText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  noResults: {
    padding: 20,
    textAlign: 'center',
    color: Colors.gray,
    fontSize: 16,
  },
});

export default HospitalsNearby;