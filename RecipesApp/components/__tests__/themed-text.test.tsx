import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemedText } from '../themed-text';

// Mock the theme hooks
jest.mock('@/hooks/use-theme-color', () => ({
  useThemeColor: jest.fn(() => '#11181C'),
}));

describe('ThemedText', () => {
  it('should render text with default type', () => {
    const { getByText } = render(<ThemedText>Hello World</ThemedText>);
    expect(getByText('Hello World')).toBeTruthy();
  });

  it('should render text with title type', () => {
    const { getByText } = render(<ThemedText type="title">Title</ThemedText>);
    const text = getByText('Title');
    expect(text).toBeTruthy();
  });

  it('should render text with subtitle type', () => {
    const { getByText } = render(<ThemedText type="subtitle">Subtitle</ThemedText>);
    const text = getByText('Subtitle');
    expect(text).toBeTruthy();
  });

  it('should render text with defaultSemiBold type', () => {
    const { getByText } = render(<ThemedText type="defaultSemiBold">Bold Text</ThemedText>);
    const text = getByText('Bold Text');
    expect(text).toBeTruthy();
  });

  it('should render text with link type', () => {
    const { getByText } = render(<ThemedText type="link">Link Text</ThemedText>);
    const text = getByText('Link Text');
    expect(text).toBeTruthy();
  });

  it('should apply custom style', () => {
    const customStyle = { fontSize: 20 };
    const { getByText } = render(<ThemedText style={customStyle}>Custom</ThemedText>);
    const text = getByText('Custom');
    expect(text.props.style).toContainEqual(customStyle);
  });

  it('should pass through other props', () => {
    const { getByText } = render(<ThemedText testID="test-id">Test</ThemedText>);
    expect(getByText('Test').props.testID).toBe('test-id');
  });
});

