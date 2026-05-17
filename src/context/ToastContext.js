import React, { createContext, useContext, useCallback, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../theme';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [message, setMessage] = useState('');
  const opacity = useRef(new Animated.Value(0)).current;
  const timer = useRef(null);

  const showToast = useCallback(
    (text) => {
      setMessage(text);
      if (timer.current) clearTimeout(timer.current);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }).start();
      timer.current = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 260,
          useNativeDriver: true,
        }).start();
      }, 2200);
    },
    [opacity],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Animated.View pointerEvents="none" style={[styles.wrap, { opacity }]}>
        <View style={styles.pill}>
          <Text style={styles.text}>{message}</Text>
        </View>
      </Animated.View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 104,
    alignItems: 'center',
  },
  pill: {
    backgroundColor: colors.text,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: radius.lg,
    maxWidth: '88%',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
