import { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useFavorites } from '@/hooks/use-favorites';

export default function FavoritesScreen() {
  const { favorites, isLoading, reloadFavorites } = useFavorites();
  const router = useRouter();

  // Reload favorites when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      reloadFavorites();
    }, [reloadFavorites])
  );

  const handleRecipePress = (recipe: any) => {
    router.push({
      pathname: '/modal',
      params: {
        recipe: JSON.stringify(recipe._source),
        recipeId: recipe._id,
      },
    });
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="heart.fill"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          My Favorites
        </ThemedText>
      </ThemedView>

      {isLoading ? (
        <ThemedView style={styles.centerContainer}>
          <ThemedText>Loading favorites...</ThemedText>
        </ThemedView>
      ) : favorites.length === 0 ? (
        <ThemedView style={styles.centerContainer}>
          <ThemedText>No favorites yet. Start adding recipes to your favorites!</ThemedText>
        </ThemedView>
      ) : (
        <ScrollView>
          {favorites.map((result) => (
            <Pressable
              key={result._id}
              onPress={() => handleRecipePress(result)}
              style={styles.recipeItem}>
              <ThemedText type="defaultSemiBold">{result._source.title}</ThemedText>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  centerContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipeItem: {
    padding: 12,
    marginVertical: 4,
    marginHorizontal: 12,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.3)',
  },
});

