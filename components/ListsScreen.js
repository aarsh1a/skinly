import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    TextInput,
    Modal,
    Animated,
    Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useLists } from '../context/ListsContext';

const { width } = Dimensions.get('window');

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

// Individual List Card Component
const ListCard = ({ list, onPress, onLongPress }) => {
    const productPreviews = list.products.slice(0, 3);

    return (
        <TouchableOpacity
            style={styles.listCard}
            onPress={onPress}
            onLongPress={onLongPress}
            activeOpacity={0.8}
            delayLongPress={500}
        >
            <BlurView intensity={20} tint="light" style={styles.listCardBlur}>
                <View style={styles.listCardInner}>
                    {/* Header Row */}
                    <View style={styles.listCardHeader}>
                        <View style={[styles.listCardIcon, { backgroundColor: `${list.color}20` }]}>
                            <Ionicons name={list.icon} size={22} color={list.color} />
                        </View>
                        <View style={styles.listCardInfo}>
                            <Text style={styles.listCardName}>{list.name}</Text>
                            <Text style={styles.listCardCount}>
                                {list.products.length} {list.products.length === 1 ? 'product' : 'products'}
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.4)" />
                    </View>

                    {/* Product Previews */}
                    {productPreviews.length > 0 && (
                        <View style={styles.previewRow}>
                            {productPreviews.map((product, index) => (
                                <View key={product.id || index} style={styles.previewItem}>
                                    {product.imageUri ? (
                                        <Image
                                            source={{ uri: product.imageUri }}
                                            style={styles.previewImage}
                                        />
                                    ) : (
                                        <View style={styles.previewPlaceholder}>
                                            <Ionicons name="cube-outline" size={16} color="rgba(255,255,255,0.4)" />
                                        </View>
                                    )}
                                </View>
                            ))}
                            {list.products.length > 3 && (
                                <View style={styles.moreCount}>
                                    <Text style={styles.moreCountText}>+{list.products.length - 3}</Text>
                                </View>
                            )}
                        </View>
                    )}
                </View>
            </BlurView>
        </TouchableOpacity>
    );
};

// Expanded List View Component
const ExpandedListView = ({ list, visible, onClose, onRemoveProduct }) => {
    if (!visible || !list) return null;

    return (
        <Modal transparent visible={visible} animationType="slide">
            <View style={styles.expandedContainer}>
                <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
                <View style={styles.expandedContent}>
                    {/* Header */}
                    <View style={styles.expandedHeader}>
                        <TouchableOpacity onPress={onClose} style={styles.expandedCloseBtn}>
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                        </TouchableOpacity>
                        <View style={styles.expandedTitleRow}>
                            <View style={[styles.expandedIcon, { backgroundColor: `${list.color}20` }]}>
                                <Ionicons name={list.icon} size={24} color={list.color} />
                            </View>
                            <View>
                                <Text style={styles.expandedTitle}>{list.name}</Text>
                                <Text style={styles.expandedCount}>
                                    {list.products.length} {list.products.length === 1 ? 'product' : 'products'}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Products */}
                    <ScrollView
                        style={styles.expandedScroll}
                        contentContainerStyle={{ paddingBottom: 40 }}
                        showsVerticalScrollIndicator={false}
                    >
                        {list.products.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Ionicons name="cube-outline" size={48} color="rgba(255,255,255,0.3)" />
                                <Text style={styles.emptyText}>No products saved yet</Text>
                                <Text style={styles.emptySubtext}>
                                    Products you save will appear here
                                </Text>
                            </View>
                        ) : (
                            list.products.map((product) => (
                                <View key={product.id} style={styles.productRow}>
                                    {product.imageUri ? (
                                        <Image
                                            source={{ uri: product.imageUri }}
                                            style={styles.productImage}
                                        />
                                    ) : (
                                        <View style={[styles.productImage, styles.productImagePlaceholder]}>
                                            <Ionicons name="cube-outline" size={24} color="rgba(255,255,255,0.4)" />
                                        </View>
                                    )}
                                    <View style={styles.productInfo}>
                                        <Text style={styles.productBrand}>{product.brand?.toUpperCase()}</Text>
                                        <Text style={styles.productName}>{product.name}</Text>
                                        {product.verdict && (
                                            <View style={[
                                                styles.statusBadge,
                                                {
                                                    backgroundColor: product.verdict.status === 'safe'
                                                        ? '#10B98120'
                                                        : product.verdict.status === 'caution'
                                                            ? '#F59E0B20'
                                                            : '#EF444420'
                                                }
                                            ]}>
                                                <Text style={[
                                                    styles.statusText,
                                                    {
                                                        color: product.verdict.status === 'safe'
                                                            ? '#10B981'
                                                            : product.verdict.status === 'caution'
                                                                ? '#F59E0B'
                                                                : '#EF4444'
                                                    }
                                                ]}>
                                                    {product.verdict.status === 'safe' ? 'Safe' :
                                                        product.verdict.status === 'caution' ? 'Caution' : 'Avoid'}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                    <TouchableOpacity
                                        style={styles.removeBtn}
                                        onPress={() => onRemoveProduct(list.id, product.id)}
                                    >
                                        <Ionicons name="trash-outline" size={18} color="#EF4444" />
                                    </TouchableOpacity>
                                </View>
                            ))
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

// Create List Modal
const CreateListModal = ({ visible, onClose, onCreate }) => {
    const [name, setName] = useState('');
    const [selectedIcon, setSelectedIcon] = useState(ICON_OPTIONS[0]);

    const handleCreate = () => {
        if (!name.trim()) return;
        onCreate(name.trim(), selectedIcon.name, selectedIcon.color);
        setName('');
        setSelectedIcon(ICON_OPTIONS[0]);
        onClose();
    };

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.createModalContainer}>
                <TouchableOpacity
                    style={StyleSheet.absoluteFill}
                    onPress={onClose}
                    activeOpacity={1}
                >
                    <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
                </TouchableOpacity>

                <View style={styles.createModalContent}>
                    <Text style={styles.createModalTitle}>Create New List</Text>

                    <TextInput
                        style={styles.createModalInput}
                        placeholder="List name..."
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        value={name}
                        onChangeText={setName}
                        autoFocus
                    />

                    <Text style={styles.iconPickerLabel}>Choose an icon</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
                                <Ionicons name={icon.name} size={22} color={icon.color} />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <View style={styles.createModalActions}>
                        <TouchableOpacity style={styles.createModalCancel} onPress={onClose}>
                            <Text style={styles.createModalCancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.createModalBtn, !name.trim() && styles.createModalBtnDisabled]}
                            onPress={handleCreate}
                            disabled={!name.trim()}
                        >
                            <Text style={styles.createModalBtnText}>Create</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

// Main Lists Screen Component
const ListsScreen = () => {
    const { lists, createList, deleteList, removeProductFromList } = useLists();
    const [expandedList, setExpandedList] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const handleListPress = (list) => {
        setExpandedList(list);
    };

    const handleListLongPress = async (list) => {
        if (list.isDefault) {
            try {
                const Haptics = require('expo-haptics');
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            } catch (e) { }
            Alert.alert('Cannot Delete', 'The Favorites list cannot be deleted.');
            return;
        }

        try {
            const Haptics = require('expo-haptics');
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } catch (e) { }

        Alert.alert(
            'Delete List',
            `Are you sure you want to delete "${list.name}"? This action cannot be undone.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => deleteList(list.id),
                },
            ]
        );
    };

    const handleCreateList = (name, icon, color) => {
        createList(name, icon, color);
    };

    const handleRemoveProduct = (listId, productId) => {
        Alert.alert(
            'Remove Product',
            'Are you sure you want to remove this product from the list?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => {
                        removeProductFromList(listId, productId);
                        // Update the expanded list view
                        const updatedList = lists.find(l => l.id === listId);
                        if (updatedList) {
                            setExpandedList({
                                ...updatedList,
                                products: updatedList.products.filter(p => p.id !== productId)
                            });
                        }
                    },
                },
            ]
        );
    };

    // Get updated expanded list data
    const currentExpandedList = expandedList
        ? lists.find(l => l.id === expandedList.id) || expandedList
        : null;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>My Lists</Text>
                <Text style={styles.subtitle}>
                    {lists.reduce((acc, l) => acc + l.products.length, 0)} products saved
                </Text>
            </View>

            {/* Lists */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {lists.map((list) => (
                    <ListCard
                        key={list.id}
                        list={list}
                        onPress={() => handleListPress(list)}
                        onLongPress={() => handleListLongPress(list)}
                    />
                ))}

                {/* Hint */}
                <Text style={styles.hint}>
                    Long press a list to delete it
                </Text>
            </ScrollView>

            {/* FAB */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => setShowCreateModal(true)}
                activeOpacity={0.8}
            >
                <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>

            {/* Expanded List View */}
            <ExpandedListView
                list={currentExpandedList}
                visible={!!expandedList}
                onClose={() => setExpandedList(null)}
                onRemoveProduct={handleRemoveProduct}
            />

            {/* Create List Modal */}
            <CreateListModal
                visible={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreate={handleCreateList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 12,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: -0.5,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.5)',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },

    // List Card
    listCard: {
        marginBottom: 14,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    listCardBlur: {
        borderRadius: 20,
    },
    listCardInner: {
        padding: 16,
        backgroundColor: 'rgba(255,255,255,0.06)',
    },
    listCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    listCardIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    listCardInfo: {
        flex: 1,
    },
    listCardName: {
        fontSize: 17,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 2,
    },
    listCardCount: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.5)',
    },
    previewRow: {
        flexDirection: 'row',
        marginTop: 14,
        paddingTop: 14,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.08)',
    },
    previewItem: {
        marginRight: 8,
    },
    previewImage: {
        width: 44,
        height: 44,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    previewPlaceholder: {
        width: 44,
        height: 44,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.08)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    moreCount: {
        width: 44,
        height: 44,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    moreCountText: {
        fontSize: 13,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.7)',
    },
    hint: {
        textAlign: 'center',
        fontSize: 13,
        color: 'rgba(255,255,255,0.3)',
        marginTop: 8,
    },

    // FAB
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 110,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#EC4899',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#EC4899',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },

    // Expanded List View
    expandedContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
    },
    expandedContent: {
        flex: 1,
        paddingTop: 60,
    },
    expandedHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    expandedCloseBtn: {
        padding: 8,
        marginRight: 12,
    },
    expandedTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    expandedIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    expandedTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
    },
    expandedCount: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.5)',
    },
    expandedScroll: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    emptyState: {
        alignItems: 'center',
        paddingTop: 60,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.6)',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.4)',
        marginTop: 4,
    },
    productRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.08)',
    },
    productImage: {
        width: 56,
        height: 56,
        borderRadius: 12,
        marginRight: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    productImagePlaceholder: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    productInfo: {
        flex: 1,
    },
    productBrand: {
        fontSize: 11,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.5)',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    productName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 6,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    removeBtn: {
        padding: 10,
    },

    // Create Modal
    createModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    createModalContent: {
        width: '100%',
        backgroundColor: 'rgba(30, 20, 35, 0.98)',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    createModalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
    },
    createModalInput: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 14,
        paddingHorizontal: 18,
        paddingVertical: 16,
        fontSize: 17,
        color: '#fff',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    iconPickerLabel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
        marginBottom: 12,
    },
    iconOption: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    iconOptionSelected: {
        borderColor: '#EC4899',
    },
    createModalActions: {
        flexDirection: 'row',
        marginTop: 24,
        gap: 12,
    },
    createModalCancel: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
    },
    createModalCancelText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 16,
        fontWeight: '600',
    },
    createModalBtn: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 14,
        backgroundColor: '#EC4899',
        alignItems: 'center',
    },
    createModalBtnDisabled: {
        backgroundColor: 'rgba(236, 72, 153, 0.4)',
    },
    createModalBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ListsScreen;
