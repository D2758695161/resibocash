import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const MOCK_ITEMS = [
  { name: 'Rice (5kg)', qty: 1, price: 285 },
  { name: 'Cooking Oil (1L)', qty: 2, price: 120 },
  { name: 'Eggs (12pcs)', qty: 1, price: 95 },
  { name: 'Instant Noodles', qty: 5, price: 8 },
  { name: 'Canned Sardines', qty: 3, price: 32 },
];

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('default', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ReceiptDetailScreen({ route, navigation }) {
  const { receipt } = route.params;

  const subtotal = MOCK_ITEMS.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>{'‹'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Receipt Details</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Store Info Card */}
        <View style={styles.storeCard}>
          <View style={styles.storeIconWrap}>
            <View style={styles.storeIcon}>
              <View style={styles.iconLine} />
              <View style={[styles.iconLine, { width: '55%' }]} />
              <View style={styles.iconLine} />
            </View>
          </View>
          <View style={styles.storeInfo}>
            <Text style={styles.storeName}>{receipt.store}</Text>
            <Text style={styles.storeDate}>{formatDate(receipt.date)}</Text>
            <Text style={styles.storeTime}>{formatTime(receipt.date)}</Text>
          </View>
        </View>

        {/* Points Earned */}
        <View style={styles.pointsBanner}>
          <View style={styles.coinDot} />
          <Text style={styles.pointsBannerText}>+{receipt.points} points earned</Text>
        </View>

        {/* Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ITEMS</Text>
          <View style={styles.card}>
            {MOCK_ITEMS.map((item, i) => (
              <View key={i}>
                <View style={styles.itemRow}>
                  <View style={styles.itemLeft}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemQty}>x{item.qty}</Text>
                  </View>
                  <Text style={styles.itemPrice}>P{(item.price * item.qty).toLocaleString()}.00</Text>
                </View>
                {i < MOCK_ITEMS.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        </View>

        {/* Totals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SUMMARY</Text>
          <View style={styles.card}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>P{subtotal.toLocaleString()}.00</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax (12%)</Text>
              <Text style={styles.summaryValue}>P{Math.round(subtotal * 0.12).toLocaleString()}.00</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>P{receipt.total.toLocaleString()}.00</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 20 }} />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 26,
    color: '#212121',
    fontWeight: '300',
    lineHeight: 30,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
  },
  scroll: {
    padding: 20,
  },
  storeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  storeIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  storeIcon: {
    width: 26,
    height: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 5,
    justifyContent: 'center',
    gap: 4,
  },
  iconLine: {
    width: '80%',
    height: 3,
    backgroundColor: '#C8E6C9',
    borderRadius: 1,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
  },
  storeDate: {
    fontSize: 13,
    color: '#757575',
    marginTop: 3,
  },
  storeTime: {
    fontSize: 12,
    color: '#9E9E9E',
    marginTop: 2,
  },
  pointsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginBottom: 20,
    gap: 8,
  },
  coinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFC107',
    borderWidth: 2,
    borderColor: '#FFB300',
  },
  pointsBannerText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9E9E9E',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
  },
  itemLeft: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
  },
  itemQty: {
    fontSize: 12,
    color: '#9E9E9E',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#424242',
  },
  divider: {
    height: 1,
    backgroundColor: '#F5F5F5',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    color: '#424242',
    fontWeight: '600',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4CAF50',
  },
});
