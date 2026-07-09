import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Word } from '../models/Word';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Strings } from '../constants/strings';
import { useWords } from '../context/WordContext';
import { searchWords } from '../services/searchService';
import { SearchInput } from '../components/SearchInput';
import { WordCard } from '../components/WordCard';
import { DictionaryStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<
  DictionaryStackParamList,
  'DictionaryList'
>;

/**
 * Wörterbuch-Screen – alphabetische Liste aller Dialektwörter mit Suche.
 */
export function DictionaryScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { words, loading, wordCount } = useWords();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWords = useMemo(
    () => searchWords(words, searchQuery),
    [words, searchQuery]
  );

  const handleWordPress = (word: Word) => {
    navigation.navigate('WordDetail', { word });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>{Strings.common.loading}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{Strings.dictionary.title}</Text>
        <Text style={styles.subtitle}>{Strings.dictionary.subtitle}</Text>
        <Text style={styles.count}>{Strings.dictionary.wordCount(wordCount)}</Text>
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={Strings.dictionary.searchPlaceholder}
          accessibilityLabel="Wörterbuch durchsuchen"
        />
      </View>

      <FlatList
        data={filteredWords}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <WordCard word={item} onPress={handleWordPress} />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>{Strings.dictionary.emptyList}</Text>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    gap: 16,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  header: {
    padding: 24,
    paddingBottom: 12,
  },
  title: {
    ...Typography.h1,
    color: Colors.primary,
    marginBottom: 4,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  count: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  list: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  empty: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 48,
    fontStyle: 'italic',
  },
});
