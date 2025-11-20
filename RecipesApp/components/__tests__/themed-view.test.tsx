import React from 'react';
import { render } from '@testing-library/react-native';
import { View, Text } from 'react-native';
import { ThemedView } from '../themed-view';

// Mock the theme hooks
jest.mock('@/hooks/use-theme-color', () => ({
  useThemeColor: jest.fn(() => '#ffffff'),
}));

describe('ThemedView', () => {
  it('should render children', () => {
    const { getByText } = render(
      <ThemedView>
        <Text>Child Content</Text>
      </ThemedView>
    );
    expect(getByText('Child Content')).toBeTruthy();
  });

  it('should apply custom style', () => {
    const customStyle = { padding: 10 };
    const { UNSAFE_getByType } = render(<ThemedView style={customStyle}>Test</ThemedView>);
    const view = UNSAFE_getByType(View);
    expect(view.props.style).toContainEqual(customStyle);
  });

  it('should pass through other props', () => {
    const { getByTestId } = render(<ThemedView testID="test-view">Test</ThemedView>);
    expect(getByTestId('test-view')).toBeTruthy();
  });
});

