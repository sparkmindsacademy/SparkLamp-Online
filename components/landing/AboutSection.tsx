import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-24 relative section-dark">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-emerald-400 text-sm font-semibold uppercase tracking-wider">关于项目</span>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mt-3 mb-4">SparkLamp 的故事</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Story */}
          <div className="space-y-6">
            <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-bold text-white mb-3">🌟 项目愿景</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                SparkLamp 诞生于一个简单的想法：让每个人都能拥有一个有温度的 AI 伙伴。我们相信，AI 不应该只是冰冷的文字和语音，它应该有"身体"、有"表情"、有"性格"——而这些性格和场景，完全由你来定义。
              </p>
            </div>

            <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-bold text-white mb-3">🔬 研究背景</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                项目基于"普惠创客"理念，采用 3D 打印和开源硬件降低制造门槛。研究表明，具身化的 AI 交互（有物理形态的 AI）比纯屏幕交互更能激发孩子的学习兴趣和专注力。SparkLamp 的机械臂情感表达系统正是基于这一研究成果设计的。
              </p>
            </div>

            <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-bold text-white mb-3">🎯 开放理念</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                SparkLamp 不限定使用场景。你可以让它成为苏格拉底式的学科导师，也可以让它变成口语陪练伙伴、故事讲述者或编程助手。AI 的性格、知识领域和交互风格完全可配置，场景由你定义。
              </p>
            </div>
          </div>

          {/* Timeline / Milestones */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">📅 发展历程</h3>
            <div className="space-y-0 relative">
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-orange-500 via-purple-500 to-emerald-500" />
              
              {[
                { date: '概念阶段', title: '灵感萌发', desc: '受皮克斯台灯启发，提出"有生命的台灯"概念', color: 'bg-orange-500' },
                { date: '设计阶段', title: '结构设计', desc: '完成 3D 打印结构设计，确定 4 自由度机械臂方案', color: 'bg-amber-500' },
                { date: '开发阶段', title: '软硬件开发', desc: 'ESP32 固件开发，多模型 API 集成，MQTT 通信调试', color: 'bg-purple-500' },
                { date: '测试阶段', title: '用户测试', desc: '邀请青少年用户参与测试，收集反馈优化交互体验', color: 'bg-blue-500' },
                { date: '发布阶段', title: 'PRO & Lite 发布', desc: '推出两个版本，满足不同需求和预算', color: 'bg-emerald-500' },
              ].map((milestone, i) => (
                <div key={i} className="flex gap-4 pb-8 relative">
                  <div className={`w-6 h-6 rounded-full ${milestone.color} shrink-0 z-10 flex items-center justify-center`}>
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <div className="pt-0.5">
                    <span className="text-xs text-slate-500 font-medium">{milestone.date}</span>
                    <h4 className="text-white font-semibold mt-0.5">{milestone.title}</h4>
                    <p className="text-slate-400 text-sm mt-1">{milestone.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Research Paper Link */}
            <div className="mt-8 bg-gradient-to-r from-orange-500/10 to-purple-500/10 rounded-2xl p-6 border border-orange-500/20">
              <h4 className="text-white font-bold mb-2">📄 研究报告</h4>
              <p className="text-slate-400 text-sm mb-3">
                《SparkLamp：基于多模态大模型与普惠创客理念的青少年伴读台灯》
              </p>
              <a 
                href="./attachments/研究报告-SparkLamp：基于国产大模型与普惠创客理念的青少年多模态伴读台灯.pdf" 
                target="_blank"
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 text-orange-300 rounded-lg text-sm font-medium hover:bg-orange-500/30 transition border border-orange-500/30"
              >
                📥 下载研究报告 (PDF)
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
