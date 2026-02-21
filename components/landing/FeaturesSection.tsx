import React from 'react';

const features = [
  {
    icon: '🗣️',
    title: 'AI 语音交互',
    description: '灵活支持 Gemini、通义千问、文心一言等多种大模型，实时语音对话。AI 性格、语气、知识领域均可自定义配置，适配各种使用场景。',
    color: 'from-orange-500 to-amber-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
  },
  {
    icon: '👁️',
    title: '多模态视觉感知',
    description: '通过摄像头和设备屏幕共享，AI 可以"看到"书本内容、作业题目以及屏幕上的任何信息，实现更丰富的视觉交互。',
    color: 'from-purple-500 to-violet-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
  },
  {
    icon: '🤖',
    title: '情感机械臂',
    description: '4 自由度机械臂赋予台灯丰富的肢体语言——点头、摇头、开心摇摆、害羞低头，让 AI 交互更有温度。',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
  },
  {
    icon: '🖥️',
    title: '多种上位机适配',
    description: '支持 DFRobot K10、M5Stack CoreS3、树莓派等多种上位机，也可以直接通过浏览器访问本网站与台灯交互——有浏览器就能用。',
    color: 'from-emerald-500 to-green-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
  },
  {
    icon: '🔧',
    title: '开源创客',
    description: '全部结构件采用 3D 打印，颜色自由搭配，设计文件开源可二次修改。践行普惠创客理念，让每个人都能拥有自己的 AI 伙伴。',
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/20',
  },
  {
    icon: '🎭',
    title: '场景无限',
    description: 'AI 性格、知识领域、交互风格均可自定义。学科辅导、口语陪练、故事伙伴、编程助手……你来定义它是谁。',
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
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">SparkLamp 将多模态 AI、计算机视觉、物联网和机器人技术融为一体，场景由你定义</p>
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
