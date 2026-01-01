import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
    Dimensions,
    Animated,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SkinlyAvatar, SkinlyChatIcon } from './SkinIcons';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.42;
const CARD_HEIGHT = 180;

// Mock recommended products
const RECOMMENDED_PRODUCTS = [
    {
        id: 'rec_1',
        name: 'Niacinamide 10%',
        brand: 'The Ordinary',
        imageUri: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400',
        tag: 'Best for Acne',
        tagColor: '#10B981',
    },
    {
        id: 'rec_2',
        name: 'Hydrating Cleanser',
        brand: 'CeraVe',
        imageUri: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
        tag: 'Gentle',
        tagColor: '#3B82F6',
    },
    {
        id: 'rec_3',
        name: 'Sunscreen SPF 50',
        brand: 'La Roche-Posay',
        imageUri: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400',
        tag: 'Essential',
        tagColor: '#F59E0B',
    },
    {
        id: 'rec_4',
        name: 'Retinol 0.5%',
        brand: "Paula's Choice",
        imageUri: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400',
        tag: 'Anti-Aging',
        tagColor: '#8B5CF6',
    },
];

// Quick suggestion chips
const QUICK_SUGGESTIONS = [
    { id: 1, text: 'Best for acne?', icon: 'help-circle-outline' },
    { id: 2, text: 'Morning routine', icon: 'sunny-outline' },
    { id: 3, text: 'Ingredients', icon: 'flask-outline' },
];

// Mock AI responses
const AI_RESPONSES = {
    default: "Hi! I'm your skincare assistant. Ask me anything about routines, ingredients, or products!",
    acne: "For acne-prone skin, I recommend Salicylic Acid, Niacinamide, or Benzoyl Peroxide. Would you like specific product recommendations?",
    routine: "A good morning routine: 1) Cleanser, 2) Vitamin C, 3) Moisturizer, 4) SPF 30+. Keep it simple!",
    ingredient: "Tell me the product name or paste ingredients, and I'll analyze them for your skin type.",
    fallback: "Great question! I'd recommend gentle, non-comedogenic products. Want me to suggest some?",
};

// Product Card Component - Vertical layout
const ProductCard = ({ product, onPress }) => (
    <TouchableOpacity
        style={styles.productCard}
        onPress={() => onPress(product)}
        activeOpacity={0.85}
    >
        <LinearGradient
            colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.04)']}
            style={styles.cardGradient}
        >
            <View style={styles.imageContainer}>
                <Image source={{ uri: product.imageUri }} style={styles.productImage} />
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.productBrand}>{product.brand}</Text>
                <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                <View style={[styles.productTag, { backgroundColor: `${product.tagColor}25` }]}>
                    <View style={[styles.tagDot, { backgroundColor: product.tagColor }]} />
                    <Text style={[styles.tagText, { color: product.tagColor }]}>{product.tag}</Text>
                </View>
            </View>
        </LinearGradient>
    </TouchableOpacity>
);

// Chat Message Component
const ChatMessage = ({ message, isUser }) => (
    <View style={[styles.messageRow, isUser && styles.userMessageRow]}>
        {!isUser && (
            <View style={styles.aiAvatar}>
                <SkinlyAvatar size={22} color="#EC4899" />
            </View>
        )}
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}>
            {isUser ? (
                <LinearGradient
                    colors={['#EC4899', '#D946EF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.userBubbleGradient}
                >
                    <Text style={styles.userMessageText}>{message.text}</Text>
                </LinearGradient>
            ) : (
                <Text style={styles.aiMessageText}>{message.text}</Text>
            )}
        </View>
    </View>
);

// Typing Indicator Component
const TypingIndicator = () => {
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animate = (dot, delay) => {
            Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(dot, { toValue: 1, duration: 300, useNativeDriver: true }),
                    Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
                ])
            ).start();
        };
        animate(dot1, 0);
        animate(dot2, 150);
        animate(dot3, 300);
    }, []);

    const dotStyle = (anim) => ({
        opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }),
        transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1.15] }) }],
    });

    return (
        <View style={styles.messageRow}>
            <View style={styles.aiAvatar}>
                <SkinlyAvatar size={22} color="#EC4899" />
            </View>
            <View style={[styles.messageBubble, styles.aiBubble, styles.typingBubble]}>
                <Animated.View style={[styles.typingDot, dotStyle(dot1)]} />
                <Animated.View style={[styles.typingDot, dotStyle(dot2)]} />
                <Animated.View style={[styles.typingDot, dotStyle(dot3)]} />
            </View>
        </View>
    );
};

// Main Discover Screen
const DiscoverScreen = ({ onCheckProduct }) => {
    const [messages, setMessages] = useState([
        { id: 1, text: AI_RESPONSES.default, isUser: false },
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollViewRef = useRef(null);

    const handleProductPress = async (product) => {
        try {
            const Haptics = require('expo-haptics');
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch (e) { }

        if (onCheckProduct) {
            onCheckProduct(product);
        }
    };

    const getAIResponse = (userMessage) => {
        const lowerMsg = userMessage.toLowerCase();
        if (lowerMsg.includes('acne') || lowerMsg.includes('pimple') || lowerMsg.includes('breakout')) {
            return AI_RESPONSES.acne;
        }
        if (lowerMsg.includes('routine') || lowerMsg.includes('morning') || lowerMsg.includes('night')) {
            return AI_RESPONSES.routine;
        }
        if (lowerMsg.includes('ingredient') || lowerMsg.includes('check') || lowerMsg.includes('analyze')) {
            return AI_RESPONSES.ingredient;
        }
        return AI_RESPONSES.fallback;
    };

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;

        try {
            const Haptics = require('expo-haptics');
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch (e) { }

        const userMessage = { id: Date.now(), text: inputText.trim(), isUser: true };
        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        Keyboard.dismiss();

        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            const aiResponse = { id: Date.now() + 1, text: getAIResponse(userMessage.text), isUser: false };
            setMessages(prev => [...prev, aiResponse]);
        }, 1200);
    };

    const handleQuickSuggestion = (suggestion) => {
        setInputText(suggestion.text);
    };

    useEffect(() => {
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    }, [messages, isTyping]);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={90}
        >
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Discover</Text>
                <Text style={styles.subtitle}>Personalized recommendations</Text>
            </View>

            {/* Product Carousel */}
            <View style={styles.carouselSection}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.carouselContent}
                    decelerationRate="fast"
                >
                    {RECOMMENDED_PRODUCTS.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onPress={handleProductPress}
                        />
                    ))}
                </ScrollView>
            </View>

            {/* AI Chatbot */}
            <View style={styles.chatSection}>
                {/* Chat Header */}
                <View style={styles.chatHeader}>
                    <View style={styles.chatHeaderIcon}>
                        <SkinlyChatIcon size={22} color="#EC4899" />
                    </View>
                    <View style={styles.chatHeaderText}>
                        <Text style={styles.chatTitle}>Ask Skinly</Text>
                    </View>
                </View>

                {/* Messages */}
                <ScrollView
                    ref={scrollViewRef}
                    style={styles.messagesContainer}
                    contentContainerStyle={styles.messagesContent}
                    showsVerticalScrollIndicator={false}
                >
                    {messages.map((msg) => (
                        <ChatMessage key={msg.id} message={msg} isUser={msg.isUser} />
                    ))}
                    {isTyping && <TypingIndicator />}
                </ScrollView>

                {/* Quick Suggestions */}
                <View style={styles.suggestionsWrapper}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.suggestionsContent}
                    >
                        {QUICK_SUGGESTIONS.map((suggestion) => (
                            <TouchableOpacity
                                key={suggestion.id}
                                style={styles.suggestionChip}
                                onPress={() => handleQuickSuggestion(suggestion)}
                                activeOpacity={0.7}
                            >
                                <Ionicons name={suggestion.icon} size={13} color="#EC4899" />
                                <Text style={styles.suggestionText}>{suggestion.text}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Input Bar */}
                <View style={styles.inputWrapper}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Ask about anything skincare..."
                            placeholderTextColor="rgba(255,255,255,0.35)"
                            value={inputText}
                            onChangeText={setInputText}
                            onSubmitEditing={handleSendMessage}
                            returnKeyType="send"
                        />
                        <TouchableOpacity
                            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                            onPress={handleSendMessage}
                            disabled={!inputText.trim()}
                        >
                            <LinearGradient
                                colors={inputText.trim() ? ['#EC4899', '#D946EF'] : ['rgba(236,72,153,0.3)', 'rgba(217,70,239,0.3)']}
                                style={styles.sendButtonGradient}
                            >
                                <Ionicons name="arrow-up" size={18} color="#fff" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 8,
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
    subtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.5)',
        marginTop: 2,
    },

    // Carousel Section
    carouselSection: {
        marginBottom: 16,
    },
    carouselContent: {
        paddingHorizontal: 20,
        gap: 12,
    },
    productCard: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    cardGradient: {
        flex: 1,
        padding: 12,
    },
    imageContainer: {
        flex: 1,
        borderRadius: 14,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    cardContent: {
        marginTop: 10,
    },
    productBrand: {
        fontSize: 10,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.45)',
        letterSpacing: 0.8,
        textTransform: 'uppercase',
    },
    productName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff',
        marginTop: 2,
    },
    productTag: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginTop: 6,
        gap: 4,
    },
    tagDot: {
        width: 5,
        height: 5,
        borderRadius: 3,
    },
    tagText: {
        fontSize: 10,
        fontWeight: '600',
    },

    // Chat Section
    chatSection: {
        flex: 1,
        marginHorizontal: 20,
        backgroundColor: 'rgba(0,0,0,0.25)',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        overflow: 'hidden',
        marginBottom: 100,
    },
    chatHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.06)',
        backgroundColor: 'rgba(255,255,255,0.02)',
    },
    chatHeaderIcon: {
        width: 40,
        height: 40,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        backgroundColor: 'rgba(236, 72, 153, 0.12)',
    },
    chatHeaderText: {
        flex: 1,
    },
    chatTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#fff',
    },
    onlineIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    onlineDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#10B981',
        marginRight: 5,
    },
    onlineText: {
        fontSize: 11,
        color: '#10B981',
        fontWeight: '500',
    },
    messagesContainer: {
        flex: 1,
    },
    messagesContent: {
        padding: 14,
        paddingBottom: 8,
    },
    messageRow: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'flex-end',
    },
    userMessageRow: {
        justifyContent: 'flex-end',
    },
    aiAvatar: {
        width: 28,
        height: 28,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
    },
    messageBubble: {
        maxWidth: '78%',
        borderRadius: 16,
        overflow: 'hidden',
    },
    aiBubble: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderBottomLeftRadius: 4,
    },
    userBubble: {
        borderBottomRightRadius: 4,
    },
    userBubbleGradient: {
        paddingVertical: 10,
        paddingHorizontal: 14,
    },
    aiMessageText: {
        color: 'rgba(255,255,255,0.88)',
        fontSize: 14,
        lineHeight: 20,
    },
    userMessageText: {
        color: '#fff',
        fontSize: 14,
        lineHeight: 20,
    },
    typingBubble: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    typingDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.5)',
    },

    // Suggestions
    suggestionsWrapper: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
        backgroundColor: 'rgba(0,0,0,0.15)',
    },
    suggestionsContent: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        gap: 8,
    },
    suggestionChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(236, 72, 153, 0.25)',
        backgroundColor: 'rgba(236, 72, 153, 0.08)',
    },
    suggestionText: {
        color: '#EC4899',
        fontSize: 12,
        fontWeight: '600',
    },

    // Input
    inputWrapper: {
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 22,
        paddingLeft: 16,
        paddingRight: 4,
        paddingVertical: 4,
    },
    textInput: {
        flex: 1,
        fontSize: 15,
        color: '#fff',
        paddingVertical: 8,
    },
    sendButton: {
        borderRadius: 18,
        overflow: 'hidden',
    },
    sendButtonDisabled: {},
    sendButtonGradient: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default DiscoverScreen;
