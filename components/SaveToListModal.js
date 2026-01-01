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
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useLists } from '../context/ListsContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const ICON_OPTIONS = [
    { name: 'heart', color: '#EC4899' },
    { name: 'star', color: '#F59E0B' },
    { name: 'bookmark', color: '#8B5CF6' },
    { name: 'water', color: '#3B82F6' },
    { name: 'sunny', color: '#FBBF24' },
    { name: 'moon', color: '#6366F1' },
    { name: 'leaf', color: '#10B981' },
    { name: 'sparkles', color: '#F472B6' },
];

const SaveToListModal = ({ visible, onClose, product }) => {
    const { lists, toggleProductInList, getListsForProduct, createList } = useLists();
    const [showCreateNew, setShowCreateNew] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [selectedIcon, setSelectedIcon] = useState(ICON_OPTIONS[0]);

    const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;

    // Get lists that contain this product
    const savedToLists = product?.id ? getListsForProduct(product.id) : [];

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(translateY, {
                    toValue: 0,
                    friction: 8,
                    tension: 65,
                    useNativeDriver: true,
                }),
                Animated.timing(backdropOpacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: SCREEN_HEIGHT,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(backdropOpacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
            // Reset state
            setShowCreateNew(false);
            setNewListName('');
            setSelectedIcon(ICON_OPTIONS[0]);
        }
    }, [visible]);

    const handleClose = () => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: SCREEN_HEIGHT,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.timing(backdropOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => onClose());
    };

    const handleToggleList = async (listId) => {
        if (!product) return;

        try {
            const Haptics = require('expo-haptics');
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch (e) { }

        toggleProductInList(listId, product);
    };

    const handleCreateList = async () => {
        if (!newListName.trim()) return;

        try {
            const Haptics = require('expo-haptics');
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } catch (e) { }

        const newList = createList(newListName.trim(), selectedIcon.name, selectedIcon.color);

        // Auto-add product to the new list
        if (product) {
            toggleProductInList(newList.id, product);
        }

        setNewListName('');
        setShowCreateNew(false);
        setSelectedIcon(ICON_OPTIONS[0]);
    };

    if (!visible) return null;

    return (
        <Modal transparent visible={visible} animationType="none">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalContainer}
            >
                {/* Backdrop */}
                <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
                    <TouchableOpacity style={StyleSheet.absoluteFill} onPress={handleClose} />
                </Animated.View>

                {/* Content */}
                <Animated.View style={[styles.contentWrapper, { transform: [{ translateY }] }]}>
                    <BlurView intensity={80} tint="dark" style={styles.content}>
                        <View style={styles.innerContent}>
                            {/* Handle */}
                            <View style={styles.handle} />

                            {/* Header */}
                            <View style={styles.header}>
                                <Text style={styles.title}>Save to List</Text>
                                <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                                    <Ionicons name="close" size={20} color="rgba(255,255,255,0.6)" />
                                </TouchableOpacity>
                            </View>

                            {/* Lists */}
                            <ScrollView
                                style={styles.listScroll}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 20 }}
                            >
                                {lists.map((list) => {
                                    const isSelected = savedToLists.includes(list.id);
                                    return (
                                        <TouchableOpacity
                                            key={list.id}
                                            style={styles.listItem}
                                            onPress={() => handleToggleList(list.id)}
                                            activeOpacity={0.7}
                                        >
                                            <View style={[styles.listIcon, { backgroundColor: `${list.color}20` }]}>
                                                <Ionicons name={list.icon} size={20} color={list.color} />
                                            </View>
                                            <View style={styles.listInfo}>
                                                <Text style={styles.listName}>{list.name}</Text>
                                                <Text style={styles.listCount}>
                                                    {list.products.length} {list.products.length === 1 ? 'product' : 'products'}
                                                </Text>
                                            </View>
                                            <View style={[
                                                styles.checkbox,
                                                isSelected && styles.checkboxSelected
                                            ]}>
                                                {isSelected && (
                                                    <Ionicons name="checkmark" size={16} color="#fff" />
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}

                                {/* Create New Section */}
                                {!showCreateNew ? (
                                    <TouchableOpacity
                                        style={styles.createNewBtn}
                                        onPress={() => setShowCreateNew(true)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={styles.createNewIcon}>
                                            <Ionicons name="add" size={22} color="#EC4899" />
                                        </View>
                                        <Text style={styles.createNewText}>Create New List</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <View style={styles.createNewForm}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="List name..."
                                            placeholderTextColor="rgba(255,255,255,0.4)"
                                            value={newListName}
                                            onChangeText={setNewListName}
                                            autoFocus
                                        />

                                        {/* Icon Picker */}
                                        <ScrollView
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            style={styles.iconPicker}
                                        >
                                            {ICON_OPTIONS.map((icon) => (
                                                <TouchableOpacity
                                                    key={icon.name}
                                                    style={[
                                                        styles.iconOption,
                                                        { backgroundColor: `${icon.color}20` },
                                                        selectedIcon.name === icon.name && styles.iconOptionSelected
                                                    ]}
                                                    onPress={() => setSelectedIcon(icon)}
                                                >
                                                    <Ionicons name={icon.name} size={20} color={icon.color} />
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>

                                        <View style={styles.formActions}>
                                            <TouchableOpacity
                                                style={styles.cancelBtn}
                                                onPress={() => {
                                                    setShowCreateNew(false);
                                                    setNewListName('');
                                                }}
                                            >
                                                <Text style={styles.cancelText}>Cancel</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[
                                                    styles.createBtn,
                                                    !newListName.trim() && styles.createBtnDisabled
                                                ]}
                                                onPress={handleCreateList}
                                                disabled={!newListName.trim()}
                                            >
                                                <Text style={styles.createText}>Create</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            </ScrollView>
                        </View>
                    </BlurView>
                </Animated.View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    contentWrapper: {
        maxHeight: SCREEN_HEIGHT * 0.7,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
    },
    content: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
    },
    innerContent: {
        backgroundColor: 'rgba(30, 20, 35, 0.95)',
        paddingBottom: 34, // Safe area
    },
    handle: {
        width: 36,
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.08)',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
    closeBtn: {
        padding: 4,
    },
    listScroll: {
        maxHeight: SCREEN_HEIGHT * 0.5,
        paddingHorizontal: 20,
        paddingTop: 12,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.06)',
    },
    listIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    listInfo: {
        flex: 1,
    },
    listName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 2,
    },
    listCount: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.5)',
    },
    checkbox: {
        width: 26,
        height: 26,
        borderRadius: 13,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxSelected: {
        backgroundColor: '#EC4899',
        borderColor: '#EC4899',
    },
    createNewBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        marginTop: 8,
    },
    createNewIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(236, 72, 153, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
        borderWidth: 1,
        borderColor: 'rgba(236, 72, 153, 0.3)',
        borderStyle: 'dashed',
    },
    createNewText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#EC4899',
    },
    createNewForm: {
        marginTop: 16,
        padding: 16,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: 16,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#fff',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    iconPicker: {
        marginBottom: 16,
    },
    iconOption: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    iconOptionSelected: {
        borderColor: '#EC4899',
    },
    formActions: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
    },
    cancelText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 15,
        fontWeight: '600',
    },
    createBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#EC4899',
        alignItems: 'center',
    },
    createBtnDisabled: {
        backgroundColor: 'rgba(236, 72, 153, 0.4)',
    },
    createText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
});

export default SaveToListModal;
