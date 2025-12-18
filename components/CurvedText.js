import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

export default function CurvedText({
    text = "check before you buy",
    size = 120,
    color = "rgba(255, 255, 255, 0.6)"
}) {
    const rotation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animate = Animated.loop(
            Animated.timing(rotation, {
                toValue: 1,
                duration: 8000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );
        animate.start();
        return () => animate.stop();
    }, [rotation]);

    const rotateInterpolate = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const characters = text.split('');
    const anglePerChar = 360 / characters.length;
    const radius = size / 2 - 15;

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Animated.View
                style={[
                    styles.textContainer,
                    {
                        width: size,
                        height: size,
                        transform: [{ rotate: rotateInterpolate }]
                    }
                ]}
            >
                {characters.map((char, index) => {
                    const angle = (index * anglePerChar) - 90;
                    const radian = (angle * Math.PI) / 180;
                    const x = radius * Math.cos(radian);
                    const y = radius * Math.sin(radian);

                    return (
                        <Text
                            key={index}
                            style={[
                                styles.character,
                                {
                                    color,
                                    transform: [
                                        { translateX: x },
                                        { translateY: y },
                                        { rotate: `${angle + 90}deg` },
                                    ],
                                },
                            ]}
                        >
                            {char}
                        </Text>
                    );
                })}
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    character: {
        position: 'absolute',
        fontSize: 12,
        fontWeight: '500',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
});
