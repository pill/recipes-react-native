// utils/elasticsearch.ts or config/elasticsearch.ts
import { Platform } from 'react-native';

export const getElasticsearchHost = () => {
  if (Platform.OS === 'android') {
    // Android emulator uses special IP to access host machine
    return 'http://10.0.2.2:9200';
  } else if (Platform.OS === 'ios') {
    // iOS simulator runs on host machine
    return 'http://localhost:9200';
  } else {
    // Web or other platforms
    return 'http://localhost:9200';
  }
};
export const ELASTICSEARCH_HOST = getElasticsearchHost();