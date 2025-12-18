import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Feather, Ionicons } from '@expo/vector-icons';
import Aurora from './components/Aurora';
import CurvedText from './components/CurvedText';

const { width } = Dimensions.get('window');

// Tab Bar Component with Glassmorphism
const TabBar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', icon: 'home', iconType: 'feather' },
    { id: 'discover', icon: 'sparkles', iconType: 'ionicons' },
    { id: 'chat', icon: 'chatbubble-outline', iconType: 'ionicons' },
    { id: 'lists', icon: 'grid-outline', iconType: 'ionicons' },
    { id: 'profile', icon: 'person-outline', iconType: 'ionicons' },
  ];

  const renderIcon = (tab) => {
    const isActive = activeTab === tab.id;
    const color = isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.5)';
    const size = 24;

    if (tab.iconType === 'feather') {
      return <Feather name={tab.icon} size={size} color={color} />;
    }
    return <Ionicons name={tab.icon} size={size} color={color} />;
  };

  return (
    <View style={styles.tabBarWrapper}>
      <View style={styles.tabBarContainer}>
        <BlurView intensity={40} tint="dark" style={styles.blurView}>
          <View style={styles.tabBarInner}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={styles.tabItem}
                onPress={() => setActiveTab(tab.id)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.tabIconContainer,
                  activeTab === tab.id && styles.tabIconContainerActive
                ]}>
                  {renderIcon(tab)}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </BlurView>
      </View>
    </View>
  );
};

// Home Screen Component
const HomeScreen = () => {
  const handleUploadImage = () => {
    console.log('Upload Product Image pressed');
  };

  const handlePasteLink = () => {
    console.log('Paste Product Link pressed');
  };

  const handleSearchProduct = () => {
    console.log('Search by Product Name pressed');
  };

  return (
    <View style={styles.content}>
      {/* Logo and Tagline */}
      <View style={styles.headerContainer}>
        <Text style={styles.logo}>Skinly</Text>
        <Text style={styles.tagline}>check before you try</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonsContainer}>
        {/* Upload Product Image */}
        <TouchableOpacity
          onPress={handleUploadImage}
          activeOpacity={0.8}
        >
          <View style={styles.glassButtonContainer}>
            <BlurView intensity={25} tint="light" style={styles.glassButton}>
              <View style={styles.glassButtonInner}>
                <View style={styles.iconCircle}>
                  <Feather name="camera" size={22} color="#ffffff" />
                </View>
                <View style={styles.buttonTextContainer}>
                  <Text style={styles.buttonTitle}>Upload Product Image</Text>
                  <Text style={styles.buttonSubtitle}>
                    Scan ingredients from your product
                  </Text>
                </View>
              </View>
            </BlurView>
          </View>
        </TouchableOpacity>

        {/* Paste Product Link */}
        <TouchableOpacity
          onPress={handlePasteLink}
          activeOpacity={0.8}
        >
          <View style={styles.glassButtonContainer}>
            <BlurView intensity={25} tint="light" style={styles.glassButton}>
              <View style={styles.glassButtonInner}>
                <View style={styles.iconCircle}>
                  <Feather name="link" size={22} color="#ffffff" />
                </View>
                <View style={styles.buttonTextContainer}>
                  <Text style={styles.buttonTitle}>Paste Product Link</Text>
                  <Text style={styles.buttonSubtitle}>
                    Analyze from online store URL
                  </Text>
                </View>
              </View>
            </BlurView>
          </View>
        </TouchableOpacity>

        {/* Search by Product Name */}
        <TouchableOpacity
          onPress={handleSearchProduct}
          activeOpacity={0.8}
        >
          <View style={styles.glassButtonContainer}>
            <BlurView intensity={25} tint="light" style={styles.glassButton}>
              <View style={styles.glassButtonInner}>
                <View style={styles.iconCircle}>
                  <Feather name="search" size={22} color="#ffffff" />
                </View>
                <View style={styles.buttonTextContainer}>
                  <Text style={styles.buttonTitle}>Search by Product Name</Text>
                  <Text style={styles.buttonSubtitle}>
                    Find and analyze any product
                  </Text>
                </View>
              </View>
            </BlurView>
          </View>
        </TouchableOpacity>
      </View>

      {/* Curved Rotating Text */}
      <View style={styles.curvedTextContainer}>
        <CurvedText
          text="  •  check before you buy  •  check before you buy  "
          size={140}
          color="rgba(255, 255, 255, 0.5)"
        />
      </View>
    </View>
  );
};

// Discover Screen Component
const DiscoverScreen = () => (
  <View style={styles.screenContainer}>
    <Text style={styles.screenTitle}>Discover</Text>
    <Text style={styles.screenSubtitle}>Trending products & skincare tips</Text>
    <View style={styles.placeholderCard}>
      <Text style={styles.placeholderEmoji}>✨</Text>
      <Text style={styles.placeholderText}>Coming Soon</Text>
      <Text style={styles.placeholderSubtext}>
        Explore trending products, expert tips, and community reviews
      </Text>
    </View>
  </View>
);

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

// Lists Screen Component
const ListsScreen = () => (
  <View style={styles.screenContainer}>
    <Text style={styles.screenTitle}>My Lists</Text>
    <Text style={styles.screenSubtitle}>Saved products & routines</Text>
    <View style={styles.placeholderCard}>
      <Text style={styles.placeholderEmoji}>📋</Text>
      <Text style={styles.placeholderText}>Coming Soon</Text>
      <Text style={styles.placeholderSubtext}>
        Save your favorite products and build your skincare routine
      </Text>
    </View>
  </View>
);

// Profile Screen Component
const ProfileScreen = () => (
  <View style={styles.screenContainer}>
    <Text style={styles.screenTitle}>Profile</Text>
    <Text style={styles.screenSubtitle}>Your skin profile & settings</Text>
    <View style={styles.placeholderCard}>
      <Text style={styles.placeholderEmoji}>👤</Text>
      <Text style={styles.placeholderText}>Coming Soon</Text>
      <Text style={styles.placeholderSubtext}>
        Customize your skin type, concerns, and preferences
      </Text>
    </View>
  </View>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'discover':
        return <DiscoverScreen />;
      case 'chat':
        return <ChatScreen />;
      case 'lists':
        return <ListsScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
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
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logo: {
    fontSize: 52,
    fontWeight: '300',
    color: '#ffffff',
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 8,
    letterSpacing: 1,
  },
  buttonsContainer: {
    width: '100%',
    gap: 14,
  },
  glassButtonContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  glassButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  glassButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(168, 85, 247, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  buttonSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  curvedTextContainer: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Glassmorphism Tab Bar Styles
  tabBarWrapper: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  tabBarContainer: {
    borderRadius: 35,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  blurView: {
    borderRadius: 35,
    overflow: 'hidden',
  },
  tabBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(30, 40, 50, 0.4)',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  tabIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIconContainerActive: {
    backgroundColor: 'rgba(60, 70, 80, 0.8)',
    borderRadius: 16,
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
