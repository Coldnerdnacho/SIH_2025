import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import TopNavbar from '../components/TopNavbar';
import { Colors } from '../constants/colors';

const emergencyNumbers = [
  { id: 1, name: 'Police', number: '100', icon: 'shield' },
  { id: 2, name: 'Fire Brigade', number: '101', icon: 'flame' },
  { id: 3, name: 'Ambulance', number: '102', icon: 'medical' },
  { id: 4, name: 'Disaster Management', number: '108', icon: 'warning' },
  { id: 5, name: 'Women Helpline', number: '1091', icon: 'woman' },
  { id: 6, name: 'Child Helpline', number: '1098', icon: 'people' },
  { id: 7, name: 'Railway Helpline', number: '139', icon: 'train' },
  { id: 8, name: 'Road Accident', number: '1073', icon: 'car' },
];

const EmergencyNumbers = () => {
  const [personalContacts, setPersonalContacts] = useState([
    { id: 1, name: 'Mom', number: '+919876543210' },
    { id: 2, name: 'Dad', number: '+919876543211' },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', number: '' });

  const makeCall = (number) => {
    Alert.alert(
      'Make Call',
      `Do you want to call ${number}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call', 
          onPress: () => {
            Linking.openURL(`tel:${number}`);
          }
        },
      ]
    );
  };

  const addPersonalContact = () => {
    if (newContact.name.trim() && newContact.number.trim()) {
      setPersonalContacts([
        ...personalContacts,
        {
          id: Date.now(),
          name: newContact.name.trim(),
          number: newContact.number.trim(),
        }
      ]);
      setNewContact({ name: '', number: '' });
      setShowAddModal(false);
    } else {
      Alert.alert('Error', 'Please fill in both name and number');
    }
  };

  const deletePersonalContact = (id) => {
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to delete this contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setPersonalContacts(personalContacts.filter(contact => contact.id !== id));
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TopNavbar title="Emergency Numbers" />

      <ScrollView style={styles.content}>
        {/* Emergency Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Services</Text>
          {emergencyNumbers.map(service => (
            <TouchableOpacity
              key={service.id}
              style={styles.emergencyCard}
              onPress={() => makeCall(service.number)}
            >
              <View style={styles.serviceInfo}>
                <View style={styles.iconContainer}>
                  <Ionicons name={service.icon} size={24} color="#e74c3c" />
                </View>
                <View style={styles.serviceDetails}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.serviceNumber}>{service.number}</Text>
                </View>
              </View>
              <Ionicons name="call" size={24} color="#e74c3c" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Personal Emergency Contacts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Emergency Contacts</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddModal(true)}
            >
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
          
          {personalContacts.map(contact => (
            <View key={contact.id} style={styles.personalCard}>
              <View style={styles.contactInfo}>
                <View style={styles.iconContainer}>
                  <Ionicons name="person" size={24} color="#2c5aa0" />
                </View>
                <View style={styles.contactDetails}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactNumber}>{contact.number}</Text>
                </View>
              </View>
              <View style={styles.contactActions}>
                <TouchableOpacity
                  style={styles.callButton}
                  onPress={() => makeCall(contact.number)}
                >
                  <Ionicons name="call" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deletePersonalContact(contact.id)}
                >
                  <Ionicons name="trash" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {personalContacts.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="person-add-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No personal contacts added</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Contact Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Emergency Contact</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Contact Name"
              value={newContact.name}
              onChangeText={(text) => setNewContact({...newContact, name: text})}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={newContact.number}
              onChangeText={(text) => setNewContact({...newContact, number: text})}
              keyboardType="phone-pad"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowAddModal(false);
                  setNewContact({ name: '', number: '' });
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.saveButton}
                onPress={addPersonalContact}
              >
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGray,
  },
  content: {
    flex: 1,
  },
  section: {
    margin: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.darkBlue,
    marginBottom: 16,
  },
  emergencyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    borderColor: Colors.bluishWhite,
  },
  personalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    borderColor: Colors.bluishWhite,
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.bluishWhite,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    elevation: 2,
    shadowColor: Colors.darkBlue,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  serviceDetails: {
    flex: 1,
  },
  contactDetails: {
    flex: 1,
  },
  serviceName: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.darkGray,
  },
  contactName: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.darkGray,
  },
  serviceNumber: {
    fontSize: 15,
    color: Colors.red,
    fontWeight: '600',
    marginTop: 2,
  },
  contactNumber: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 2,
  },
  contactActions: {
    flexDirection: 'row',
    gap: 12,
  },
  addButton: {
    backgroundColor: Colors.lightBlue,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.lightBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  callButton: {
    backgroundColor: Colors.green,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.green,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  deleteButton: {
    backgroundColor: Colors.red,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.red,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.gray,
    marginTop: 12,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: `${Colors.darkBlue}80`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    padding: 24,
    borderRadius: 20,
    width: '85%',
    elevation: 10,
    shadowColor: Colors.darkBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
    color: Colors.darkBlue,
  },
  input: {
    borderWidth: 2,
    borderColor: Colors.bluishWhite,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: Colors.bluishWhite + '50',
    color: Colors.darkGray,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 25,
    backgroundColor: Colors.bluishWhite,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.lightBlue,
  },
  saveButton: {
    flex: 1,
    padding: 14,
    borderRadius: 25,
    backgroundColor: Colors.darkBlue,
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.darkBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cancelText: {
    color: Colors.lightBlue,
    fontSize: 16,
    fontWeight: '600',
  },
  saveText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EmergencyNumbers;