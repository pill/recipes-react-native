import { renderHook } from '@testing-library/react-native';
import { useThemeColor } from '../use-theme-color';
import { Colors } from '@/constants/theme';

// Mock useColorScheme
jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: jest.fn(() => 'light'),
}));

describe('useThemeColor', () => {
  it('should return light color when theme is light', () => {
    const { useColorScheme } = require('@/hooks/use-color-scheme');
    useColorScheme.mockReturnValue('light');

    const { result } = renderHook(() =>
      useThemeColor({ light: '#000000', dark: '#ffffff' }, 'text')
    );

    expect(result.current).toBe('#000000');
  });

  it('should return dark color when theme is dark', () => {
    const { useColorScheme } = require('@/hooks/use-color-scheme');
    useColorScheme.mockReturnValue('dark');

    const { result } = renderHook(() =>
      useThemeColor({ light: '#000000', dark: '#ffffff' }, 'text')
    );

    expect(result.current).toBe('#ffffff');
  });

  it('should return default color from Colors when props not provided', () => {
    const { useColorScheme } = require('@/hooks/use-color-scheme');
    useColorScheme.mockReturnValue('light');

    const { result } = renderHook(() => useThemeColor({}, 'text'));

    expect(result.current).toBe(Colors.light.text);
  });

  it('should default to light theme when colorScheme is null', () => {
    const { useColorScheme } = require('@/hooks/use-color-scheme');
    useColorScheme.mockReturnValue(null);

    const { result } = renderHook(() => useThemeColor({}, 'text'));

    expect(result.current).toBe(Colors.light.text);
  });
});

