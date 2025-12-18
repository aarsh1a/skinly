import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

export default function Aurora({
    colorStops = ['#a041c5ff', '#db4492ff', '#FAFAFA'],
    speed = 0.5,
}) {
    const animation1 = useRef(new Animated.Value(0)).current;
    const animation2 = useRef(new Animated.Value(0)).current;
    const animation3 = useRef(new Animated.Value(0)).current;
    const animation4 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const duration = 6000 / speed;

        const animate1 = Animated.loop(
            Animated.sequence([
                Animated.timing(animation1, {
                    toValue: 1,
                    duration: duration,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(animation1, {
                    toValue: 0,
                    duration: duration,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ])
        );

        const animate2 = Animated.loop(
            Animated.sequence([
                Animated.timing(animation2, {
                    toValue: 1,
                    duration: duration * 1.3,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(animation2, {
                    toValue: 0,
                    duration: duration * 1.3,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ])
        );

        const animate3 = Animated.loop(
            Animated.sequence([
                Animated.timing(animation3, {
                    toValue: 1,
                    duration: duration * 0.8,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(animation3, {
                    toValue: 0,
                    duration: duration * 0.8,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ])
        );

        const animate4 = Animated.loop(
            Animated.sequence([
                Animated.timing(animation4, {
                    toValue: 1,
                    duration: duration * 1.1,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(animation4, {
                    toValue: 0,
                    duration: duration * 1.1,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ])
        );

        animate1.start();
        animate2.start();
        animate3.start();
        animate4.start();

        return () => {
            animate1.stop();
            animate2.stop();
            animate3.stop();
            animate4.stop();
        };
    }, [speed, animation1, animation2, animation3, animation4]);

    const translateY1 = animation1.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 120],
    });

    const translateX1 = animation1.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 80],
    });

    const scale1 = animation1.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 1.25, 1],
    });

    const translateY2 = animation2.interpolate({
        inputRange: [0, 1],
        outputRange: [60, -80],
    });

    const translateX2 = animation2.interpolate({
        inputRange: [0, 1],
        outputRange: [-40, 100],
    });

    const scale2 = animation2.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1.1, 0.85, 1.1],
    });

    const translateY3 = animation3.interpolate({
        inputRange: [0, 1],
        outputRange: [-40, 100],
    });

    const translateX3 = animation3.interpolate({
        inputRange: [0, 1],
        outputRange: [60, -60],
    });

    const translateY4 = animation4.interpolate({
        inputRange: [0, 1],
        outputRange: [40, -80],
    });

    const translateX4 = animation4.interpolate({
        inputRange: [0, 1],
        outputRange: [-60, 80],
    });

    const opacity1 = animation1.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.5, 0.8, 0.5],
    });

    const opacity2 = animation2.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.45, 0.7, 0.45],
    });

    const opacity3 = animation3.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.4, 0.65, 0.4],
    });

    const opacity4 = animation4.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.35, 0.6, 0.35],
    });

    return (
        <View style={styles.container}>
            {/* Base dark gradient */}
            <LinearGradient
                colors={['#0a0a12', '#100a18', '#0a0a12']}
                style={StyleSheet.absoluteFill}
            />

            {/* Aurora blob 1 - Deep Purple */}
            <Animated.View
                style={[
                    styles.auroraBlob,
                    styles.blob1,
                    {
                        opacity: opacity1,
                        transform: [
                            { translateX: translateX1 },
                            { translateY: translateY1 },
                            { scale: scale1 },
                        ],
                    },
                ]}
            >
                <LinearGradient
                    colors={[
                        colorStops[0],
                        `${colorStops[0]}80`,
                        `${colorStops[0]}40`,
                        `${colorStops[0]}10`,
                        'transparent',
                    ]}
                    locations={[0, 0.3, 0.5, 0.7, 1]}
                    style={styles.gradient}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                />
            </Animated.View>

            {/* Aurora blob 2 - Medium Purple */}
            <Animated.View
                style={[
                    styles.auroraBlob,
                    styles.blob2,
                    {
                        opacity: opacity2,
                        transform: [
                            { translateX: translateX2 },
                            { translateY: translateY2 },
                            { scale: scale2 },
                        ],
                    },
                ]}
            >
                <LinearGradient
                    colors={[
                        colorStops[1],
                        `${colorStops[1]}80`,
                        `${colorStops[1]}40`,
                        `${colorStops[1]}10`,
                        'transparent',
                    ]}
                    locations={[0, 0.25, 0.5, 0.75, 1]}
                    style={styles.gradient}
                    start={{ x: 0.3, y: 0 }}
                    end={{ x: 0.7, y: 1 }}
                />
            </Animated.View>

            {/* Aurora blob 3 - Light Lavender */}
            <Animated.View
                style={[
                    styles.auroraBlob,
                    styles.blob3,
                    {
                        opacity: opacity3,
                        transform: [
                            { translateX: translateX3 },
                            { translateY: translateY3 },
                        ],
                    },
                ]}
            >
                <LinearGradient
                    colors={[
                        colorStops[2],
                        `${colorStops[2]}80`,
                        `${colorStops[2]}40`,
                        `${colorStops[2]}10`,
                        'transparent',
                    ]}
                    locations={[0, 0.2, 0.45, 0.7, 1]}
                    style={styles.gradient}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                />
            </Animated.View>

            {/* Aurora blob 4 - Extra glow */}
            <Animated.View
                style={[
                    styles.auroraBlob,
                    styles.blob4,
                    {
                        opacity: opacity4,
                        transform: [
                            { translateX: translateX4 },
                            { translateY: translateY4 },
                        ],
                    },
                ]}
            >
                <LinearGradient
                    colors={[
                        colorStops[0],
                        `${colorStops[1]}60`,
                        `${colorStops[2]}30`,
                        'transparent',
                    ]}
                    locations={[0, 0.3, 0.6, 1]}
                    style={styles.gradient}
                    start={{ x: 0.2, y: 0.2 }}
                    end={{ x: 0.8, y: 0.8 }}
                />
            </Animated.View>

            {/* Glassmorphism blur overlay */}
            <BlurView
                intensity={25}
                tint="dark"
                style={styles.blurOverlay}
            />

            {/* Soft glow layer */}
            <Animated.View
                style={[
                    styles.glowLayer,
                    {
                        opacity: animation1.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: [0.15, 0.25, 0.15],
                        }),
                    },
                ]}
            >
                <LinearGradient
                    colors={[
                        'transparent',
                        `${colorStops[1]}20`,
                        `${colorStops[0]}15`,
                        'transparent',
                    ]}
                    locations={[0, 0.3, 0.6, 1]}
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    auroraBlob: {
        position: 'absolute',
        borderRadius: 9999,
        overflow: 'hidden',
    },
    blob1: {
        width: width * 2,
        height: height * 0.8,
        top: -height * 0.2,
        left: -width * 0.5,
    },
    blob2: {
        width: width * 1.8,
        height: height * 0.7,
        top: height * 0.05,
        right: -width * 0.4,
    },
    blob3: {
        width: width * 1.5,
        height: height * 0.6,
        top: height * 0.1,
        left: -width * 0.2,
    },
    blob4: {
        width: width * 1.6,
        height: height * 0.5,
        top: -height * 0.05,
        right: -width * 0.2,
    },
    gradient: {
        flex: 1,
    },
    blurOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    glowLayer: {
        ...StyleSheet.absoluteFillObject,
    },
});
