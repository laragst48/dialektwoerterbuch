import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import { Colors } from '../constants/colors';
import { MIN_TOUCH_TARGET, Typography } from '../constants/typography';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

/**
 * Großer, seniorenfreundlicher Button mit hohem Kontrast.
 */
export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  accessibilityLabel,
}: ButtonProps) {
  const variantStyles = {
    primary: { bg: Colors.primary, text: '#FFFFFF', border: Colors.primary },
    secondary: { bg: Colors.secondary, text: Colors.text, border: Colors.secondary },
    outline: { bg: Colors.surface, text: Colors.primary, border: Colors.primary },
    danger: { bg: Colors.microphone, text: '#FFFFFF', border: Colors.microphone },
  }[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: variantStyles.bg,
          borderColor: variantStyles.border,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles.text} size="large" />
      ) : (
        <Text style={[styles.text, { color: variantStyles.text }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: MIN_TOUCH_TARGET,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...Typography.button,
    textAlign: 'center',
  },
});
