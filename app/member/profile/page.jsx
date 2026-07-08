'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Briefcase, GraduationCap, FileText, Bot, Plus, Edit2, Shield, Settings, Menu, X, ArrowRight, CheckCircle2, ChevronRight, Upload, Search } from 'lucide-react';
import { useChat } from '@ai-sdk/react';
import Link from 'next/link';

const MOCK_PROFILE = {
  name: "Іван Петренко",
  role: "Кваліфікований зварювальник",
  id: "KP-2026-8941",
  status: "verified",
  completion: 85,
  ai_summary: "Іван — висококваліфікований зварювальник з 5 роками досвіду роботи в Польщі. Має чинну Карту Побиту до 2028 року. В даний момент відкрито до пропозицій на позиції бригадира.",
  languages: [
    { lang: 'Польська', level: 'B2', verified: true },
    { lang: 'Англійська', level: 'A2', verified: false }
  ],
  documents: [
    { id: 1, type: 'Карта Побиту', number: 'XYZ123456', expires: '2028-10-15', verified: true },
    { id: 2, type: 'Віза (Робоча)', number: 'V000123', expires: '2024-05-10', verified: true, expired: true }
  ],
  experience: [
    { id: 1, title: 'Зварювальник MIG/MAG', company: 'StalBud Sp. z o.o.', start: '2021-05', end: 'Current', skills: ['MIG', 'MAG', 'Читання креслень'] },
    { id: 2, title: 'Помічник зварювальника', company: 'Konstrukcje EU', start: '2019-02', end: '2021-04', skills: ['Підготовка металу'] }
  ],
  education: [
    { id: 1, institution: 'ПТУ №5', degree: 'Диплом зварювальника', year: '2018' },
    { id: 2, institution: 'TUV SUD Polska', degree: 'Сертифікат зварювальника EN 9606', year: '2021' }
  ]
};

export default function DigitalProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAiChat, setShowAiChat] = useState(false);
  const messagesEndRef = useRef(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/member/chat',
    body: {
      profile: profile 
    },
    initialMessages: [
      { id: '1', role: 'assistant', content: 'Вітаю! Я ваш AI-координатор. Ваша Карта Побиту дійсна ще 2 роки, але раджу оновити сертифікат TUV, він скоро може втратити актуальність. Чим можу допомогти?' }
    ]
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/member/profile');
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        } else {
          console.error("Failed to load profile");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-black/95">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-black/95">
        <p className="text-slate-500">Профіль не знайдено</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-black/95 text-slate-900 dark:text-slate-100 font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 dark:border-white/10 bg-white dark:bg-black/40 backdrop-blur flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-white/10">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">Kompas.ID</h1>
          <p className="text-xs text-slate-500 mt-1">Федерація Цифрової Профспілки</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <NavItem active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={User} label="Мій Профіль" />
          <NavItem active={activeTab === 'docs'} onClick={() => setActiveTab('docs')} icon={FileText} label="Документи" badge={2} />
          <NavItem active={activeTab === 'experience'} onClick={() => setActiveTab('experience')} icon={Briefcase} label="Досвід" />
          <NavItem active={activeTab === 'education'} onClick={() => setActiveTab('education')} icon={GraduationCap} label="Освіта та Навички" />
          
          <div className="my-6 border-t border-slate-100 dark:border-white/10 pt-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">Агенти (Федерація)</p>
            <Link href="/member/jobs" style={{ textDecoration: 'none', color: 'inherit' }}>
              <NavItem icon={Briefcase} label="Агент Працевлаштування" />
            </Link>
            <Link href="/member/legal" style={{ textDecoration: 'none', color: 'inherit' }}>
              <NavItem icon={Shield} label="Агент Легалізації" badge="1" />
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10 px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Цифрова Особистість</h2>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowAiChat(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full font-medium hover:shadow-lg transition-all"
            >
              <Bot className="w-4 h-4" />
              <span>AI-Представник</span>
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-sm">
              <span className="font-bold text-slate-600 dark:text-slate-300">ІП</span>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-5xl mx-auto space-y-8">
          
          {/* Identity Card */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 flex items-start gap-6">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-100 to-teal-50 dark:from-blue-900/40 dark:to-teal-900/20 flex items-center justify-center border border-blue-200 dark:border-blue-500/20">
                <User className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl font-bold">{profile.name}</h1>
                  {profile.status === 'verified' && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                </div>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">{profile.role}</p>
                
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">ID:</span>
                    <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded font-mono font-medium">{profile.id}</code>
                  </div>
                  <div className="flex items-center gap-3 flex-1 max-w-xs">
                    <span className="text-slate-500 whitespace-nowrap">Профіль: {profile.completion}%</span>
                    <div className="h-2 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${profile.completion}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-500/10 flex gap-4 items-start">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h4 className="font-semibold text-indigo-900 dark:text-indigo-300 mb-1">AI-Самарі</h4>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{profile.ai_summary}</p>
              </div>
            </div>
          </section>

          {/* Dynamic Content */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-2 gap-6">
              <OverviewCard title="Мови" icon={Search} items={profile.languages} renderItem={(lang) => (
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="font-medium">{lang.lang}</span>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded">{lang.level}</span>
                    {lang.verified && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  </div>
                </div>
              )} />
              <OverviewCard title="Останній досвід" icon={Briefcase} items={[profile.experience[0]]} renderItem={(exp) => (
                <div className="p-4 rounded-xl border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-800/50">
                  <h4 className="font-bold">{exp.title}</h4>
                  <p className="text-sm text-slate-500">{exp.company} ({exp.start} - {exp.end})</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {exp.skills.map(s => <span key={s} className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800">{s}</span>)}
                  </div>
                </div>
              )} />
            </div>
          )}

          {activeTab === 'docs' && (
            <section className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Мої Документи</h3>
                <button className="flex items-center gap-2 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 px-4 py-2 rounded-lg font-medium transition-colors">
                  <Upload className="w-4 h-4" /> Додати документ
                </button>
              </div>
              {profile.documents.map(doc => (
                <div key={doc.id} className={`p-5 rounded-2xl border flex items-center justify-between ${doc.expired ? 'bg-red-50/50 border-red-100 dark:bg-red-900/10 dark:border-red-900/30' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${doc.expired ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'}`}>
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{doc.type}</h4>
                      <p className="text-sm text-slate-500 font-mono">{doc.number}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 mb-1">Дійсний до</p>
                    <p className={`font-semibold ${doc.expired ? 'text-red-600 dark:text-red-400' : ''}`}>{doc.expires}</p>
                  </div>
                </div>
              ))}
            </section>
          )}

        </div>
      </main>

      {/* AI Assistant Flyout */}
      <AnimatePresence>
        {showAiChat && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-white/10 shadow-2xl flex flex-col z-50 absolute right-0 top-0 bottom-0"
          >
            <div className="p-4 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">AI-Представник</h3>
                  <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium uppercase tracking-wider">Федерація Агентів</p>
                </div>
              </div>
              <button onClick={() => setShowAiChat(false)} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-indigo-100 dark:bg-indigo-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                    {msg.role === 'user' ? <User className="w-3 h-3 text-indigo-600 dark:text-indigo-400" /> : <Bot className="w-3 h-3 text-blue-600 dark:text-blue-400" />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-sm'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="p-4 border-t border-slate-100 dark:border-white/10 flex gap-2">
              <input 
                value={input} 
                onChange={handleInputChange} 
                type="text" 
                placeholder="Напишіть AI-координатору..." 
                className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
                disabled={isLoading}
              />
              <button type="submit" disabled={isLoading || !input.trim()} className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

function NavItem({ active, icon: Icon, label, badge, locked, onClick, href }) {
  const content = (
    <div className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${active ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'} ${locked ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${active ? 'text-blue-600 dark:text-blue-400' : ''}`} />
        <span>{label}</span>
      </div>
      {badge && <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs font-bold">{badge}</span>}
    </div>
  );

  if (href && !locked) {
    return <Link href={href} className="block w-full">{content}</Link>;
  }

  return (
    <button onClick={onClick} disabled={locked} className="w-full text-left">
      {content}
    </button>
  );
}

function OverviewCard({ title, icon: Icon, items, renderItem }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <Icon className="w-5 h-5 text-slate-500" />
        </div>
        <h3 className="font-bold text-lg">{title}</h3>
      </div>
      <div className="space-y-3">
        {items.map((item, idx) => <div key={idx}>{renderItem(item)}</div>)}
      </div>
    </div>
  );
}
