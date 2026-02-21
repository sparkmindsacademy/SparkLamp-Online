import React, { useState, useEffect } from 'react';
import { AppConfig, ConnectionState } from '../types';
import { DEFAULT_MQTT_TOPIC } from '../constants';

interface SettingsModalProps {
  onConnect: (config: AppConfig) => void;
  connectionState: ConnectionState;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onConnect, connectionState }) => {
  // Config State
  const [googleKey, setGoogleKey] = useState('');
  const [livekitUrl, setLivekitUrl] = useState('');
  const [livekitKey, setLivekitKey] = useState('');
  const [livekitSecret, setLivekitSecret] = useState('');
  const [mqttTopic, setMqttTopic] = useState(DEFAULT_MQTT_TOPIC);
  const [showAdvanced, setShowAdvanced] = useState(true); // Default to true to show Topic input

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('sparklamp_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setGoogleKey(parsed.googleApiKey || '');
        setLivekitUrl(parsed.livekitUrl || '');
        setLivekitKey(parsed.livekitApiKey || '');
        setLivekitSecret(parsed.livekitApiSecret || '');
        setMqttTopic(parsed.mqttTopic || DEFAULT_MQTT_TOPIC);
      } catch (e) {
        console.error("Failed to load saved config");
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (googleKey && mqttTopic) {
      const config: AppConfig = {
        googleApiKey: googleKey,
        livekitUrl,
        livekitApiKey: livekitKey,
        livekitApiSecret: livekitSecret,
        mqttTopic
      };
      
      // Save to localStorage
      localStorage.setItem('sparklamp_config', JSON.stringify(config));
      
      onConnect(config);
    }
  };

  if (connectionState === ConnectionState.CONNECTED) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-hide">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">SparkLamp Setup</h2>
          <div className="text-xs px-2 py-1 bg-blue-900/30 border border-blue-500/30 rounded text-blue-300">
            Web Controller
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: The Brain */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">1. The Brain (Google Gemini)</h3>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">GOOGLE_API_KEY</label>
              <input
                type="password"
                required
                value={googleKey}
                onChange={(e) => setGoogleKey(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                placeholder="AIza..."
              />
            </div>
          </div>

          {/* Section 2: LiveKit (Optional Transport) */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider">2. LiveKit (Presence & A/V)</h3>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">LIVEKIT_URL</label>
                <input
                  type="text"
                  value={livekitUrl}
                  onChange={(e) => setLivekitUrl(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-purple-500 outline-none text-sm"
                  placeholder="wss://..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">API_KEY</label>
                  <input
                    type="text"
                    value={livekitKey}
                    onChange={(e) => setLivekitKey(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-purple-500 outline-none text-sm"
                    placeholder="API Key"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">API_SECRET</label>
                  <input
                    type="password"
                    value={livekitSecret}
                    onChange={(e) => setLivekitSecret(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-purple-500 outline-none text-sm"
                    placeholder="Secret"
                  />
                </div>
              </div>
            </div>
            <p className="text-[10px] text-slate-500">
              * LiveKit parameters are optional. If provided, you will join the room "room-01" with camera enabled.
            </p>
          </div>

          {/* Section 3: The Hands (MQTT) */}
          <div className="space-y-3 border-t border-slate-800 pt-4">
             <div className="flex justify-between items-center cursor-pointer" onClick={() => setShowAdvanced(!showAdvanced)}>
                <h3 className="text-sm font-semibold text-orange-400 uppercase tracking-wider">3. The Hands (MQTT)</h3>
                <span className="text-xs text-slate-500">{showAdvanced ? 'Hide' : 'Edit'}</span>
             </div>
             
             {showAdvanced && (
               <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">MQTT Topic <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  required
                  value={mqttTopic}
                  onChange={(e) => setMqttTopic(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-orange-500 outline-none text-sm"
                  placeholder="e.g. sparklamp/device_01/command"
                />
                <p className="text-[10px] text-orange-300 mt-2 bg-orange-950/30 p-2 rounded border border-orange-500/20">
                  ⚠️ <strong>Important:</strong> This topic must exactly match the topic defined in your ESP32/Lamp firmware code (e.g., <code>const char* mqtt_topic = "...";</code>).
                </p>
               </div>
             )}
             {!showAdvanced && <div className="text-xs text-slate-600">Topic: {mqttTopic}</div>}
          </div>

          <button
            type="submit"
            disabled={connectionState === ConnectionState.CONNECTING}
            className={`w-full py-3 rounded-xl font-bold text-white transition mt-6 shadow-lg ${
              connectionState === ConnectionState.CONNECTING
                ? 'bg-gradient-to-r from-blue-700 to-purple-700 opacity-50 cursor-wait'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500'
            }`}
          >
            {connectionState === ConnectionState.CONNECTING ? 'Initializing Agent...' : 'Start Agent'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsModal;