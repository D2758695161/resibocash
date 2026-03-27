import React, { useContext, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  SafeAreaView,
} from 'react-native';
import { PointsContext } from '../App';

export default function ResultScreen({ route, navigation }) {
  const { data } = route.params;
  const { points } = useContext(PointsContext);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const coinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 450, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 450, useNativeDriver: true }),
      ]),
      Animated.spring(coinAnim, { toValue: 1, friction: 4, tension: 60, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Success */}
        <Animated.View style={[styles.checkCircle, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.checkMark}>
            <View style={styles.checkShort} />
            <View style={styles.checkLong} />
          </View>
        </Animated.View>

        <Animated.View style={[styles.body, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.title}>Points Earned!</Text>
          <Text style={styles.subtitle}>Your receipt has been verified</Text>

          {/* Points Highlight */}
          <Animated.View style={[styles.earnedCard, { transform: [{ scale: coinAnim }] }]}>
            <View style={styles.earnedCoin} />
            <Text style={styles.earnedValue}>+{data.points}</Text>
            <Text style={styles.earnedLabel}>points added</Text>
          </Animated.View>

          {/* Receipt Details */}
          <View style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailHeaderText}>RECEIPT DETAILS</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Store</Text>
              <Text style={styles.rowValue}>{data.store}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Amount</Text>
              <Text style={styles.rowValue}>P{data.total.toLocaleString()}.00</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Points Rate</Text>
              <Text style={styles.rowValue}>1 pt / P10 spent</Text>
            </View>
          </View>

          {/* Balance */}
          <View style={styles.balanceCard}>
            <View>
              <Text style={styles.balanceLabel}>Total Balance</Text>
            </View>
            <View style={styles.balancePill}>
              <View style={styles.balanceCoin} />
              <Text style={styles.balanceValue}>{points.toLocaleString()}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Actions */}
        <Animated.View style={[styles.actions, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('Camera')}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryText}>Scan Another Receipt</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate('MainTabs')}
          >
            <Text style={styles.secondaryText}>Back to Home</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1, paddingHorizontal: 24, justifyContent: 'center', alignItems: 'center' },

  checkCircle: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3, borderColor: '#4CAF50',
  },
  checkMark: { width: 34, height: 24, position: 'relative' },
  checkShort: {
    position: 'absolute', bottom: 1, left: 2,
    width: 14, height: 3.5, backgroundColor: '#4CAF50', borderRadius: 2,
    transform: [{ rotate: '45deg' }],
  },
  checkLong: {
    position: 'absolute', bottom: 4, left: 10,
    width: 21, height: 3.5, backgroundColor: '#4CAF50', borderRadius: 2,
    transform: [{ rotate: '-45deg' }],
  },

  body: { width: '100%', alignItems: 'center' },
  title: { fontSize: 26, fontWeight: '800', color: '#212121', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#9E9E9E', marginBottom: 24 },

  earnedCard: {
    backgroundColor: '#4CAF50', borderRadius: 20,
    paddingVertical: 28, paddingHorizontal: 40,
    width: '100%', alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#1B5E20', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 16, elevation: 8,
  },
  earnedCoin: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#FFC107',
    borderWidth: 3, borderColor: '#FFB300',
    marginBottom: 8,
  },
  earnedValue: {
    color: '#FFFFFF', fontSize: 52, fontWeight: '900', letterSpacing: -2,
  },
  earnedLabel: {
    color: '#A5D6A7', fontSize: 14, fontWeight: '600', marginTop: 4,
  },

  detailCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16,
    width: '100%', marginBottom: 12,
    borderWidth: 1, borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  detailHeader: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 10, paddingHorizontal: 18,
    borderBottomWidth: 1, borderBottomColor: '#E0E0E0',
  },
  detailHeaderText: {
    color: '#9E9E9E', fontSize: 11, fontWeight: '700', letterSpacing: 1.5,
  },
  row: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 15, paddingHorizontal: 18,
  },
  rowLabel: { fontSize: 15, color: '#9E9E9E', fontWeight: '500' },
  rowValue: { fontSize: 15, fontWeight: '700', color: '#212121' },
  divider: { height: 1, backgroundColor: '#F5F5F5', marginHorizontal: 18 },

  balanceCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    width: '100%', backgroundColor: '#FFFFFF', borderRadius: 14,
    paddingVertical: 16, paddingHorizontal: 18,
    borderWidth: 1, borderColor: '#E0E0E0',
    marginBottom: 8,
  },
  balanceLabel: { fontSize: 15, color: '#9E9E9E', fontWeight: '500' },
  balancePill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12,
    gap: 6, borderWidth: 1, borderColor: '#FFE082',
  },
  balanceCoin: {
    width: 16, height: 16, borderRadius: 8, backgroundColor: '#FFC107',
  },
  balanceValue: { fontSize: 17, fontWeight: '800', color: '#212121' },

  actions: { width: '100%', marginTop: 24, gap: 10 },
  primaryBtn: {
    backgroundColor: '#4CAF50', paddingVertical: 18, borderRadius: 14, alignItems: 'center',
    shadowColor: '#1B5E20', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 8, elevation: 6,
  },
  primaryText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  secondaryBtn: { paddingVertical: 14, alignItems: 'center' },
  secondaryText: { color: '#9E9E9E', fontSize: 15, fontWeight: '600' },
});
