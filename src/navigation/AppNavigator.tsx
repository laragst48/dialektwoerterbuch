import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Strings } from '../constants/strings';
import { TranslateScreen } from '../screens/TranslateScreen';
import { DictionaryScreen } from '../screens/DictionaryScreen';
import { WordDetailScreen } from '../screens/WordDetailScreen';
import { PronunciationScreen } from '../screens/PronunciationScreen';
import { InfoScreen } from '../screens/InfoScreen';
import { DictionaryStackParamList, RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();
const DictionaryStack = createNativeStackNavigator<DictionaryStackParamList>();

/** Wörterbuch mit eigener Stack-Navigation für die Detailansicht */
function DictionaryNavigator() {
  return (
    <DictionaryStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { ...Typography.h3, color: '#FFFFFF' },
        headerBackTitle: Strings.common.back,
      }}
    >
      <DictionaryStack.Screen
        name="DictionaryList"
        component={DictionaryScreen}
        options={{ headerShown: false }}
      />
      <DictionaryStack.Screen
        name="WordDetail"
        component={WordDetailScreen}
        options={{
          title: Strings.dictionary.detailTitle,
          headerLargeTitle: false,
        }}
      />
    </DictionaryStack.Navigator>
  );
}

type TabIconName = keyof typeof Ionicons.glyphMap;

const TAB_ICONS: Record<keyof RootTabParamList, { active: TabIconName; inactive: TabIconName }> = {
  Translate: { active: 'swap-horizontal', inactive: 'swap-horizontal-outline' },
  Dictionary: { active: 'book', inactive: 'book-outline' },
  Pronunciation: { active: 'mic', inactive: 'mic-outline' },
  Info: { active: 'information-circle', inactive: 'information-circle-outline' },
};

const TAB_LABELS: Record<keyof RootTabParamList, string> = {
  Translate: Strings.tabs.translate,
  Dictionary: Strings.tabs.dictionary,
  Pronunciation: Strings.tabs.pronunciation,
  Info: Strings.tabs.info,
};

/**
 * Hauptnavigation der App – vier Tabs mit großen Icons und Beschriftungen.
 */
export function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            const icons = TAB_ICONS[route.name];
            const iconName = focused ? icons.active : icons.inactive;
            return <Ionicons name={iconName} size={size + 4} color={color} />;
          },
          tabBarActiveTintColor: Colors.tabBarActive,
          tabBarInactiveTintColor: Colors.tabBarInactive,
          tabBarStyle: {
            backgroundColor: Colors.tabBar,
            borderTopColor: Colors.border,
            borderTopWidth: 1,
            height: Platform.OS === 'ios' ? 88 : 72,
            paddingBottom: Platform.OS === 'ios' ? 28 : 12,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            ...Typography.caption,
            fontWeight: '600',
            fontSize: 14,
          },
          headerShown: false,
        })}
      >
        <Tab.Screen
          name="Translate"
          component={TranslateScreen}
          options={{ tabBarLabel: TAB_LABELS.Translate }}
        />
        <Tab.Screen
          name="Dictionary"
          component={DictionaryNavigator}
          options={{ tabBarLabel: TAB_LABELS.Dictionary }}
        />
        <Tab.Screen
          name="Pronunciation"
          component={PronunciationScreen}
          options={{ tabBarLabel: TAB_LABELS.Pronunciation }}
        />
        <Tab.Screen
          name="Info"
          component={InfoScreen}
          options={{ tabBarLabel: TAB_LABELS.Info }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
