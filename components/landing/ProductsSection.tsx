import React, { useState } from 'react';

const ProductsSection: React.FC = () => {
  const [activeProduct, setActiveProduct] = useState<'pro' | 'lite'>('pro');

  return (
    <section id="products" className="py-24 relative section-dark">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-purple-400 text-sm font-semibold uppercase tracking-wider">产品系列</span>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mt-3 mb-4">选择你的 SparkLamp</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">两个版本，同样的 AI 灵魂。根据你的需求选择最适合的伙伴</p>
        </div>

        {/* Product Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-slate-800/80 rounded-xl p-1 border border-slate-700/50">
            <button 
              onClick={() => setActiveProduct('pro')}
              className={`px-8 py-3 rounded-lg text-sm font-bold transition-all ${activeProduct === 'pro' ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25' : 'text-slate-400 hover:text-white'}`}
            >
              🤖 SparkLamp PRO
            </button>
            <button 
              onClick={() => setActiveProduct('lite')}
              className={`px-8 py-3 rounded-lg text-sm font-bold transition-all ${activeProduct === 'lite' ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg shadow-purple-500/25' : 'text-slate-400 hover:text-white'}`}
            >
              💡 SparkLamp Lite
            </button>
          </div>
        </div>

        {/* PRO Product */}
        {activeProduct === 'pro' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-fadeInUp">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500/10 rounded-3xl blur-3xl" />
              <img 
                src="./attachments/SparkLamp-PRO单独.png" 
                alt="SparkLamp PRO" 
                className="relative z-10 w-full max-w-md mx-auto rounded-2xl glow-orange"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-xs font-bold mb-4">
                旗舰版
              </div>
              <h3 className="text-4xl font-bold text-white mb-4">SparkLamp PRO</h3>
              <p className="text-slate-400 text-lg mb-6 leading-relaxed">
                搭载 3 自由度机械臂的旗舰版本。灵感来源于皮克斯经典台灯形象，采用工业机器人式关节设计，赋予台灯丰富的情感表达能力。
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  { label: '3 自由度机械臂', desc: '底座旋转 + 大臂俯仰 + 灯头俯仰，实现 10+ 种情感动作' },
                  { label: 'ESP32-S3 主控', desc: '双核处理器，支持 WiFi + 蓝牙，驱动舵机与 LED' },
                  { label: '3D 打印结构', desc: 'PLA/PETG 材质，开源设计文件，支持自行打印制作' },
                  { label: 'AI 多模态交互', desc: '语音对话 + 视觉识别 + 肢体表达，三位一体' },
                ].map((spec, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 shrink-0" />
                    <div>
                      <span className="text-white font-semibold text-sm">{spec.label}</span>
                      <p className="text-slate-500 text-xs mt-0.5">{spec.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Lite Product */}
        {activeProduct === 'lite' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-fadeInUp">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/10 rounded-3xl blur-3xl" />
              <img 
                src="./attachments/SparkLamp-Lite.png" 
                alt="SparkLamp Lite" 
                className="relative z-10 w-full max-w-md mx-auto rounded-2xl glow-purple"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs font-bold mb-4">
                经典版
              </div>
              <h3 className="text-4xl font-bold text-white mb-4">SparkLamp Lite</h3>
              <p className="text-slate-400 text-lg mb-6 leading-relaxed">
                经典台灯造型的轻量版本。保留完整的 AI 语音交互和视觉识别能力，以更亲民的成本让每个家庭都能拥有 AI 伴读伙伴。
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  { label: '经典台灯设计', desc: '优雅的可调节臂架结构，兼顾美观与实用' },
                  { label: '完整 AI 能力', desc: '同样搭载 Gemini 多模态 AI，语音交互无缩水' },
                  { label: '视觉识别', desc: '支持摄像头接入，实现作业识别与内容分析' },
                  { label: '普惠定价', desc: '更低的硬件成本，践行普惠创客理念' },
                ].map((spec, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 shrink-0" />
                    <div>
                      <span className="text-white font-semibold text-sm">{spec.label}</span>
                      <p className="text-slate-500 text-xs mt-0.5">{spec.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Comparison Table */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-white text-center mb-8">版本对比</h3>
          <div className="overflow-x-auto">
            <table className="w-full max-w-3xl mx-auto text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">功能</th>
                  <th className="text-center py-3 px-4 text-orange-400 font-bold">PRO</th>
                  <th className="text-center py-3 px-4 text-purple-400 font-bold">Lite</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {[
                  ['AI 语音交互', '✅', '✅'],
                  ['视觉识别', '✅', '✅'],
                  ['MQTT 物联网', '✅', '✅'],
                  ['3 自由度机械臂', '✅', '—'],
                  ['情感动作表达', '10+ 种', '基础'],
                  ['3D 打印结构', '✅', '✅'],
                  ['开源设计', '✅', '✅'],
                ].map(([feature, pro, lite], i) => (
                  <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition">
                    <td className="py-3 px-4">{feature}</td>
                    <td className="py-3 px-4 text-center">{pro}</td>
                    <td className="py-3 px-4 text-center">{lite}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
