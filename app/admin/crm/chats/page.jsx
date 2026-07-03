"use client";
import React, { useEffect, useState, useRef } from "react";
import { Icon, Avatar } from "@/components/admin/ui";
import { motion, AnimatePresence } from "framer-motion";
import SpotlightCard from "@/components/SpotlightCard";
import { supabase } from "@/lib/supabase";

export default function ChatsDemoPage() {
  const [activeTab, setActiveTab] = useState("open");
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // 1. Fetch Chats
  useEffect(() => {
    const fetchChats = async () => {
      setLoadingChats(true);
      try {
        if (supabase) {
          const { data, error } = await supabase.from('custom_chats').select('*').order('updated_at', { ascending: false });
          if (!error && data) {
            setChats(data);
            if (data.length > 0 && !activeChat) {
              setActiveChat(data[0]);
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
      setLoadingChats(false);
    };

    fetchChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Fetch Messages for Active Chat
  useEffect(() => {
    if (!supabase || !activeChat) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase.from('custom_messages').select('*').eq('chat_id', activeChat.id).order('created_at', { ascending: true });
      if (!error && data) {
        setMessages(data);
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    };

    fetchMessages();
  }, [activeChat]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeChat || !supabase) return;

    const msgText = newMessage.trim();
    setNewMessage("");

    const now = new Date();
    const timeStr = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

    // Optimistic UI update
    const tempMsg = { id: Date.now().toString(), text: msgText, time: timeStr, sender: 'manager', is_seen: false };
    setMessages(prev => [...prev, tempMsg]);
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    // Update Chat last_message
    await supabase.from('custom_chats').update({ last_message: msgText, time: timeStr, updated_at: new Date() }).eq('id', activeChat.id);

    // Insert message
    await supabase.from('custom_messages').insert([{
      chat_id: activeChat.id,
      text: msgText,
      time: timeStr,
      sender: 'manager',
      is_seen: false
    }]);
  };

  return (
    <div className="flex h-[calc(100vh-32px)] -m-4 bg-[#050505] overflow-hidden text-gray-200">
      
      {/* LEFT SIDEBAR: CHAT LIST */}
      <div className="w-[340px] flex flex-col bg-white/5 border-r border-white/10 backdrop-blur-md z-10 shadow-[5px_0_30px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="m-0 text-xl font-bold tracking-tight text-white">Чаты</h2>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 transition-colors">
                <Icon name="plus-circle" size={18} />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 transition-colors">
                <Icon name="filter" size={18} />
              </button>
            </div>
          </div>
          <div className="flex items-center bg-black/40 border border-white/10 rounded-xl px-3 py-2 gap-2 focus-within:border-blue-500/50 transition-colors">
            <Icon name="search" size={16} className="text-gray-500" />
            <input type="text" placeholder="Поиск" className="bg-transparent border-none outline-none text-gray-200 w-full text-sm placeholder:text-gray-600" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 px-2 pt-2">
          <button 
            className={`flex-1 pb-3 text-sm font-semibold transition-colors relative ${activeTab === "open" ? "text-blue-400" : "text-gray-500 hover:text-gray-300"}`} 
            onClick={() => setActiveTab("open")}
          >
            Открытые
            {activeTab === "open" && <motion.div layoutId="chatTab" className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-500 rounded-t-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />}
          </button>
          <button 
            className={`flex-1 pb-3 text-sm font-semibold transition-colors relative ${activeTab === "closed" ? "text-blue-400" : "text-gray-500 hover:text-gray-300"}`} 
            onClick={() => setActiveTab("closed")}
          >
            Закрытые
            {activeTab === "closed" && <motion.div layoutId="chatTab" className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-500 rounded-t-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />}
          </button>
          <button 
            className={`flex-1 pb-3 text-sm font-semibold transition-colors relative ${activeTab === "all" ? "text-blue-400" : "text-gray-500 hover:text-gray-300"}`} 
            onClick={() => setActiveTab("all")}
          >
            Все
            {activeTab === "all" && <motion.div layoutId="chatTab" className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-500 rounded-t-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />}
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
          {loadingChats ? (
            <div className="p-8 text-center text-gray-500 text-sm">Загрузка чатов...</div>
          ) : chats.filter(c => activeTab === "all" || c.status === activeTab).map(chat => (
            <div key={chat.id} className="perspective-1000">
              <motion.div 
                onClick={() => setActiveChat(chat)}
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={`p-3 rounded-xl flex gap-3 cursor-pointer transition-colors relative overflow-hidden group
                  ${activeChat?.id === chat.id 
                    ? 'bg-blue-500/10 border border-blue-500/30' 
                    : 'bg-transparent border border-transparent hover:bg-white/5 hover:border-white/10'}`}
              >
                {activeChat?.id === chat.id && (
                  <motion.div layoutId="activeChatGlow" className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                )}
                
                <div className="relative">
                  <Avatar name={chat.name} size={44} className="border border-white/10 shadow-inner" />
                  <div className="absolute -bottom-1 -right-1 bg-[#121212] rounded-full p-1 border border-white/10">
                    <Icon name={chat.source_icon} size={10} color={chat.source_color} />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`font-bold text-sm truncate ${activeChat?.id === chat.id ? 'text-white' : 'text-gray-200 group-hover:text-white'}`}>
                      {chat.name}
                    </span>
                    <span className="text-[10px] font-medium text-gray-500">{chat.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 truncate flex-1 leading-tight">{chat.last_message}</span>
                    {chat.unread > 0 && (
                      <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-2 shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CHAT WINDOW */}
      <div className="flex-1 flex flex-col relative z-0">
        
        {/* Chat Header */}
        {activeChat ? (
          <>
            <div className="px-6 py-4 bg-white/5 backdrop-blur-xl border-b border-white/10 flex justify-between items-center z-10 shadow-[0_5px_30px_rgba(0,0,0,0.3)]">
              <div className="flex items-center gap-4">
                <Avatar name={activeChat.name} size={44} className="border border-white/10 shadow-inner" />
                <div>
                  <div className="font-bold text-base text-white">{activeChat.name}</div>
                  <div className="text-xs font-medium text-gray-500 flex items-center gap-1.5 mt-0.5">
                    <Icon name={activeChat.source_icon} size={12} color={activeChat.source_color} />
                    {activeChat.source === "telegram" ? "Telegram" : activeChat.source === "whatsapp" ? "WhatsApp" : "Viber"}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                  <Icon name="paperclip" size={18} />
                </button>
                <button className="px-4 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                  <Icon name="x" size={16} /> Закрыть диалог
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6 relative">
              {/* Background gradient hint */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
              
              <div className="text-center my-4 sticky top-0 z-10">
                <span className="bg-black/60 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase text-gray-400">Сегодня</span>
              </div>

              <AnimatePresence>
                {messages.map(msg => {
                  const isManager = msg.sender === "manager";
                  return (
                    <motion.div 
                      key={msg.id}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={`flex ${isManager ? "justify-end" : "justify-start"} relative z-10`}
                    >
                      <div className={`flex gap-3 max-w-[70%] ${isManager ? "flex-row-reverse" : "flex-row"}`}>
                        {!isManager && <Avatar name={activeChat.name} size={32} className="border border-white/10 self-end mb-5" />}
                        <div className={`flex flex-col gap-1 ${isManager ? "items-end" : "items-start"}`}>
                          <div className={`
                            px-4 py-3 text-sm leading-relaxed whitespace-pre-line shadow-lg
                            ${isManager 
                              ? "bg-blue-500 text-white rounded-2xl rounded-br-sm shadow-[0_5px_20px_rgba(59,130,246,0.3)]" 
                              : "bg-white/10 border border-white/10 text-gray-200 rounded-2xl rounded-bl-sm backdrop-blur-md"}
                          `}>
                            {msg.text}
                          </div>
                          <div className="text-[10px] font-medium text-gray-500 flex items-center gap-1.5 px-1">
                            {msg.time}
                            {isManager && msg.is_seen && <Icon name="check-check" size={12} className="text-blue-400" />}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              <div ref={messagesEndRef} className="h-4" />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white/5 backdrop-blur-xl border-t border-white/10 z-10">
              <div className="bg-black/40 border border-white/10 rounded-2xl p-3 flex flex-col gap-3 focus-within:border-blue-500/50 transition-colors shadow-inner">
                <textarea 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Введите сообщение..." 
                  className="w-full min-h-[60px] max-h-[200px] bg-transparent border-none outline-none resize-none text-gray-200 text-sm placeholder:text-gray-600 custom-scrollbar"
                />
                <div className="flex justify-between items-center px-1">
                  <div className="flex gap-4">
                    <button className="text-gray-500 hover:text-blue-400 transition-colors"><Icon name="paperclip" size={18} /></button>
                    <button className="text-gray-500 hover:text-blue-400 transition-colors"><Icon name="smile" size={18} /></button>
                    <button className="text-gray-500 hover:text-blue-400 transition-colors"><Icon name="mic" size={18} /></button>
                  </div>
                  <button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className={`
                      px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all
                      ${newMessage.trim() 
                        ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:bg-blue-600 cursor-pointer' 
                        : 'bg-white/10 text-gray-500 cursor-not-allowed'}
                    `}>
                    <Icon name="send" size={16} /> 
                    <span>Відправити</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/5 blur-[80px] rounded-full pointer-events-none" />
            <Icon name="message-square" size={64} className="mb-6 opacity-20" />
            <p className="text-lg font-medium text-gray-400">Выберите чат для начала общения</p>
          </div>
        )}

      </div>

      {/* RIGHT SIDEBAR: CONTACT INFO */}
      <div className="w-[320px] bg-white/5 border-l border-white/10 backdrop-blur-md overflow-y-auto custom-scrollbar flex flex-col z-10 shadow-[-5px_0_30px_rgba(0,0,0,0.5)]">
        {activeChat ? (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col h-full">
            
            <div className="p-6 border-b border-white/10 flex flex-col items-center text-center">
              <Avatar name={activeChat.name} size={80} className="mb-4 border-2 border-white/10 shadow-xl" />
              <h3 className="m-0 mb-1 text-lg font-bold text-white">{activeChat.name}</h3>
              <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400 mb-6 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                <Icon name={activeChat.source_icon} size={12} color={activeChat.source_color} />
                {activeChat.source === "telegram" ? "Telegram" : activeChat.source === "whatsapp" ? "WhatsApp" : "Viber"}
              </div>

              <div className="w-full flex flex-col gap-4 text-left">
                <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Телефон</div>
                  <div className="text-sm font-medium text-gray-200">+48 123 456 789</div>
                </div>
                <div className="bg-black/20 p-4 rounded-xl border border-white/5 flex flex-col items-start">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email</div>
                  <button className="text-blue-400 text-sm font-semibold hover:text-blue-300 transition-colors flex items-center gap-1">
                    <Icon name="plus" size={14} /> Добавить email
                  </button>
                </div>
                
                <button className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white py-3 rounded-xl text-sm font-bold transition-colors mt-2 shadow-sm">
                  Сохранить покупателя
                </button>
              </div>
            </div>

            <div className="p-6 border-b border-white/10">
              <div className="flex justify-between items-center mb-4">
                <h4 className="m-0 text-sm font-bold text-gray-300 uppercase tracking-wider">Заметки</h4>
                <button className="text-blue-400 text-xs font-bold hover:text-blue-300 flex items-center gap-1">
                  <Icon name="plus" size={14} /> Добавить
                </button>
              </div>
              <div className="bg-black/20 border border-white/5 border-dashed rounded-xl p-4 text-center">
                <p className="m-0 text-xs text-gray-500 font-medium italic">Нет заметок</p>
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="m-0 text-sm font-bold text-gray-300 uppercase tracking-wider">Активные воронки</h4>
                <button className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-blue-400 hover:bg-blue-500/20 transition-colors">
                  <Icon name="plus" size={14} />
                </button>
              </div>
              
              {/* Active Funnel Card */}
              <SpotlightCard className="bg-black/40 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">В работе</span>
                  </div>
                  <Icon name="more-horizontal" size={16} className="text-gray-500 hover:text-gray-300 transition-colors" />
                </div>
                <div className="font-bold text-sm text-white mb-2">Чат з {activeChat.name}</div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                  <Icon name="clock" size={12} /> Сегодня 16:21
                </div>
                <div className="text-sm font-bold text-blue-400">
                  500,00 PLN
                </div>
              </SpotlightCard>
            </div>
            
          </motion.div>
        ) : (
          <div className="p-8 text-gray-500 text-sm font-medium text-center">Нет активного чата</div>
        )}
      </div>
    </div>
  );
}
