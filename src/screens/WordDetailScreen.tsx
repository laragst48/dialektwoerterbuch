import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Colors } from '../constants/colors';
import { WordDetail } from '../components/WordDetail';
import { DictionaryStackParamList } from '../navigation/types';

type RouteProps = RouteProp<DictionaryStackParamList, 'WordDetail'>;

/**
 * Detailansicht eines einzelnen Dialektworts (Navigation aus dem Wörterbuch).
 */
export function WordDetailScreen() {
  const route = useRoute<RouteProps>();
  const { word } = route.params;

  return (
    <View style={styles.container}>
      <WordDetail word={word} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
