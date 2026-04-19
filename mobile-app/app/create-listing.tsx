import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from './context/AuthContext';
import { calculateTransportPriceRequest, createSellRequest } from './services/api';

type FuelType = 'DIESEL' | 'PETROL';

type TransportCalculationResponse = {
  costPerQuintal: number;
  grossRevenue: number;
  netProfit: number;
  totalTransportCost: number;
};

export default function CreateListingScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { accessToken } = useAuth();

  const [formData, setFormData] = useState({
    cropName: params.cropName ? String(params.cropName) : 'Tomato',
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPriceCalcModal, setShowPriceCalcModal] = useState(false);
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(false);
  const [priceCalcForm, setPriceCalcForm] = useState({
    fuelPrice: '92.5',
    mileage: '12.0',
    fuelType: 'DIESEL' as FuelType,
  });
  const [priceCalculation, setPriceCalculation] = useState<TransportCalculationResponse | null>(null);

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePriceCalcInputChange = (name: 'fuelPrice' | 'mileage', value: string) => {
    setPriceCalcForm(prev => ({ ...prev, [name]: value }));
  };

  const formatCurrency = (amount: number) => {
    return `\u20B9${amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const onDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleChange('harvestDate', selectedDate.toISOString().split('T')[0]);
    }
  };

  const fetchLocation = async () => {
    setIsFetchingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('common.permissionDenied'), t('createListing.permissionDeniedMessage'));
        setIsFetchingLocation(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      handleChange('lat', location.coords.latitude.toString());
      handleChange('lng', location.coords.longitude.toString());
    } catch {
      Alert.alert(t('common.error'), t('createListing.locationFetchFailed'));
    } finally {
      setIsFetchingLocation(false);
    }
  };

  const handleCalculatePrices = async () => {
    if (!accessToken) {
      Alert.alert(t('common.error'), t('createListing.notAuthenticated'));
      return;
    }

    if (!params.selectedMandiId) {
      Alert.alert(t('common.error'), t('createListing.calcMissingMandi'));
      return;
    }

    const mandiId = parseInt(String(params.selectedMandiId), 10);
    const quantity = parseFloat(formData.quantity);
    const fuelPrice = parseFloat(priceCalcForm.fuelPrice);
    const mileage = parseFloat(priceCalcForm.mileage);

    if (
      !formData.cropName.trim() ||
      !Number.isFinite(mandiId) ||
      !Number.isFinite(quantity) ||
      quantity <= 0 ||
      !Number.isFinite(fuelPrice) ||
      fuelPrice <= 0 ||
      !Number.isFinite(mileage) ||
      mileage <= 0
    ) {
      Alert.alert(t('common.notice'), t('createListing.invalidCalcInputs'));
      return;
    }

    setIsCalculatingPrice(true);
    try {
      const response = await calculateTransportPriceRequest(accessToken, {
        mandiId,
        crop: formData.cropName.trim(),
        quantity,
        fuelPrice,
        mileage,
        fuelType: priceCalcForm.fuelType,
      });

      setPriceCalculation(response);
      setShowPriceCalcModal(false);
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message || t('createListing.calcFailed'));
    } finally {
      setIsCalculatingPrice(false);
    }
  };

  const handleSave = async () => {
    if (!accessToken) {
      Alert.alert(t('common.error'), t('createListing.notAuthenticated'));
      return;
    }

    if (!params.selectedMandiId) {
      Alert.alert(t('common.error'), t('createListing.noMandiSelected'));
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        selectedMandiId: parseInt(String(params.selectedMandiId), 10),
        cropName: formData.cropName,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        expectedPricePerUnit: parseFloat(formData.expectedPricePerUnit),
        harvestDate: formData.harvestDate,
        qualityGrade: formData.qualityGrade
      };

      await createSellRequest(accessToken, payload);
      Alert.alert(t('common.success'), t('createListing.sellRequestCreated'));
      router.replace('/(tabs)/orders');
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message || t('createListing.sellRequestFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('createListing.title')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('createListing.cropDetails')}</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('createListing.cropName')}</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="local-florist" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={formData.cropName}
                onChangeText={(text) => handleChange('cropName', text)}
                placeholder={t('createListing.cropPlaceholder')}
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('createListing.quantity')}</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={formData.quantity}
                onChangeText={(text) => handleChange('quantity', text)}
                keyboardType="numeric"
                placeholder="1000"
              />
              <View style={styles.unitBadge}>
                <Text style={styles.unitText}>kg</Text>
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('createListing.expectedPricePerUnit')}</Text>
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
          <Text style={styles.sectionTitle}>{t('createListing.harvestQuality')}</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('createListing.harvestDate')}</Text>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={() => setShowDatePicker(true)}
            >
              <Feather name="calendar" size={20} color="#666" style={styles.inputIcon} />
              <Text style={[styles.input, styles.pickerText, { color: formData.harvestDate ? '#111' : '#999' }]}>
                {formData.harvestDate || t('createListing.datePlaceholder')}
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
            <Text style={styles.label}>{t('createListing.qualityGrade')}</Text>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={() => setShowQualityModal(true)}
            >
              <Feather name="check-circle" size={20} color="#666" style={styles.inputIcon} />
              <Text style={[styles.input, styles.pickerText, { color: formData.qualityGrade ? '#111' : '#999' }]}>
                {formData.qualityGrade ? t('createListing.gradeWithValue', { grade: formData.qualityGrade }) : t('createListing.selectGrade')}
              </Text>
              <Feather name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.locationHeaderRow}>
            <Text style={[styles.sectionTitle, { marginBottom: 0, borderBottomWidth: 0, paddingBottom: 0 }]}>{t('createListing.locationData')}</Text>
            <TouchableOpacity style={styles.fetchLocationBtn} onPress={fetchLocation} disabled={isFetchingLocation}>
              {isFetchingLocation ? (
                <ActivityIndicator size="small" color="#085836" />
              ) : (
                <>
                  <Ionicons name="location" size={16} color="#085836" />
                  <Text style={styles.fetchLocationText}>{t('createListing.useDeviceLocation')}</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
          <View style={{ height: 1, backgroundColor: '#f0f0f0', marginBottom: 15 }} />

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>{t('createListing.latitude')}</Text>
              <TextInput
                style={[styles.input, styles.inputStandalone]}
                value={formData.lat}
                onChangeText={(text) => handleChange('lat', text)}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>{t('createListing.longitude')}</Text>
              <TextInput
                style={[styles.input, styles.inputStandalone]}
                value={formData.lng}
                onChangeText={(text) => handleChange('lng', text)}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('createListing.transportPriceTitle')}</Text>
          <Text style={styles.calculationDescription}>{t('createListing.transportPriceSubtitle')}</Text>

          <TouchableOpacity style={styles.calculatePricesButton} onPress={() => setShowPriceCalcModal(true)}>
            <Text style={styles.calculatePricesButtonText}>{t('createListing.calculatePrices')}</Text>
          </TouchableOpacity>

          {priceCalculation ? (
            <View style={styles.calculationResultBox}>
              <Text style={styles.calculationResultTitle}>{t('createListing.calculatedPrices')}</Text>

              <View style={styles.calculationRow}>
                <Text style={styles.calculationLabel}>{t('createListing.costPerQuintal')}</Text>
                <Text style={styles.calculationValue}>{formatCurrency(priceCalculation.costPerQuintal)}</Text>
              </View>

              <View style={styles.calculationRow}>
                <Text style={styles.calculationLabel}>{t('createListing.totalTransportCost')}</Text>
                <Text style={styles.calculationValue}>{formatCurrency(priceCalculation.totalTransportCost)}</Text>
              </View>

              <View style={styles.calculationRow}>
                <Text style={styles.calculationLabel}>{t('createListing.grossRevenue')}</Text>
                <Text style={styles.calculationValue}>{formatCurrency(priceCalculation.grossRevenue)}</Text>
              </View>

              <View style={[styles.calculationRow, styles.calculationRowLast]}>
                <Text style={[styles.calculationLabel, styles.netProfitLabel]}>{t('createListing.netProfit')}</Text>
                <Text style={[styles.calculationValue, styles.netProfitValue]}>{formatCurrency(priceCalculation.netProfit)}</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.calculationHint}>{t('createListing.noCalculationYet')}</Text>
          )}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSave} disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitButtonText}>{t('createListing.publishListing')}</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      <Modal visible={showQualityModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('createListing.selectQualityGrade')}</Text>
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
                  {t('createListing.gradeWithValue', { grade })}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.closeModalButton} onPress={() => setShowQualityModal(false)}>
              <Text style={styles.closeModalText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showPriceCalcModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.priceModalContent}>
            <Text style={styles.modalTitle}>{t('createListing.calculatePrices')}</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('createListing.fuelPrice')}</Text>
              <TextInput
                style={styles.modalInput}
                value={priceCalcForm.fuelPrice}
                onChangeText={(text) => handlePriceCalcInputChange('fuelPrice', text)}
                keyboardType="decimal-pad"
                placeholder="92.5"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('createListing.mileage')}</Text>
              <TextInput
                style={styles.modalInput}
                value={priceCalcForm.mileage}
                onChangeText={(text) => handlePriceCalcInputChange('mileage', text)}
                keyboardType="decimal-pad"
                placeholder="12.0"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('createListing.fuelType')}</Text>
              <View style={styles.fuelTypeRow}>
                {(['DIESEL', 'PETROL'] as FuelType[]).map((fuelType) => {
                  const isActive = priceCalcForm.fuelType === fuelType;
                  return (
                    <TouchableOpacity
                      key={fuelType}
                      style={[styles.fuelTypeChip, isActive && styles.fuelTypeChipActive]}
                      onPress={() => setPriceCalcForm(prev => ({ ...prev, fuelType }))}
                    >
                      <Text style={[styles.fuelTypeChipText, isActive && styles.fuelTypeChipTextActive]}>
                        {fuelType === 'DIESEL' ? t('createListing.diesel') : t('createListing.petrol')}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={styles.modalSecondaryButton}
                onPress={() => setShowPriceCalcModal(false)}
                disabled={isCalculatingPrice}
              >
                <Text style={styles.modalSecondaryButtonText}>{t('common.cancel')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalPrimaryButton}
                onPress={handleCalculatePrices}
                disabled={isCalculatingPrice}
              >
                {isCalculatingPrice ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.modalPrimaryButtonText}>{t('createListing.calculate')}</Text>
                )}
              </TouchableOpacity>
            </View>
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
  modalInput: {
    height: 44,
    fontSize: 15,
    color: '#111',
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  pickerText: {
    textAlignVertical: 'center',
    lineHeight: 48,
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
  calculationDescription: {
    color: '#666',
    fontSize: 13,
    marginBottom: 12,
    lineHeight: 18,
  },
  calculatePricesButton: {
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  calculatePricesButtonText: {
    color: '#085836',
    fontSize: 14,
    fontWeight: '700',
  },
  calculationHint: {
    color: '#888',
    fontSize: 13,
  },
  calculationResultBox: {
    borderWidth: 1,
    borderColor: '#E4EFE8',
    backgroundColor: '#F9FCFA',
    borderRadius: 12,
    padding: 12,
  },
  calculationResultTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E4D35',
    marginBottom: 8,
  },
  calculationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF5F0',
  },
  calculationRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  calculationLabel: {
    color: '#4A4A4A',
    fontSize: 13,
  },
  calculationValue: {
    color: '#085836',
    fontWeight: '700',
    fontSize: 13,
  },
  netProfitLabel: {
    fontWeight: '700',
    color: '#222',
  },
  netProfitValue: {
    fontSize: 14,
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
  priceModalContent: {
    width: '90%',
    maxWidth: 360,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
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
  fuelTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  fuelTypeChip: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },
  fuelTypeChipActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#9CCFAD',
  },
  fuelTypeChipText: {
    color: '#555',
    fontWeight: '600',
    fontSize: 13,
  },
  fuelTypeChipTextActive: {
    color: '#085836',
  },
  modalActionRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 10,
  },
  modalSecondaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
  },
  modalSecondaryButtonText: {
    color: '#555',
    fontWeight: '600',
    fontSize: 14,
  },
  modalPrimaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#085836',
    alignItems: 'center',
  },
  modalPrimaryButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
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
