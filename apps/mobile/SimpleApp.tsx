import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';

export default function SimpleApp() {
  const handleConnect = () => {
    Alert.alert('VPN Connection', 'Connecting to ConSERVERtive VPN...');
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('./assets/conservertive-logo.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.subtitle}>Fight for Internet Freedom</Text>
      
      <TouchableOpacity style={styles.button} onPress={handleConnect}>
        <Text style={styles.buttonText}>Connect VPN</Text>
      </TouchableOpacity>
      
      <View style={styles.features}>
        <Text style={styles.featureText}>🔒 Military-grade encryption</Text>
        <Text style={styles.featureText}>🌍 Global server network</Text>
        <Text style={styles.featureText}>❤️ Fight censorship worldwide</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 240,
    height: 120,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#94a3b8',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 40,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  features: {
    alignItems: 'center',
  },
  featureText: {
    color: '#94a3b8',
    fontSize: 16,
    marginBottom: 10,
  },
});
