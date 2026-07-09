import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Strings } from '../constants/strings';
import { useWords } from '../context/WordContext';
import { Button } from '../components/Button';

interface InfoSectionProps {
  title: string;
  text: string;
}

/** Einzelner Informationsabschnitt */
function InfoSection({ title, text }: InfoSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionText}>{text}</Text>
    </View>
  );
}

/**
 * Informations-Screen – Projektbeschreibung und Hintergrund zur Mundart.
 */
export function InfoScreen() {
  const { importFromExcel, wordCount } = useWords();
  const [importing, setImporting] = useState(false);

  const handleImport = async () => {
    setImporting(true);
    const result = await importFromExcel();
    setImporting(false);
    Alert.alert(
      result.success ? 'Import erfolgreich' : 'Import fehlgeschlagen',
      result.message
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>{Strings.info.title}</Text>
      <Text style={styles.appName}>
        {Strings.appName} {Strings.appSubtitle}
      </Text>

      <InfoSection
        title={Strings.info.projectTitle}
        text={Strings.info.projectText}
      />
      <InfoSection
        title={Strings.info.dialectTitle}
        text={Strings.info.dialectText}
      />
      <InfoSection
        title={Strings.info.regionTitle}
        text={Strings.info.regionText}
      />
      <InfoSection
        title={Strings.info.targetGroupTitle}
        text={Strings.info.targetGroupText}
      />
      <InfoSection
        title={Strings.info.dataSourceTitle}
        text={Strings.info.dataSourceText}
      />

      {/* Excel-Import für Administratoren */}
      <View style={styles.importSection}>
        <Text style={styles.importTitle}>Datenbank verwalten</Text>
        <Text style={styles.importInfo}>
          Aktuell {wordCount} Wörter in der Datenbank.
        </Text>
        <Button
          title={Strings.common.importExcel}
          onPress={handleImport}
          loading={importing}
          variant="outline"
          accessibilityLabel="Excel-Datei mit Dialektwörtern importieren"
        />
      </View>

      <Text style={styles.version}>{Strings.info.version}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  title: {
    ...Typography.h1,
    color: Colors.primary,
    marginBottom: 4,
  },
  appName: {
    ...Typography.h3,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.primary,
    marginBottom: 12,
  },
  sectionText: {
    ...Typography.body,
    color: Colors.text,
    lineHeight: 30,
  },
  importSection: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.secondary,
    padding: 20,
    marginBottom: 24,
    gap: 12,
  },
  importTitle: {
    ...Typography.h3,
    color: Colors.primary,
  },
  importInfo: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  version: {
    ...Typography.caption,
    color: Colors.placeholder,
    textAlign: 'center',
  },
});
