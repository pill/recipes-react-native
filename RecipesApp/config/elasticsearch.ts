// utils/elasticsearch.ts or config/elasticsearch.ts
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Mac's local IP address - update this if your IP changes
// Find it with: ifconfig | grep "inet " | grep -v 127.0.0.1
const MAC_LOCAL_IP = '192.168.86.28';

export const getElasticsearchHost = () => {
  // Allow override via environment variable (useful for physical devices)
  if (process.env.EXPO_PUBLIC_ELASTICSEARCH_HOST) {
    return process.env.EXPO_PUBLIC_ELASTICSEARCH_HOST;
  }

  if (Platform.OS === 'android') {
    // Android emulator uses special IP to access host machine
    return 'http://10.0.2.2:9200';
  } else if (Platform.OS === 'ios') {
    // iOS: For physical devices (Expo Go), use Mac's local IP
    // For simulator, use localhost
    // Detect if running in Expo Go (physical device)
    const executionEnv = Constants.executionEnvironment;
    const isExpoGo = executionEnv === 'storeClient' || 
                     (typeof Constants.appOwnership !== 'undefined' && Constants.appOwnership === 'expo');
    
    // Use Mac's IP for physical devices (Expo Go), localhost for simulator
    // Change to 'localhost' if testing on iOS simulator
    return isExpoGo ? `http://${MAC_LOCAL_IP}:9200` : 'http://localhost:9200';
  } else {
    // Web or other platforms
    return 'http://localhost:9200';
  }
};
export const ELASTICSEARCH_HOST = getElasticsearchHost();