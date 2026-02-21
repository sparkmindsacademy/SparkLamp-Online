import React from 'react';

const TechSection: React.FC = () => {
  const techStack = [
    {
      layer: 'AI 大脑',
      icon: '🧠',
      color: 'border-orange-500/30 bg-orange-500/5',
      items: [
        { name: 'Google Gemini', desc: '多模态大模型，支持语音+视觉+文本' },
        { name: 'Live API', desc: '实时双向流式交互，低延迟响应' },
        { name: 'Function Calling', desc: 'AI 自主调用硬件控制函数' },
      ]
    },
    {
      layer: '通信层',
      icon: '📡',
      color: 'border-blue-500/30 bg-blue-500/5',
      items: [
        { name: 'MQTT 协议', desc: '轻量级物联网通信，发布/订阅模式' },
        { name: 'WebSocket', desc: '浏览器与 MQTT Broker 的桥接' },
        { name: 'LiveKit', desc: '可选的实时音视频传输层' },
      ]
    },
    {
      layer: '硬件层',
      icon: '⚡',
      color: 'border-emerald-500/30 bg-emerald-500/5',
      items: [
        { name: 'ESP32-S3', desc: '双核 240MHz，WiFi + BLE，驱动舵机' },
        { name: 'SG90 舵机 ×3', desc: '底座旋转、大臂俯仰、灯头俯仰' },
        { name: 'WS2812B LED', desc: '可编程 RGB LED，支持亮度调节' },
      ]
    },
    {
      layer: '结构层',
      icon: '🔧',
      color: 'border-pink-500/30 bg-pink-500/5',
      items: [
        { name: '3D 打印', desc: 'FDM 工艺，PLA/PETG 材质' },
        { name: '参数化设计', desc: '开源 CAD 文件，支持自定义修改' },
        { name: '模块化组装', desc: '螺丝连接，易于拆装和维护' },
      ]
    },
  ];

  return (
    <section id="tech" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-blue-400 text-sm font-semibold uppercase tracking-wider">技术架构</span>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mt-3 mb-4">四层技术栈</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">从云端 AI 到本地硬件，每一层都经过精心设计</p>
        </div>

        {/* Architecture Diagram */}
        <div className="max-w-4xl mx-auto space-y-4">
          {techStack.map((layer, i) => (
            <div key={i} className={`rounded-2xl border ${layer.color} p-6 card-hover`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{layer.icon}</span>
                <h3 className="text-xl font-bold text-white">{layer.layer}</h3>
                <div className="flex-grow h-px bg-slate-800 ml-4" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {layer.items.map((item, j) => (
                  <div key={j} className="bg-slate-900/50 rounded-xl p-4 border border-slate-800/50">
                    <h4 className="text-white font-semibold text-sm mb-1">{item.name}</h4>
                    <p className="text-slate-500 text-xs">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Data Flow */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-bold text-white mb-6">数据流</h3>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            {[
              { label: '用户语音/视觉', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
              { label: '→', color: 'text-slate-600' },
              { label: 'Gemini AI', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
              { label: '→', color: 'text-slate-600' },
              { label: 'Function Call', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
              { label: '→', color: 'text-slate-600' },
              { label: 'MQTT 消息', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
              { label: '→', color: 'text-slate-600' },
              { label: 'ESP32 执行', color: 'bg-pink-500/20 text-pink-300 border-pink-500/30' },
            ].map((item, i) => (
              item.label === '→' 
                ? <span key={i} className={item.color}>→</span>
                : <span key={i} className={`px-3 py-1.5 rounded-lg border ${item.color} font-medium`}>{item.label}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechSection;
