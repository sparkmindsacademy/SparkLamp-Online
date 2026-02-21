import React from 'react';

interface FooterProps {
  onNavigateAI: () => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigateAI }) => {
  return (
    <footer className="py-16 border-t border-slate-800/50 bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-400 rounded-xl flex items-center justify-center">
                <span className="text-xl">💡</span>
              </div>
              <div>
                <span className="text-xl font-bold text-white">SparkLamp</span>
                <span className="text-[10px] text-orange-400 block -mt-1">AI 伴读台灯</span>
              </div>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
              灵活支持多种大模型的青少年多模态伴读台灯。融合 AI 语音交互、视觉识别与机械臂情感表达，践行普惠创客理念。
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">快速链接</h4>
            <div className="space-y-2">
              <a href="#features" className="block text-slate-500 hover:text-slate-300 text-sm transition">功能介绍</a>
              <a href="#products" className="block text-slate-500 hover:text-slate-300 text-sm transition">产品系列</a>
              <a href="#tech" className="block text-slate-500 hover:text-slate-300 text-sm transition">技术架构</a>
              <a href="#about" className="block text-slate-500 hover:text-slate-300 text-sm transition">关于项目</a>
            </div>
          </div>

          {/* CTA */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">体验</h4>
            <div className="space-y-3">
              <button onClick={onNavigateAI} className="block w-full px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg hover:from-orange-400 hover:to-orange-500 transition text-center">
                在线体验 AI
              </button>
              <a 
                href="./attachments/研究报告-SparkLamp：基于国产大模型与普惠创客理念的青少年多模态伴读台灯.pdf" 
                target="_blank"
                className="block w-full px-4 py-2.5 bg-slate-800 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-700 transition text-center border border-slate-700"
              >
                下载研究报告
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-600 text-xs">
            © 2025 SparkLamp Project. 基于普惠创客理念，开源共享。
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <span>Powered by Multi-Model AI</span>
            <span>·</span>
            <span>Built with ESP32</span>
            <span>·</span>
            <span>Made with ❤️</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
