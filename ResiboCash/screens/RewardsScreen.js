import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import { PointsContext } from '../App';

const CATEGORIES = ['All', 'E-Wallet', 'Mobile Load', 'Gift Cards', 'Food'];

const REWARDS = [
  {
    id: '1',
    name: 'GCash',
    desc: 'P50 GCash Credit',
    cost: 500,
    category: 'E-Wallet',
    color: '#0050AE',
    initial: 'G',
  },
  {
    id: '2',
    name: 'GCash',
    desc: 'P100 GCash Credit',
    cost: 1000,
    category: 'E-Wallet',
    color: '#0050AE',
    initial: 'G',
  },
  {
    id: '3',
    name: 'Maya',
    desc: 'P50 Maya Credit',
    cost: 500,
    category: 'E-Wallet',
    color: '#00B140',
    initial: 'M',
  },
  {
    id: '4',
    name: 'Globe Load',
    desc: 'P50 Mobile Load',
    cost: 450,
    category: 'Mobile Load',
    color: '#0099DD',
    initial: 'GL',
  },
  {
    id: '5',
    name: 'Smart Load',
    desc: 'P50 Mobile Load',
    cost: 450,
    category: 'Mobile Load',
    color: '#00AA00',
    initial: 'SM',
  },
  {
    id: '6',
    name: 'SM Gift Card',
    desc: 'P100 SM Store Credit',
    cost: 900,
    category: 'Gift Cards',
    color: '#003DA5',
    initial: 'SM',
  },
  {
    id: '7',
    name: 'Jollibee',
    desc: 'P100 Jollibee Voucher',
    cost: 800,
    category: 'Food',
    color: '#CC0000',
    initial: 'J',
  },
  {
    id: '8',
    name: 'Grab',
    desc: 'P50 Grab Credit',
    cost: 500,
    category: 'E-Wallet',
    color: '#00B14F',
    initial: 'GR',
  },
  {
    id: '9',
    name: 'Robinson',
    desc: 'P100 Store Credit',
    cost: 900,
    category: 'Gift Cards',
    color: '#0D47A1',
    initial: 'R',
  },
  {
    id: '10',
    name: 'McDonald\'s',
    desc: 'P100 McD Voucher',
    cost: 800,
    category: 'Food',
    color: '#FFC107',
    initial: 'Mc',
  },
];

function RewardCard({ item, points, onRedeem }) {
  const canAfford = points >= item.cost;

  return (
    <View style={cardStyles.card}>
      <View style={[cardStyles.iconWrap, { backgroundColor: item.color }]}>
        <Text style={cardStyles.initial}>{item.initial}</Text>
      </View>
      <View style={cardStyles.info}>
        <Text style={cardStyles.name}>{item.name}</Text>
        <Text style={cardStyles.desc}>{item.desc}</Text>
        <View style={cardStyles.costRow}>
          <View style={cardStyles.coinDot} />
          <Text style={cardStyles.costText}>{item.cost.toLocaleString()} pts</Text>
        </View>
      </View>
      <TouchableOpacity
        style={[cardStyles.redeemBtn, !canAfford && cardStyles.redeemDisabled]}
        onPress={() => canAfford && onRedeem(item)}
        disabled={!canAfford}
      >
        <Text style={[cardStyles.redeemText, !canAfford && cardStyles.redeemTextDisabled]}>
          {canAfford ? 'Redeem' : 'Need more'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  initial: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#212121',
  },
  desc: {
    fontSize: 13,
    color: '#9E9E9E',
    marginTop: 2,
  },
  costRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 5,
  },
  coinDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFC107',
  },
  costText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF8F00',
  },
  redeemBtn: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  redeemDisabled: {
    backgroundColor: '#F5F5F5',
  },
  redeemText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  redeemTextDisabled: {
    color: '#BDBDBD',
  },
});

export default function RewardsScreen() {
  const { points, setPoints, setTotalRedeemed } = useContext(PointsContext);
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? REWARDS
    : REWARDS.filter((r) => r.category === activeCategory);

  const handleRedeem = (item) => {
    Alert.alert(
      'Redeem Reward',
      `Use ${item.cost.toLocaleString()} points for ${item.desc}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Redeem',
          onPress: () => {
            setPoints((prev) => prev - item.cost);
            setTotalRedeemed((prev) => prev + 1);
            Alert.alert('Success!', `${item.desc} has been sent to your account.`);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rewards</Text>
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <View>
          <Text style={styles.balanceLabel}>AVAILABLE POINTS</Text>
          <View style={styles.balanceRow}>
            <View style={styles.balanceCoin} />
            <Text style={styles.balanceValue}>{points.toLocaleString()}</Text>
          </View>
        </View>
        <View style={styles.balanceDivider} />
        <View style={styles.balanceInfo}>
          <Text style={styles.balanceInfoLabel}>Rewards available</Text>
          <Text style={styles.balanceInfoValue}>
            {REWARDS.filter((r) => points >= r.cost).length}
          </Text>
        </View>
      </View>

      {/* Categories */}
      <FlatList
        data={CATEGORIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.catList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.catPill, item === activeCategory && styles.catPillActive]}
            onPress={() => setActiveCategory(item)}
          >
            <Text style={[styles.catText, item === activeCategory && styles.catTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Rewards List */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((item) => (
          <RewardCard
            key={item.id}
            item={item}
            points={points}
            onRedeem={handleRedeem}
          />
        ))}

        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No rewards in this category</Text>
            <Text style={styles.emptySub}>Check back soon!</Text>
          </View>
        )}
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
  balanceCard: {
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 18,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#1B5E20',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  balanceLabel: {
    color: '#A5D6A7',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  balanceCoin: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFC107',
    borderWidth: 2,
    borderColor: '#FFB300',
  },
  balanceValue: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
  },
  balanceDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginHorizontal: 20,
  },
  balanceInfo: {
    flex: 1,
  },
  balanceInfoLabel: {
    color: '#A5D6A7',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  balanceInfoValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  catList: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 8,
  },
  catPill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  catPillActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  catText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
  },
  catTextActive: {
    color: '#FFFFFF',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9E9E9E',
  },
  emptySub: {
    fontSize: 14,
    color: '#BDBDBD',
    marginTop: 4,
  },
});
