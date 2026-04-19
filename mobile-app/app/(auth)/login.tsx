import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { sendOtpRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { t } = useTranslation();
  const { loginSession } = useAuth();
  const [mobileNo, setMobileNo] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendOTP = async () => {
    if (mobileNo.length < 10) return;
    setLoading(true);
    try {
      await sendOtpRequest(mobileNo, 'FARMER');
      router.push({ pathname: '/(auth)/otp', params: { mobileNo } });
    } catch (error: any) {
      alert(error?.message || t('login.sendOtpFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{t('common.krishieaze')}</Text>
          <Text style={styles.subtitle}>{t('login.subtitle')}</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>{t('login.mobileNumber')}</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.prefix}>+91</Text>
            <TextInput
              style={styles.input}
              placeholder={t('login.mobilePlaceholder')}
              keyboardType="phone-pad"
              maxLength={10}
              value={mobileNo}
              onChangeText={setMobileNo}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, mobileNo.length < 10 && styles.buttonDisabled]}
            onPress={handleSendOTP}
            disabled={mobileNo.length < 10 || loading}
          >
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>{t('login.sendOtp')}</Text>}
          </TouchableOpacity>

          <TouchableOpacity 
            style={{ marginTop: 20, alignItems: 'center', backgroundColor: '#eee', padding: 10, borderRadius: 8 }} 
            onPress={async () => {
              await loginSession('debug_token_home', 'debug_refresh_token', { profileCompleted: true, role: 'FARMER' });
            }}
          >
            <Text style={{ color: '#085836', fontWeight: 'bold' }}>{t('login.debugHome')}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={{ marginTop: 10, alignItems: 'center', backgroundColor: '#eee', padding: 10, borderRadius: 8 }} 
            onPress={async () => {
              await loginSession('debug_token_register', 'debug_refresh_token', { profileCompleted: false, role: 'FARMER' });
            }}
          >
            <Text style={{ color: '#085836', fontWeight: 'bold' }}>{t('login.debugRegister')}</Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  keyboardView: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  headerContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#085836',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 56,
    marginBottom: 24,
  },
  prefix: {
    fontSize: 16,
    color: '#333',
    marginRight: 10,
    fontWeight: '500',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111',
  },
  button: {
    backgroundColor: '#085836',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#085836',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#A5C9B3',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
