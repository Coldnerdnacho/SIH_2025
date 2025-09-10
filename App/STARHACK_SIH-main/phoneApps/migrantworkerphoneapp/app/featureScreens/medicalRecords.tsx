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
import TopNavbar from '../components/TopNavbar';
import { Colors } from '../constants/colors';

// Mock data - replace with Supabase fetch later
const mockRecords = [
  {
    id: 1,
    date: '2024-01-15',
    type: 'Blood Test',
    doctor: 'Dr. Smith',
    hospital: 'City Hospital',
    status: 'Normal',
  },
  {
    id: 2,
    date: '2024-01-10',
    type: 'X-Ray',
    doctor: 'Dr. Johnson',
    hospital: 'General Hospital',
    status: 'Review Required',
  },
  {
    id: 3,
    date: '2024-01-05',
    type: 'ECG',
    doctor: 'Dr. Brown',
    hospital: 'Care Clinic',
    status: 'Normal',
  },
];

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, recent, pending

  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  const fetchMedicalRecords = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual Supabase fetch
      setTimeout(() => {
        setRecords(mockRecords);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching medical records:', error);
      Alert.alert('Error', 'Failed to load medical records');
      setLoading(false);
    }
  };

  const getFilteredRecords = () => {
    switch (filter) {
      case 'recent':
        return records.filter(record => {
          const recordDate = new Date(record.date);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return recordDate >= thirtyDaysAgo;
        });
      case 'pending':
        return records.filter(record => record.status === 'Review Required');
      default:
        return records;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Normal':
        return '#27ae60';
      case 'Review Required':
        return '#e74c3c';
      default:
        return '#f39c12';
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <TopNavbar title="Medical Records" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.darkBlue} />
          <Text style={styles.loadingText}>Loading medical records...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopNavbar title="Medical Records" />
      
      <View style={styles.filterContainer}>
        {['all', 'recent', 'pending'].map(filterType => (
          <TouchableOpacity
            key={filterType}
            style={[
              styles.filterButton,
              filter === filterType && styles.activeFilter
            ]}
            onPress={() => setFilter(filterType)}
          >
            <Text style={[
              styles.filterText,
              filter === filterType && styles.activeFilterText
            ]}>
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.recordsList}>
        {getFilteredRecords().map(record => (
          <TouchableOpacity key={record.id} style={styles.recordCard}>
            <View style={styles.recordHeader}>
              <Text style={styles.recordType}>{record.type}</Text>
              <View style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(record.status) }
              ]}>
                <Text style={styles.statusText}>{record.status}</Text>
              </View>
            </View>
            
            <View style={styles.recordDetails}>
              <View style={styles.recordRow}>
                <Ionicons name="calendar" size={16} color="#666" />
                <Text style={styles.recordInfo}>{record.date}</Text>
              </View>
              
              <View style={styles.recordRow}>
                <Ionicons name="person" size={16} color="#666" />
                <Text style={styles.recordInfo}>{record.doctor}</Text>
              </View>
              
              <View style={styles.recordRow}>
                <Ionicons name="medical" size={16} color="#666" />
                <Text style={styles.recordInfo}>{record.hospital}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        
        {getFilteredRecords().length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No medical records found</Text>
          </View>
        )}
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
    marginTop: 12,
    fontSize: 16,
    color: Colors.gray,
    fontWeight: '500',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    marginBottom: 12,
  },
  filterButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: Colors.bluishWhite,
    borderWidth: 1,
    borderColor: Colors.lightBlue + '30',
  },
  activeFilter: {
    backgroundColor: Colors.lightBlue,
  },
  filterText: {
    color: Colors.gray,
    fontSize: 14,
    fontWeight: '500',
  },
  activeFilterText: {
    color: Colors.white,
    fontWeight: '600',
  },
  recordsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  recordCard: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: 18,
    marginBottom: 12,
    elevation: 4,
    shadowColor: Colors.darkBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: Colors.bluishWhite,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recordType: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.darkBlue,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    elevation: 2,
  },
  statusText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  recordDetails: {
    gap: 8,
  },
  recordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  recordInfo: {
    fontSize: 14,
    color: Colors.gray,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.gray,
    marginTop: 12,
    fontWeight: '500',
  },
});

export default MedicalRecords;