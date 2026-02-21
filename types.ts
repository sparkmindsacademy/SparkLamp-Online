export interface MqttConfig {
  brokerUrl: string; // wss://broker.emqx.io:8084/mqtt
  topic: string;
  clientId: string;
}

export interface AppConfig {
  googleApiKey: string;
  livekitUrl: string;
  livekitApiKey: string;
  livekitApiSecret: string;
  mqttTopic: string;
}

export enum ConnectionState {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  ERROR = 'ERROR',
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  source: 'User' | 'AI' | 'System' | 'MQTT' | 'LiveKit';
  message: string;
  type: 'info' | 'error' | 'success';
}