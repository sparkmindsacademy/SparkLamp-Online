import React, { useState, useEffect } from 'react';

interface NavbarProps {
  onNavigateAI: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigateAI }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { label: '功能', href: '#features' },
    { label: '产品', href: '#products' },
    { label: '技术', href: '#tech' },
    { label: '关于', href: '#about' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass border-b border-slate-800/50 shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-400 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-shadow">
            <span className="text-xl">💡</span>
          </div>
          <div>
            <span className="text-xl font-bold text-white tracking-tight">SparkLamp</span>
            <span className="text-[10px] text-orange-400 block -mt-1 font-medium">AI 智能台灯</span>
          </div>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(link => (
            <a key={link.href} href={link.href} className="text-sm text-slate-300 hover:text-white transition-colors font-medium">{link.label}</a>
          ))}
          <button onClick={onNavigateAI} className="px-5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg hover:from-orange-400 hover:to-orange-500 transition-all shadow-lg shadow-orange-500/20">
            体验 AI
          </button>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white text-2xl">
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-slate-800/50 px-6 py-4 space-y-3">
          {links.map(link => (
            <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="block text-sm text-slate-300 hover:text-white py-2">{link.label}</a>
          ))}
          <button onClick={() => { onNavigateAI(); setMobileOpen(false); }} className="w-full px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg">体验 AI</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
