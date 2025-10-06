import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
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
  city: string;
  isRecommended?: boolean;
}

const servers: VPNServer[] = [
  { id: '1', name: 'New York', country: 'United States', flag: '🇺🇸', ping: 12, load: 23, city: 'New York', isRecommended: true },
  { id: '2', name: 'Los Angeles', country: 'United States', flag: '🇺🇸', ping: 15, load: 45, city: 'Los Angeles' },
  { id: '3', name: 'London', country: 'United Kingdom', flag: '🇬🇧', ping: 18, load: 35, city: 'London', isRecommended: true },
  { id: '4', name: 'Manchester', country: 'United Kingdom', flag: '🇬🇧', ping: 22, load: 67, city: 'Manchester' },
  { id: '5', name: 'Tokyo', country: 'Japan', flag: '🇯🇵', ping: 25, load: 12, city: 'Tokyo', isRecommended: true },
  { id: '6', name: 'Osaka', country: 'Japan', flag: '🇯🇵', ping: 28, load: 34, city: 'Osaka' },
  { id: '7', name: 'Sydney', country: 'Australia', flag: '🇦🇺', ping: 32, load: 12, city: 'Sydney' },
  { id: '8', name: 'Melbourne', country: 'Australia', flag: '🇦🇺', ping: 35, load: 28, city: 'Melbourne' },
  { id: '9', name: 'Toronto', country: 'Canada', flag: '🇨🇦', ping: 8, load: 15, city: 'Toronto', isRecommended: true },
  { id: '10', name: 'Vancouver', country: 'Canada', flag: '🇨🇦', ping: 10, load: 22, city: 'Vancouver' },
  { id: '11', name: 'Berlin', country: 'Germany', flag: '🇩🇪', ping: 20, load: 18, city: 'Berlin' },
  { id: '12', name: 'Frankfurt', country: 'Germany', flag: '🇩🇪', ping: 18, load: 25, city: 'Frankfurt', isRecommended: true },
  { id: '13', name: 'Paris', country: 'France', flag: '🇫🇷', ping: 19, load: 30, city: 'Paris' },
  { id: '14', name: 'Amsterdam', country: 'Netherlands', flag: '🇳🇱', ping: 16, load: 20, city: 'Amsterdam', isRecommended: true },
  { id: '15', name: 'Singapore', country: 'Singapore', flag: '🇸🇬', ping: 30, load: 40, city: 'Singapore' },
  { id: '16', name: 'Hong Kong', country: 'Hong Kong', flag: '🇭🇰', ping: 28, load: 35, city: 'Hong Kong' },
];

export default function ServersScreen() {
  const [selectedServer, setSelectedServer] = useState<VPNServer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'ping' | 'load' | 'name'>('ping');

  const filteredServers = servers
    .filter(server => 
      server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      server.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      server.city.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'ping':
          return a.ping - b.ping;
        case 'load':
          return a.load - b.load;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const handleServerSelect = (server: VPNServer) => {
    setSelectedServer(server);
    Alert.alert(
      'Server Selected',
      `Selected ${server.name}, ${server.country}\nPing: ${server.ping}ms\nLoad: ${server.load}%`,
      [{ text: 'OK' }]
    );
  };

  const getPingColor = (ping: number) => {
    if (ping < 20) return '#10b981';
    if (ping < 50) return '#f59e0b';
    return '#ef4444';
  };

  const getLoadColor = (load: number) => {
    if (load < 30) return '#10b981';
    if (load < 70) return '#f59e0b';
    return '#ef4444';
  };

  const renderServer = ({ item }: { item: VPNServer }) => (
    <TouchableOpacity
      style={[
        styles.serverItem,
        selectedServer?.id === item.id && styles.serverItemSelected,
        item.isRecommended && styles.serverItemRecommended,
      ]}
      onPress={() => handleServerSelect(item)}
    >
      <View style={styles.serverHeader}>
        <Text style={styles.serverFlag}>{item.flag}</Text>
        <View style={styles.serverInfo}>
          <View style={styles.serverNameRow}>
            <Text style={styles.serverName}>{item.name}</Text>
            {item.isRecommended && (
              <View style={styles.recommendedBadge}>
                <Text style={styles.recommendedText}>Recommended</Text>
              </View>
            )}
          </View>
          <Text style={styles.serverLocation}>{item.city}, {item.country}</Text>
        </View>
        <View style={styles.serverStats}>
          <View style={styles.statItem}>
            <Ionicons name="time" size={14} color={getPingColor(item.ping)} />
            <Text style={[styles.statText, { color: getPingColor(item.ping) }]}>
              {item.ping}ms
            </Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="trending-up" size={14} color={getLoadColor(item.load)} />
            <Text style={[styles.statText, { color: getLoadColor(item.load) }]}>
              {item.load}%
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search servers..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <View style={styles.sortButtons}>
          {[
            { key: 'ping', label: 'Ping' },
            { key: 'load', label: 'Load' },
            { key: 'name', label: 'Name' },
          ].map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.sortButton,
                sortBy === option.key && styles.sortButtonActive,
              ]}
              onPress={() => setSortBy(option.key as any)}
            >
              <Text style={[
                styles.sortButtonText,
                sortBy === option.key && styles.sortButtonTextActive,
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Server List */}
      <FlatList
        data={filteredServers}
        renderItem={renderServer}
        keyExtractor={(item) => item.id}
        style={styles.serverList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.serverListContent}
      />

      {/* Quick Connect */}
      {selectedServer && (
        <View style={styles.quickConnectContainer}>
          <TouchableOpacity style={styles.quickConnectButton}>
            <Ionicons name="flash" size={20} color="#ffffff" />
            <Text style={styles.quickConnectText}>
              Connect to {selectedServer.name}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#334155',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Sora',
    paddingVertical: 12,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  sortLabel: {
    color: '#94a3b8',
    fontSize: 14,
    fontFamily: 'Sora',
    marginRight: 10,
  },
  sortButtons: {
    flexDirection: 'row',
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    marginRight: 8,
  },
  sortButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  sortButtonText: {
    color: '#94a3b8',
    fontSize: 12,
    fontFamily: 'Sora',
  },
  sortButtonTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  serverList: {
    flex: 1,
  },
  serverListContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  serverItem: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  serverItemSelected: {
    borderColor: '#3b82f6',
    backgroundColor: '#1e3a8a',
  },
  serverItemRecommended: {
    borderColor: '#10b981',
  },
  serverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serverFlag: {
    fontSize: 24,
    marginRight: 15,
  },
  serverInfo: {
    flex: 1,
  },
  serverNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serverName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Sora',
  },
  recommendedBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  recommendedText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Sora',
  },
  serverLocation: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
    fontFamily: 'Sora',
  },
  serverStats: {
    alignItems: 'flex-end',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    fontFamily: 'Sora',
  },
  quickConnectContainer: {
    padding: 20,
    backgroundColor: '#1e293b',
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  quickConnectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 15,
    borderRadius: 12,
  },
  quickConnectText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    fontFamily: 'Sora',
  },
});






