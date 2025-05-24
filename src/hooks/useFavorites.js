import { useState, useEffect, useCallback } from 'react';

const FAVORITES_STORAGE_KEY = 'favoriteCocktails';

export const useFavorites = () => {
  const [favoriteIds, setFavoriteIds] = useState(() => {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return storedFavorites ? JSON.parse(storedFavorites) : [];
    } catch (error) {
      console.error("Error parsing favorites from localStorage:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds));
    } catch (error) {
      console.error("Error saving favorites to localStorage:", error);
    }
  }, [favoriteIds]);

  const addFavorite = useCallback((cocktailId) => {
    setFavoriteIds((prevIds) => {
      if (!prevIds.includes(cocktailId)) {
        return [...prevIds, cocktailId];
      }
      return prevIds;
    });
  }, []);

  const removeFavorite = useCallback((cocktailId) => {
    setFavoriteIds((prevIds) => prevIds.filter(id => id !== cocktailId));
  }, []);

  const isFavorite = useCallback((cocktailId) => {
    return favoriteIds.includes(cocktailId);
  }, [favoriteIds]);

  const toggleFavorite = useCallback((cocktailId) => {
    setFavoriteIds((prevIds) => {
      if (prevIds.includes(cocktailId)) {
        return prevIds.filter(id => id !== cocktailId);
      } else {
        return [...prevIds, cocktailId];
      }
    });
  }, []);

  return {
    favoriteIds, // The array of favorite cocktail IDs
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
  };
};
