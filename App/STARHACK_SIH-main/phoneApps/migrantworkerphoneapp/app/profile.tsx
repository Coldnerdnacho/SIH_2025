import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import TopNavbar from './components/TopNavbar';
import { Colors } from './constants/colors';

const Profile = () => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editField, setEditField] = useState('');
  const [tempValue, setTempValue] = useState('');
  
  const [userProfile, setUserProfile] = useState({
    name: 'Rajesh Kumar',
    phoneNumber: '+91 9876543210',
    aadharNumber: '1234 5678 9012',
    abhaId: 'ABHA123456789012',
    email: 'rajesh.kumar@email.com',
    gender: 'Male',
    age: '32',
    height: '5\'8"',
    weight: '70 kg',
    bloodGroup: 'B+',
    disabilities: 'None',
    emergencyContact: '+91 9876543211',
    address: '123, MG Road, Thiruvananthapuram, Kerala - 695001',
    occupation: 'Construction Worker',
    languagesSpoken: 'Hindi, Malayalam, English',
  });

  const profileSections = [
    {
      title: 'Personal Information',
      data: [
        { label: 'Full Name', value: userProfile.name, key: 'name', icon: 'person' },
        { label: 'Phone Number', value: userProfile.phoneNumber, key: 'phoneNumber', icon: 'call' },
        { label: 'Email', value: userProfile.email, key: 'email', icon: 'mail' },
        { label: 'Gender', value: userProfile.gender, key: 'gender', icon: 'male-female' },
        { label: 'Age', value: userProfile.age, key: 'age', icon: 'calendar' },
      ]
    },
    {
      title: 'Identity Documents',
      data: [
        { label: 'Aadhar Number', value: userProfile.aadharNumber, key: 'aadharNumber', icon: 'card', sensitive: true },
        { label: 'ABHA ID', value: userProfile.abhaId, key: 'abhaId', icon: 'medical', sensitive: true },
      ]
    },
    {
      title: 'Health Information',
      data: [
        { label: 'Height', value: userProfile.height, key: 'height', icon: 'resize' },
        { label: 'Weight', value: userProfile.weight, key: 'weight', icon: 'fitness' },
        { label: 'Blood Group', value: userProfile.bloodGroup, key: 'bloodGroup', icon: 'water' },
        { label: 'Disabilities', value: userProfile.disabilities, key: 'disabilities', icon: 'accessibility' },
      ]
    },
    {
      title: 'Other Information',
      data: [
        { label: 'Emergency Contact', value: userProfile.emergencyContact, key: 'emergencyContact', icon: 'call' },
        { label: 'Address', value: userProfile.address, key: 'address', icon: 'location', multiline: true },
        { label: 'Occupation', value: userProfile.occupation, key: 'occupation', icon: 'briefcase' },
        { label: 'Languages', value: userProfile.languagesSpoken, key: 'languagesSpoken', icon: 'language' },
      ]
    }
  ];

  const openEditModal = (field, currentValue, label) => {
    setEditField({ key: field, label });
    setTempValue(currentValue);
    setShowEditModal(true);
  };

  const saveEdit = () => {
    if (tempValue.trim()) {
      setUserProfile(prev => ({
        ...prev,
        [editField.key]: tempValue.trim()
      }));
      setShowEditModal(false);
      setTempValue('');
      setEditField('');
    } else {
      Alert.alert('Error', 'Please enter a valid value');
    }
  };

  const maskSensitiveData = (value, sensitive) => {
    if (!sensitive) return value;
    if (value.length <= 4) return value;
    return value.substring(0, 4) + ' **** ****';
  };

  return (
    <View style={styles.container}>
      <TopNavbar title="Profile" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.profileImageContainer}>
            <Ionicons name="person" size={40} color={Colors.darkBlue} />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.userName}>{userProfile.name}</Text>
            <Text style={styles.userOccupation}>{userProfile.occupation}</Text>
          </View>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setIsEditing(!isEditing)}
            activeOpacity={0.8}
          >
            <Ionicons name={isEditing ? "checkmark" : "create"} size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {profileSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            
            {section.data.map((item, itemIndex) => (
              <View key={itemIndex} style={styles.profileItem}>
                <View style={styles.itemLeft}>
                  <View style={styles.iconContainer}>
                    <Ionicons name={item.icon} size={20} color={Colors.lightBlue} />
                  </View>
                  <View style={styles.itemContent}>
                    <Text style={styles.itemLabel}>{item.label}</Text>
                    <Text style={[
                      styles.itemValue, 
                      item.multiline && styles.multilineValue
                    ]}>
                      {maskSensitiveData(item.value, item.sensitive)}
                    </Text>
                  </View>
                </View>
                
                {isEditing && (
                  <TouchableOpacity
                    style={styles.editItemButton}
                    onPress={() => openEditModal(item.key, item.value, item.label)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="create-outline" size={18} color={Colors.lightBlue} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        ))}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
            <Ionicons name="download-outline" size={22} color={Colors.lightBlue} />
            <Text style={styles.actionText}>Download Profile PDF</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.gray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
            <Ionicons name="share-outline" size={22} color={Colors.lightBlue} />
            <Text style={styles.actionText}>Share Profile</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.gray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
            <Ionicons name="shield-checkmark-outline" size={22} color={Colors.lightBlue} />
            <Text style={styles.actionText}>Privacy Settings</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.gray} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton} 
            activeOpacity={0.8}
            onPress={() => router.push('./screens/LoginScreen')}
          >
            <Ionicons name="log-in-outline" size={22} color={Colors.lightBlue} />
            <Text style={styles.actionText}>Login / Signup</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.gray} />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit {editField.label}</Text>
            
            <TextInput
              style={[
                styles.modalInput,
                editField.key === 'address' && styles.multilineInput
              ]}
              value={tempValue}
              onChangeText={setTempValue}
              placeholder={`Enter ${editField.label}`}
              placeholderTextColor={Colors.gray}
              multiline={editField.key === 'address'}
              numberOfLines={editField.key === 'address' ? 3 : 1}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowEditModal(false);
                  setTempValue('');
                  setEditField('');
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.saveButton}
                onPress={saveEdit}
                activeOpacity={0.8}
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
  header: {
    backgroundColor: Colors.lightBlue,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.bluishWhite,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    elevation: 4,
    shadowColor: Colors.darkBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  headerInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 4,
  },
  userOccupation: {
    fontSize: 16,
    color: Colors.bluishWhite,
    fontWeight: '500',
  },
  editButton: {
    backgroundColor: Colors.darkBlue,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.darkBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.darkBlue,
    marginBottom: 16,
    paddingLeft: 4,
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: Colors.darkBlue,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.bluishWhite,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 14,
    color: Colors.gray,
    fontWeight: '500',
    marginBottom: 2,
  },
  itemValue: {
    fontSize: 16,
    color: Colors.darkGray,
    fontWeight: '600',
  },
  multilineValue: {
    lineHeight: 20,
  },
  editItemButton: {
    padding: 8,
    borderRadius: 15,
    backgroundColor: Colors.bluishWhite,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: Colors.darkBlue,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    color: Colors.darkGray,
    fontWeight: '600',
    marginLeft: 12,
  },
  bottomSpacing: {
    height: 30,
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
    marginBottom: 20,
    textAlign: 'center',
    color: Colors.darkBlue,
  },
  modalInput: {
    borderWidth: 2,
    borderColor: Colors.bluishWhite,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: Colors.bluishWhite + '30',
    color: Colors.darkGray,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
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

export default Profile;