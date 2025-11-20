import { renderHook, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFavorites, FavoriteRecipe } from '../use-favorites';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

describe('useFavorites', () => {
  beforeEach(() => {
    AsyncStorage.clear();
    jest.clearAllMocks();
  });

  const mockRecipe: FavoriteRecipe = {
    _id: 'recipe-1',
    _source: {
      title: 'Test Recipe',
      description: 'A test recipe',
    },
  };

  const mockRecipe2: FavoriteRecipe = {
    _id: 'recipe-2',
    _source: {
      title: 'Another Recipe',
      description: 'Another test recipe',
    },
  };

  it('should initialize with empty favorites', async () => {
    const { result } = renderHook(() => useFavorites());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.favorites).toEqual([]);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.favorites).toEqual([]);
  });

  it('should load existing favorites from storage', async () => {
    await AsyncStorage.setItem('@recipes_favorites', JSON.stringify([mockRecipe]));

    const { result } = renderHook(() => useFavorites());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.favorites[0]._id).toBe('recipe-1');
  });

  it('should add a favorite', async () => {
    const { result } = renderHook(() => useFavorites());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.addFavorite(mockRecipe);
    });

    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.favorites[0]._id).toBe('recipe-1');

    // Verify it's persisted
    const stored = await AsyncStorage.getItem('@recipes_favorites');
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored || '[]');
    expect(parsed).toHaveLength(1);
  });

  it('should remove a favorite', async () => {
    await AsyncStorage.setItem('@recipes_favorites', JSON.stringify([mockRecipe, mockRecipe2]));

    const { result } = renderHook(() => useFavorites());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.favorites).toHaveLength(2);

    await act(async () => {
      await result.current.removeFavorite('recipe-1');
    });

    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.favorites[0]._id).toBe('recipe-2');
  });

  it('should check if a recipe is favorited', async () => {
    await AsyncStorage.setItem('@recipes_favorites', JSON.stringify([mockRecipe]));

    const { result } = renderHook(() => useFavorites());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isFavorite('recipe-1')).toBe(true);
    expect(result.current.isFavorite('recipe-2')).toBe(false);
  });

  it('should toggle favorite status', async () => {
    const { result } = renderHook(() => useFavorites());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Add favorite
    await act(async () => {
      await result.current.toggleFavorite(mockRecipe);
    });

    expect(result.current.isFavorite('recipe-1')).toBe(true);
    expect(result.current.favorites).toHaveLength(1);

    // Remove favorite
    await act(async () => {
      await result.current.toggleFavorite(mockRecipe);
    });

    expect(result.current.isFavorite('recipe-1')).toBe(false);
    expect(result.current.favorites).toHaveLength(0);
  });

  it('should handle errors when loading favorites', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    AsyncStorage.getItem = jest.fn().mockRejectedValueOnce(new Error('Storage error'));

    const { result } = renderHook(() => useFavorites());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.favorites).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should handle errors when saving favorites', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    AsyncStorage.setItem = jest.fn().mockRejectedValueOnce(new Error('Storage error'));

    const { result } = renderHook(() => useFavorites());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.addFavorite(mockRecipe);
    });

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

