import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@recipes_favorites';

export interface FavoriteRecipe {
  _id: string;
  _source: any;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load favorites from storage
  const loadFavorites = useCallback(async () => {
    try {
      setIsLoading(true);
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save favorites to storage
  const saveFavorites = useCallback(async (newFavorites: FavoriteRecipe[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, []);

  // Add a recipe to favorites
  const addFavorite = useCallback(
    async (recipe: FavoriteRecipe) => {
      const updated = [...favorites, recipe];
      await saveFavorites(updated);
    },
    [favorites, saveFavorites]
  );

  // Remove a recipe from favorites
  const removeFavorite = useCallback(
    async (recipeId: string) => {
      const updated = favorites.filter((fav) => fav._id !== recipeId);
      await saveFavorites(updated);
    },
    [favorites, saveFavorites]
  );

  // Check if a recipe is favorited
  const isFavorite = useCallback(
    (recipeId: string) => {
      return favorites.some((fav) => fav._id === recipeId);
    },
    [favorites]
  );

  // Toggle favorite status
  const toggleFavorite = useCallback(
    async (recipe: FavoriteRecipe) => {
      if (isFavorite(recipe._id)) {
        await removeFavorite(recipe._id);
      } else {
        await addFavorite(recipe);
      }
    },
    [isFavorite, addFavorite, removeFavorite]
  );

  // Load favorites on mount
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    reloadFavorites: loadFavorites,
  };
}

