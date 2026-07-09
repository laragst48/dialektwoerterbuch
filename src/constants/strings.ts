/**
 * Alle sichtbaren Texte der App – vollständig auf Deutsch.
 */
export const Strings = {
  appName: 'DialektWörterbuch',
  appSubtitle: 'Groß-Umstadt',

  // Tab-Navigation
  tabs: {
    translate: 'Übersetzen',
    dictionary: 'Wörterbuch',
    pronunciation: 'Aussprache',
    info: 'Informationen',
  },

  // Übersetzen
  translate: {
    title: 'Übersetzen',
    subtitle: 'Hochdeutsch ↔ Dialekt',
    directionHochdeutsch: 'Hochdeutsch → Dialekt',
    directionDialekt: 'Dialekt → Hochdeutsch',
    inputPlaceholder: 'Wort eingeben…',
    noResult: 'Kein passendes Wort gefunden.',
    resultLabel: 'Ergebnis',
    meaningLabel: 'Bedeutung',
    searchHint: 'Tippen Sie ein Wort ein – das Ergebnis erscheint sofort.',
  },

  // Wörterbuch
  dictionary: {
    title: 'Wörterbuch',
    subtitle: 'Alle Dialektwörter von Groß-Umstadt',
    searchPlaceholder: 'Wörterbuch durchsuchen…',
    emptyList: 'Noch keine Wörter geladen.',
    wordCount: (count: number) => `${count} Wörter`,
    detailTitle: 'Wortdetails',
    labelMundart: 'Dialektwort',
    labelSchriftdeutsch: 'Hochdeutsch',
    labelBedeutung: 'Bedeutung',
    labelSprecher: 'Sprecher',
    labelOrt: 'Ort',
    labelDatum: 'Datum',
    labelAudio: 'Aussprache anhören',
    noAudio: 'Keine Audioaufnahme vorhanden',
  },

  // Aussprache
  pronunciation: {
    title: 'Aussprache',
    subtitle: 'Sprechen Sie ein Dialektwort',
    listenLabel: 'Aufnahme anhören',
    speakLabel: 'Zum Sprechen tippen',
    speakingLabel: 'Ich höre zu…',
    recognizedLabel: 'Erkannt:',
    noMatch: 'Kein passendes Wort in der Datenbank gefunden.',
    permissionDenied: 'Mikrofon-Berechtigung erforderlich.',
    tapMicrophone: 'Tippen Sie auf das Mikrofon und sprechen Sie ein Dialektwort.',
  },

  // Informationen
  info: {
    title: 'Informationen',
    projectTitle: 'Über das Projekt',
    projectText:
      'Das DialektWörterbuch Groß-Umstadt dokumentiert die regionale Mundart ' +
      'der Stadt Groß-Umstadt im Odenwald. Ziel ist es, Dialektwörter mit ' +
      'ihren hochdeutschen Übersetzungen, Bedeutungen und originalen ' +
      'Sprachaufnahmen für alle Generationen zugänglich zu machen.',
    dialectTitle: 'Warum Dialekte wichtig sind',
    dialectText:
      'Regionale Dialekte sind ein wertvolles Kulturerbe. Sie verbinden uns ' +
      'mit unserer Heimat, unserer Geschichte und unseren Vorfahren. ' +
      'Jedes Wort erzählt eine Geschichte – vom Alltag, von der Arbeit auf dem ' +
      'Feld, von Festen und Traditionen.',
    regionTitle: 'Die Mundart von Groß-Umstadt',
    regionText:
      'Groß-Umstadt liegt im südhessischen Odenwald. Die lokale Mundart gehört ' +
      'zum Mittelhessischen und weist odenwälderische Einflüsse auf. ' +
      'Charakteristisch sind besondere Wortformen, Aussprache und Ausdrücke, ' +
      'die in der Alltagssprache der Region bewahrt wurden.',
    targetGroupTitle: 'Für wen ist die App?',
    targetGroupText:
      'Die App richtet sich an ältere Menschen, die ihre Mundart weitergeben ' +
      'möchten, an Schüler, die die Heimatsprache kennenlernen wollen, und an ' +
      'alle, die sich für Sprache und Region interessieren.',
    dataSourceTitle: 'Datenquelle',
    dataSourceText:
      'Die Wörter stammen aus einer umfangreichen Excel-Datenbank mit ' +
      'Dialektwörtern, Übersetzungen, Bedeutungen und Sprachaufnahmen ' +
      'von Einwohnern Groß-Umstadts.',
    version: 'Version 1.0.0',
  },

  // Allgemein
  common: {
    loading: 'Wird geladen…',
    error: 'Ein Fehler ist aufgetreten.',
    retry: 'Erneut versuchen',
    back: 'Zurück',
    play: 'Abspielen',
    pause: 'Pause',
    importExcel: 'Excel importieren',
    importSuccess: (count: number) => `${count} Wörter erfolgreich importiert.`,
    importError: 'Import fehlgeschlagen. Bitte Dateiformat prüfen.',
  },
} as const;
