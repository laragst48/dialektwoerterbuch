import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { MIN_TOUCH_TARGET, Typography } from '../constants/typography';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  accessibilityLabel?: string;
}

/**
 * Großes Suchfeld mit Lupen-Icon – gut lesbar und leicht zu bedienen.
 */
export function SearchInput({
  value,
  onChangeText,
  placeholder = 'Suchen…',
  accessibilityLabel,
}: SearchInputProps) {
  return (
    <View style={styles.container}>
      <Ionicons
        name="search"
        size={28}
        color={Colors.placeholder}
        style={styles.icon}
        accessibilityElementsHidden
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.placeholder}
        accessibilityLabel={accessibilityLabel ?? placeholder}
        clearButtonMode="while-editing"
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    minHeight: MIN_TOUCH_TARGET,
    paddingHorizontal: 16,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    ...Typography.body,
    color: Colors.text,
    paddingVertical: 12,
  },
});
