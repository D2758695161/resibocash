import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
} from 'react-native';
import { PointsContext } from '../App';


const STORES = [
  { id: '1', name: 'SM', dist: '1.9 mi', offers: 136, color: '#1B5E20' },
  { id: '2', name: 'PG', dist: '2.6 mi', offers: 57, color: '#E65100' },
  { id: '3', name: 'Rob', dist: '2.5 mi', offers: 42, color: '#0D47A1' },
  { id: '4', name: 'Merc', dist: '4.7 mi', offers: 23, color: '#B71C1C' },
  { id: '5', name: '711', dist: '2.3 mi', offers: 87, color: '#1B5E20' },
];

function StoreCircle({ item }) {
  return (
    <View style={storeStyles.wrap}>
      <Text style={storeStyles.dist}>{item.dist}</Text>
      <View style={storeStyles.pinWrap}>
        <View style={[storeStyles.circle, { backgroundColor: item.color }]}>
          <Text style={storeStyles.name}>{item.name}</Text>
        </View>
        <View style={[storeStyles.pin, { backgroundColor: item.color }]} />
      </View>
      <Text style={storeStyles.offers}>{item.offers} Offers</Text>
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const { points } = useContext(PointsContext);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStores = searchQuery.trim()
    ? STORES.filter((s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : STORES;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Discover</Text>
          <View style={styles.headerRight}>
            <View style={styles.playBtn}>
              <View style={styles.playTriangle} />
              <Text style={styles.playText}>Play</Text>
            </View>
            <View style={styles.pointsPill}>
              <View style={styles.coinIcon} />
              <Text style={styles.pointsText}>
                {points > 0 ? points.toLocaleString() : '0'}
              </Text>
            </View>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>{'\u2315'}</Text>
            <TextInput
              style={styles.searchInput}
              placeholder='Search for "rewards"'
              placeholderTextColor="#BDBDBD"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.heartBtn}>
            <Text style={styles.heartIcon}>{'\u2665'}</Text>
            <Text style={styles.heartCount}>0</Text>
          </View>
        </View>

        {/* Points Card */}
        <View style={styles.pointsCard}>
          <View style={styles.pointsCardLeft}>
            <Text style={styles.pointsCardLabel}>YOUR BALANCE</Text>
            <View style={styles.pointsCardRow}>
              <View style={styles.pointsCardCoin} />
              <Text style={styles.pointsCardValue}>
                {points > 0 ? points.toLocaleString() : '0'}
              </Text>
            </View>
            <Text style={styles.pointsCardSub}>points</Text>
          </View>
          <TouchableOpacity
            style={styles.pointsCardBtn}
            onPress={() => navigation.navigate('Camera')}
          >
            <Text style={styles.pointsCardBtnText}>Scan</Text>
          </TouchableOpacity>
        </View>

        {/* Promo */}
        <View style={styles.promo}>
          <View style={styles.promoLeft}>
            <View style={styles.promoMultWrap}>
              <Text style={styles.promoMult}>2X</Text>
            </View>
            <View>
              <Text style={styles.promoTitle}>Double Points Week</Text>
              <Text style={styles.promoSub}>On all receipt scans</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.promoBtn}
            onPress={() => navigation.navigate('Camera')}
          >
            <Text style={styles.promoBtnText}>Scan Now</Text>
          </TouchableOpacity>
        </View>

        {/* Stores */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Stores near you</Text>
          <TouchableOpacity>
            <Text style={styles.seeMore}>See more</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredStores}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.hList}
          renderItem={({ item }) => <StoreCircle item={item} />}
        />

        {/* Scan CTA */}
        <TouchableOpacity
          style={styles.scanCTA}
          onPress={() => navigation.navigate('Camera')}
          activeOpacity={0.85}
        >
          <View style={styles.scanCTAIcon}>
            <View style={styles.scanCTALens} />
          </View>
          <View style={styles.scanCTAContent}>
            <Text style={styles.scanCTATitle}>Scan a receipt</Text>
            <Text style={styles.scanCTASub}>Earn points on every purchase</Text>
          </View>
          <Text style={styles.scanCTAArrow}>{'\u203A'}</Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const storeStyles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    marginRight: 18,
    width: 68,
  },
  dist: {
    fontSize: 10,
    color: '#9E9E9E',
    fontWeight: '600',
    marginBottom: 6,
  },
  pinWrap: {
    alignItems: 'center',
    marginBottom: 8,
  },
  circle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
  pin: {
    width: 3,
    height: 10,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    marginTop: -1,
  },
  offers: {
    fontSize: 11,
    color: '#616161',
    fontWeight: '600',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#212121',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  playBtn: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  playTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderLeftColor: '#4CAF50',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  playText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '700',
  },
  pointsPill: {
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  coinIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFC107',
  },
  pointsText: {
    color: '#212121',
    fontSize: 15,
    fontWeight: '800',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
  },
  searchIcon: {
    fontSize: 18,
    color: '#9E9E9E',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#212121',
    padding: 0,
  },
  clearIcon: {
    fontSize: 14,
    color: '#9E9E9E',
    paddingHorizontal: 4,
  },
  heartBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FCE4EC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartIcon: {
    fontSize: 16,
    color: '#E91E63',
  },
  heartCount: {
    fontSize: 10,
    color: '#E91E63',
    fontWeight: '700',
    marginTop: -2,
  },
  pointsCard: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 4,
    backgroundColor: '#4CAF50',
    borderRadius: 18,
    padding: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#1B5E20',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  pointsCardLeft: {},
  pointsCardLabel: {
    color: '#A5D6A7',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  pointsCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pointsCardCoin: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFC107',
    borderWidth: 2,
    borderColor: '#FFB300',
  },
  pointsCardValue: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -1,
  },
  pointsCardSub: {
    color: '#A5D6A7',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  pointsCardBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
  },
  pointsCardBtnText: {
    color: '#4CAF50',
    fontSize: 15,
    fontWeight: '800',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#212121',
  },
  seeMore: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4CAF50',
  },
  hList: {
    paddingHorizontal: 20,
  },
  promo: {
    marginHorizontal: 20,
    marginTop: 22,
    backgroundColor: '#1B5E20',
    borderRadius: 18,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#1B5E20',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  promoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  promoMultWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFC107',
    justifyContent: 'center',
    alignItems: 'center',
  },
  promoMult: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1B5E20',
  },
  promoTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  promoSub: {
    color: '#A5D6A7',
    fontSize: 12,
    marginTop: 2,
  },
  promoBtn: {
    backgroundColor: '#FFC107',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  promoBtnText: {
    color: '#1B5E20',
    fontSize: 13,
    fontWeight: '800',
  },
  scanCTA: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  scanCTAIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  scanCTALens: {
    width: 20,
    height: 16,
    borderRadius: 5,
    borderWidth: 2.5,
    borderColor: '#4CAF50',
  },
  scanCTAContent: {
    flex: 1,
  },
  scanCTATitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
  },
  scanCTASub: {
    fontSize: 13,
    color: '#9E9E9E',
    marginTop: 2,
  },
  scanCTAArrow: {
    fontSize: 28,
    color: '#BDBDBD',
    fontWeight: '300',
  },
});
