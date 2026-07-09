import { Word } from '../models/Word';

/** Parameter für den Wörterbuch-Stack (Liste + Detail) */
export type DictionaryStackParamList = {
  DictionaryList: undefined;
  WordDetail: { word: Word };
};

/** Parameter für die Tab-Navigation */
export type RootTabParamList = {
  Translate: undefined;
  Dictionary: undefined;
  Pronunciation: undefined;
  Info: undefined;
};
