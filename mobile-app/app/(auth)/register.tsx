import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { updateProfileRequest } from '../services/api';

export default function RegisterScreen() {
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
      alert("Please fill required fields: First Name, Surname, and Address.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        roles: ["ROLE_FARMER"]
      };

      const parsedRes: any = await updateProfileRequest(accessToken!, payload);
      // Backend returns standard response structure usually or just parses it.
      // E.g., if response is standard, we check parsedRes properties to confirm it passed, 
      // but if the API doesn't throw ApiError it means 200 OK. Let's assume on success we proceed.
      // The old mock code checked `parsedRes.success && parsedRes.data`.
      // Real backend likely returns the updated profile object or standard response.
      // If we got here with no errors thrown by apiClient, we assume success.
      await updateUserContext({ profileCompleted: true });
      router.replace('/(tabs)');

    } catch (error: any) {
      alert(error?.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Complete Profile</Text>
            <Text style={styles.subtitle}>Please fill out your details to get started with KrishiEaze.</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.sectionHeader}>Personal Information</Text>

            <TextInput style={styles.input} placeholder="First Name *" value={form.firstName} onChangeText={(v) => handleChange('firstName', v)} />
            <TextInput style={styles.input} placeholder="Middle Name" value={form.middleName} onChangeText={(v) => handleChange('middleName', v)} />
            <TextInput style={styles.input} placeholder="Surname *" value={form.surName} onChangeText={(v) => handleChange('surName', v)} />

            <View style={styles.divider} />
            <Text style={styles.sectionHeader}>Location Information</Text>

            <TextInput style={styles.input} placeholder="Address Line *" value={form.address} onChangeText={(v) => handleChange('address', v)} />
            <TextInput style={styles.input} placeholder="District" value={form.district} onChangeText={(v) => handleChange('district', v)} />

            <View style={styles.row}>
              <TextInput style={[styles.input, { flex: 1, marginRight: 10 }]} placeholder="State" value={form.state} onChangeText={(v) => handleChange('state', v)} />
              <TextInput style={[styles.input, { flex: 1 }]} placeholder="Pincode" keyboardType="number-pad" value={form.pinCode} onChangeText={(v) => handleChange('pinCode', v)} />
            </View>

            <TouchableOpacity style={styles.button} onPress={submitProfile} disabled={loading}>
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Complete Registration</Text>}
            </TouchableOpacity>

            {/* Dev Mode Debug Bypass */}
            <TouchableOpacity
              style={{ marginTop: 20, alignItems: 'center', backgroundColor: '#eee', padding: 10, borderRadius: 8 }}
              onPress={async () => {
                await updateUserContext({ profileCompleted: true });
                router.replace('/(tabs)');
              }}
            >
              <Text style={{ color: '#085836', fontWeight: 'bold' }}>Debug: Force Home Dashboard</Text>
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
