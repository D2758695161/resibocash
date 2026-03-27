import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { PointsContext } from '../App';

function formatDate(iso) {
  const d = new Date(iso);
  const month = d.toLocaleString('default', { month: 'short' });
  const day = d.getDate();
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${month} ${day}, ${time}`;
}

function ReceiptItem({ item }) {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <View style={styles.receiptIcon}>
          <View style={styles.rLine} />
          <View style={[styles.rLine, { width: '55%' }]} />
          <View style={styles.rLine} />
        </View>
      </View>
      <View style={styles.info}>
        <Text style={styles.store}>{item.store}</Text>
        <Text style={styles.date}>{formatDate(item.date)}</Text>
        <Text style={styles.total}>P{item.total.toLocaleString()}.00</Text>
      </View>
      <View style={styles.pointsBadge}>
        <View style={styles.coinDot} />
        <Text style={styles.pointsText}>+{item.points}</Text>
      </View>
    </View>
  );
}

export default function HistoryScreen() {
  const { history } = useContext(PointsContext);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>History</Text>
        <Text style={styles.headerSub}>
          {history.length} receipt{history.length !== 1 ? 's' : ''} scanned
        </Text>
      </View>

      {history.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyCircle}>
            <View style={styles.emptyReceipt}>
              <View style={styles.eLine} />
              <View style={[styles.eLine, { width: '55%' }]} />
              <View style={styles.eLine} />
              <View style={[styles.eLine, { width: '40%' }]} />
            </View>
          </View>
          <Text style={styles.emptyTitle}>No receipts yet</Text>
          <Text style={styles.emptySub}>
            Scan your first receipt to start earning points!
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={({ item }) => <ReceiptItem item={item} />}
        />
      )}
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
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#212121',
  },
  headerSub: {
    fontSize: 14,
    color: '#9E9E9E',
    fontWeight: '600',
    marginTop: 2,
  },
  list: {
    padding: 20,
  },
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
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  receiptIcon: {
    width: 22,
    height: 28,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    padding: 4,
    justifyContent: 'center',
    gap: 3,
  },
  rLine: {
    width: '80%',
    height: 3,
    backgroundColor: '#C8E6C9',
    borderRadius: 1,
  },
  info: {
    flex: 1,
  },
  store: {
    fontSize: 15,
    fontWeight: '700',
    color: '#212121',
  },
  date: {
    fontSize: 12,
    color: '#9E9E9E',
    marginTop: 2,
  },
  total: {
    fontSize: 13,
    color: '#757575',
    fontWeight: '600',
    marginTop: 4,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 5,
  },
  coinDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFC107',
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2E7D32',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#A5D6A7',
  },
  emptyReceipt: {
    width: 36,
    height: 46,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    padding: 7,
    justifyContent: 'center',
    gap: 4,
  },
  eLine: {
    width: '80%',
    height: 3,
    backgroundColor: '#C8E6C9',
    borderRadius: 1,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
  },
  emptySub: {
    fontSize: 14,
    color: '#9E9E9E',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
});
