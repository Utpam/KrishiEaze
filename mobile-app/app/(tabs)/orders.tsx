import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, RefreshControl } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { getMySellRequests } from '../services/api';
import { Feather, FontAwesome5 } from '@expo/vector-icons';

export default function OrdersScreen() {
  const { accessToken } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    if (!accessToken) return;
    try {
      const data = await getMySellRequests(accessToken);
      setOrders(data || []);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [accessToken]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return '#F59E0B';
      case 'APPROVED': return '#10B981';
      case 'REJECTED': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cropName}>{item.cropName}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
        </View>
      </View>
      
      <View style={styles.infoRow}>
        <FontAwesome5 name="store" size={14} color="#666" style={styles.icon} />
        <Text style={styles.infoText}>{item.mandi?.mandiName}, {item.mandi?.district}</Text>
      </View>

      <View style={styles.row}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Quantity</Text>
          <Text style={styles.detailValue}>{item.quantity} {item.unit}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Expected Price</Text>
          <Text style={styles.detailValue}>₹{item.expectedPricePerUnit}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Quality</Text>
          <Text style={styles.detailValue}>Grade {item.qualityGrade}</Text>
        </View>
      </View>

      <View style={styles.footerRow}>
        <Feather name="calendar" size={14} color="#999" />
        <Text style={styles.dateText}>Requested: {new Date(item.requestDate).toLocaleDateString()}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Sell Requests</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#085836" style={{ marginTop: 40 }} />
      ) : orders.length === 0 ? (
        <View style={styles.emptyState}>
          <Feather name="inbox" size={48} color="#ccc" />
          <Text style={styles.emptyText}>No sell requests found</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#085836"]} />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7F5" },
  header: { padding: 16, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#111' },
  listContainer: { padding: 16, paddingBottom: 100 },
  card: { backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, shadowOffset: {width: 0, height: 1} },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cropName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  icon: { marginRight: 8 },
  infoText: { fontSize: 14, color: '#555' },
  row: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 12, marginBottom: 12 },
  detailItem: { alignItems: 'flex-start' },
  detailLabel: { fontSize: 12, color: '#777', marginBottom: 4 },
  detailValue: { fontSize: 14, fontWeight: '600', color: '#111' },
  footerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' },
  dateText: { fontSize: 12, color: '#999', marginLeft: 4 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#888', marginTop: 12 }
});
