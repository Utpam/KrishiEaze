import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { updateProfileRequest } from '../services/api';

export default function RegisterScreen() {
  const { t } = useTranslation();
  const { accessToken, updateUserContext } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    middleName: '',
    surName: '',
    address: '',
    district: '',
    state: '',
    pinCode: '',
  });

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const submitProfile = async () => {
    if (!form.firstName || !form.surName || !form.address) {
      alert(t('register.requiredFields'));
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        roles: ["ROLE_FARMER"]
      };

      await updateProfileRequest(accessToken!, payload);
      await updateUserContext({ profileCompleted: true });
      router.replace('/(tabs)');

    } catch (error: any) {
      alert(error?.message || t('register.updateFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>{t('register.title')}</Text>
            <Text style={styles.subtitle}>{t('register.subtitle')}</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.sectionHeader}>{t('register.personalInformation')}</Text>

            <TextInput style={styles.input} placeholder={t('register.firstName')} value={form.firstName} onChangeText={(v) => handleChange('firstName', v)} />
            <TextInput style={styles.input} placeholder={t('register.middleName')} value={form.middleName} onChangeText={(v) => handleChange('middleName', v)} />
            <TextInput style={styles.input} placeholder={t('register.surname')} value={form.surName} onChangeText={(v) => handleChange('surName', v)} />

            <View style={styles.divider} />
            <Text style={styles.sectionHeader}>{t('register.locationInformation')}</Text>

            <TextInput style={styles.input} placeholder={t('register.addressLine')} value={form.address} onChangeText={(v) => handleChange('address', v)} />
            <TextInput style={styles.input} placeholder={t('register.district')} value={form.district} onChangeText={(v) => handleChange('district', v)} />

            <View style={styles.row}>
              <TextInput style={[styles.input, { flex: 1, marginRight: 10 }]} placeholder={t('register.state')} value={form.state} onChangeText={(v) => handleChange('state', v)} />
              <TextInput style={[styles.input, { flex: 1 }]} placeholder={t('register.pincode')} keyboardType="number-pad" value={form.pinCode} onChangeText={(v) => handleChange('pinCode', v)} />
            </View>

            <TouchableOpacity style={styles.button} onPress={submitProfile} disabled={loading}>
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>{t('register.completeRegistration')}</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              style={{ marginTop: 20, alignItems: 'center', backgroundColor: '#eee', padding: 10, borderRadius: 8 }}
              onPress={async () => {
                await updateUserContext({ profileCompleted: true });
                router.replace('/(tabs)');
              }}
            >
              <Text style={{ color: '#085836', fontWeight: 'bold' }}>{t('register.debugHome')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  scrollContent: { paddingHorizontal: 24, paddingTop: 40, paddingBottom: 60 },
  headerContainer: { marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', lineHeight: 24 },
  formContainer: { width: '100%' },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', color: '#085836', marginBottom: 15, marginTop: 10 },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 10 },
  input: {
    backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E0E0E0',
    borderRadius: 12, paddingHorizontal: 15, height: 56, marginBottom: 16,
    fontSize: 16, color: '#111'
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  button: {
    backgroundColor: '#085836', height: 56, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', marginTop: 20
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});
