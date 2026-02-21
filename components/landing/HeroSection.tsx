import React from 'react';

interface HeroSectionProps {
  onTryAI: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onTryAI }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient pt-20">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left: Text */}
        <div className="animate-fadeInUp">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
            多模型灵活适配 · 普惠创客理念
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight mb-6">
            <span className="gradient-text">SparkLamp</span>
            <br />
            <span className="text-3xl lg:text-4xl font-bold text-slate-300">AI 多模态智能台灯</span>
          </h1>
          
          <p className="text-lg text-slate-400 leading-relaxed mb-8 max-w-lg">
            融合 AI 语音交互、多模态视觉感知与机械臂情感表达的智能台灯。支持多种上位机与大模型灵活搭配，AI 性格和场景完全可自定义。
          </p>

          <div className="flex flex-wrap gap-4">
            <button onClick={onTryAI} className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:from-orange-400 hover:to-orange-500 transition-all shadow-lg shadow-orange-500/25 text-lg">
              在线体验 AI →
            </button>
            <a href="#products" className="px-8 py-3.5 bg-slate-800/80 text-white font-semibold rounded-xl hover:bg-slate-700 transition border border-slate-700 text-lg">
              了解产品
            </a>
          </div>

          <div className="flex items-center gap-8 mt-10 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <span className="text-orange-400">✦</span> 3D 打印开源硬件
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-400">✦</span> 多模型灵活适配
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400">✦</span> 多种上位机适配
            </div>
          </div>
        </div>

        {/* Right: Video */}
        <div className="relative flex justify-center animate-fadeInUp" style={{animationDelay: '0.2s'}}>
          <div className="relative w-full max-w-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-purple-500/20 rounded-3xl blur-3xl scale-110" />
            <div className="relative z-10 w-full rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl shadow-orange-500/10" style={{aspectRatio: '16/9'}}>
              <iframe 
                src="//player.bilibili.com/player.html?isOutside=true&aid=116006194250863&bvid=BV1ytFjzME8z&cid=35794584163&p=1"
                scrolling="no"
                frameBorder="0"
                allowFullScreen={true}
                className="w-full h-full"
                title="SparkLamp 介绍视频"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 text-xs animate-bounce">
        <span>向下滚动</span>
        <span>↓</span>
      </div>
    </section>
  );
};

export default HeroSection;
