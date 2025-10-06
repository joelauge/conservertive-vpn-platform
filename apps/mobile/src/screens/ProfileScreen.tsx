import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => console.log('Signed out') },
      ]
    );
  };

  const handleUpgrade = () => {
    Alert.alert('Upgrade Account', 'Redirecting to upgrade options...');
  };

  const handleSponsor = () => {
    Alert.alert('Sponsor User', 'You are sponsoring 1 user in a censored country!');
  };

  const ProfileRow = ({ 
    icon, 
    title, 
    subtitle, 
    onPress,
    showArrow = true 
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
    onPress: () => void;
    showArrow?: boolean;
  }) => (
    <TouchableOpacity style={styles.profileRow} onPress={onPress}>
      <View style={styles.profileRowLeft}>
        <Ionicons name={icon} size={24} color="#3b82f6" />
        <View style={styles.profileRowText}>
          <Text style={styles.profileRowTitle}>{title}</Text>
          {subtitle && <Text style={styles.profileRowSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {showArrow && (
        <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: 'https://via.placeholder.com/80x80/3b82f6/ffffff?text=JA' }}
              style={styles.avatar}
            />
          </View>
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

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <ProfileRow
            icon="card"
            title="Billing & Subscription"
            subtitle="Manage your subscription"
            onPress={() => Alert.alert('Billing', 'Redirecting to billing management...')}
          />
          
          <ProfileRow
            icon="arrow-up-circle"
            title="Upgrade Plan"
            subtitle="Get more features"
            onPress={handleUpgrade}
          />
          
          <ProfileRow
            icon="heart"
            title="Sponsor Another User"
            subtitle="Help fight censorship"
            onPress={handleSponsor}
          />
          
          <ProfileRow
            icon="gift"
            title="Refer Friends"
            subtitle="Earn rewards for referrals"
            onPress={() => Alert.alert('Refer Friends', 'Share your referral code: CONSERVE2025')}
          />
        </View>

        {/* Usage & Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Usage & Activity</Text>
          
          <ProfileRow
            icon="analytics"
            title="Usage Statistics"
            subtitle="View your VPN usage"
            onPress={() => Alert.alert('Usage Stats', 'Showing usage statistics...')}
          />
          
          <ProfileRow
            icon="time"
            title="Connection History"
            subtitle="View past connections"
            onPress={() => Alert.alert('Connection History', 'Showing connection history...')}
          />
          
          <ProfileRow
            icon="download"
            title="Download Reports"
            subtitle="Export your data"
            onPress={() => Alert.alert('Download Reports', 'Generating reports...')}
          />
        </View>

        {/* Impact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Impact</Text>
          
          <View style={styles.impactCard}>
            <View style={styles.impactHeader}>
              <Ionicons name="globe" size={24} color="#10b981" />
              <Text style={styles.impactTitle}>Global Impact</Text>
            </View>
            <Text style={styles.impactDescription}>
              You've helped provide internet freedom to users in censored countries. 
              Your sponsorship is making a real difference!
            </Text>
            <View style={styles.impactStats}>
              <View style={styles.impactStat}>
                <Text style={styles.impactStatNumber}>1</Text>
                <Text style={styles.impactStatLabel}>User Sponsored</Text>
              </View>
              <View style={styles.impactStat}>
                <Text style={styles.impactStatNumber}>45</Text>
                <Text style={styles.impactStatLabel}>Hours Protected</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <ProfileRow
            icon="notifications"
            title="Notifications"
            subtitle="Manage notification settings"
            onPress={() => Alert.alert('Notifications', 'Managing notification preferences...')}
          />
          
          <ProfileRow
            icon="language"
            title="Language"
            subtitle="English"
            onPress={() => Alert.alert('Language', 'Select your preferred language...')}
          />
          
          <ProfileRow
            icon="moon"
            title="Dark Mode"
            subtitle="Always enabled"
            onPress={() => Alert.alert('Dark Mode', 'Dark mode is always enabled for this app')}
          />
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <ProfileRow
            icon="help-circle"
            title="Help Center"
            subtitle="Get help and support"
            onPress={() => Alert.alert('Help Center', 'Visit our help center at help.conservertive.co')}
          />
          
          <ProfileRow
            icon="chatbubble"
            title="Live Chat"
            subtitle="Chat with support"
            onPress={() => Alert.alert('Live Chat', 'Starting live chat with support...')}
          />
          
          <ProfileRow
            icon="bug"
            title="Report Bug"
            subtitle="Report an issue"
            onPress={() => Alert.alert('Report Bug', 'Thank you for helping us improve!')}
          />
        </View>

        {/* Sign Out */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Ionicons name="log-out" size={24} color="#ef4444" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
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
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#3b82f6',
  },
  userName: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'Sora',
    marginBottom: 5,
  },
  userEmail: {
    color: '#94a3b8',
    fontSize: 16,
    fontFamily: 'Sora',
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
    fontFamily: 'Sora',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'Sora',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontFamily: 'Sora',
    marginTop: 4,
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
  },
  profileRow: {
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
  profileRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileRowText: {
    marginLeft: 15,
    flex: 1,
  },
  profileRowTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Sora',
    fontWeight: '500',
  },
  profileRowSubtitle: {
    color: '#94a3b8',
    fontSize: 14,
    fontFamily: 'Sora',
    marginTop: 2,
  },
  impactCard: {
    backgroundColor: '#1e293b',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  impactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  impactTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Sora',
    marginLeft: 10,
  },
  impactDescription: {
    color: '#94a3b8',
    fontSize: 14,
    fontFamily: 'Sora',
    lineHeight: 20,
    marginBottom: 15,
  },
  impactStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  impactStat: {
    alignItems: 'center',
  },
  impactStatNumber: {
    color: '#10b981',
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Sora',
  },
  impactStatLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontFamily: 'Sora',
    marginTop: 4,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e293b',
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  signOutText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Sora',
    marginLeft: 10,
  },
});






