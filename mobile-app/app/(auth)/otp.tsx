import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { verifyOtpRequest } from '../services/api';

export default function OTPScreen() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();
  const params = useLocalSearchParams();
  const mobileNo = params.mobileNo as string || 'Unknown Number';
  const { loginSession } = useAuth();

  const handleVerifyOTP = async () => {
    if (otp.length < 6) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const parsedRes: any = await verifyOtpRequest(mobileNo, otp);
      if (parsedRes?.tokenResponse) {
        const { accessToken, refreshToken } = parsedRes.tokenResponse;
        
        const user = {
          mobileNo: parsedRes.mobileNo,
          profileCompleted: !parsedRes.newUser,
          role: 'FARMER' 
        };

        // Save the authenticated user and tokens to global store
        await loginSession(accessToken, refreshToken, user);

        // Navigation is automatically intercepted by AuthContext
      }
    } catch (error: any) {
      setErrorMsg(error?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Confirm OTP</Text>
          <Text style={styles.subtitle}>Enter the 6-digit code sent to +91 {mobileNo}</Text>
        </View>

        <View style={styles.formContainer}>
          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                otp.length > 0 ? { fontSize: 22, letterSpacing: 8, fontWeight: 'bold' } : { fontSize: 16, fontWeight: 'normal' }
              ]}
              placeholder="Enter OTP"
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
              autoFocus
            />
          </View>

          <TouchableOpacity
            style={[styles.button, otp.length < 6 && styles.buttonDisabled]}
            onPress={handleVerifyOTP}
            disabled={otp.length < 6 || loading}
          >
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Verify & Proceed</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backText}>Change Mobile Number</Text>
          </TouchableOpacity>

          {/* Dev Mode Debug Bypass */}
          <TouchableOpacity
            style={{ marginTop: 20, alignItems: 'center', backgroundColor: '#eee', padding: 10, borderRadius: 8 }}
            onPress={async () => {
              await loginSession('debug_token_home', 'debug_refresh_token', { profileCompleted: true, role: 'FARMER' });
            }}
          >
            <Text style={{ color: '#085836', fontWeight: 'bold' }}>Debug: Skip to Home</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  keyboardView: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  headerContainer: { marginBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', lineHeight: 24 },
  formContainer: { width: '100%' },
  errorText: { color: '#E02B2B', fontSize: 14, marginBottom: 10, fontWeight: '500' },
  inputContainer: {
    backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E0E0E0',
    borderRadius: 12, paddingHorizontal: 15, height: 56, marginBottom: 24,
    justifyContent: 'center', alignItems: 'center'
  },
  input: { color: '#111', textAlign: 'center' },
  button: {
    backgroundColor: '#085836', height: 56, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  buttonDisabled: { backgroundColor: '#A5C9B3' },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  backButton: { marginTop: 24, alignItems: 'center' },
  backText: { color: '#085836', fontSize: 15, fontWeight: '600' }
});
