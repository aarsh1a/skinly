import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Image,
    Animated,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const ProductResultModal = ({ visible, onClose, product, loading, onSave, isSaved = false }) => {

    const slideAnim = useRef(new Animated.Value(height)).current;

    useEffect(() => {
        if (visible && !loading) {
            Animated.spring(slideAnim, {
                toValue: 0,
                friction: 8,
                tension: 65,
                useNativeDriver: true,
            }).start();
        } else if (!visible) {
            Animated.timing(slideAnim, {
                toValue: height,
                duration: 250,
                useNativeDriver: true,
            }).start();
        }
    }, [visible, loading]);

    if (!visible) return null;

    // --- MOCK DATA FOR DEMO ---
    const displayProduct = product || {
        name: "Moisturizing Cream",
        brand: "CeraVe",
        imageUri: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",

        // 2. Overall Verdict
        verdict: {
            status: "safe", // safe, caution, risky
            headline: "Safe for acne-prone skin",
            subheadline: "Targets dry spots & barrier repair",
            timeToResult: "~4 weeks",
        },

        // New Highlights Data (Replaces Verdict Card Info)
        highlights: [
            { icon: "checkmark-circle", label: "Acne Safe", specialColor: "#10B981" },
            { icon: "shield-checkmark-outline", label: "Barrier Repair" },
            { icon: "time-outline", label: "~4 Weeks" },
        ],

        // 3. Acne / Comedogenicity Check
        acneCheck: {
            count: 0,
            label: "Safe", // Safe, Caution, Risky
            description: "Contains 0 pore-clogging ingredients",
        },

        // 4. Skin Type Suitability
        suitability: {
            goodFor: ["Dry", "Normal", "Sensitive"],
            cautionFor: ["Oily"], // Empty if none
        },

        // 5. Interaction Warnings
        warnings: [
            // { type: "warning", text: "Contains Vitamin C — avoid mixing with Retinol" },
            // Empty mock for "safe" product, uncomment to test
        ],

        // 6. Ingredient Breakdown
        ingredients: [
            { name: "Ceramides", tag: "safe", desc: "Restores skin barrier" },
            { name: "Hyaluronic Acid", tag: "safe", desc: "Deep hydration" },
            { name: "Petrolatum", tag: "caution", desc: "Occlusive, seals moisture" },
            { name: "Glycerin", tag: "safe", desc: "Draws moisture to skin" },
        ],

        // 7. Target Benefits
        targets: [
            { id: 'hydration', label: 'Hydration', icon: 'water-outline' },
            { id: 'barrier', label: 'Barrier Repair', icon: 'shield-checkmark-outline' },
            { id: 'soothing', label: 'Soothing', icon: 'leaf-outline' },
        ],

        // 8. Review Summary
        reviews: {
            improvement: 92,
            irritation: 2,
            avgTime: "4 weeks",
        },

        // 9. Acne Safety Score
        safetyScore: 9.5,

        // 10. Alternates
        alternates: [
            { name: "Hydro Boost", brand: "Neutrogena", imageUri: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
            { name: "Daily Lotion", brand: "Cetaphil", imageUri: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
        ],
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'safe': return '#10B981'; // Green
            case 'caution': return '#F59E0B'; // Amber
            case 'risky':
            case 'avoid': return '#EF4444'; // Red
            default: return '#6B7280';
        }
    };

    const statusColor = getStatusColor(displayProduct.verdict.status);

    return (
        <Modal transparent visible={visible} animationType="none">
            <StatusBar barStyle="light-content" />

            {loading ? (
                /* --- LOAD STATE --- */
                <View style={styles.loadingContainer}>
                    <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                    <View style={styles.loaderCircle}>
                        <Ionicons name="scan-outline" size={48} color="#EC4899" />
                    </View>
                    <Text style={styles.loadingText}>Analyzing Ingredients...</Text>
                    <Text style={styles.loadingSubtext}>Checking against your skin profile</Text>
                </View>
            ) : (
                /* --- RESULT STATE --- */
                <View style={styles.modalContainer}>
                    {/* Animated Slide-Up Content */}
                    <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>

                        {/* Background Gradient */}
                        <LinearGradient
                            colors={['#1F1122', '#150A1A', '#000000']}
                            style={StyleSheet.absoluteFill}
                        />

                        <SafeAreaView style={{ flex: 1 }}>
                            {/* Top Navigation */}
                            <View style={styles.topNav}>
                                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                    <Ionicons name="close" size={24} color="#fff" />
                                </TouchableOpacity>
                                <Text style={styles.navTitle}>Analysis Result</Text>
                                <TouchableOpacity style={styles.saveButton} onPress={onSave}>
                                    <Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={24} color={isSaved ? "#EC4899" : "#fff"} />
                                </TouchableOpacity>
                            </View>

                            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                                {/* 1️⃣ Product Header */}
                                <View style={styles.headerSection}>
                                    <Text style={styles.brandName}>{displayProduct.brand.toUpperCase()}</Text>
                                    <Text style={styles.productName}>{displayProduct.name}</Text>
                                    <View style={styles.imageWrapper}>
                                        <Image source={{ uri: displayProduct.imageUri }} style={styles.productImage} />
                                        <BlurView intensity={20} tint="light" style={styles.trustBadge}>
                                            <Ionicons name="shield-checkmark" size={14} color="#fff" />
                                            <Text style={styles.trustText}>Trusted Brand</Text>
                                        </BlurView>
                                    </View>
                                </View>



                                {/* 🌟 Key Highlights (New Component) */}
                                <View style={styles.sectionContainer}>
                                    <View style={styles.highlightsContainer}>
                                        {displayProduct.highlights.map((item, index) => (
                                            <React.Fragment key={index}>
                                                <View style={styles.highlightItem}>
                                                    <View style={styles.highlightIconBg}>
                                                        <Ionicons name={item.icon} size={22} color="#fff" />
                                                    </View>
                                                    <Text style={styles.highlightText}>{item.label}</Text>
                                                </View>
                                                {index < displayProduct.highlights.length - 1 && (
                                                    <View style={styles.highlightDivider} />
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </View>
                                </View>

                                {/* 3️⃣ Acne Check */}
                                <View style={styles.sectionContainer}>
                                    <Text style={styles.sectionTitle}>Comedogenic Check</Text>
                                    <View style={styles.glassCard}>
                                        <View style={styles.rowBetween}>
                                            <View style={{ flex: 1, paddingRight: 10 }}>
                                                <Text style={styles.acneCountText}>
                                                    Contains <Text style={{ fontWeight: '700', color: displayProduct.acneCheck.count === 0 ? '#10B981' : '#EF4444' }}>{displayProduct.acneCheck.count}</Text> pore-clogging ingredients
                                                </Text>
                                                <Text style={styles.cardSubtext}>{displayProduct.acneCheck.description}</Text>
                                            </View>
                                            <View style={[styles.statusPill, { backgroundColor: displayProduct.acneCheck.count === 0 ? '#10B98120' : '#EF444420' }]}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                                    <Text style={{ color: displayProduct.acneCheck.count === 0 ? '#10B981' : '#EF4444', fontWeight: '600' }}>
                                                        {displayProduct.acneCheck.label}
                                                    </Text>
                                                    <Ionicons
                                                        name={displayProduct.acneCheck.count === 0 ? "checkmark-circle" : "close-circle"}
                                                        size={16}
                                                        color={displayProduct.acneCheck.count === 0 ? '#10B981' : '#EF4444'}
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                {/* 7️⃣ Targets (Moved Up) */}
                                <View style={styles.sectionContainer}>
                                    <Text style={styles.sectionTitle}>Targets</Text>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, paddingHorizontal: 20 }}>
                                        {displayProduct.targets.map((t, i) => (
                                            <View key={i} style={styles.targetPill}>
                                                <Ionicons name={t.icon} size={16} color="#EC4899" />
                                                <Text style={styles.targetText}>{t.label}</Text>
                                            </View>
                                        ))}
                                    </ScrollView>
                                </View>

                                {/* 4️⃣ Suitability */}
                                <View style={styles.sectionContainer}>
                                    <Text style={styles.sectionTitle}>Skin Type Suitability</Text>
                                    <View style={styles.glassCard}>
                                        <View style={styles.suitabilityRow}>
                                            <Text style={styles.suitabilityLabel}>Good for:</Text>
                                            <View style={styles.tagsRow}>
                                                {displayProduct.suitability.goodFor.map((t, i) => (
                                                    <View key={i} style={[styles.tag, { backgroundColor: '#10B98120', flexDirection: 'row', alignItems: 'center', gap: 4 }]}>
                                                        <Ionicons name="checkmark" size={12} color="#10B981" />
                                                        <Text style={[styles.tagText, { color: '#10B981' }]}>{t}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>
                                        {displayProduct.suitability.cautionFor.length > 0 && (
                                            <View style={[styles.suitabilityRow, { marginTop: 12 }]}>
                                                <Text style={styles.suitabilityLabel}>Caution:</Text>
                                                <View style={styles.tagsRow}>
                                                    {displayProduct.suitability.cautionFor.map((t, i) => (
                                                        <View key={i} style={[styles.tag, { backgroundColor: '#F59E0B20', flexDirection: 'row', alignItems: 'center', gap: 4 }]}>
                                                            <Ionicons name="alert-circle" size={12} color="#F59E0B" />
                                                            <Text style={[styles.tagText, { color: '#F59E0B' }]}>{t}</Text>
                                                        </View>
                                                    ))}
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                </View>

                                {/* 5️⃣ Interaction Warnings */}
                                {displayProduct.warnings.length > 0 && (
                                    <View style={styles.sectionContainer}>
                                        <Text style={styles.sectionTitle}>Interaction Warnings</Text>
                                        {displayProduct.warnings.map((w, i) => (
                                            <View key={i} style={styles.warningCard}>
                                                <Ionicons name="warning-outline" size={20} color="#F59E0B" />
                                                <Text style={styles.warningText}>{w.text}</Text>
                                            </View>
                                        ))}
                                    </View>
                                )}

                                {/* 6️⃣ Ingredient Breakdown */}
                                <View style={styles.sectionContainer}>
                                    <Text style={styles.sectionTitle}>Ingredient Breakdown</Text>
                                    <View style={styles.glassCard}>
                                        {displayProduct.ingredients.map((ing, i) => (
                                            <View key={i} style={styles.ingredientRow}>
                                                <View style={styles.ingHeader}>
                                                    <Text style={styles.ingName}>{ing.name}</Text>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: ing.tag === 'safe' ? '#10B98115' : ing.tag === 'caution' ? '#F59E0B15' : '#EF444415', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                                                        <Ionicons
                                                            name={ing.tag === 'safe' ? 'checkmark-circle-outline' : ing.tag === 'caution' ? 'alert-circle-outline' : 'close-circle-outline'}
                                                            size={14}
                                                            color={ing.tag === 'safe' ? '#10B981' : ing.tag === 'caution' ? '#F59E0B' : '#EF4444'}
                                                        />
                                                        <Text style={{ fontSize: 11, fontWeight: '600', color: ing.tag === 'safe' ? '#10B981' : ing.tag === 'caution' ? '#F59E0B' : '#EF4444' }}>
                                                            {ing.tag === 'safe' ? 'Safe' : ing.tag === 'caution' ? 'Caution' : 'Comedogenic'}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <Text style={styles.ingDesc}>{ing.desc}</Text>
                                                {i < displayProduct.ingredients.length - 1 && <View style={styles.divider} />}
                                            </View>
                                        ))}
                                    </View>
                                </View>



                                {/* 8️⃣ Review Summary */}
                                <View style={styles.sectionContainer}>
                                    <Text style={styles.sectionTitle}>Community Reviews</Text>
                                    <View style={styles.statsRow}>
                                        <View style={styles.statCard}>
                                            <Ionicons name="trending-up" size={24} color="#10B981" style={{ marginBottom: 8 }} />
                                            <Text style={styles.statValue}>{displayProduct.reviews.improvement}%</Text>
                                            <Text style={styles.statLabel}>Saw Effect</Text>
                                        </View>
                                        <View style={styles.statCard}>
                                            <Ionicons name="alert-circle-outline" size={24} color="#F59E0B" style={{ marginBottom: 8 }} />
                                            <Text style={styles.statValue}>{displayProduct.reviews.irritation}%</Text>
                                            <Text style={styles.statLabel}>Irritation</Text>
                                        </View>
                                        <View style={styles.statCard}>
                                            <Ionicons name="time-outline" size={24} color="#EC4899" style={{ marginBottom: 8 }} />
                                            <Text style={styles.statValue}>{displayProduct.reviews.avgTime.replace('weeks', 'wks')}</Text>
                                            <Text style={styles.statLabel}>Avg Time</Text>
                                        </View>
                                    </View>
                                </View>

                                {/* 10. Alternate Options */}
                                {displayProduct.alternates && displayProduct.alternates.length > 0 && (
                                    <View style={styles.sectionContainer}>
                                        <Text style={styles.sectionTitle}>See Alternate Options</Text>
                                        <View>
                                            {displayProduct.alternates.map((alt, i) => (
                                                <View key={i} style={[styles.glassCard, { marginBottom: 10, flexDirection: 'row', alignItems: 'center', padding: 12 }]}>
                                                    <Image source={{ uri: alt.imageUri }} style={{ width: 48, height: 48, borderRadius: 24, marginRight: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }} />
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 2 }}>{alt.name}</Text>
                                                        <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{alt.brand}</Text>
                                                    </View>
                                                    <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.4)" />
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                )}

                                {/* 9️⃣ Acne Safety Score */}
                                <View style={styles.sectionContainer}>
                                    <Text style={styles.sectionTitle}>Acne Safety Score</Text>
                                    <View style={styles.scoreCard}>
                                        <Ionicons name="shield-checkmark" size={32} color="#10B981" />
                                        <Text style={styles.scoreDisplay}>{displayProduct.safetyScore}</Text>
                                        <Text style={styles.scoreMax}>/ 10</Text>
                                    </View>
                                </View>

                                <View style={{ height: 40 }} />
                            </ScrollView>
                        </SafeAreaView>
                    </Animated.View>
                </View>
            )}
        </Modal>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    loaderCircle: {
        marginBottom: 20,
        transform: [{ scale: 1.2 }],
    },
    loadingText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 8,
    },
    loadingSubtext: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
    modalContent: {
        flex: 1,
    },
    topNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    navTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    closeButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
    },
    saveButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },

    // 1. Header
    headerSection: {
        alignItems: 'center',
        marginBottom: 24,
    },
    brandName: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 13,
        fontWeight: '600',
        letterSpacing: 1,
        marginBottom: 4,
    },
    productName: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    imageWrapper: {
        position: 'relative',
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
    },
    productImage: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    trustBadge: {
        position: 'absolute',
        top: -10,
        right: -20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 4,
        overflow: 'hidden',
        backgroundColor: 'rgba(50,50,50,0.5)',
    },
    trustText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '600',
    },

    // 2. Verdict
    verdictCard: {
        borderWidth: 1,
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden',
    },
    verdictHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10,
    },
    verdictRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6,
    },
    verdictTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    verdictSub: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 15,
        marginBottom: 6,
    },
    verdictTime: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 13,
        fontStyle: 'italic',
    },

    // Highlights Component
    highlightsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(236, 72, 153, 0.08)', // Pinkish glass
        borderRadius: 20,
        paddingVertical: 16,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'rgba(236, 72, 153, 0.3)', // Pink border
        shadowColor: '#EC4899',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    highlightItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    highlightIconBg: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 2,
    },
    highlightText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        fontWeight: '500',
        textAlign: 'center',
    },
    highlightDivider: {
        width: 1,
        height: '60%',
        backgroundColor: 'rgba(255,255,255,0.1)',
    },

    // 3. Acne & Common Styles
    sectionContainer: {
        marginBottom: 24,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
    },
    glassCard: {
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    acneCountText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 16,
        marginBottom: 4,
    },
    cardSubtext: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 13,
    },
    statusPill: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },

    // 4. Suitability
    suitabilityRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    suitabilityLabel: {
        color: 'rgba(255,255,255,0.6)',
        width: 70,
        fontSize: 14,
    },
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        flex: 1,
    },
    tag: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    tagText: {
        fontSize: 12,
        fontWeight: '600',
    },

    // 5. Warnings
    warningCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: 'rgba(245, 158, 11, 0.15)',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(245, 158, 11, 0.3)',
        marginBottom: 12,
    },
    warningText: {
        color: '#F59E0B',
        fontSize: 14,
        flex: 1,
        lineHeight: 20,
    },

    // 6. Ingredient
    ingredientRow: {
        marginBottom: 12,
    },
    ingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    ingName: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    ingDesc: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 13,
        lineHeight: 18,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginTop: 12,
    },

    // 7. Targets
    targetPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(236, 72, 153, 0.15)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 999,
        marginRight: 10,
    },
    targetText: {
        color: '#EC4899',
        fontWeight: '600',
        fontSize: 14,
    },

    // 8. Stats
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
    },
    statValue: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    statLabel: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
        textAlign: 'center',
    },

    // 9. Safety Score
    scoreCard: {
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'baseline',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 20,
        gap: 4,
    },
    scoreDisplay: {
        color: '#10B981',
        fontSize: 32,
        fontWeight: '700',
    },
    scoreMax: {
        color: '#10B981',
        fontSize: 16,
        opacity: 0.6,
    },
});

export default ProductResultModal;
