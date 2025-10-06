import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import VPNService from './src/services/VPNService';
import NativeVPNService from './src/services/NativeVPNService';
import VPNCredentialsService from './src/services/VPNCredentialsService';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentServer, setCurrentServer] = useState(null);
  const [servers, setServers] = useState([]);
  const [trafficStats, setTrafficStats] = useState({ bytesIn: 0, bytesOut: 0, connectedTime: 0 });

  // Helper functions
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDuration = (connectedTime: number): string => {
    if (connectedTime === 0) return '0s';
    const now = Date.now() / 1000;
    const duration = now - connectedTime;
    
    if (duration < 60) return `${Math.floor(duration)}s`;
    if (duration < 3600) return `${Math.floor(duration / 60)}m`;
    return `${Math.floor(duration / 3600)}h`;
  };

  useEffect(() => {
    loadServers();
    checkConnectionStatus();
    
    // Listen for VPN status changes
    const subscription = NativeVPNService.onVPNStatusChange((data) => {
      console.log('VPN Status Changed:', data);
      const status = data.status;
      setIsConnected(status === 'connected');
      if (status === 'connected' || status === 'disconnected') {
        setIsConnecting(false);
      }
      
      // Update traffic stats if provided
      if (data.trafficStats) {
        setTrafficStats(data.trafficStats);
      }
    });
    
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  const loadServers = async () => {
    try {
      const serverList = await VPNService.getServers();
      setServers(serverList);
    } catch (error) {
      console.error('Failed to load servers:', error);
    }
  };

  const checkConnectionStatus = () => {
    const status = VPNService.getConnectionStatus();
    setIsConnected(status.connected);
    setCurrentServer(status.server);
  };

  const handleConnect = async () => {
    if (isConnecting) return;

    try {
      setIsConnecting(true);

      if (isConnected) {
        // Disconnect using native VPN service
        const success = await NativeVPNService.disconnectVPN();
        if (success) {
          setIsConnected(false);
          setCurrentServer(null);
          Alert.alert('VPN Disconnected', 'You are now disconnected from ConSERVERtive VPN');
        } else {
          Alert.alert('Disconnect Failed', 'Failed to disconnect from VPN. Please try again.');
        }
      } else {
        // Connect using native VPN service
        if (servers.length === 0) {
          Alert.alert('No Servers', 'No VPN servers available. Please try again later.');
          return;
        }

        // Get real VPN credentials
        const credentials = await VPNCredentialsService.fetchCredentials();
        if (!credentials) {
          Alert.alert('Credentials Error', 'Failed to get VPN credentials. Please try again.');
          return;
        }
        
        const serverEndpoint = VPNCredentialsService.getServerEndpoint(credentials.serverId);
        
        // Install VPN configuration with real credentials
        const configInstalled = await NativeVPNService.installVPNConfiguration({
          serverAddress: serverEndpoint,
          serverPort: 500,
          username: credentials.username,
          password: credentials.password,
          protocol: 'IKEv2'
        });

        if (!configInstalled) {
          Alert.alert(
            'Configuration Failed', 
            'Failed to install VPN configuration. Please check your device settings.\n\nFor personalized VPN credentials:\n1. Visit conservertive.co\n2. Sign in to your account\n3. Go to Dashboard\n4. Generate VPN credentials\n5. Use those credentials in this app'
          );
          return;
        }

        // Connect to VPN
        const success = await NativeVPNService.connectVPN();

        if (success) {
          setIsConnected(true);
          // Create a server object with the real credentials info
          const connectedServer = {
            name: credentials.serverId.replace('-', ' ').toUpperCase(),
            country: 'United States', // This would come from the backend
            flag: '🇺🇸',
            protocol: 'IKEv2',
            ping: 15,
            load: 25,
            endpoint: serverEndpoint
          };
          setCurrentServer(connectedServer);
          Alert.alert(
            'VPN Connected', 
            `Successfully connected to ${connectedServer.name}\n\nYour connection is now protected with military-grade encryption.\n\nServer: ${serverEndpoint}\nUsername: ${credentials.username}`
          );
        } else {
          Alert.alert('Connection Failed', 'Failed to connect to VPN. Please check your internet connection and try again.');
        }
      }
    } catch (error) {
      console.error('VPN operation failed:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const renderHomeScreen = () => (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('./assets/conservertive-logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Connection Status */}
      <View style={styles.statusContainer}>
        <View style={[styles.statusIndicator, { backgroundColor: isConnected ? '#10b981' : '#ef4444' }]} />
        <Text style={styles.statusText}>{isConnected ? 'Connected' : 'Disconnected'}</Text>
      </View>

      {/* Current Server Info */}
      {currentServer && (
        <View style={styles.serverInfoCard}>
          <Text style={styles.serverFlag}>{currentServer.flag}</Text>
          <View style={styles.serverInfo}>
            <Text style={styles.serverName}>{currentServer.name}</Text>
            <Text style={styles.serverCountry}>{currentServer.country}</Text>
            <Text style={styles.serverProtocol}>{currentServer.protocol}</Text>
          </View>
          <View style={styles.serverStats}>
            <Text style={styles.pingText}>{currentServer.ping}ms</Text>
            <Text style={styles.loadText}>{currentServer.load}% load</Text>
          </View>
        </View>
      )}

      {/* Traffic Stats */}
      {isConnected && (
        <View style={styles.trafficStatsCard}>
          <Text style={styles.trafficStatsTitle}>Traffic Statistics</Text>
          <View style={styles.trafficStatsGrid}>
            <View style={styles.trafficStatItem}>
              <Ionicons name="arrow-down" size={20} color="#10b981" />
              <Text style={styles.trafficStatValue}>{formatBytes(trafficStats.bytesIn)}</Text>
              <Text style={styles.trafficStatLabel}>Downloaded</Text>
            </View>
            <View style={styles.trafficStatItem}>
              <Ionicons name="arrow-up" size={20} color="#3b82f6" />
              <Text style={styles.trafficStatValue}>{formatBytes(trafficStats.bytesOut)}</Text>
              <Text style={styles.trafficStatLabel}>Uploaded</Text>
            </View>
            <View style={styles.trafficStatItem}>
              <Ionicons name="time" size={20} color="#8b5cf6" />
              <Text style={styles.trafficStatValue}>{formatDuration(trafficStats.connectedTime)}</Text>
              <Text style={styles.trafficStatLabel}>Connected</Text>
            </View>
          </View>
        </View>
      )}

      {/* Connect Button */}
      <TouchableOpacity 
        style={[
          styles.connectButton, 
          { 
            backgroundColor: isConnected ? '#ef4444' : '#3b82f6',
            opacity: isConnecting ? 0.7 : 1
          }
        ]}
        onPress={handleConnect}
        disabled={isConnecting}
      >
        <Ionicons 
          name={isConnecting ? 'hourglass' : (isConnected ? 'stop' : 'play')} 
          size={24} 
          color="#ffffff" 
          style={styles.buttonIcon}
        />
        <Text style={styles.connectButtonText}>
          {isConnecting ? 'Connecting...' : (isConnected ? 'Disconnect' : 'Connect VPN')}
        </Text>
      </TouchableOpacity>

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
  );

  const renderServersScreen = () => (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <Text style={styles.screenTitle}>Server Selection</Text>
      <Text style={styles.screenSubtitle}>Choose your preferred server location</Text>
      
      {/* Server List */}
      {[
        { name: 'New York', country: 'United States', flag: '🇺🇸', ping: 12, load: 23 },
        { name: 'London', country: 'United Kingdom', flag: '🇬🇧', ping: 18, load: 35 },
        { name: 'Tokyo', country: 'Japan', flag: '🇯🇵', ping: 25, load: 12 },
        { name: 'Sydney', country: 'Australia', flag: '🇦🇺', ping: 32, load: 12 },
      ].map((server, index) => (
        <TouchableOpacity key={index} style={styles.serverItem}>
          <Text style={styles.serverFlag}>{server.flag}</Text>
          <View style={styles.serverInfo}>
            <Text style={styles.serverName}>{server.name}</Text>
            <Text style={styles.serverCountry}>{server.country}</Text>
          </View>
          <View style={styles.serverStats}>
            <Text style={styles.pingText}>{server.ping}ms</Text>
            <Text style={styles.loadText}>{server.load}% load</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderSettingsScreen = () => (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <Text style={styles.screenTitle}>Settings</Text>
      <Text style={styles.screenSubtitle}>Configure your VPN preferences</Text>
      
      {/* Settings Items */}
      {[
        { icon: 'shield-checkmark', title: 'Kill Switch', subtitle: 'Block internet if VPN disconnects' },
        { icon: 'flash', title: 'Auto Connect', subtitle: 'Connect automatically on startup' },
        { icon: 'shield', title: 'DNS Protection', subtitle: 'Use secure DNS servers' },
        { icon: 'eye-off', title: 'IPv6 Leak Protection', subtitle: 'Prevent IPv6 address leaks' },
      ].map((setting, index) => (
        <View key={index} style={styles.settingItem}>
          <Ionicons name={setting.icon as any} size={24} color="#3b82f6" />
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>{setting.title}</Text>
            <Text style={styles.settingSubtitle}>{setting.subtitle}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderProfileScreen = () => (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <View style={styles.profileHeader}>
        <Image 
          source={{ uri: 'https://via.placeholder.com/80x80/3b82f6/ffffff?text=JA' }}
          style={styles.avatar}
        />
        <Text style={styles.userName}>Joel Auge</Text>
        <Text style={styles.userEmail}>joelauge@gmail.com</Text>
        <View style={styles.planBadge}>
          <Text style={styles.planText}>Premium Plan</Text>
        </View>
      </View>

      {/* Account Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>127</Text>
          <Text style={styles.statLabel}>Days Connected</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>2.4GB</Text>
          <Text style={styles.statLabel}>Data Protected</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>1</Text>
          <Text style={styles.statLabel}>User Sponsored</Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'servers':
        return renderServersScreen();
      case 'settings':
        return renderSettingsScreen();
      case 'profile':
        return renderProfileScreen();
      default:
        return renderHomeScreen();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Main Content */}
      {renderCurrentScreen()}
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {[
          { key: 'home', icon: 'home', label: 'Home' },
          { key: 'servers', icon: 'globe', label: 'Servers' },
          { key: 'settings', icon: 'settings', label: 'Settings' },
          { key: 'profile', icon: 'person', label: 'Profile' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={styles.navItem}
            onPress={() => setCurrentScreen(tab.key)}
          >
            <Ionicons
              name={currentScreen === tab.key ? tab.icon : `${tab.icon}-outline`}
              size={24}
              color={currentScreen === tab.key ? '#3b82f6' : '#94a3b8'}
            />
            <Text style={[
              styles.navLabel,
              { color: currentScreen === tab.key ? '#3b82f6' : '#94a3b8' }
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  screen: {
    flex: 1,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 30,
  },
  logo: {
    width: 250,
    height: 125,
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
  },
  serverInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  serverFlag: {
    fontSize: 24,
    marginRight: 15,
  },
  serverInfo: {
    flex: 1,
  },
  serverName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  serverCountry: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  serverProtocol: {
    color: '#3b82f6',
    fontSize: 10,
    marginTop: 2,
    fontWeight: '600',
  },
  serverStats: {
    alignItems: 'flex-end',
  },
  trafficStatsCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  trafficStatsTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  trafficStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  trafficStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  trafficStatValue: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 5,
  },
  trafficStatLabel: {
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
  },
  featuresContainer: {
    marginBottom: 30,
  },
  featuresTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
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
  },
  screenTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  screenSubtitle: {
    color: '#94a3b8',
    fontSize: 16,
    marginBottom: 30,
  },
  serverItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  serverFlag: {
    fontSize: 24,
    marginRight: 15,
  },
  serverInfo: {
    flex: 1,
  },
  serverName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  serverCountry: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  serverStats: {
    alignItems: 'flex-end',
  },
  pingText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '600',
  },
  loadText: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  settingInfo: {
    marginLeft: 15,
    flex: 1,
  },
  settingTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtitle: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 2,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#3b82f6',
    marginBottom: 15,
  },
  userName: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 5,
  },
  userEmail: {
    color: '#94a3b8',
    fontSize: 16,
    marginBottom: 15,
  },
  planBadge: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  planText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '600',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 4,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingBottom: 5,
    paddingTop: 5,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});
