import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useFavorites } from '@/hooks/use-favorites';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ModalScreen() {
  const { recipe, recipeId } = useLocalSearchParams<{
    recipe: string;
    recipeId: string;
  }>();
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  const colorScheme = useColorScheme() ?? 'light';

  let recipeData: any = null;
  let currentRecipeId = recipeId;
  if (recipe) {
    try {
      recipeData = JSON.parse(recipe);
    } catch (e) {
      console.error('Failed to parse recipe data:', e);
    }
  }

  const favorited = currentRecipeId ? isFavorite(currentRecipeId) : false;

  const handleToggleFavorite = async () => {
    if (recipeData && currentRecipeId) {
      await toggleFavorite({
        _id: currentRecipeId,
        _source: recipeData,
      });
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}>
        {recipeData ? (
          <>
            <ThemedView style={styles.titleRow}>
              <ThemedText type="title" style={styles.title}>
                {recipeData.title || 'Recipe Details'}
              </ThemedText>
              {currentRecipeId && (
                <Pressable onPress={handleToggleFavorite} style={styles.favoriteButton}>
                  <IconSymbol
                    name={favorited ? 'heart.fill' : 'heart'}
                    size={28}
                    color={favorited ? '#ff3b30' : Colors[colorScheme].icon}
                  />
                </Pressable>
              )}
            </ThemedView>

            {recipeData.description && (
              <ThemedView style={styles.section}>
                <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                  Description
                </ThemedText>
                <ThemedText>{recipeData.description}</ThemedText>
              </ThemedView>
            )}

            {recipeData.ingredients && (
              <ThemedView style={styles.section}>
                <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                  Ingredients
                </ThemedText>
                {Array.isArray(recipeData.ingredients) ? (
                  recipeData.ingredients.map((ingredient: any, index: number) => {
                    // Handle object ingredients with name, quantity, unit, notes
                    if (typeof ingredient === 'object' && ingredient !== null) {
                      const parts: string[] = [];
                      if (ingredient.quantity) parts.push(ingredient.quantity);
                      if (ingredient.unit) parts.push(ingredient.unit);
                      if (ingredient.name) parts.push(ingredient.name);
                      const formatted = parts.join(' ');
                      const notes = ingredient.notes ? ` (${ingredient.notes})` : '';
                      return (
                        <ThemedText key={index}>• {formatted}{notes}</ThemedText>
                      );
                    }
                    // Handle string ingredients
                    return <ThemedText key={index}>• {String(ingredient)}</ThemedText>;
                  })
                ) : (
                  <ThemedText>{recipeData.ingredients}</ThemedText>
                )}
              </ThemedView>
            )}

            {recipeData.instructions && (
              <ThemedView style={styles.section}>
                <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                  Instructions
                </ThemedText>
                {Array.isArray(recipeData.instructions) ? (
                  recipeData.instructions.map((step: any, index: number) => {
                    // Handle object instructions if needed
                    if (typeof step === 'object' && step !== null) {
                      const stepText = step.text || step.instruction || step.description || JSON.stringify(step);
                      return (
                        <ThemedText key={index}>
                          {index + 1}. {stepText}
                        </ThemedText>
                      );
                    }
                    // Handle string instructions
                    return (
                      <ThemedText key={index}>
                        {index + 1}. {String(step)}
                      </ThemedText>
                    );
                  })
                ) : (
                  <ThemedText>{recipeData.instructions}</ThemedText>
                )}
              </ThemedView>
            )}

            {recipeData.cookTime && (
              <ThemedView style={styles.section}>
                <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                  Cook Time
                </ThemedText>
                <ThemedText>{recipeData.cookTime}</ThemedText>
              </ThemedView>
            )}

            {recipeData.servings && (
              <ThemedView style={styles.section}>
                <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                  Servings
                </ThemedText>
                <ThemedText>{recipeData.servings}</ThemedText>
              </ThemedView>
            )}

            {recipeData.tags && (
              <ThemedView style={styles.section}>
                <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                  Tags
                </ThemedText>
                {Array.isArray(recipeData.tags) ? (
                  <ThemedText>{recipeData.tags.join(', ')}</ThemedText>
                ) : (
                  <ThemedText>{recipeData.tags}</ThemedText>
                )}
              </ThemedView>
            )}

            {/* Display any other recipe fields */}
            {Object.entries(recipeData).map(([key, value]) => {
              if (
                ['title', 'description', 'ingredients', 'instructions', 'cookTime', 'servings', 'tags'].includes(
                  key
                ) ||
                !value
              ) {
                return null;
              }
              // Handle different value types
              let displayValue: string;
              if (typeof value === 'object' && value !== null) {
                if (Array.isArray(value)) {
                  // For arrays, try to join if strings, otherwise stringify
                  displayValue = value.every((item) => typeof item === 'string')
                    ? value.join(', ')
                    : JSON.stringify(value);
                } else {
                  // For objects, stringify them
                  displayValue = JSON.stringify(value);
                }
              } else {
                // For primitives, convert to string
                displayValue = String(value);
              }
              return (
                <ThemedView key={key} style={styles.section}>
                  <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </ThemedText>
                  <ThemedText>{displayValue}</ThemedText>
                </ThemedView>
              );
            })}
          </>
        ) : (
          <ThemedText type="title">No recipe selected</ThemedText>
        )}

        <Pressable onPress={() => router.dismiss()} style={styles.link}>
          <ThemedText type="link">Close</ThemedText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    flex: 1,
    fontSize: 28,
    marginRight: 12,
  },
  favoriteButton: {
    padding: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  link: {
    marginTop: 20,
    marginBottom: 20,
    paddingVertical: 15,
    alignItems: 'center',
  },
});
