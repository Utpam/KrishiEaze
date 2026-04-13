import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Modal, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CreateListingScreen() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    cropName: 'Tomato',
    quantity: '1200',
    unit: 'kg',
    expectedPricePerUnit: '18',
    harvestDate: '2026-04-08',
    qualityGrade: 'A',
    lat: '18.5204',
    lng: '73.8567'
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showQualityModal, setShowQualityModal] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleChange('harvestDate', selectedDate.toISOString().split('T')[0]);
    }
  };

  const fetchLocation = async () => {
    setIsFetchingLocation(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please grant location access or enter coordinates manually.');
        setIsFetchingLocation(false);
        return;
      }
      
      let location = await Location.getCurrentPositionAsync({});
      handleChange('lat', location.coords.latitude.toString());
      handleChange('lng', location.coords.longitude.toString());
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch location. Please enter manually.');
    } finally {
      setIsFetchingLocation(false);
    }
  };

  const handleSave = () => {
    console.log("Saving new listing:", formData);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Listing</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Crop Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Crop Name</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="local-florist" size={20} color="#666" style={styles.inputIcon} />
              <TextInput 
                style={styles.input}
                value={formData.cropName}
                onChangeText={(text) => handleChange('cropName', text)}
                placeholder="e.g. Wheat, Tomato"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Quantity</Text>
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.input}
                value={formData.quantity}
                onChangeText={(text) => handleChange('quantity', text)}
                keyboardType="numeric"
                placeholder="1000"
              />
              {/* Unit is fixed to kg as requested */}
              <View style={styles.unitBadge}>
                <Text style={styles.unitText}>kg</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Expected Price Per Unit (₹)</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="currency-rupee" size={20} color="#666" style={styles.inputIcon} />
              <TextInput 
                style={styles.input}
                value={formData.expectedPricePerUnit}
                onChangeText={(text) => handleChange('expectedPricePerUnit', text)}
                keyboardType="numeric"
                placeholder="18"
              />
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Harvest & Quality</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Harvest Date</Text>
            <TouchableOpacity 
              style={styles.inputContainer}
              onPress={() => setShowDatePicker(true)}
            >
              <Feather name="calendar" size={20} color="#666" style={styles.inputIcon} />
              <Text style={[styles.input, { textAlignVertical: 'center', lineHeight: 48, color: formData.harvestDate ? '#111' : '#999' }]}>
                {formData.harvestDate ? formData.harvestDate : "YYYY-MM-DD"}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={formData.harvestDate ? new Date(formData.harvestDate) : new Date()}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Quality Grade</Text>
            <TouchableOpacity 
              style={styles.inputContainer}
              onPress={() => setShowQualityModal(true)}
            >
              <Feather name="check-circle" size={20} color="#666" style={styles.inputIcon} />
              <Text style={[styles.input, { textAlignVertical: 'center', lineHeight: 48, color: formData.qualityGrade ? '#111' : '#999' }]}>
                {formData.qualityGrade ? `Grade ${formData.qualityGrade}` : "Select Grade"}
              </Text>
              <Feather name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.locationHeaderRow}>
            <Text style={[styles.sectionTitle, { marginBottom: 0, borderBottomWidth: 0, paddingBottom: 0 }]}>Location Data</Text>
            <TouchableOpacity style={styles.fetchLocationBtn} onPress={fetchLocation} disabled={isFetchingLocation}>
              {isFetchingLocation ? (
                <ActivityIndicator size="small" color="#085836" />
              ) : (
                <>
                  <Ionicons name="location" size={16} color="#085836" />
                  <Text style={styles.fetchLocationText}>Use Device Location</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
          <View style={{ height: 1, backgroundColor: '#f0f0f0', marginBottom: 15 }} />
          
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Latitude</Text>
              <TextInput 
                style={[styles.input, styles.inputStandalone]}
                value={formData.lat}
                onChangeText={(text) => handleChange('lat', text)}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Longitude</Text>
              <TextInput 
                style={[styles.input, styles.inputStandalone]}
                value={formData.lng}
                onChangeText={(text) => handleChange('lng', text)}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
          <Text style={styles.submitButtonText}>Publish Listing</Text>
        </TouchableOpacity>
        
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Quality Grade Modal */}
      <Modal visible={showQualityModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Quality Grade</Text>
            {['A', 'B', 'C'].map((grade) => (
              <TouchableOpacity 
                key={grade} 
                style={styles.modalOption} 
                onPress={() => {
                  handleChange('qualityGrade', grade);
                  setShowQualityModal(false);
                }}
              >
                <Text style={[styles.modalOptionText, formData.qualityGrade === grade && styles.modalOptionTextActive]}>
                  Grade {grade}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.closeModalButton} onPress={() => setShowQualityModal(false)}>
              <Text style={styles.closeModalText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
  },
  scrollContent: {
    padding: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 10,
  },
  inputGroup: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 15,
    color: '#111',
  },
  inputStandalone: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  unitBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 8,
  },
  unitText: {
    color: '#085836',
    fontWeight: 'bold',
    fontSize: 14,
  },
  locationHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: -5,
  },
  fetchLocationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  fetchLocationText: {
    color: '#085836',
    fontWeight: '600',
    fontSize: 12,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 280,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 15,
  },
  modalOption: {
    width: '100%',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#555',
  },
  modalOptionTextActive: {
    color: '#085836',
    fontWeight: 'bold',
  },
  closeModalButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
  },
  closeModalText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#085836',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#085836',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    marginTop: 10,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
