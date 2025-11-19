import { useState } from 'react';
import { Button, Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { useRouter } from 'expo-router';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { ELASTICSEARCH_HOST } from '@/config/elasticsearch';

export default function SearchScreen() {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const router = useRouter();

  const handleSearch = () => {
    console.log('Search button pressed');
    fetch(`${ELASTICSEARCH_HOST}/recipes/_search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: {
          match: {
            title: searchText,
          },
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Search results:', data);
        if (typeof data !== 'undefined' && data) {
          setSearchResults(data.hits.hits);
        }
      })
      .catch((error) => {
        console.error('Search error:', error);
      });
  };

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
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          Search Recipes
        </ThemedText>
      </ThemedView>

      <TextInput
        placeholder="Search for a recipe"
        style={styles.input}
        onChangeText={(text) => {
          console.log('Search text changed:', text);
          setSearchText(text);
        }}
      />
      <ThemedView style={styles.buttonContainer}>
        <Button onPress={handleSearch} title="Search" />
      </ThemedView>

      <ScrollView>
        {searchResults.map((result) => (
          <Pressable
            key={result._id}
            onPress={() => handleRecipePress(result)}
            style={styles.recipeItem}>
            <ThemedText type="defaultSemiBold">{result._source.title}</ThemedText>
          </Pressable>
        ))}
      </ScrollView>

      <ThemedText>
        This template includes an example of an animated component. The{' '}
        <ThemedText type="defaultSemiBold">components/HelloWave.tsx</ThemedText> component uses
        the powerful{' '}
        <ThemedText type="defaultSemiBold" style={{ fontFamily: Fonts.mono }}>
          react-native-reanimated
        </ThemedText>{' '}
        library to create a waving hand animation.
      </ThemedText>
      
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    margin: 12,
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
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

