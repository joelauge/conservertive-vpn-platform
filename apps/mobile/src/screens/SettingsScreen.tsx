import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const [killSwitch, setKillSwitch] = useState(true);
  const [autoConnect, setAutoConnect] = useState(false);
  const [dnsProtection, setDnsProtection] = useState(true);
  const [adBlocker, setAdBlocker] = useState(false);
  const [malwareProtection, setMalwareProtection] = useState(true);
  const [splitTunneling, setSplitTunneling] = useState(false);
  const [obfuscation, setObfuscation] = useState(false);
  const [ipv6Leak, setIpv6Leak] = useState(true);

  const handleProtocolChange = () => {
    Alert.alert(
      'Protocol Selection',
      'Choose your preferred VPN protocol:\n\n• WireGuard: Fastest, modern encryption\n• OpenVPN: Most compatible, battle-tested\n• IKEv2: Best for mobile, auto-reconnect',
      [
        { text: 'WireGuard', onPress: () => console.log('WireGuard selected') },
        { text: 'OpenVPN', onPress: () => console.log('OpenVPN selected') },
        { text: 'IKEv2', onPress: () => console.log('IKEv2 selected') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleClearLogs = () => {
    Alert.alert(
      'Clear Connection Logs',
      'This will clear all connection logs and statistics. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => console.log('Logs cleared') },
      ]
    );
  };

  const handleExportConfig = () => {
    Alert.alert('Export Configuration', 'Configuration exported to Downloads folder');
  };

  const SettingRow = ({ 
    icon, 
    title, 
    subtitle, 
    value, 
    onValueChange, 
    type = 'switch',
    onPress 
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
    value?: boolean;
    onValueChange?: (value: boolean) => void;
    type?: 'switch' | 'button';
    onPress?: () => void;
  }) => (
    <TouchableOpacity 
      style={styles.settingRow} 
      onPress={type === 'button' ? onPress : undefined}
      disabled={type === 'switch'}
    >
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color="#3b82f6" />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {type === 'switch' ? (
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: '#374151', true: '#3b82f6' }}
            thumbColor={value ? '#ffffff' : '#9ca3af'}
          />
        ) : (
          <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Security Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          
          <SettingRow
            icon="shield-checkmark"
            title="Kill Switch"
            subtitle="Block internet if VPN disconnects"
            value={killSwitch}
            onValueChange={setKillSwitch}
          />
          
          <SettingRow
            icon="shield"
            title="DNS Protection"
            subtitle="Use secure DNS servers"
            value={dnsProtection}
            onValueChange={setDnsProtection}
          />
          
          <SettingRow
            icon="bug"
            title="Malware Protection"
            subtitle="Block malicious websites"
            value={malwareProtection}
            onValueChange={setMalwareProtection}
          />
          
          <SettingRow
            icon="eye-off"
            title="IPv6 Leak Protection"
            subtitle="Prevent IPv6 address leaks"
            value={ipv6Leak}
            onValueChange={setIpv6Leak}
          />
        </View>

        {/* Connection Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connection</Text>
          
          <SettingRow
            icon="flash"
            title="Auto Connect"
            subtitle="Connect automatically on startup"
            value={autoConnect}
            onValueChange={setAutoConnect}
          />
          
          <SettingRow
            icon="code-slash"
            title="Protocol"
            subtitle="WireGuard"
            type="button"
            onPress={handleProtocolChange}
          />
          
          <SettingRow
            icon="git-network"
            title="Split Tunneling"
            subtitle="Route some apps through VPN"
            value={splitTunneling}
            onValueChange={setSplitTunneling}
          />
          
          <SettingRow
            icon="eye"
            title="Obfuscation"
            subtitle="Hide VPN traffic"
            value={obfuscation}
            onValueChange={setObfuscation}
          />
        </View>

        {/* Privacy Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          
          <SettingRow
            icon="stop-circle"
            title="Ad Blocker"
            subtitle="Block advertisements"
            value={adBlocker}
            onValueChange={setAdBlocker}
          />
          
          <SettingRow
            icon="trash"
            title="Clear Connection Logs"
            subtitle="Remove all connection history"
            type="button"
            onPress={handleClearLogs}
          />
        </View>

        {/* Advanced Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Advanced</Text>
          
          <SettingRow
            icon="download"
            title="Export Configuration"
            subtitle="Download VPN config files"
            type="button"
            onPress={handleExportConfig}
          />
          
          <SettingRow
            icon="information-circle"
            title="About"
            subtitle="Version 1.0.0"
            type="button"
            onPress={() => Alert.alert('About', 'ConSERVERtive VPN v1.0.0\nFighting for internet freedom worldwide')}
          />
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <SettingRow
            icon="help-circle"
            title="Help Center"
            subtitle="Get help and support"
            type="button"
            onPress={() => Alert.alert('Help Center', 'Visit our help center at help.conservertive.co')}
          />
          
          <SettingRow
            icon="mail"
            title="Contact Support"
            subtitle="support@conservertive.co"
            type="button"
            onPress={() => Alert.alert('Contact Support', 'Email us at support@conservertive.co')}
          />
          
          <SettingRow
            icon="star"
            title="Rate App"
            subtitle="Rate us on the App Store"
            type="button"
            onPress={() => Alert.alert('Rate App', 'Thank you for your support!')}
          />
        </View>

        {/* Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          
          <SettingRow
            icon="document-text"
            title="Privacy Policy"
            subtitle="Read our privacy policy"
            type="button"
            onPress={() => Alert.alert('Privacy Policy', 'Visit our privacy policy at conservertive.co/privacy')}
          />
          
          <SettingRow
            icon="document"
            title="Terms of Service"
            subtitle="Read our terms of service"
            type="button"
            onPress={() => Alert.alert('Terms of Service', 'Visit our terms at conservertive.co/terms')}
          />
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
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Sora',
    marginHorizontal: 20,
    marginBottom: 15,
    marginTop: 10,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#1e293b',
    marginHorizontal: 20,
    marginBottom: 1,
    borderWidth: 1,
    borderColor: '#334155',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 15,
    flex: 1,
  },
  settingTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Sora',
    fontWeight: '500',
  },
  settingSubtitle: {
    color: '#94a3b8',
    fontSize: 14,
    fontFamily: 'Sora',
    marginTop: 2,
  },
  settingRight: {
    marginLeft: 15,
  },
});






