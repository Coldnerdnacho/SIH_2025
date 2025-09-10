import React from 'react';
import { StyleSheet, View } from 'react-native';
import Features from './features';
import Navbar from './NavBar';

const HomeScreen = () => (
  <View style={{ flex: 1 }}>
    <Navbar />
    <Features
      onDocumentsPress={() => {}}
      onAbhaPress={() => {}}
    />
  </View>
);

export default HomeScreen;

const styles = StyleSheet.create({});