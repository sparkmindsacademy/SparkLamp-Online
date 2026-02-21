import React from 'react';

const features = [
  {
    icon: '🗣️',
    title: 'AI 语音伴读',
    description: '基于 Gemini 大模型的实时语音交互，支持苏格拉底式教学法，引导孩子主动思考而非被动接受答案。',
    color: 'from-orange-500 to-amber-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
  },
  {
    icon: '👁️',
    title: '视觉识别',
    description: '通过摄像头实时识别书本内容、作业题目，AI 可以"看到"孩子正在学习的内容并提供针对性辅导。',
    color: 'from-purple-500 to-violet-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
  },
  {
    icon: '🤖',
    title: '情感机械臂',
    description: '3自由度机械臂赋予台灯丰富的肢体语言——点头、摇头、开心摇摆、害羞低头，让AI交互更有温度。',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
  },
  {
    icon: '🌐',
    title: 'MQTT 物联网',
    description: '基于 ESP32 + MQTT 协议的物联网架构，实现云端AI与本地硬件的低延迟双向通信。',
    color: 'from-emerald-500 to-green-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
  },
  {
    icon: '🔧',
    title: '开源创客',
    description: '全部结构件采用 3D 打印，设计文件开源。践行普惠创客理念，让每个孩子都能拥有自己的 AI 伙伴。',
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/20',
  },
  {
    icon: '📚',
    title: '多学科辅导',
    description: '覆盖语文、数学、英语、科学等多学科，支持口语练习、概念讲解、题目分析等多种学习场景。',
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-orange-400 text-sm font-semibold uppercase tracking-wider">核心功能</span>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mt-3 mb-4">不只是一盏灯</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">SparkLamp 将 AI 大模型、计算机视觉、物联网和机器人技术融为一体，重新定义伴读体验</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div key={i} className={`card-hover group p-6 rounded-2xl border ${feature.borderColor} ${feature.bgColor} backdrop-blur-sm`}>
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
