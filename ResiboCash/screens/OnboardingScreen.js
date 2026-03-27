import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    icon: 'receipt',
    title: 'Scan Any Receipt',
    desc: 'Snap a photo of any store receipt — grocery, pharmacy, convenience store, even sari-sari!',
  },
  {
    id: '2',
    icon: 'coins',
    title: 'Earn Points',
    desc: 'Get 1 point for every P10 spent. Bonus points on featured brands and special promos.',
  },
  {
    id: '3',
    icon: 'cashout',
    title: 'Cash Out Rewards',
    desc: 'Redeem points for GCash, Maya, mobile load, or gift cards from your favorite stores.',
  },
];

function SlideIcon({ type }) {
  if (type === 'receipt') {
    return (
      <View style={iconStyles.circle}>
        <View style={iconStyles.receiptBody}>
          <View style={iconStyles.line} />
          <View style={[iconStyles.line, { width: '55%' }]} />
          <View style={iconStyles.line} />
          <View style={[iconStyles.line, { width: '40%' }]} />
          <View style={iconStyles.checkRow}>
            <View style={iconStyles.checkShort} />
            <View style={iconStyles.checkLong} />
          </View>
        </View>
      </View>
    );
  }
  if (type === 'coins') {
    return (
      <View style={iconStyles.circle}>
        <View style={iconStyles.coinStack}>
          <View style={[iconStyles.coin, { backgroundColor: '#FFC107' }]} />
          <View style={[iconStyles.coin, { backgroundColor: '#FFB300', marginTop: -8 }]} />
          <View style={[iconStyles.coin, { backgroundColor: '#FF8F00', marginTop: -8 }]} />
        </View>
        <View style={iconStyles.sparkle1} />
        <View style={iconStyles.sparkle2} />
      </View>
    );
  }
  return (
    <View style={iconStyles.circle}>
      <View style={iconStyles.phoneBody}>
        <View style={iconStyles.phoneScreen}>
          <Text style={iconStyles.peso}>P</Text>
        </View>
      </View>
    </View>
  );
}

const iconStyles = StyleSheet.create({
  circle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 3,
    borderColor: '#A5D6A7',
  },
  receiptBody: {
    width: 50,
    height: 65,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    justifyContent: 'center',
    gap: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  line: { width: '80%', height: 4, backgroundColor: '#C8E6C9', borderRadius: 2 },
  checkRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  checkShort: {
    width: 8, height: 3, backgroundColor: '#4CAF50', borderRadius: 1,
    transform: [{ rotate: '45deg' }],
  },
  checkLong: {
    width: 14, height: 3, backgroundColor: '#4CAF50', borderRadius: 1,
    transform: [{ rotate: '-45deg' }], marginLeft: -2,
  },
  coinStack: { alignItems: 'center' },
  coin: {
    width: 40, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: 'rgba(0,0,0,0.1)',
  },
  sparkle1: {
    position: 'absolute', top: 25, right: 28,
    width: 8, height: 8, borderRadius: 1,
    backgroundColor: '#FFC107',
    transform: [{ rotate: '45deg' }],
  },
  sparkle2: {
    position: 'absolute', bottom: 30, left: 30,
    width: 6, height: 6, borderRadius: 1,
    backgroundColor: '#FFC107',
    transform: [{ rotate: '45deg' }],
  },
  phoneBody: {
    width: 40, height: 60, borderRadius: 8,
    borderWidth: 3, borderColor: '#4CAF50',
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  phoneScreen: {
    width: 28, height: 40, borderRadius: 4,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center', alignItems: 'center',
  },
  peso: { fontSize: 20, fontWeight: '900', color: '#4CAF50' },
});

export default function OnboardingScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('slides'); // slides | phone | otp
  const flatListRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const animateTransition = (callback) => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      callback();
      Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
    });
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
      setCurrentIndex(currentIndex + 1);
    } else {
      animateTransition(() => setStep('phone'));
    }
  };

  const handlePhoneSubmit = () => {
    if (phone.length >= 10) {
      animateTransition(() => setStep('otp'));
    }
  };

  const handleOtpSubmit = () => {
    if (otp.length >= 4) {
      AsyncStorage.setItem('@resibo_onboarded', 'true');
      navigation.replace('MainTabs');
    }
  };

  // Phone number entry
  if (step === 'phone') {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.stepWrap}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Animated.View style={[styles.stepContent, { opacity: fadeAnim }]}>
            <View style={styles.stepIcon}>
              <View style={styles.phoneIcon}>
                <View style={styles.phoneBar} />
              </View>
            </View>
            <Text style={styles.stepTitle}>Enter your mobile number</Text>
            <Text style={styles.stepDesc}>We'll send you a verification code</Text>

            <View style={styles.phoneInputRow}>
              <View style={styles.countryCode}>
                <Text style={styles.countryFlag}>PH</Text>
                <Text style={styles.countryText}>+63</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                placeholder="917 123 4567"
                placeholderTextColor="#BDBDBD"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                maxLength={12}
              />
            </View>

            <TouchableOpacity
              style={[styles.primaryBtn, phone.length < 10 && styles.btnDisabled]}
              onPress={handlePhoneSubmit}
              disabled={phone.length < 10}
            >
              <Text style={styles.primaryBtnText}>Send Code</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.skipLoginBtn} onPress={() => { AsyncStorage.setItem('@resibo_onboarded', 'true'); navigation.replace('MainTabs'); }}>
              <Text style={styles.skipLoginText}>Skip for now</Text>
            </TouchableOpacity>

            <Text style={styles.termsText}>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // OTP verification
  if (step === 'otp') {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.stepWrap}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Animated.View style={[styles.stepContent, { opacity: fadeAnim }]}>
            <View style={styles.stepIcon}>
              <View style={styles.shieldIcon}>
                <View style={styles.shieldCheck1} />
                <View style={styles.shieldCheck2} />
              </View>
            </View>
            <Text style={styles.stepTitle}>Verify your number</Text>
            <Text style={styles.stepDesc}>Enter the 6-digit code sent to +63 {phone}</Text>

            <TextInput
              style={styles.otpInput}
              placeholder="- - - - - -"
              placeholderTextColor="#BDBDBD"
              keyboardType="number-pad"
              value={otp}
              onChangeText={setOtp}
              maxLength={6}
              textAlign="center"
            />

            <TouchableOpacity
              style={[styles.primaryBtn, otp.length < 4 && styles.btnDisabled]}
              onPress={handleOtpSubmit}
              disabled={otp.length < 4}
            >
              <Text style={styles.primaryBtnText}>Verify</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resendBtn}>
              <Text style={styles.resendText}>Resend code</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => animateTransition(() => setStep('phone'))}>
              <Text style={styles.backLink}>Change number</Text>
            </TouchableOpacity>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Slides
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.skipBtn} onPress={() => animateTransition(() => setStep('phone'))}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <SlideIcon type={item.icon} />
            <Text style={styles.slideTitle}>{item.title}</Text>
            <Text style={styles.slideDesc}>{item.desc}</Text>
          </View>
        )}
      />

      {/* Dots */}
      <View style={styles.dotsRow}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === currentIndex && styles.dotActive,
            ]}
          />
        ))}
      </View>

      {/* Button */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleNext}>
          <Text style={styles.primaryBtnText}>
            {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  skipBtn: {
    position: 'absolute',
    top: 56,
    right: 24,
    zIndex: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    color: '#9E9E9E',
    fontSize: 16,
    fontWeight: '600',
  },
  slide: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 80,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#212121',
    textAlign: 'center',
    marginBottom: 12,
  },
  slideDesc: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 24,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
  },
  dotActive: {
    backgroundColor: '#4CAF50',
    width: 24,
  },
  bottomActions: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  primaryBtn: {
    backgroundColor: '#4CAF50',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#1B5E20',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  btnDisabled: {
    backgroundColor: '#C8E6C9',
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  stepWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  stepContent: {
    paddingHorizontal: 28,
    alignItems: 'center',
  },
  stepIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  phoneIcon: {
    width: 28,
    height: 44,
    borderRadius: 6,
    borderWidth: 2.5,
    borderColor: '#4CAF50',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 4,
  },
  phoneBar: {
    width: 12,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#4CAF50',
  },
  shieldIcon: {
    width: 32,
    height: 38,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderWidth: 2.5,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shieldCheck1: {
    width: 8,
    height: 3,
    backgroundColor: '#4CAF50',
    borderRadius: 1,
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
    left: 6,
    top: 16,
  },
  shieldCheck2: {
    width: 14,
    height: 3,
    backgroundColor: '#4CAF50',
    borderRadius: 1,
    transform: [{ rotate: '-45deg' }],
    position: 'absolute',
    left: 10,
    top: 14,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#212121',
    marginBottom: 8,
    textAlign: 'center',
  },
  stepDesc: {
    fontSize: 15,
    color: '#9E9E9E',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  phoneInputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
    width: '100%',
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  countryFlag: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4CAF50',
  },
  countryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  phoneInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    letterSpacing: 1,
  },
  otpInput: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 12,
    fontSize: 28,
    fontWeight: '700',
    color: '#212121',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    letterSpacing: 8,
    marginBottom: 24,
  },
  resendBtn: {
    marginTop: 16,
    paddingVertical: 8,
  },
  resendText: {
    color: '#4CAF50',
    fontSize: 15,
    fontWeight: '600',
  },
  backLink: {
    color: '#9E9E9E',
    fontSize: 14,
    marginTop: 8,
  },
  skipLoginBtn: {
    marginTop: 16,
    paddingVertical: 10,
  },
  skipLoginText: {
    color: '#4CAF50',
    fontSize: 15,
    fontWeight: '600',
  },
  termsText: {
    color: '#BDBDBD',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 18,
    paddingHorizontal: 20,
  },
});
