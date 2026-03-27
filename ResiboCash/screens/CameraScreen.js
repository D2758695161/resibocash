import React, { useState, useRef, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { PointsContext } from '../App';
import { scanReceipt } from '../services/api';

function ScanningOverlay() {
  const scanLine = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    const line = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLine, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(scanLine, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    const p = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.05, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.95, duration: 900, useNativeDriver: true }),
      ])
    );
    line.start();
    p.start();
    return () => { line.stop(); p.stop(); };
  }, []);

  return (
    <View style={loadStyles.wrap}>
      <Animated.View style={[loadStyles.iconCircle, { transform: [{ scale: pulse }] }]}>
        <View style={loadStyles.receiptShape}>
          <View style={loadStyles.rLine} />
          <View style={[loadStyles.rLine, { width: '55%' }]} />
          <View style={loadStyles.rLine} />
          <View style={[loadStyles.rLine, { width: '45%' }]} />
        </View>
        <Animated.View
          style={[
            loadStyles.scanBar,
            { transform: [{ translateY: scanLine.interpolate({ inputRange: [0, 1], outputRange: [-28, 28] }) }] },
          ]}
        />
      </Animated.View>
      <Text style={loadStyles.title}>Scanning your receipt...</Text>
      <Text style={loadStyles.sub}>Reading items and totals</Text>
      <View style={loadStyles.dots}>
        <View style={[loadStyles.dot, { backgroundColor: '#4CAF50' }]} />
        <View style={[loadStyles.dot, { backgroundColor: '#FFC107' }]} />
        <View style={[loadStyles.dot, { backgroundColor: '#4CAF50' }]} />
      </View>
    </View>
  );
}

const loadStyles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 40 },
  iconCircle: {
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 28,
    borderWidth: 3,
    borderColor: '#A5D6A7',
  },
  receiptShape: {
    width: 40, height: 52,
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    padding: 8,
    justifyContent: 'center',
    gap: 6,
    overflow: 'hidden',
  },
  rLine: { width: '80%', height: 4, backgroundColor: '#C8E6C9', borderRadius: 2 },
  scanBar: {
    position: 'absolute', left: 30, right: 30, height: 3,
    backgroundColor: '#4CAF50',
    shadowColor: '#4CAF50', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.7, shadowRadius: 8,
  },
  title: { fontSize: 20, fontWeight: '700', color: '#212121' },
  sub: { fontSize: 14, color: '#9E9E9E', marginTop: 6 },
  dots: { flexDirection: 'row', gap: 8, marginTop: 28 },
  dot: { width: 10, height: 10, borderRadius: 5 },
});

export default function CameraScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);
  const cameraRef = useRef(null);
  const { setPoints, setHistory, setTotalEarned } = useContext(PointsContext);

  if (!permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <View style={styles.permCircle}>
          <View style={styles.permLens} />
        </View>
        <Text style={styles.permTitle}>Camera Access Needed</Text>
        <Text style={styles.permDesc}>Allow camera access to scan and read your receipts</Text>
        <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
          <Text style={styles.permBtnText}>Enable Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePhoto = async () => {
    if (!cameraRef.current) return;
    try {
      const result = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      setPhoto(result.uri);
    } catch {
      Alert.alert('Error', 'Failed to capture. Please try again.');
    }
  };

  const submitPhoto = async () => {
    if (uploading) return;
    setUploading(true);
    try {
      const response = await scanReceipt(photo);
      setPoints((prev) => prev + response.points);
      setTotalEarned((prev) => prev + response.points);
      setHistory((prev) => [
        { id: Date.now().toString(), ...response, date: new Date().toISOString() },
        ...prev,
      ]);
      navigation.navigate('Result', { data: response });
    } catch {
      Alert.alert('Failed', 'Could not process receipt.');
    } finally {
      setUploading(false);
      setPhoto(null);
    }
  };

  if (uploading) return <ScanningOverlay />;

  if (photo) {
    return (
      <View style={styles.previewWrap}>
        <Image source={{ uri: photo }} style={styles.previewImg} />
        <View style={styles.previewHeader}>
          <Text style={styles.previewTitle}>Review Your Receipt</Text>
          <Text style={styles.previewSub}>Make sure it is clear and readable</Text>
        </View>
        <View style={styles.previewBtns}>
          <TouchableOpacity style={styles.retakeBtn} onPress={() => setPhoto(null)}>
            <Text style={styles.retakeText}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitBtn} onPress={submitPhoto}>
            <Text style={styles.submitText}>Submit Receipt</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.cameraWrap}>
      <CameraView style={styles.camera} ref={cameraRef} facing="back">
        {/* Viewfinder */}
        <View style={styles.overlay}>
          <View style={styles.topDark} />
          <View style={styles.middleRow}>
            <View style={styles.sideDark} />
            <View style={styles.frame}>
              <View style={[styles.corner, styles.tl]} />
              <View style={[styles.corner, styles.tr]} />
              <View style={[styles.corner, styles.bl]} />
              <View style={[styles.corner, styles.br]} />
            </View>
            <View style={styles.sideDark} />
          </View>
          <View style={styles.bottomDark}>
            <View style={styles.guidePill}>
              <Text style={styles.guideText}>Position receipt inside the frame</Text>
            </View>
          </View>
        </View>

        {/* Capture */}
        <View style={styles.captureBar}>
          <TouchableOpacity style={styles.captureOuter} onPress={takePhoto}>
            <View style={styles.captureRing}>
              <View style={styles.captureInner} />
            </View>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const CS = 32;
const CW = 4;

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 40 },
  permCircle: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 24,
  },
  permLens: { width: 30, height: 24, borderRadius: 7, borderWidth: 3, borderColor: '#4CAF50' },
  permTitle: { fontSize: 20, fontWeight: '700', color: '#212121', marginBottom: 8 },
  permDesc: { fontSize: 15, color: '#9E9E9E', textAlign: 'center', lineHeight: 22, marginBottom: 28 },
  permBtn: {
    backgroundColor: '#4CAF50', paddingVertical: 16, paddingHorizontal: 40, borderRadius: 14,
    shadowColor: '#1B5E20', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8,
  },
  permBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },

  cameraWrap: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },

  overlay: { flex: 1 },
  topDark: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' },
  middleRow: { flexDirection: 'row', height: '50%' },
  sideDark: { flex: 0.1, backgroundColor: 'rgba(0,0,0,0.55)' },
  frame: { flex: 0.8, position: 'relative' },
  bottomDark: {
    flex: 0.6, backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-start', alignItems: 'center', paddingTop: 16,
  },

  corner: { position: 'absolute', width: CS, height: CS },
  tl: { top: 0, left: 0, borderTopWidth: CW, borderLeftWidth: CW, borderColor: '#4CAF50', borderTopLeftRadius: 10 },
  tr: { top: 0, right: 0, borderTopWidth: CW, borderRightWidth: CW, borderColor: '#4CAF50', borderTopRightRadius: 10 },
  bl: { bottom: 0, left: 0, borderBottomWidth: CW, borderLeftWidth: CW, borderColor: '#4CAF50', borderBottomLeftRadius: 10 },
  br: { bottom: 0, right: 0, borderBottomWidth: CW, borderRightWidth: CW, borderColor: '#4CAF50', borderBottomRightRadius: 10 },

  guidePill: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 18, paddingVertical: 10, borderRadius: 24,
  },
  guideText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },

  captureBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingBottom: 50, paddingTop: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  captureOuter: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center' },
  captureRing: {
    width: 80, height: 80, borderRadius: 40,
    borderWidth: 5, borderColor: '#4CAF50',
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  captureInner: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4,
  },

  previewWrap: { flex: 1, backgroundColor: '#F5F5F5' },
  previewImg: { flex: 1, resizeMode: 'contain' },
  previewHeader: {
    position: 'absolute', top: 0, left: 0, right: 0,
    padding: 20, backgroundColor: 'rgba(255,255,255,0.95)',
    borderBottomWidth: 1, borderBottomColor: '#E0E0E0',
  },
  previewTitle: { fontSize: 18, fontWeight: '700', color: '#212121' },
  previewSub: { fontSize: 13, color: '#9E9E9E', marginTop: 2 },
  previewBtns: {
    flexDirection: 'row', gap: 12, padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1, borderTopColor: '#E0E0E0',
  },
  retakeBtn: {
    flex: 1, backgroundColor: '#F5F5F5',
    paddingVertical: 16, borderRadius: 14, alignItems: 'center',
    borderWidth: 1, borderColor: '#E0E0E0',
  },
  retakeText: { fontSize: 16, fontWeight: '600', color: '#212121' },
  submitBtn: {
    flex: 1.5, backgroundColor: '#4CAF50',
    paddingVertical: 16, borderRadius: 14, alignItems: 'center',
    shadowColor: '#1B5E20', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8,
  },
  submitText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
});
