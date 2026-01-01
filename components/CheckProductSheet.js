import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Animated,
    Dimensions,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const CheckProductSheet = ({ visible, onClose, onImageSelected, onLinkSubmit }) => {
    const [linkInput, setLinkInput] = useState('');
    const [showLinkInput, setShowLinkInput] = useState(false);
    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(slideAnim, {
                    toValue: 0,
                    friction: 8,
                    tension: 65,
                    useNativeDriver: true,
                }),
                Animated.timing(backdropOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: SCREEN_HEIGHT,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(backdropOpacity, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    const handleClose = () => {
        setShowLinkInput(false);
        setLinkInput('');
        onClose();
    };

    const handleTakePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Camera access is required to take photos.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
            allowsEditing: true,
        });

        if (!result.canceled && result.assets[0]) {
            onImageSelected(result.assets[0].uri, 'camera');
            handleClose();
        }
    };

    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Photo library access is required.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
            allowsEditing: true,
        });

        if (!result.canceled && result.assets[0]) {
            onImageSelected(result.assets[0].uri, 'gallery');
            handleClose();
        }
    };

    const handleLinkSubmit = () => {
        if (linkInput.trim()) {
            onLinkSubmit(linkInput.trim());
            handleClose();
        }
    };

    const inputOptions = [
        {
            id: 'camera',
            icon: 'camera',
            label: 'Take Photo',
            subtitle: 'Scan ingredients',
            color: '#EC4899',
            onPress: handleTakePhoto,
        },
        {
            id: 'gallery',
            icon: 'images',
            label: 'Upload',
            subtitle: 'From gallery',
            color: '#8B5CF6',
            onPress: handlePickImage,
        },
        {
            id: 'link',
            icon: 'link',
            label: 'Paste Link',
            subtitle: 'Product URL',
            color: '#06B6D4',
            onPress: () => setShowLinkInput(true),
        },
    ];

    if (!visible) return null;

    return (
        <Modal transparent visible={visible} animationType="none">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                {/* Backdrop */}
                <Animated.View
                    style={[styles.backdrop, { opacity: backdropOpacity }]}
                >
                    <TouchableOpacity
                        style={StyleSheet.absoluteFill}
                        onPress={handleClose}
                        activeOpacity={1}
                    />
                </Animated.View>

                {/* Sheet */}
                <Animated.View
                    style={[
                        styles.sheet,
                        { transform: [{ translateY: slideAnim }] }
                    ]}
                >
                    <BlurView intensity={40} tint="dark" style={styles.blurContainer}>
                        <View style={styles.sheetContent}>
                            {/* Handle */}
                            <View style={styles.handleContainer}>
                                <View style={styles.handle} />
                            </View>

                            {/* Header */}
                            <View style={styles.header}>
                                <Text style={styles.title}>Check a Product</Text>
                                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                                    <Ionicons name="close" size={24} color="rgba(255,255,255,0.6)" />
                                </TouchableOpacity>
                            </View>

                            {!showLinkInput ? (
                                <>
                                    {/* Input Options */}
                                    <View style={styles.optionsContainer}>
                                        {inputOptions.map((option) => (
                                            <TouchableOpacity
                                                key={option.id}
                                                style={styles.optionCard}
                                                onPress={option.onPress}
                                                activeOpacity={0.7}
                                            >
                                                <View style={[styles.optionIcon, { backgroundColor: `${option.color}20` }]}>
                                                    <Ionicons name={option.icon} size={28} color={option.color} />
                                                </View>
                                                <Text style={styles.optionLabel}>{option.label}</Text>
                                                <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>

                                    {/* Divider */}
                                    <View style={styles.divider}>
                                        <View style={styles.dividerLine} />
                                        <Text style={styles.dividerText}>or search</Text>
                                        <View style={styles.dividerLine} />
                                    </View>

                                    {/* Search Bar */}
                                    <View style={styles.searchContainer}>
                                        <Feather name="search" size={18} color="rgba(255,255,255,0.4)" />
                                        <TextInput
                                            style={styles.searchInput}
                                            placeholder="Search by product name..."
                                            placeholderTextColor="rgba(255,255,255,0.4)"
                                            returnKeyType="search"
                                        />
                                    </View>
                                </>
                            ) : (
                                /* Link Input View */
                                <View style={styles.linkInputContainer}>
                                    <TouchableOpacity
                                        onPress={() => setShowLinkInput(false)}
                                        style={styles.backButton}
                                    >
                                        <Ionicons name="arrow-back" size={24} color="#ffffff" />
                                    </TouchableOpacity>

                                    <Text style={styles.linkTitle}>Paste Product Link</Text>
                                    <Text style={styles.linkSubtitle}>
                                        We'll fetch the ingredients from the product page
                                    </Text>

                                    <View style={styles.linkInputWrapper}>
                                        <Ionicons name="link" size={20} color="rgba(255,255,255,0.5)" />
                                        <TextInput
                                            style={styles.linkInput}
                                            placeholder="https://..."
                                            placeholderTextColor="rgba(255,255,255,0.4)"
                                            value={linkInput}
                                            onChangeText={setLinkInput}
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            keyboardType="url"
                                        />
                                    </View>

                                    <TouchableOpacity
                                        style={[
                                            styles.submitButton,
                                            !linkInput.trim() && styles.submitButtonDisabled
                                        ]}
                                        onPress={handleLinkSubmit}
                                        disabled={!linkInput.trim()}
                                    >
                                        <Text style={styles.submitButtonText}>Analyze Product</Text>
                                        <Ionicons name="arrow-forward" size={20} color="#ffffff" />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </BlurView>
                </Animated.View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    sheet: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
    },
    blurContainer: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
    },
    sheetContent: {
        backgroundColor: 'rgba(20, 10, 30, 0.85)',
        paddingBottom: 40,
    },
    handleContainer: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
        color: '#ffffff',
    },
    closeButton: {
        padding: 4,
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    optionCard: {
        alignItems: 'center',
        width: 100,
    },
    optionIcon: {
        width: 64,
        height: 64,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    optionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 2,
    },
    optionSubtitle: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.5)',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    dividerText: {
        marginHorizontal: 12,
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.4)',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        marginHorizontal: 20,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 14,
        gap: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#ffffff',
    },
    linkInputContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    backButton: {
        marginBottom: 16,
    },
    linkTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 8,
    },
    linkSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.5)',
        marginBottom: 20,
    },
    linkInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        paddingHorizontal: 14,
        paddingVertical: 14,
        borderRadius: 14,
        gap: 10,
        marginBottom: 20,
    },
    linkInput: {
        flex: 1,
        fontSize: 15,
        color: '#ffffff',
    },
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EC4899',
        paddingVertical: 14,
        borderRadius: 14,
        gap: 8,
    },
    submitButtonDisabled: {
        backgroundColor: 'rgba(236, 72, 153, 0.4)',
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
});

export default CheckProductSheet;
