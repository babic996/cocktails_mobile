import { Dimensions } from "react-native";

export const width = Dimensions.get("window").width;
export const height = Dimensions.get("window").height;
export const DEFAULT_PAGE_SIZE = 8;
export const DEFAULT_FILTER_PAGE_SIZE = 9;
export const DEFAULT_MY_BAR_INGREDIENT_PAGE_SIZE = 33;

export const ingredientsTitleTranslations = {
  ENG: "What to use?",
  GER: "Was verwenden?",
  SPA: "¿Qué usar?",
  ITA: "Cosa usare?",
  FRA: "Quoi utiliser?",
};

export const instructionTitleTranslations = {
  ENG: "How to make?",
  GER: "Wie macht man?",
  SPA: "¿Cómo hacer?",
  ITA: "Come fare?",
  FRA: "Comment faire?",
};

export const noTranslations = {
  GER: "Keine Übersetzung für die ausgewählte Sprache verfügbar",
  SPA: "No hay traducción disponible para el idioma seleccionado",
  ITA: "Non ci sono traduzioni disponibili per la lingua selezionata",
  FRA: "Il n'y a pas de traduction disponible pour la langue sélectionnée",
  default: "Translation not available for the selected language",
};
