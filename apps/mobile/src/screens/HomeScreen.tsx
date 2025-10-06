import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface VPNServer {
  id: string;
  name: string;
  country: string;
  flag: string;
  ping: number;
  load: number;
}

const mockServers: VPNServer[] = [
  { id: '1', name: 'New York', country: 'United States', flag: '🇺🇸', ping: 12, load: 23 },
  { id: '2', name: 'London', country: 'United Kingdom', flag: '🇬🇧', ping: 18, load: 45 },
  { id: '3', name: 'Tokyo', country: 'Japan', flag: '🇯🇵', ping: 25, load: 67 },
  { id: '4', name: 'Sydney', country: 'Australia', flag: '🇦🇺', ping: 32, load: 12 },
];

export default function HomeScreen() {
  const [isConnected, setIsConnected] = useState(false);
  const [selectedServer, setSelectedServer] = useState<VPNServer>(mockServers[0]);
  const [selectedProtocol, setSelectedProtocol] = useState('WireGuard');
  const [killSwitch, setKillSwitch] = useState(true);
  const [autoConnect, setAutoConnect] = useState(false);

  const handleConnect = () => {
    if (isConnected) {
      setIsConnected(false);
      Alert.alert('VPN Disconnected', 'You are now disconnected from ConSERVERtive VPN');
    } else {
      setIsConnected(true);
      Alert.alert('VPN Connected', `Connected to ${selectedServer.name}, ${selectedServer.country}`);
    }
  };

  const getStatusColor = () => {
    return isConnected ? '#10b981' : '#ef4444';
  };

  const getStatusText = () => {
    return isConnected ? 'Connected' : 'Disconnected';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/conservertive-logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Connection Status */}
        <View style={styles.statusContainer}>
          <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>

        {/* Current Server */}
        <View style={styles.serverCard}>
          <View style={styles.serverHeader}>
            <Text style={styles.serverFlag}>{selectedServer.flag}</Text>
            <View style={styles.serverInfo}>
              <Text style={styles.serverName}>{selectedServer.name}</Text>
              <Text style={styles.serverCountry}>{selectedServer.country}</Text>
            </View>
            <View style={styles.serverStats}>
              <Text style={styles.pingText}>{selectedServer.ping}ms</Text>
              <Text style={styles.loadText}>{selectedServer.load}% load</Text>
            </View>
          </View>
        </View>

        {/* Connect Button */}
        <TouchableOpacity 
          style={[styles.connectButton, { backgroundColor: isConnected ? '#ef4444' : '#3b82f6' }]}
          onPress={handleConnect}
        >
          <Ionicons 
            name={isConnected ? 'stop' : 'play'} 
            size={24} 
            color="#ffffff" 
            style={styles.buttonIcon}
          />
          <Text style={styles.connectButtonText}>
            {isConnected ? 'Disconnect' : 'Connect VPN'}
          </Text>
        </TouchableOpacity>

        {/* Quick Settings */}
        <View style={styles.settingsContainer}>
          <Text style={styles.settingsTitle}>Quick Settings</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="shield-checkmark" size={20} color="#3b82f6" />
              <Text style={styles.settingLabel}>Kill Switch</Text>
            </View>
            <Switch
              value={killSwitch}
              onValueChange={setKillSwitch}
              trackColor={{ false: '#374151', true: '#3b82f6' }}
              thumbColor={killSwitch ? '#ffffff' : '#9ca3af'}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="flash" size={20} color="#3b82f6" />
              <Text style={styles.settingLabel}>Auto Connect</Text>
            </View>
            <Switch
              value={autoConnect}
              onValueChange={setAutoConnect}
              trackColor={{ false: '#374151', true: '#3b82f6' }}
              thumbColor={autoConnect ? '#ffffff' : '#9ca3af'}
            />
          </View>
        </View>

        {/* Protocol Selection */}
        <View style={styles.protocolContainer}>
          <Text style={styles.protocolTitle}>Protocol</Text>
          <View style={styles.protocolButtons}>
            {['WireGuard', 'OpenVPN', 'IKEv2'].map((protocol) => (
              <TouchableOpacity
                key={protocol}
                style={[
                  styles.protocolButton,
                  selectedProtocol === protocol && styles.protocolButtonActive
                ]}
                onPress={() => setSelectedProtocol(protocol)}
              >
                <Text style={[
                  styles.protocolButtonText,
                  selectedProtocol === protocol && styles.protocolButtonTextActive
                ]}>
                  {protocol}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Features</Text>
          <View style={styles.featuresGrid}>
            <View style={styles.featureItem}>
              <Ionicons name="shield-checkmark" size={24} color="#10b981" />
              <Text style={styles.featureText}>Military-grade encryption</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="globe" size={24} color="#3b82f6" />
              <Text style={styles.featureText}>Global server network</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="heart" size={24} color="#ef4444" />
              <Text style={styles.featureText}>Fight censorship</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="eye-off" size={24} color="#8b5cf6" />
              <Text style={styles.featureText}>No-logs policy</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  logo: {
    width: 200,
    height: 100,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Sora',
  },
  serverCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#334155',
  },
  serverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serverFlag: {
    fontSize: 32,
    marginRight: 15,
  },
  serverInfo: {
    flex: 1,
  },
  serverName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Sora',
  },
  serverCountry: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 2,
  },
  serverStats: {
    alignItems: 'flex-end',
  },
  pingText: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '600',
  },
  loadText: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 30,
  },
  buttonIcon: {
    marginRight: 8,
  },
  connectButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Sora',
  },
  settingsContainer: {
    marginBottom: 30,
  },
  settingsTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Sora',
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 10,
    fontFamily: 'Sora',
  },
  protocolContainer: {
    marginBottom: 30,
  },
  protocolTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Sora',
    marginBottom: 15,
  },
  protocolButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  protocolButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    marginHorizontal: 4,
  },
  protocolButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  protocolButtonText: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Sora',
  },
  protocolButtonTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  featuresContainer: {
    marginBottom: 30,
  },
  featuresTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Sora',
    marginBottom: 15,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  featureText: {
    color: '#ffffff',
    fontSize: 14,
    marginLeft: 10,
    fontFamily: 'Sora',
  },
});





