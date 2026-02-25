import React, { useState, useEffect, useRef } from 'react';
import mqtt from 'mqtt';
import { Room, RoomEvent, VideoPresets, Track, LocalTrackPublication } from 'livekit-client';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { 
  ACTION_MAPPING, 
  DEFAULT_MQTT_BROKER, 
  DEFAULT_CLIENT_ID, 
  TOOLS, 
  SYSTEM_INSTRUCTION 
} from './constants';
import { AppConfig, ConnectionState, LogEntry } from './types';
import { createPcmBlob, base64ToFloat32Array } from './utils/audio';
import { generateLiveKitToken } from './utils/token';
import LampVisualizer from './components/LampVisualizer';
import { Analytics } from '@vercel/analytics/react';

// ─── Landing Page Sections ───
import HeroSection from './components/landing/HeroSection';
import FeaturesSection from './components/landing/FeaturesSection';
import ProductsSection from './components/landing/ProductsSection';
import TechSection from './components/landing/TechSection';
import AboutSection from './components/landing/AboutSection';
import Navbar from './components/landing/Navbar';
import Footer from './components/landing/Footer';

// Helper for image resizing/compression
const processImageForGemini = async (blob: Blob): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result as string;
      resolve(base64data.split(',')[1]);
    };
    reader.readAsDataURL(blob);
  });
};

// ─── AI Controller Panel (extracted from original App) ───
function AIControllerPanel() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.DISCONNECTED);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLightOn, setIsLightOn] = useState(false);
  const [lastAction, setLastAction] = useState('idle');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volume, setVolume] = useState(1);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'logs'>('chat');
  const [chatInput, setChatInput] = useState('');
  const [showSetup, setShowSetup] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Config form state
  const [googleKey, setGoogleKey] = useState('');
  const [livekitUrl, setLivekitUrl] = useState('');
  const [livekitKey, setLivekitKey] = useState('');
  const [livekitSecret, setLivekitSecret] = useState('');
  const [mqttTopic, setMqttTopic] = useState('');

  const configRef = useRef<AppConfig | null>(null);
  const mqttClientRef = useRef<mqtt.MqttClient | null>(null);
  const livekitRoomRef = useRef<Room | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const outputNodeRef = useRef<GainNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionRef = useRef<any>(null);
  const isSessionActive = useRef(false);
  const videoCanvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));
  const videoIntervalRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);
  const screenIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('sparklamp_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setGoogleKey(parsed.googleApiKey || '');
        setLivekitUrl(parsed.livekitUrl || '');
        setLivekitKey(parsed.livekitApiKey || '');
        setLivekitSecret(parsed.livekitApiSecret || '');
        setMqttTopic(parsed.mqttTopic || '');
      } catch (e) {}
    }
  }, []);

  const addLog = (message: string, source: LogEntry['source'], type: LogEntry['type'] = 'info') => {
    setLogs(prev => [{
      id: Math.random().toString(36).substring(7),
      timestamp: new Date(),
      source, message, type
    }, ...prev].slice(0, 50));
  };

  const sendVideoFrame = async () => {
    if (!videoRef || !sessionRef.current || !isVideoEnabled || !isSessionActive.current) return;
    const canvas = videoCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const scale = 0.5;
    canvas.width = videoRef.videoWidth * scale;
    canvas.height = videoRef.videoHeight * scale;
    ctx.drawImage(videoRef, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(async (blob) => {
      if (blob && isSessionActive.current) {
        try {
          const base64Data = await processImageForGemini(blob);
          if (sessionRef.current && isSessionActive.current) {
            sessionRef.current.sendRealtimeInput({ media: { mimeType: 'image/jpeg', data: base64Data } });
          }
        } catch (e) {}
      }
    }, 'image/jpeg', 0.6);
  };

  useEffect(() => {
    if (isVideoEnabled && connectionState === ConnectionState.CONNECTED) {
      addLog('AI Vision Enabled', 'System', 'success');
      videoIntervalRef.current = window.setInterval(sendVideoFrame, 1000);
    } else {
      if (videoIntervalRef.current) { clearInterval(videoIntervalRef.current); videoIntervalRef.current = null; }
    }
    return () => { if (videoIntervalRef.current) clearInterval(videoIntervalRef.current); };
  }, [isVideoEnabled, connectionState]);

  const handleSendMessage = () => {
    if (!chatInput.trim() || !sessionRef.current || !isSessionActive.current) return;
    try {
      sessionRef.current.sendClientContent({ turns: [{ role: 'user', parts: [{ text: chatInput }] }], turnComplete: true });
      addLog(chatInput, 'User', 'info');
      setChatInput('');
    } catch (e) { addLog("Failed to send message", 'System', 'error'); }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !sessionRef.current || !isSessionActive.current) return;
    addLog(`Uploading: ${file.name}...`, 'System', 'info');
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      if (isSessionActive.current) {
        try {
          sessionRef.current.sendRealtimeInput({ media: { mimeType: file.type, data: base64String } });
          addLog(`Image sent to AI`, 'User', 'success');
        } catch (e) {}
      }
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSnapshot = () => {
    if (!videoRef || !sessionRef.current || !isSessionActive.current) { addLog("Camera not ready", "System", "error"); return; }
    const canvas = videoCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = videoRef.videoWidth;
    canvas.height = videoRef.videoHeight;
    ctx.drawImage(videoRef, 0, 0);
    canvas.toBlob(async (blob) => {
      if (blob && isSessionActive.current) {
        try {
          const base64Data = await processImageForGemini(blob);
          if (sessionRef.current && isSessionActive.current) {
            sessionRef.current.sendRealtimeInput({ media: { mimeType: 'image/jpeg', data: base64Data } });
            addLog("Snapshot sent to AI", "User", "success");
          }
        } catch (e) {}
      }
    }, 'image/jpeg', 0.8);
  };

  // ─── SCREEN SHARE LOGIC ───
  const startScreenShare = async () => {
    if (!sessionRef.current || !isSessionActive.current) {
      addLog("请先连接 AI", "System", "error");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: 1 }, audio: false });
      screenStreamRef.current = stream;
      
      // Create a hidden video element to capture frames
      const video = document.createElement('video');
      video.srcObject = stream;
      video.muted = true;
      video.playsInline = true;
      await video.play();
      screenVideoRef.current = video;

      // Listen for user stopping share via browser UI
      stream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };

      setIsScreenSharing(true);
      addLog('屏幕共享已开启 - AI 可以看到你的桌面', 'System', 'success');

      // Send frames at ~1 FPS
      const canvas = document.createElement('canvas');
      screenIntervalRef.current = window.setInterval(() => {
        if (!screenVideoRef.current || !sessionRef.current || !isSessionActive.current) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const scale = 0.5;
        canvas.width = screenVideoRef.current.videoWidth * scale;
        canvas.height = screenVideoRef.current.videoHeight * scale;
        ctx.drawImage(screenVideoRef.current, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(async (blob) => {
          if (blob && isSessionActive.current && sessionRef.current) {
            try {
              const base64Data = await processImageForGemini(blob);
              sessionRef.current.sendRealtimeInput({ media: { mimeType: 'image/jpeg', data: base64Data } });
            } catch (e) {}
          }
        }, 'image/jpeg', 0.5);
      }, 1500);
    } catch (e: any) {
      if (e.name !== 'NotAllowedError') {
        addLog(`屏幕共享失败: ${e.message}`, 'System', 'error');
      }
    }
  };

  const stopScreenShare = () => {
    if (screenIntervalRef.current) { clearInterval(screenIntervalRef.current); screenIntervalRef.current = null; }
    if (screenStreamRef.current) { screenStreamRef.current.getTracks().forEach(t => t.stop()); screenStreamRef.current = null; }
    if (screenVideoRef.current) { screenVideoRef.current.pause(); screenVideoRef.current.srcObject = null; screenVideoRef.current = null; }
    setIsScreenSharing(false);
    addLog('屏幕共享已关闭', 'System', 'info');
  };

  const connectToMqtt = async (topic: string) => {
    return new Promise<void>((resolve, reject) => {
      addLog(`Connecting to MQTT...`, 'System', 'info');
      const client = mqtt.connect(DEFAULT_MQTT_BROKER, { clientId: DEFAULT_CLIENT_ID, clean: true, connectTimeout: 4000, reconnectPeriod: 1000 });
      client.on('connect', () => { addLog('MQTT Connected', 'MQTT', 'success'); client.publish(topic, 'hello'); mqttClientRef.current = client; resolve(); });
      client.on('error', (err) => { addLog(`MQTT Error: ${err.message}`, 'MQTT', 'error'); client.end(); reject(err); });
      // Timeout fallback
      setTimeout(() => { if (!mqttClientRef.current) { addLog('MQTT timeout, continuing...', 'MQTT', 'info'); mqttClientRef.current = client; resolve(); } }, 5000);
    });
  };

  const publishAction = (action: string) => {
    if (!mqttClientRef.current || !configRef.current) return;
    const esp32Command = ACTION_MAPPING[action] || action;
    mqttClientRef.current.publish(configRef.current.mqttTopic, esp32Command);
    addLog(`Sent: "${esp32Command}"`, 'MQTT', 'info');
    setLastAction(action);
    if (action === 'turn_light_on' || esp32Command === 'on') setIsLightOn(true);
    if (action === 'turn_light_off' || esp32Command === 'off') setIsLightOn(false);
  };

  const connectToLiveKit = async (cfg: AppConfig) => {
    if (!cfg.livekitUrl || !cfg.livekitApiKey || !cfg.livekitApiSecret) { addLog('LiveKit skipped', 'LiveKit', 'info'); return null; }
    try {
      addLog('Connecting to LiveKit...', 'LiveKit', 'info');
      const token = await generateLiveKitToken(cfg.livekitApiKey, cfg.livekitApiSecret, "Web-Controller", "room-01");
      const room = new Room({ adaptiveStream: true, dynacast: true });
      await room.connect(cfg.livekitUrl, token);
      addLog(`Joined Room: ${room.name}`, 'LiveKit', 'success');
      await room.localParticipant.enableCameraAndMicrophone();
      const tracks = Array.from(room.localParticipant.trackPublications.values()).filter((pub: any) => pub.kind === Track.Kind.Video);
      if (tracks.length > 0 && videoRef) { (tracks[0] as LocalTrackPublication).track?.attach(videoRef); }
      livekitRoomRef.current = room;
      return room;
    } catch (e: any) { addLog(`LiveKit Failed: ${e.message}`, 'LiveKit', 'error'); return null; }
  };

  const startSession = async (currentConfig: AppConfig) => {
    try {
      setConnectionState(ConnectionState.CONNECTING);
      isSessionActive.current = false;
      
      // MQTT and LiveKit are non-blocking - don't let them prevent Gemini connection
      try { await connectToMqtt(currentConfig.mqttTopic); } catch(e) { addLog('MQTT connection failed, continuing...', 'System', 'info'); }
      try { await connectToLiveKit(currentConfig); } catch(e) { addLog('LiveKit connection failed, continuing...', 'System', 'info'); }

      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      outputNodeRef.current = audioContextRef.current.createGain();
      outputNodeRef.current.gain.value = volume;
      outputNodeRef.current.connect(audioContextRef.current.destination);
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 16000 } });
      const inputContext = new AudioContext({ sampleRate: 16000 });
      const source = inputContext.createMediaStreamSource(stream);
      processorRef.current = inputContext.createScriptProcessor(4096, 1, 1);
      source.connect(processorRef.current);
      processorRef.current.connect(inputContext.destination);

      const ai = new GoogleGenAI({ apiKey: currentConfig.googleApiKey });
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          tools: TOOLS,
          responseModalities: [Modality.AUDIO],
          systemInstruction: SYSTEM_INSTRUCTION,
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } }
        },
        callbacks: {
          onopen: () => {
            addLog('Connected to Gemini', 'System', 'success');
            setConnectionState(ConnectionState.CONNECTED);
            setShowSetup(false);
            isSessionActive.current = true;
            if(processorRef.current) {
              processorRef.current.onaudioprocess = (e) => {
                if (!isSessionActive.current || !sessionRef.current) return;
                const inputData = e.inputBuffer.getChannelData(0);
                const pcmBlob = createPcmBlob(inputData);
                try { sessionRef.current.sendRealtimeInput({ media: pcmBlob }); } catch(err) {}
              };
            }
          },
          onmessage: async (msg: LiveServerMessage) => {
            if (msg.toolCall && msg.toolCall.functionCalls) {
              for (const fc of msg.toolCall.functionCalls) {
                addLog(`Function: ${fc.name}`, 'AI', 'info');
                let result = { result: "ok" };
                if (fc.name === 'play_recording') { const recName = (fc.args as any).recording_name; publishAction(recName); result = { result: `Executed ${recName}` }; }
                else if (fc.name === 'turn_light_on') { publishAction('light_on'); }
                else if (fc.name === 'turn_light_off') { publishAction('light_off'); }
                else if (fc.name === 'stop_movement') { publishAction('stop'); }
                else if (fc.name === 'reset_to_idle') { publishAction('release'); result = { result: "Servos released" }; }
                if (isSessionActive.current && sessionRef.current) {
                  try { sessionRef.current.sendToolResponse({ functionResponses: { id: fc.id, name: fc.name, response: result } }); } catch(e) {}
                }
              }
            }
            const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData && audioContextRef.current && outputNodeRef.current) {
              setIsSpeaking(true);
              const float32 = base64ToFloat32Array(audioData);
              const audioBuffer = audioContextRef.current.createBuffer(1, float32.length, 24000);
              audioBuffer.getChannelData(0).set(float32);
              const src = audioContextRef.current.createBufferSource();
              src.buffer = audioBuffer;
              src.connect(outputNodeRef.current);
              const currentTime = audioContextRef.current.currentTime;
              if (nextStartTimeRef.current < currentTime) nextStartTimeRef.current = currentTime;
              src.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              src.onended = () => { if (audioContextRef.current && audioContextRef.current.currentTime >= nextStartTimeRef.current) setIsSpeaking(false); };
            }
            const textData = msg.serverContent?.modelTurn?.parts?.find(p => p.text)?.text;
            if (textData) addLog(textData, 'AI', 'info');
          },
          onclose: () => {
            isSessionActive.current = false;
            if (processorRef.current) { processorRef.current.disconnect(); processorRef.current.onaudioprocess = null; }
            addLog('Disconnected', 'System', 'error');
            setConnectionState(ConnectionState.DISCONNECTED);
            sessionRef.current = null;
          },
          onerror: (err) => { isSessionActive.current = false; addLog(`Error: ${err.message}`, 'System', 'error'); }
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (e: any) { isSessionActive.current = false; addLog(`Setup Error: ${e.message}`, 'System', 'error'); setConnectionState(ConnectionState.ERROR); }
  };

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleKey || !mqttTopic) return;
    const newConfig: AppConfig = { googleApiKey: googleKey, livekitUrl, livekitApiKey: livekitKey, livekitApiSecret: livekitSecret, mqttTopic };
    localStorage.setItem('sparklamp_config', JSON.stringify(newConfig));
    setConfig(newConfig);
    configRef.current = newConfig;
    startSession(newConfig);
  };

  const disconnect = () => {
    isSessionActive.current = false;
    stopScreenShare();
    if(mqttClientRef.current) mqttClientRef.current.end();
    if(livekitRoomRef.current) livekitRoomRef.current.disconnect();
    if(audioContextRef.current) audioContextRef.current.close();
    if(processorRef.current) { processorRef.current.disconnect(); processorRef.current.onaudioprocess = null; }
    setConnectionState(ConnectionState.DISCONNECTED);
    sessionRef.current = null;
    window.location.reload();
  };

  useEffect(() => {
    if (livekitRoomRef.current && videoRef) {
      const tracks = Array.from(livekitRoomRef.current.localParticipant.trackPublications.values()).filter((pub: any) => pub.kind === Track.Kind.Video);
      if (tracks.length > 0) { (tracks[0] as LocalTrackPublication).track?.attach(videoRef); }
    }
  }, [videoRef, connectionState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isSessionActive.current = false;
      if(mqttClientRef.current) { try { mqttClientRef.current.end(); } catch(e) {} }
      if(livekitRoomRef.current) { try { livekitRoomRef.current.disconnect(); } catch(e) {} }
      if(audioContextRef.current) { try { audioContextRef.current.close(); } catch(e) {} }
      if(processorRef.current) { try { processorRef.current.disconnect(); processorRef.current.onaudioprocess = null; } catch(e) {} }
      if(videoIntervalRef.current) { clearInterval(videoIntervalRef.current); }
      if(screenIntervalRef.current) { clearInterval(screenIntervalRef.current); }
      if(screenStreamRef.current) { screenStreamRef.current.getTracks().forEach(t => t.stop()); }
      sessionRef.current = null;
    };
  }, []);

  const actionButtons = [
    { cmd: 'wake_up', label: '👋 Wake' }, { cmd: 'nod', label: '✅ Nod' },
    { cmd: 'headshake', label: '❌ Shake' }, { cmd: 'happy_wiggle', label: '🎉 Happy' },
    { cmd: 'think', label: '🤔 Think' }, { cmd: 'scanning', label: '🔍 Scan' },
    { cmd: 'shy', label: '😊 Shy' }, { cmd: 'sad', label: '😢 Sad' },
    { cmd: 'shock', label: '😲 Shock' }, { cmd: 'release', label: '😌 Relax' },
  ];

  // ─── Disconnected: Show setup or start button ───
  if ((connectionState === ConnectionState.DISCONNECTED || connectionState === ConnectionState.ERROR) && !showSetup) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center animate-pulse-glow">
          <span className="text-4xl">💡</span>
        </div>
        <h3 className="text-2xl font-bold text-white">SparkLamp AI 控制台</h3>
        <p className="text-slate-400 text-sm text-center max-w-md">连接你的 SparkLamp，通过语音、文字和视觉与 AI 伴读助手实时互动</p>
        <button onClick={() => setShowSetup(true)} className="px-8 py-3 bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold rounded-xl hover:from-orange-400 hover:to-purple-500 transition-all shadow-lg shadow-orange-500/25">
          开始连接
        </button>
      </div>
    );
  }

  // ─── Setup Form (also shown during CONNECTING) ───
  const stateStr = connectionState as string;
  if (showSetup || stateStr === ConnectionState.CONNECTING) {
    const isConnecting = stateStr === ConnectionState.CONNECTING;
    return (
      <div className="max-w-lg mx-auto py-8 px-4">
        <div className="glass rounded-2xl border border-slate-700/50 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">连接设置</h2>
            {!isConnecting && <button onClick={() => setShowSetup(false)} className="text-slate-400 hover:text-white text-sm">✕ 关闭</button>}
          </div>
          {isConnecting ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center animate-pulse">
                <span className="text-2xl">💡</span>
              </div>
              <p className="text-slate-300 text-sm">正在连接 AI 助手...</p>
              <p className="text-slate-500 text-xs">请允许麦克风权限</p>
            </div>
          ) : (
          <form onSubmit={handleConnect} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-orange-400 mb-1 uppercase tracking-wider">Google API Key *</label>
              <input type="password" required value={googleKey} onChange={(e) => setGoogleKey(e.target.value)} className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:ring-1 focus:ring-orange-500 outline-none text-sm" placeholder="AIza..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-orange-400 mb-1 uppercase tracking-wider">MQTT Topic *</label>
              <input type="text" required value={mqttTopic} onChange={(e) => setMqttTopic(e.target.value)} className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:ring-1 focus:ring-orange-500 outline-none text-sm" placeholder="sparklamp/device_01/command" />
            </div>
            <details className="text-sm">
              <summary className="text-purple-400 cursor-pointer hover:text-purple-300">LiveKit 设置 (可选)</summary>
              <div className="mt-3 space-y-3">
                <input type="text" value={livekitUrl} onChange={(e) => setLivekitUrl(e.target.value)} className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-purple-500 outline-none text-sm" placeholder="LiveKit URL (wss://...)" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" value={livekitKey} onChange={(e) => setLivekitKey(e.target.value)} className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none text-sm" placeholder="API Key" />
                  <input type="password" value={livekitSecret} onChange={(e) => setLivekitSecret(e.target.value)} className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none text-sm" placeholder="API Secret" />
                </div>
              </div>
            </details>
            <button type="submit" disabled={connectionState === ConnectionState.CONNECTING} className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-400 hover:to-purple-500 transition shadow-lg disabled:opacity-50">
              {connectionState === ConnectionState.CONNECTING ? '连接中...' : '启动 AI 助手'}
            </button>
          </form>
          )}
        </div>
      </div>
    );
  }

  // ─── Connected: Full Controller UI ───
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400 font-medium">已连接</span>
          {isScreenSharing && (
            <span className="text-xs text-red-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              🖥️ 屏幕共享中
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">音量</span>
            <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => { const v = parseFloat(e.target.value); setVolume(v); if(outputNodeRef.current) outputNodeRef.current.gain.value = v; }} className="w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500" />
          </div>
          <button onClick={disconnect} className="text-xs bg-slate-800 hover:bg-red-900/50 text-slate-300 hover:text-red-300 px-3 py-1.5 rounded-lg transition border border-slate-700 hover:border-red-500/30">断开</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Visualizer */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 relative overflow-hidden flex-grow flex flex-col justify-center items-center min-h-[300px]">
            <LampVisualizer lastAction={lastAction} isLightOn={isLightOn} isSpeaking={isSpeaking} />
            {config?.livekitUrl && (
              <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
                <div className="w-28 h-20 bg-black rounded-lg overflow-hidden border border-slate-700 relative group">
                  <video ref={setVideoRef} className="w-full h-full object-cover transform -scale-x-100" autoPlay muted playsInline />
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] text-white text-center py-0.5">{isVideoEnabled ? '👁️ AI 观察中' : '🙈 视觉关闭'}</div>
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={handleSnapshot} className="bg-white/20 hover:bg-white/40 p-1.5 rounded-full backdrop-blur-sm">📷</button>
                  </div>
                </div>
                <button onClick={() => setIsVideoEnabled(!isVideoEnabled)} className={`text-[10px] px-2 py-1 rounded-full border transition-all ${isVideoEnabled ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 animate-pulse' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                  {isVideoEnabled ? '停止广播' : '广播视频给AI'}
                </button>
              </div>
            )}
          </div>
          {/* Action Buttons */}
          <div className="grid grid-cols-5 gap-1.5">
            {actionButtons.map((btn) => (
              <button key={btn.cmd} onClick={() => publishAction(btn.cmd)} className="p-2 rounded-xl text-[10px] font-medium bg-slate-800/80 border border-slate-700/50 hover:bg-slate-700 active:scale-95 transition-all text-slate-300">{btn.label}</button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button onClick={() => publishAction('turn_light_on')} className="p-2 rounded-xl text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition">💡 开灯</button>
            <button onClick={() => publishAction('turn_light_off')} className="p-2 rounded-xl text-xs font-semibold bg-slate-800/50 text-slate-400 border border-slate-700 hover:bg-slate-700 transition">🌙 关灯</button>
          </div>
        </div>

        {/* Right: Chat & Logs */}
        <div className="lg:col-span-7 flex flex-col h-[500px]">
          <div className="flex-grow bg-black/30 rounded-2xl border border-slate-800 overflow-hidden flex flex-col">
            <div className="bg-slate-900/90 border-b border-slate-800 flex">
              <button onClick={() => setActiveTab('chat')} className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${activeTab === 'chat' ? 'bg-slate-800 text-orange-400 border-b-2 border-orange-500' : 'text-slate-500 hover:text-slate-300'}`}>对话</button>
              <button onClick={() => setActiveTab('logs')} className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${activeTab === 'logs' ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300'}`}>系统日志</button>
            </div>
            <div className="flex-grow overflow-y-auto p-4 space-y-2 font-mono text-xs">
              {logs.length === 0 && <div className="flex flex-col items-center justify-center h-full text-slate-600 opacity-50"><span className="text-4xl mb-2">💬</span><p>等待对话开始...</p></div>}
              {logs.filter(l => activeTab === 'logs' ? true : (l.source === 'User' || l.source === 'AI')).map(log => (
                <div key={log.id} className={`flex gap-3 ${log.source === 'User' ? 'flex-row-reverse' : ''}`}>
                  {activeTab === 'logs' && <span className="text-slate-600 shrink-0 text-[10px] self-center">{log.timestamp.toLocaleTimeString([], {hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit'})}</span>}
                  <div className={`max-w-[80%] rounded-xl p-3 ${log.source === 'User' ? 'bg-orange-600/20 border border-orange-500/30 text-orange-100' : log.source === 'AI' ? 'bg-slate-800 border border-slate-700 text-slate-200' : 'text-slate-400'}`}>
                    {activeTab === 'logs' && <div className="font-bold text-[8px] uppercase tracking-wider mb-1 opacity-70">{log.source}</div>}
                    <div className="whitespace-pre-wrap">{log.message}</div>
                  </div>
                </div>
              ))}
            </div>
            {activeTab === 'chat' && connectionState === ConnectionState.CONNECTED && (
              <div className="bg-slate-900/90 border-t border-slate-800 p-3">
                <div className="flex gap-2">
                  <button onClick={() => fileInputRef.current?.click()} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700 transition" title="上传图片">📎</button>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                  <button onClick={handleSnapshot} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700 transition" title="拍照">📷</button>
                  <button onClick={isScreenSharing ? stopScreenShare : startScreenShare} className={`p-2 rounded-lg border transition ${isScreenSharing ? 'bg-red-500/20 text-red-300 border-red-500/50 animate-pulse' : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-700'}`} title={isScreenSharing ? '停止共享' : '共享屏幕'}>🖥️</button>
                  <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="输入消息..." className="flex-grow bg-black/50 border border-slate-700 rounded-lg px-3 text-white focus:outline-none focus:border-orange-500 text-sm" />
                  <button onClick={handleSendMessage} className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white rounded-lg font-semibold transition text-sm">发送</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main App: Landing Page + AI Controller ───
export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'ai'>('home');

  if (currentPage === 'ai') {
    return (
      <>
        <div className="min-h-screen bg-slate-950">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => setCurrentPage('home')} className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm">
                <span>←</span> 返回首页
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-purple-600 rounded-lg flex items-center justify-center"><span className="text-lg">💡</span></div>
                <span className="text-white font-bold">SparkLamp AI</span>
              </div>
            </div>
            <AIControllerPanel />
          </div>
        </div>
        <Analytics />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-950">
        <Navbar onNavigateAI={() => setCurrentPage('ai')} />
        <HeroSection onTryAI={() => setCurrentPage('ai')} />
        <FeaturesSection />
        <ProductsSection />
        <TechSection />
        <AboutSection />
        <Footer onNavigateAI={() => setCurrentPage('ai')} />
      </div>
      <Analytics />
    </>
  );
}
