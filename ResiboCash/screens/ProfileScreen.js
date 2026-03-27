import React, { useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { PointsContext } from '../App';

const MENU_SECTIONS = [
  {
    title: 'Account',
    items: [
      { label: 'Edit Profile', icon: '\u270E' },
      { label: 'Phone Number', icon: '\u260E', detail: '+63 9** *** **67' },
      { label: 'Linked Wallets', icon: '\u2B50', detail: 'GCash, Maya' },
    ],
  },
  {
    title: 'Activity',
    items: [
      { label: 'Scan History', icon: '\u2630' },
      { label: 'Redemption History', icon: '\u2B50' },
      { label: 'Referral Program', icon: '\u2764', badge: 'NEW' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { label: 'Notifications', icon: '\u266A' },
      { label: 'Language', icon: '\u2B50', detail: 'English' },
      { label: 'Help Center', icon: '\u2753' },
    ],
  },
];

function MenuItem({ item, onPress }) {
  return (
    <TouchableOpacity style={menuStyles.item} onPress={onPress}>
      <View style={menuStyles.iconWrap}>
        <Text style={menuStyles.icon}>{item.icon}</Text>
      </View>
      <Text style={menuStyles.label}>{item.label}</Text>
      <View style={{ flex: 1 }} />
      {item.badge && (
        <View style={menuStyles.badge}>
          <Text style={menuStyles.badgeText}>{item.badge}</Text>
        </View>
      )}
      {item.detail && <Text style={menuStyles.detail}>{item.detail}</Text>}
      <Text style={menuStyles.arrow}>{'\u203A'}</Text>
    </TouchableOpacity>
  );
}

const menuStyles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 4,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  icon: {
    fontSize: 14,
    color: '#757575',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212121',
  },
  detail: {
    fontSize: 13,
    color: '#9E9E9E',
    marginRight: 8,
  },
  badge: {
    backgroundColor: '#FFC107',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 8,
  },
  badgeText: {
    color: '#1B5E20',
    fontSize: 10,
    fontWeight: '800',
  },
  arrow: {
    fontSize: 22,
    color: '#BDBDBD',
    fontWeight: '300',
  },
});

export default function ProfileScreen({ navigation }) {
  const { points, history, totalEarned, totalRedeemed } = useContext(PointsContext);

  const STATS = [
    { label: 'Receipts Scanned', value: history.length.toString() },
    { label: 'Points Earned', value: totalEarned.toLocaleString() },
    { label: 'Rewards Redeemed', value: totalRedeemed.toString() },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Account</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>RC</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>ResiboCash User</Text>
            <Text style={styles.profilePhone}>+63 9** *** **67</Text>
            <View style={styles.memberBadge}>
              <Text style={styles.memberText}>Member since Mar 2026</Text>
            </View>
          </View>
        </View>

        {/* Points Summary */}
        <View style={styles.pointsBar}>
          <View style={styles.pointsBarLeft}>
            <Text style={styles.pointsBarLabel}>Available Points</Text>
            <View style={styles.pointsBarRow}>
              <View style={styles.pointsCoin} />
              <Text style={styles.pointsBarValue}>{points.toLocaleString()}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.redeemShortcut}
            onPress={() => {}}
          >
            <Text style={styles.redeemShortcutText}>Redeem</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {STATS.map((stat, i) => (
            <View key={i} style={[styles.statCard, i < STATS.length - 1 && styles.statBorder]}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Menu Sections */}
        {MENU_SECTIONS.map((section, i) => (
          <View key={i} style={styles.menuSection}>
            <Text style={styles.menuTitle}>{section.title}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, j) => (
                <View key={j}>
                  <MenuItem
                    item={item}
                    onPress={item.label === 'Help Center' ? () => navigation.navigate('Settings') : undefined}
                  />
                  {j < section.items.length - 1 && <View style={styles.menuDivider} />}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutBtn}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* Version */}
        <Text style={styles.version}>ResiboCash v1.0.0 (MVP)</Text>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F8',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#212121',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#1B5E20',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
  },
  profilePhone: {
    fontSize: 14,
    color: '#9E9E9E',
    marginTop: 2,
  },
  memberBadge: {
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  memberText: {
    color: '#FF8F00',
    fontSize: 11,
    fontWeight: '700',
  },
  pointsBar: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: '#4CAF50',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#1B5E20',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  pointsBarLeft: {},
  pointsBarLabel: {
    color: '#A5D6A7',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  pointsBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pointsCoin: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFC107',
    borderWidth: 2,
    borderColor: '#FFB300',
  },
  pointsBarValue: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -1,
  },
  redeemShortcut: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  redeemShortcutText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    overflow: 'hidden',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 18,
  },
  statBorder: {
    borderRightWidth: 1,
    borderRightColor: '#F0F0F0',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#212121',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#9E9E9E',
    fontWeight: '600',
    textAlign: 'center',
  },
  menuSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9E9E9E',
    marginBottom: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F5F5F5',
  },
  signOutBtn: {
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  signOutText: {
    color: '#E53935',
    fontSize: 16,
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    color: '#BDBDBD',
    fontSize: 12,
    marginTop: 16,
  },
});
