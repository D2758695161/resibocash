import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL_KEY = '@resibo_api_url';
const DEFAULT_URL = 'https://api.resibocash.com';

export default function SettingsScreen({ navigation }) {
  const [apiUrl, setApiUrl] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem(API_URL_KEY).then((val) => {
      setApiUrl(val || DEFAULT_URL);
    });
  }, []);

  const saveUrl = async (url) => {
    await AsyncStorage.setItem(API_URL_KEY, url);
  };

  const testConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const url = apiUrl.replace(/\/$/, '');
      const res = await fetch(`${url}/api/health`, { method: 'GET' });
      if (res.ok) {
        setTestResult({ success: true, msg: 'Connection successful!' });
      } else {
        setTestResult({ success: false, msg: `Server returned ${res.status}` });
      }
    } catch (e) {
      setTestResult({ success: false, msg: 'Could not reach server' });
    }
    setTesting(false);
  };

  const resetUrl = () => {
    Alert.alert('Reset API URL', 'Reset to default URL?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        onPress: () => {
          setApiUrl(DEFAULT_URL);
          saveUrl(DEFAULT_URL);
          setTestResult(null);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>{'‹'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>API CONFIGURATION</Text>
          <View style={styles.card}>
            <Text style={styles.fieldLabel}>API Server URL</Text>
            <TextInput
              style={styles.input}
              value={apiUrl}
              onChangeText={(text) => {
                setApiUrl(text);
                setTestResult(null);
              }}
              onBlur={() => saveUrl(apiUrl)}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              placeholder="https://api.resibocash.com"
              placeholderTextColor="#BDBDBD"
            />

            {testResult && (
              <View style={[styles.resultBanner, testResult.success ? styles.resultSuccess : styles.resultError]}>
                <Text style={[styles.resultText, testResult.success ? styles.resultTextSuccess : styles.resultTextError]}>
                  {testResult.msg}
                </Text>
              </View>
            )}

            <View style={styles.btnRow}>
              <TouchableOpacity
                style={styles.testBtn}
                onPress={testConnection}
                disabled={testing}
                activeOpacity={0.8}
              >
                {testing ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.testBtnText}>Test Connection</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.resetBtn} onPress={resetUrl} activeOpacity={0.8}>
                <Text style={styles.resetBtnText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ABOUT</Text>
          <View style={styles.card}>
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>Version</Text>
              <Text style={styles.aboutValue}>1.0.0 (MVP)</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>Build</Text>
              <Text style={styles.aboutValue}>2026.03</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>Environment</Text>
              <Text style={styles.aboutValue}>Production</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 30 }} />
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
  section: {
    marginBottom: 20,
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
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#757575',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#212121',
    backgroundColor: '#FAFAFA',
    marginBottom: 12,
  },
  resultBanner: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  resultSuccess: {
    backgroundColor: '#E8F5E9',
  },
  resultError: {
    backgroundColor: '#FFEBEE',
  },
  resultText: {
    fontSize: 13,
    fontWeight: '600',
  },
  resultTextSuccess: {
    color: '#2E7D32',
  },
  resultTextError: {
    color: '#C62828',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  testBtn: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  resetBtn: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  resetBtnText: {
    color: '#757575',
    fontSize: 14,
    fontWeight: '600',
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  aboutLabel: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '500',
  },
  aboutValue: {
    fontSize: 14,
    color: '#424242',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#F5F5F5',
  },
});
