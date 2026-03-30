import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

export type WaterDropAnimationRef = {
  play: () => void;
};

export const WaterDropAnimation = forwardRef<WaterDropAnimationRef>((_, ref) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useImperativeHandle(ref, () => ({
    play: () => {
      translateY.setValue(0);
      opacity.setValue(0.8);
      scale.setValue(0.9);

      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 90,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(200),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(scale, {
          toValue: 1.1,
          duration: 750,
          useNativeDriver: true,
        }),
      ]).start();
    },
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.drop,
        {
          opacity,
          transform: [{ translateY }, { scale }],
        },
      ]}
    />
  );
});

const styles = StyleSheet.create({
  drop: {
    position: 'absolute',
    alignSelf: 'center',
    top: 10,
    width: 28,
    height: 28,
    backgroundColor: '#87CEEB',
    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,
    borderBottomLeftRadius: 14,
    borderTopLeftRadius: 0,
    transform: [{ rotate: '-45deg' }],
    zIndex: 10,
  },
});
