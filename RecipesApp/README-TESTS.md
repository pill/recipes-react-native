# Testing Setup

This project uses **Jest** and **React Native Testing Library** for unit testing.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## Test Structure

Tests are organized alongside the code they test, following this pattern:
- `hooks/__tests__/` - Tests for custom hooks
- `components/__tests__/` - Tests for components
- `config/__tests__/` - Tests for configuration files

## Current Test Coverage

### ✅ Hooks
- **use-favorites.test.ts** - Tests for the favorites management hook
  - Initialization with empty favorites
  - Loading favorites from storage
  - Adding favorites
  - Removing favorites
  - Checking favorite status
  - Toggling favorites
  - Error handling

- **use-theme-color.test.ts** - Tests for theme color hook
  - Light theme colors
  - Dark theme colors
  - Default color fallback

### ✅ Components
- **themed-text.test.tsx** - Tests for ThemedText component
  - Different text types (title, subtitle, link, etc.)
  - Custom styling
  - Prop forwarding

- **themed-view.test.tsx** - Tests for ThemedView component
  - Rendering children
  - Custom styling
  - Prop forwarding

### ✅ Configuration
- **elasticsearch.test.ts** - Tests for Elasticsearch configuration
  - Environment variable override
  - Platform-specific host URLs
  - iOS simulator vs physical device detection

## Writing New Tests

When creating new tests:

1. Create a `__tests__` directory next to the file you're testing
2. Name the test file as `[filename].test.ts` or `[filename].test.tsx`
3. Use React Native Testing Library for component tests
4. Mock external dependencies (AsyncStorage, expo-router, etc.)

Example:
```typescript
import { render } from '@testing-library/react-native';
import { MyComponent } from '../my-component';

describe('MyComponent', () => {
  it('should render correctly', () => {
    const { getByText } = render(<MyComponent title="Test" />);
    expect(getByText('Test')).toBeTruthy();
  });
});
```

## Mocking

Common mocks are set up in `jest-setup.js`:
- `expo-router` - Router functions
- `expo-constants` - App constants
- `react-native-reanimated` - Animation library
- `react-native-gesture-handler` - Gesture handling
- `@react-native-async-storage/async-storage` - Storage mocking

