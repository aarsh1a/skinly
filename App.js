import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ScrollView,
  Animated,
  Alert,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Aurora from './components/Aurora';
import { AcneIcon, CombinationIcon, BreakoutIcon, SensitivityIcon, RoutineIcon } from './components/SkinIcons';
import CheckProductSheet from './components/CheckProductSheet';
import ProductResultModal from './components/ProductResultModal';
import SaveToListModal from './components/SaveToListModal';
import ListsScreen from './components/ListsScreen';
import DiscoverScreen from './components/DiscoverScreen';
import ProfileScreen from './components/ProfileScreen';
import { ListsProvider, useLists } from './context/ListsContext';

const { width } = Dimensions.get('window');

// Helper function to get time-based greeting with icon
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return { text: 'Good morning', icon: 'sunny-outline' };
  if (hour >= 12 && hour < 17) return { text: 'Good afternoon', icon: 'partly-sunny-outline' };
  if (hour >= 17 && hour < 21) return { text: 'Good evening', icon: 'moon-outline' };
  return { text: 'Good night', icon: 'sparkles' };
};

// Mock data for recently checked products
const recentlyChecked = [
  { id: 1, name: 'CeraVe Moisturizing Cream', status: 'safe', statusText: 'Safe for you' },
  { id: 2, name: 'The Ordinary Niacinamide 10%', status: 'caution', statusText: 'Use with caution' },
  { id: 3, name: 'Neutrogena Sunscreen SPF 50', status: 'safe', statusText: 'Safe for you' },
];

// Daily skin tips
const skinTips = [
  "Vitamin C works best in the morning under sunscreen.",
  "Always patch test new products for 24 hours.",
  "Hydration starts from within – drink water!",
  "Apply products thinnest to thickest consistency.",
  "Retinol and AHAs shouldn't be used together.",
];

// Tab Bar Component with Premium Floating Pill Design
const TabBar = ({ activeTab, setActiveTab, onCheckPress }) => {
  // Animation values for each tab
  const scaleAnims = {
    home: React.useRef(new Animated.Value(activeTab === 'home' ? 1.15 : 1)).current,
    discover: React.useRef(new Animated.Value(activeTab === 'discover' ? 1.15 : 1)).current,
    lists: React.useRef(new Animated.Value(activeTab === 'lists' ? 1.15 : 1)).current,
    profile: React.useRef(new Animated.Value(activeTab === 'profile' ? 1.15 : 1)).current,
  };

  const checkButtonScale = React.useRef(new Animated.Value(1)).current;

  const tabs = [
    { id: 'home', icon: 'home', activeIcon: 'home', iconType: 'ionicons' },
    { id: 'discover', icon: 'compass-outline', activeIcon: 'compass', iconType: 'ionicons' },
    { id: 'check', isCenter: true },
    { id: 'lists', icon: 'heart-outline', activeIcon: 'heart', iconType: 'ionicons' },
    { id: 'profile', icon: 'person-outline', activeIcon: 'person', iconType: 'ionicons' },
  ];

  const handleTabPress = async (tabId) => {
    if (tabId === 'check') {
      // Bounce animation for check button
      Animated.sequence([
        Animated.timing(checkButtonScale, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(checkButtonScale, {
          toValue: 1,
          friction: 3,
          tension: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Haptic feedback
      try {
        const Haptics = require('expo-haptics');
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (e) { }

      if (onCheckPress) onCheckPress();
      return;
    }

    // Animate previous active tab down
    if (activeTab && activeTab !== 'check' && scaleAnims[activeTab]) {
      Animated.spring(scaleAnims[activeTab], {
        toValue: 1,
        friction: 5,
        tension: 300,
        useNativeDriver: true,
      }).start();
    }

    // Animate new active tab up with bounce
    if (scaleAnims[tabId]) {
      Animated.spring(scaleAnims[tabId], {
        toValue: 1.15,
        friction: 4,
        tension: 200,
        useNativeDriver: true,
      }).start();
    }

    // Haptic feedback
    try {
      const Haptics = require('expo-haptics');
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) { }

    setActiveTab(tabId);
  };

  const renderIcon = (tab) => {
    const isActive = activeTab === tab.id;
    const iconName = isActive ? tab.activeIcon : tab.icon;
    const color = isActive ? '#EC4899' : 'rgba(255, 255, 255, 0.5)';
    const size = 24;

    return <Ionicons name={iconName} size={size} color={color} />;
  };

  const renderCenterButton = () => (
    <Animated.View style={[styles.centerButtonWrapper, { transform: [{ scale: checkButtonScale }] }]}>
      <TouchableOpacity
        onPress={() => handleTabPress('check')}
        activeOpacity={0.8}
        style={styles.centerButton}
      >
        <LinearGradient
          colors={['#EC4899', '#F472B6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.centerButtonGradient}
        >
          <Ionicons name="scan" size={26} color="#ffffff" />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.tabBarWrapper}>
      {/* Soft shadow underneath */}
      <View style={styles.tabBarShadow} />

      <View style={styles.tabBarContainer}>
        <BlurView intensity={50} tint="dark" style={styles.blurView}>
          <View style={styles.tabBarInner}>
            {tabs.map((tab) => {
              if (tab.isCenter) {
                return <View key={tab.id} style={styles.centerButtonSpace}>{renderCenterButton()}</View>;
              }

              const isActive = activeTab === tab.id;
              const scaleAnim = scaleAnims[tab.id];

              return (
                <TouchableOpacity
                  key={tab.id}
                  style={styles.tabItem}
                  onPress={() => handleTabPress(tab.id)}
                  activeOpacity={0.7}
                >
                  <Animated.View
                    style={[
                      styles.tabIconContainer,
                      { transform: [{ scale: scaleAnim }] }
                    ]}
                  >
                    {/* Glow effect for active tab */}
                    {isActive && <View style={styles.activeGlow} />}
                    {renderIcon(tab)}
                  </Animated.View>
                </TouchableOpacity>
              );
            })}
          </View>
        </BlurView>
      </View>
    </View>
  );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const getStatusStyle = () => {
    switch (status) {
      case 'safe':
        return { bg: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', icon: 'checkmark-circle' };
      case 'caution':
        return { bg: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24', icon: 'warning' };
      case 'avoid':
        return { bg: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', icon: 'close-circle' };
      default:
        return { bg: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', icon: 'help-circle' };
    }
  };

  const statusStyle = getStatusStyle();

  return (
    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
      <Ionicons name={statusStyle.icon} size={16} color={statusStyle.color} />
    </View>
  );
};

// Home Screen Component
const HomeScreen = ({ onCheckProduct }) => {
  const greeting = getGreeting();
  const randomTip = skinTips[Math.floor(Math.random() * skinTips.length)];

  const handleCheckProduct = () => {
    if (onCheckProduct) onCheckProduct();
  };

  return (
    <View style={styles.homeContainer}>
      {/* Header with Greeting and Tip */}
      <View style={styles.headerSection}>
        <View style={styles.greetingRow}>
          <Text style={styles.greeting}>
            {greeting.text}, Aarshi
          </Text>
          <Ionicons name={greeting.icon} size={24} color="#EC4899" style={styles.greetingIcon} />
        </View>
        <Text style={styles.subtitle}>Tip: {randomTip.replace(/\.$/, '')}</Text>
      </View>

      {/* Skin Profile Card */}
      <View style={styles.cardContainer}>
        <BlurView intensity={25} tint="light" style={styles.profileCard}>
          <View style={styles.profileCardInner}>
            {/* Header with Edit */}
            <View style={styles.profileHeader}>
              <Text style={styles.profileTitle}>Your Skin Profile</Text>
              <TouchableOpacity activeOpacity={0.7} style={styles.editButton}>
                <Feather name="edit-2" size={16} color="#EC4899" />
              </TouchableOpacity>
            </View>

            {/* Skin Type Pills - Vertical Layout */}
            <View style={styles.skinTags}>
              <View style={styles.skinTagVertical}>
                <AcneIcon size={24} color="#f9a8d4" />
                <Text style={styles.skinTagText}>Acne-prone</Text>
              </View>
              <View style={styles.skinTagVertical}>
                <CombinationIcon size={24} color="#a5b4fc" />
                <Text style={styles.skinTagText}>Combination</Text>
              </View>
            </View>

            {/* Main Concern */}
            <View style={styles.profileRow}>
              <Text style={styles.profileRowLabel}>Main Concern</Text>
              <View style={styles.concernPill}>
                <BreakoutIcon size={14} color="#fcd34d" />
                <Text style={styles.concernText}>Breakouts</Text>
              </View>
            </View>

            {/* Sensitivity Row */}
            <View style={styles.profileRow}>
              <Text style={styles.profileRowLabel}>Sensitivity</Text>
              <View style={styles.sensitivityIndicator}>
                <SensitivityIcon size={14} color="#86efac" />
                <Text style={styles.sensitivityValue}>Moderate</Text>
              </View>
            </View>

            {/* Routine Style */}
            <View style={styles.profileRowMuted}>
              <RoutineIcon size={14} color="rgba(255,255,255,0.4)" />
              <Text style={styles.routineText}>Routine: Minimal</Text>
            </View>
          </View>
        </BlurView>
      </View>

      {/* Main CTA Button */}
      <TouchableOpacity
        onPress={handleCheckProduct}
        activeOpacity={0.8}
        style={styles.ctaWrapper}
      >
        <View style={styles.ctaContainer}>
          <BlurView intensity={30} tint="light" style={styles.ctaButton}>
            <View style={styles.ctaInner}>
              <View style={styles.ctaIconCircle}>
                <Ionicons name="scan" size={28} color="#ffffff" />
              </View>
              <Text style={styles.ctaText}>Check a Product</Text>
              <Feather name="arrow-right" size={20} color="rgba(255,255,255,0.8)" />
            </View>
          </BlurView>
        </View>
      </TouchableOpacity>

      {/* Recently Checked Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recently Checked</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardContainer}>
          <BlurView intensity={20} tint="light" style={styles.recentCard}>
            <View style={styles.recentCardInner}>
              {recentlyChecked.slice(0, 2).map((product, index) => (
                <TouchableOpacity
                  key={product.id}
                  style={[
                    styles.productItem,
                    index !== 1 && styles.productItemBorder
                  ]}
                  activeOpacity={0.7}
                >
                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={1}>
                      {product.name}
                    </Text>
                    <Text style={styles.productStatus}>{product.statusText}</Text>
                  </View>
                  <StatusBadge status={product.status} />
                </TouchableOpacity>
              ))}
            </View>
          </BlurView>
        </View>
      </View>
    </View>
  );
};

// Discover Screen Component is now imported from ./components/DiscoverScreen

// Chat Screen Component
const ChatScreen = () => (
  <View style={styles.screenContainer}>
    <Text style={styles.screenTitle}>AI Skincare Assistant</Text>
    <Text style={styles.screenSubtitle}>Ask me anything about skincare</Text>
    <View style={styles.placeholderCard}>
      <Text style={styles.placeholderEmoji}>💬</Text>
      <Text style={styles.placeholderText}>Coming Soon</Text>
      <Text style={styles.placeholderSubtext}>
        Get personalized skincare advice powered by AI
      </Text>
    </View>
  </View>
);

// Lists Screen Component is now imported from ./components/ListsScreen

// Profile Screen Component is now imported from ./components/ProfileScreen

// Inner App Component that uses Lists context
function AppContent() {
  const [activeTab, setActiveTab] = useState('home');
  const [showCheckSheet, setShowCheckSheet] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedProduct, setAnalyzedProduct] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [currentProductForSave, setCurrentProductForSave] = useState(null);

  const { isProductSaved } = useLists();

  const handleCheckProduct = () => {
    setShowCheckSheet(true);
  };

  const startAnalysis = () => {
    setShowCheckSheet(false);
    console.log('Starting analysis...');

    // Small delay to allow the bottom sheet to close smoothly before opening the new modal
    setTimeout(() => {
      setShowResult(true);
      setIsAnalyzing(true);
      setAnalyzedProduct(null);

      console.log('Showing loading state...');

      // Mock analysis delay - set the analyzed product with an ID for saving
      setTimeout(() => {
        setIsAnalyzing(false);
        // Set the analyzed product with ID for saving functionality
        const mockProduct = {
          id: `product_${Date.now()}`,
          name: 'Moisturizing Cream',
          brand: 'CeraVe',
          imageUri: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
          verdict: { status: 'safe', headline: 'Safe for acne-prone skin' },
        };
        setAnalyzedProduct(mockProduct);
        setCurrentProductForSave(mockProduct);
        console.log('Analysis done, showing results.');
      }, 2500);
    }, 500);
  };

  const handleSaveProduct = () => {
    if (currentProductForSave) {
      setShowSaveModal(true);
    }
  };

  const handleImageSelected = (uri, source) => {
    console.log(`Image selected from ${source}:`, uri);
    startAnalysis();
  };

  const handleLinkSubmit = (link) => {
    console.log('Link submitted:', link);
    startAnalysis();
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen onCheckProduct={handleCheckProduct} />;
      case 'discover':
        return <DiscoverScreen onCheckProduct={handleCheckProduct} />;
      case 'lists':
        return <ListsScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen onCheckProduct={handleCheckProduct} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Aurora animated background */}
      <Aurora
        colorStops={['#EC4899', '#F472B6', '#FAFAFA']}
        speed={0.5}
      />

      <SafeAreaView style={styles.safeArea}>
        {renderScreen()}
      </SafeAreaView>

      {/* Bottom Tab Bar */}
      <TabBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onCheckPress={handleCheckProduct}
      />

      {/* Check Product Bottom Sheet */}
      <CheckProductSheet
        visible={showCheckSheet}
        onClose={() => setShowCheckSheet(false)}
        onImageSelected={handleImageSelected}
        onLinkSubmit={handleLinkSubmit}
      />

      {/* Product Analysis Result Modal */}
      <ProductResultModal
        visible={showResult}
        loading={isAnalyzing}
        product={analyzedProduct}
        onClose={() => setShowResult(false)}
        onSave={handleSaveProduct}
        isSaved={currentProductForSave ? isProductSaved(currentProductForSave.id) : false}
      />

      {/* Save to List Modal */}
      <SaveToListModal
        visible={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        product={currentProductForSave}
      />
    </View>
  );
}

// Main App wrapped with ListsProvider
export default function App() {
  return (
    <ListsProvider>
      <AppContent />
    </ListsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a12',
  },
  safeArea: {
    flex: 1,
  },

  // Home container (no scroll)
  homeContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 110,
    justifyContent: 'flex-start',
  },

  // Header styles
  headerSection: {
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '600',
    color: '#ffffff',
  },
  greetingIcon: {
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.6)',
  },

  // Card container styles
  cardContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    marginBottom: 12,
  },

  // Skin Profile Card
  profileCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileCardInner: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  healthBadge: {
    backgroundColor: 'rgba(236, 72, 153, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  healthScore: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EC4899',
  },
  skinTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 14,
  },
  skinTagVertical: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    minWidth: 90,
  },
  skinTagWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  skinTagText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
    textAlign: 'center',
  },
  editButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(236, 72, 153, 0.15)',
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileRowLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  concernPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(252, 211, 77, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  concernText: {
    fontSize: 12,
    color: '#fcd34d',
    fontWeight: '500',
  },
  sensitivityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(134, 239, 172, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  sensitivityValue: {
    fontSize: 12,
    color: '#86efac',
    fontWeight: '500',
  },
  profileRowMuted: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
  },
  routineText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  microcopy: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.35)',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
  },

  // CTA Button
  ctaWrapper: {
    marginBottom: 16,
  },
  ctaContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.4)',
  },
  ctaButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  ctaInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    backgroundColor: 'rgba(236, 72, 153, 0.15)',
  },
  ctaIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(236, 72, 153, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  ctaText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },

  // Section styles
  sectionContainer: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    color: 'rgba(236, 72, 153, 0.9)',
    fontWeight: '500',
  },

  // Recently Checked Card
  recentCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  recentCardInner: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  productItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  productInfo: {
    flex: 1,
    marginRight: 12,
  },
  productName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 4,
  },
  productStatus: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  statusBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Tip Card
  tipCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  tipCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  tipIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    fontStyle: 'italic',
    lineHeight: 20,
  },

  // Bottom spacer
  bottomSpacer: {
    height: 120,
  },

  // Premium Floating Pill Tab Bar Styles
  tabBarWrapper: {
    position: 'absolute',
    bottom: 34,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  tabBarShadow: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    height: 70,
    borderRadius: 999,
    backgroundColor: 'rgba(236, 72, 153, 0.15)',
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  tabBarContainer: {
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  blurView: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  tabBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(20, 10, 30, 0.75)',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  tabIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeGlow: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(236, 72, 153, 0.25)',
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },

  // Center Check Button
  centerButtonSpace: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  centerButtonWrapper: {
    marginTop: 0,
  },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  centerButtonGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },

  // Other Screens Styles
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  screenSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 40,
  },
  placeholderCard: {
    backgroundColor: 'rgba(30, 20, 50, 0.8)',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    width: '100%',
  },
  placeholderEmoji: {
    fontSize: 50,
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 10,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    lineHeight: 20,
  },
});
