import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { getNearestMandiRequest, updateLocationRequest } from '../services/api';

export default function ListingsScreen() {
  const { accessToken } = useAuth();
  const [crop, setCrop] = useState('');
  const [mandiList, setMandiList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingLocation, setUpdatingLocation] = useState(false);

  const handleUpdateLocation = async () => {
    setUpdatingLocation(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied');
        setUpdatingLocation(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      if (accessToken) {
        await updateLocationRequest(accessToken, location.coords.latitude, location.coords.longitude);
        Alert.alert('Success', `Location synced: Lat ${location.coords.latitude.toFixed(2)}, Lng ${location.coords.longitude.toFixed(2)}`);
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to update location. Please try again.');
    } finally {
      setUpdatingLocation(false);
    }
  };

  const fetchNearestMandis = async () => {
    if (!crop.trim()) {
      Alert.alert('Notice', 'Please enter a crop name first');
      return;
    }
    if (!accessToken) return;

    setLoading(true);
    try {
      const response = await getNearestMandiRequest(accessToken, crop);
      setMandiList(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to fetch mandis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Action Bar */}
      <View style={styles.actionBar}>
        <View style={styles.actionHeader}>
          <Text style={styles.actionTitle}>Your nearest mandi according to your GPS</Text>
          <TouchableOpacity
            style={styles.locationBtn}
            onPress={handleUpdateLocation}
            disabled={updatingLocation}
          >
            {updatingLocation ? (
              <ActivityIndicator size="small" color="#085836" />
            ) : (
              <MaterialIcons name="my-location" size={24} color="#085836" />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.searchRow}>
          <TextInput
            style={styles.input}
            placeholder="Enter crop (e.g. Wheat, Tomato)"
            placeholderTextColor="#888"
            value={crop}
            onChangeText={setCrop}
          />
          <TouchableOpacity style={styles.searchBtn} onPress={fetchNearestMandis}>
            <Text style={styles.searchBtnText}>Find</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* List */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color="#085836" style={{ marginTop: 40 }} />
        ) : mandiList.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome5 name="store-alt-slash" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No mandis found. Enter a crop and search.</Text>
          </View>
        ) : (
          mandiList.map((mandi) => (
            <View key={mandi.mandiId} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.mandiName}>{mandi.mandiName}</Text>
                <View style={styles.distanceBadge}>
                  <Text style={styles.distanceText}>{mandi.distanceKm?.toFixed(1)} km</Text>
                </View>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                  <MaterialIcons name="location-on" size={16} color="#666" />
                  <Text style={styles.infoText}>{mandi.district}, {mandi.state}</Text>
                </View>
                <View style={styles.infoRow}>
                  <FontAwesome5 name="box-open" size={14} color="#666" style={{ marginLeft: 1, marginRight: 2 }} />
                  <Text style={styles.infoText}>Commodity: {mandi.commodity}</Text>
                </View>
                <View style={styles.priceContainer}>
                  <Text style={styles.priceLabel}>Modal Price</Text>
                  <Text style={styles.priceValue}>{mandi.modalPrice}</Text>
                </View>
              </View>
            </View>
          ))
        )}
        {/* Extra padding to prevent the Tabs from covering content */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7F5",
  },
  actionBar: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  actionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  locationBtn: {
    padding: 8,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 15,
    color: '#111',
  },
  searchBtn: {
    backgroundColor: '#085836',
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  searchBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  scrollContent: {
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: '#888',
    marginTop: 16,
    fontSize: 15,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  mandiName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
    flex: 1,
    marginRight: 8,
  },
  distanceBadge: {
    backgroundColor: '#FFF0E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  distanceText: {
    color: '#D95A11',
    fontWeight: 'bold',
    fontSize: 12,
  },
  cardBody: {},
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    color: '#555',
    marginLeft: 6,
    fontSize: 14,
  },
  priceContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    color: '#777',
    fontSize: 13,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#085836',
  }
});
