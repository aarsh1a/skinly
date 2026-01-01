import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    Image,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Menu Item Component
const MenuItem = ({ icon, label, value, onPress, showArrow = true, isDestructive = false }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
        <View style={[styles.menuIcon, isDestructive && styles.menuIconDestructive]}>
            <Ionicons name={icon} size={20} color={isDestructive ? '#EF4444' : '#EC4899'} />
        </View>
        <Text style={[styles.menuLabel, isDestructive && styles.menuLabelDestructive]}>{label}</Text>
        {value && <Text style={styles.menuValue}>{value}</Text>}
        {showArrow && <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.3)" />}
    </TouchableOpacity>
);

// Toggle Item Component
const ToggleItem = ({ icon, label, value, onToggle }) => (
    <View style={styles.menuItem}>
        <View style={styles.menuIcon}>
            <Ionicons name={icon} size={20} color="#EC4899" />
        </View>
        <Text style={styles.menuLabel}>{label}</Text>
        <Switch
            value={value}
            onValueChange={onToggle}
            trackColor={{ false: 'rgba(255,255,255,0.1)', true: 'rgba(236, 72, 153, 0.5)' }}
            thumbColor={value ? '#EC4899' : '#888'}
            ios_backgroundColor="rgba(255,255,255,0.1)"
        />
    </View>
);

// Section Header
const SectionHeader = ({ title }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
);

const ProfileScreen = () => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = useState(true);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Profile</Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <LinearGradient
                        colors={['rgba(236, 72, 153, 0.15)', 'rgba(139, 92, 246, 0.1)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.profileGradient}
                    >
                        <View style={styles.avatarContainer}>
                            <LinearGradient
                                colors={['#EC4899', '#8B5CF6']}
                                style={styles.avatar}
                            >
                                <Text style={styles.avatarText}>A</Text>
                            </LinearGradient>
                            <TouchableOpacity style={styles.editAvatarBtn}>
                                <Ionicons name="camera" size={14} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.userName}>Aarshi</Text>
                        <Text style={styles.userEmail}>aarshi@skinly.app</Text>

                        {/* Skin Type Tags */}
                        <View style={styles.skinTags}>
                            <View style={styles.skinTag}>
                                <Text style={styles.skinTagText}>Acne-prone</Text>
                            </View>
                            <View style={styles.skinTag}>
                                <Text style={styles.skinTagText}>Combination</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                {/* Skin Profile Section */}
                <SectionHeader title="Skin Profile" />
                <View style={styles.menuSection}>
                    <MenuItem icon="water-outline" label="Skin Type" value="Combination" onPress={() => { }} />
                    <MenuItem icon="alert-circle-outline" label="Concerns" value="Acne, Texture" onPress={() => { }} />
                    <MenuItem icon="shield-checkmark-outline" label="Sensitivity" value="Moderate" onPress={() => { }} />
                    <MenuItem icon="calendar-outline" label="Routine Style" value="Minimal" onPress={() => { }} />
                </View>

                {/* Preferences Section */}
                <SectionHeader title="Preferences" />
                <View style={styles.menuSection}>
                    <ToggleItem
                        icon="notifications-outline"
                        label="Push Notifications"
                        value={notificationsEnabled}
                        onToggle={setNotificationsEnabled}
                    />
                    <ToggleItem
                        icon="moon-outline"
                        label="Dark Mode"
                        value={darkModeEnabled}
                        onToggle={setDarkModeEnabled}
                    />
                </View>

                {/* App Section */}
                <SectionHeader title="App" />
                <View style={styles.menuSection}>
                    <MenuItem icon="star-outline" label="Rate Skinly" onPress={() => { }} />
                    <MenuItem icon="share-social-outline" label="Share with Friends" onPress={() => { }} />
                    <MenuItem icon="help-circle-outline" label="Help & Support" onPress={() => { }} />
                    <MenuItem icon="document-text-outline" label="Privacy Policy" onPress={() => { }} />
                    <MenuItem icon="information-circle-outline" label="About" value="v1.0.0" onPress={() => { }} />
                </View>

                {/* Account Section */}
                <SectionHeader title="Account" />
                <View style={styles.menuSection}>
                    <MenuItem icon="log-out-outline" label="Sign Out" onPress={() => { }} isDestructive />
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Made with 💗 for healthy skin</Text>
                    <Text style={styles.footerVersion}>Skinly v1.0.0</Text>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 12,
    },
    header: {
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: -0.5,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 120,
    },

    // Profile Card
    profileCard: {
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    profileGradient: {
        padding: 24,
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 12,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 32,
        fontWeight: '700',
        color: '#fff',
    },
    editAvatarBtn: {
        position: 'absolute',
        bottom: 0,
        right: -4,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#EC4899',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#1a1a2e',
    },
    userName: {
        fontSize: 22,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.5)',
        marginBottom: 16,
    },
    skinTags: {
        flexDirection: 'row',
        gap: 8,
    },
    skinTag: {
        backgroundColor: 'rgba(236, 72, 153, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    skinTagText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#EC4899',
    },

    // Section Header
    sectionHeader: {
        fontSize: 13,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.4)',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 12,
        marginTop: 8,
    },

    // Menu Section
    menuSection: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    menuIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(236, 72, 153, 0.12)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    menuIconDestructive: {
        backgroundColor: 'rgba(239, 68, 68, 0.12)',
    },
    menuLabel: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500',
        color: '#fff',
    },
    menuLabelDestructive: {
        color: '#EF4444',
    },
    menuValue: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.4)',
        marginRight: 8,
    },

    // Footer
    footer: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    footerText: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.4)',
        marginBottom: 4,
    },
    footerVersion: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.25)',
    },
});

export default ProfileScreen;
