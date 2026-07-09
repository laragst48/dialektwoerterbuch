# DialektWörterbuch Groß-Umstadt

Mobile App (Android & iOS) zur Bewahrung und Zugänglichmachung der regionalen Mundart von Groß-Umstadt im Odenwald.

## Funktionen

| Bereich | Beschreibung |
|---------|--------------|
| **Übersetzen** | Hochdeutsch ↔ Dialekt mit sofortiger Ergebnisanzeige |
| **Wörterbuch** | Alphabetische Liste aller Wörter mit Detailansicht |
| **Aussprache** | Spracheingabe per Mikrofon, Erkennung und Übersetzung |
| **Informationen** | Projektbeschreibung, Excel-Import |

## Technologie

- **React Native** mit **Expo** (~52)
- **TypeScript**
- **SQLite** (expo-sqlite) für lokale Datenspeicherung
- **@react-native-voice/voice** für Speech-to-Text
- **expo-av** für Audio-Wiedergabe
- **xlsx** für Excel-Import

## Voraussetzungen

- [Node.js](https://nodejs.org/) (LTS, Version 18+)
- [Xcode](https://developer.apple.com/xcode/) (für iOS-Simulator / Gerät)
- [Android Studio](https://developer.android.com/studio) (für Android-Emulator / Gerät)
- [Expo Go](https://expo.dev/go) App auf dem Smartphone (optional, für schnelles Testen)

## Installation

```bash
cd ~/Projects/dialektwoerterbuch-gross-umstadt
npm install
npx expo start
```

Dann `i` für iOS-Simulator, `a` für Android-Emulator, oder QR-Code mit Expo Go scannen.

> **Hinweis:** Speech-to-Text und Audio-Wiedergabe funktionieren am besten auf echten Geräten, nicht im Simulator.

## Projektstruktur

```
├── App.tsx                    # Einstiegspunkt
├── data/
│   ├── importedWords.ts       # 78 Wörter aus „Datenbank App Dialekte.xlsx“
│   ├── Datenbank-App-Dialekte.xlsx  # Original-Excel-Datei
│   ├── sampleWords.ts         # Kleine Testmenge (veraltet)
│   └── excel-vorlage.csv      # Vorlage für den Excel-Import
├── src/
│   ├── components/            # UI-Komponenten (Button, SearchInput, AudioPlayer, …)
│   ├── constants/             # Farben, Typografie, deutsche Texte
│   ├── context/               # WordContext (globaler Datenkontext)
│   ├── hooks/                 # useAudio, useSpeechRecognition
│   ├── models/                # Word-Datenmodell
│   ├── navigation/            # Tab- und Stack-Navigation
│   ├── screens/               # Alle vier Hauptscreens
│   ├── services/              # SQLite, Suche, Excel-Import
│   └── utils/                 # Textnormalisierung
├── assets/audio/              # Sprachaufnahmen (.mp3) ablegen
└── scripts/importExcel.ts     # CLI-Import-Skript
```

## Excel-Daten importieren

### In der App

1. Tab **Informationen** öffnen
2. **Excel importieren** tippen
3. `.xlsx`- oder `.xls`-Datei auswählen

### Über die Kommandozeile

```bash
npm run import-excel -- pfad/zur/datenbank.xlsx
```

Erzeugt `data/importedWords.json` zur Kontrolle.

### Erwartete Spalten

Die vorhandene Datenbank verwendet folgende Spaltenköpfe:

| Spalte in Excel | Pflicht | Beschreibung |
|-----------------|---------|--------------|
| Schriftdeutsch geschrieben | Ja* | Hochdeutsches Wort |
| Mundart geschrieben | Ja* | Dialektwort |
| Bedeutung Mundart | Nein | Erklärung / Kontext |
| Sprachaufnahme Mundart | Nein | Audio-Referenz (z. B. `Audio Beispiel 1`) |
| Sprecher | Nein | Name des Sprechers |
| Ort | Nein | Aufnahmeort |
| Datum | Nein | Aufnahmedatum |

Alternativ funktionieren auch die Kurzformen: `Schriftdeutsch`, `Mundart`, `Bedeutung`, `AudioDatei`.

\* Mindestens eines von beiden muss ausgefüllt sein.

### Datenbank aktualisieren

Wenn die Excel-Datei geändert wurde:

```bash
perl scripts/parse_xlsx.pl "/pfad/zur/Datenbank App Dialekte.xlsx" > data/importedWords.json
# Danach importedWords.ts neu generieren oder in der App über „Excel importieren“ laden
```

Die App enthält bereits **78 importierte Wörter** aus Ihrer Datei.

Eine CSV-Vorlage liegt unter `data/excel-vorlage.csv` – in Excel öffnen und als `.xlsx` speichern.

## Audioaufnahmen

Sprachaufnahmen als `.mp3` in `assets/audio/` ablegen. In der Excel-Datei den Dateinamen in der Spalte `AudioDatei` eintragen (z. B. `griene.mp3`).

## Design

Die App ist seniorenfreundlich gestaltet:

- Große Schrift (ab 18 px, Überschriften bis 32 px)
- Große Buttons (mindestens 56 px Höhe)
- Hoher Kontrast (dunkler Text auf hellem Hintergrund)
- Einfache Tab-Navigation mit großen Icons
- Alle Texte auf Deutsch

## Nächste Schritte

1. Eigene Excel-Datenbank importieren
2. Sprachaufnahmen in `assets/audio/` hinterlegen
3. App-Icon und Splash-Screen anpassen (`assets/icon.png`, `assets/splash.png`)
4. Mit `eas build` produktionsreife Builds erstellen (Expo Application Services)

## Lizenz

Projekt zur Bewahrung des Dialekts von Groß-Umstadt.
