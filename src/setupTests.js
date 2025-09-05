import '@testing-library/jest-dom';
import { vi } from 'vitest';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  ns: ['translation'],
  defaultNS: 'translation',
  resources: {
    en: {
      translation: {
        "header": {
          "searchPlaceholder": "Search by name or ingredient..."
        },
        "buttons": {
          "surpriseMe": "✨ Surprise Me! ✨"
        },
        "navigation": {
          "home": "Home",
          "categories": "Categories",
          "favorites": "Favorites",
          "levelOne": "Level One",
          "theGlitch": "The Glitch"
        },
        "cocktailOfTheWeek": "Cocktail of the Week!",
        "viewRecipe": "View Recipe",
        "browseBySpirit": "Browse by Spirit",
        "exploreByTheme": "Explore by Theme",
        "loading": "Loading...",
        "cocktailNotFound": "Cocktail not found!",
        "removeFromFavorites": "Remove from Favorites",
        "addToFavorites": "Add to Favorites",
        "available": "Available",
        "unavailable": "Unavailable",
        "ingredients": "Ingredients",
        "instructions": "Instructions",
        "details": "Details",
        "glass": "Glass",
        "difficulty": "Difficulty",
        "tags": "Tags",
        "flavorProfile": "Flavor Profile",
        "history": "History"
      }
    }
  }
});
