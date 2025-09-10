import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from './constants/colors';

const notificationsData = [
  { id: '1', text: 'Welcome to the app!' },
  { id: '2', text: 'Your profile was updated.' },
  { id: '3', text: 'New job opportunities available.' },
];

const Navbar = () => {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navbar}>
        {/* Profile Section */}
        <TouchableOpacity
          style={styles.profileContainer}
          onPress={() => router.push('/profile')}
          activeOpacity={0.8}
        >
          <View style={styles.profileImage}>
            <AntDesign name="user" size={22} color={Colors.darkBlue} />
          </View>
        </TouchableOpacity>

        {/* Current Location Section */}
        <View style={styles.locationInfo}>
          <Text style={styles.locationLabel}>Current Location</Text>
          <View style={styles.locationRow}>
            <Text style={styles.locationText}>Thiruvananthapuram</Text>
            <Ionicons name="chevron-down" size={14} color={Colors.white} />
          </View>
        </View>

        {/* Right side - Icons */}
        <View style={styles.rightContainer}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setShowNotifications(!showNotifications)}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={22} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Notifications Modal */}
      <Modal
        visible={showNotifications}
        animationType="slide"
        transparent
        onRequestClose={() => setShowNotifications(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.notificationsModal}>
            <Text style={styles.notificationsTitle}>Notifications</Text>
            <FlatList
              data={notificationsData}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <View style={styles.notificationItem}>
                  <Text style={styles.notificationText}>{item.text}</Text>
                </View>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowNotifications(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.darkBlue,
  },
  navbar: {
    backgroundColor: Colors.darkBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    height: 65,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  profileImage: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.bluishWhite,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: Colors.darkBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  locationInfo: {
    flex: 1,
    alignItems: 'center',
  },
  locationLabel: {
    color: Colors.bluishWhite,
    fontSize: 11,
    opacity: 0.9,
    fontWeight: '400',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '600',
    marginRight: 6,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: `${Colors.darkBlue}80`,
    justifyContent: 'flex-end',
  },
  notificationsModal: {
    backgroundColor: Colors.white,
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 250,
    elevation: 10,
    shadowColor: Colors.darkBlue,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  notificationsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.darkBlue,
    textAlign: 'center',
  },
  notificationItem: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.bluishWhite,
  },
  notificationText: {
    fontSize: 15,
    color: Colors.darkGray,
    lineHeight: 20,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: Colors.darkBlue,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.darkBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  closeButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Navbar;