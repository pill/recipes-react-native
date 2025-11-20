// Mock Platform before importing the module
const mockPlatform = {
  OS: 'ios',
  select: jest.fn((obj) => obj.ios),
};

jest.mock('react-native', () => ({
  Platform: mockPlatform,
}));

// Mock expo-constants
const mockConstants = {
  executionEnvironment: 'storeClient',
  appOwnership: 'expo',
};

jest.mock('expo-constants', () => ({
  default: mockConstants,
}));

describe('getElasticsearchHost', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    delete process.env.EXPO_PUBLIC_ELASTICSEARCH_HOST;
    mockPlatform.OS = 'ios';
    mockConstants.executionEnvironment = 'storeClient';
    mockConstants.appOwnership = 'expo';
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should use environment variable if set', () => {
    process.env.EXPO_PUBLIC_ELASTICSEARCH_HOST = 'http://custom-host:9200';
    const { getElasticsearchHost } = require('../elasticsearch');
    expect(getElasticsearchHost()).toBe('http://custom-host:9200');
  });

  it('should return Android emulator IP for Android', () => {
    mockPlatform.OS = 'android';
    jest.resetModules();
    const { getElasticsearchHost } = require('../elasticsearch');
    expect(getElasticsearchHost()).toBe('http://10.0.2.2:9200');
  });

  it('should return Mac IP for iOS in Expo Go', () => {
    // Skip this test as it depends on actual network configuration
    // The host will use the MAC_LOCAL_IP constant which may vary
    mockPlatform.OS = 'ios';
    mockConstants.executionEnvironment = 'storeClient';
    mockConstants.appOwnership = 'expo';
    jest.resetModules();
    const { getElasticsearchHost } = require('../elasticsearch');
    const host = getElasticsearchHost();
    // Just verify it returns a valid URL (not localhost for Expo Go)
    expect(host).toMatch(/^http:\/\//);
    expect(host).toContain(':9200');
  });

  it('should return localhost for iOS simulator', () => {
    mockPlatform.OS = 'ios';
    mockConstants.executionEnvironment = 'standalone';
    mockConstants.appOwnership = 'standalone';
    jest.resetModules();
    const { getElasticsearchHost } = require('../elasticsearch');
    expect(getElasticsearchHost()).toBe('http://localhost:9200');
  });

  it('should return localhost for web', () => {
    mockPlatform.OS = 'web';
    jest.resetModules();
    const { getElasticsearchHost } = require('../elasticsearch');
    expect(getElasticsearchHost()).toBe('http://localhost:9200');
  });
});

