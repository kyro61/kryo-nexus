import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  X,
  CheckCheck,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Info,
  Radio,
  Plus,
  Shield,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NotificationItem } from '../types';

export const NotificationCenter: React.FC = () => {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications,
    simulateAlert,
    playSound,
  } = useApp();

  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');

  if (!isNotificationsOpen) return null;

  const filteredList = filter === 'UNREAD' ? notifications.filter((n) => !n.read) : notifications;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'alert':
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
      case 'telemetry':
        return <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />;
      default:
        return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex justify-end select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            playSound('click');
            setIsNotificationsOpen(false);
          }}
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Drawer Window */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md h-full bg-[#090c14] border-l border-zinc-800 shadow-2xl z-10 flex flex-col text-zinc-100"
        >
          {/* Header */}
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold font-display text-white">Event Log Center</h3>
                <p className="text-xs text-zinc-400 font-mono">REAL-TIME SYSTEM DISPATCHES</p>
              </div>
            </div>

            <button
              onClick={() => {
                playSound('click');
                setIsNotificationsOpen(false);
              }}
              className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer border border-zinc-700/50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action Toolbar */}
          <div className="px-5 py-3 border-b border-zinc-800/80 flex items-center justify-between text-xs font-mono bg-black/20">
            <div className="flex gap-1">
              <button
                onClick={() => {
                  playSound('hover');
                  setFilter('ALL');
                }}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                  filter === 'ALL' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                ALL ({notifications.length})
              </button>
              <button
                onClick={() => {
                  playSound('hover');
                  setFilter('UNREAD');
                }}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                  filter === 'UNREAD' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                UNREAD ({notifications.filter((n) => !n.read).length})
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={markAllNotificationsAsRead}
                className="p-1.5 text-zinc-400 hover:text-cyan-300 transition cursor-pointer"
                title="Mark all as read"
              >
                <CheckCheck className="w-4 h-4" />
              </button>
              <button
                onClick={clearAllNotifications}
                className="p-1.5 text-zinc-400 hover:text-red-400 transition cursor-pointer"
                title="Clear all events"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications Scroll List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredList.length === 0 ? (
              <div className="py-24 text-center text-xs font-mono text-zinc-500 space-y-3">
                <Bell className="w-8 h-8 text-zinc-700 mx-auto" />
                <div>NO EVENTS IN ACTIVE QUEUE</div>
              </div>
            ) : (
              filteredList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (!item.read) markNotificationAsRead(item.id);
                  }}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex gap-3 ${
                    item.read
                      ? 'bg-black/20 border-zinc-800/60 opacity-75'
                      : 'bg-cyan-950/20 border-cyan-500/40 shadow-sm'
                  }`}
                >
                  <div className="pt-0.5 flex-shrink-0">{getIcon(item.type)}</div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-display text-white">{item.title}</span>
                      <span className="text-[10px] font-mono text-zinc-400">{item.timestamp}</span>
                    </div>
                    <p className="text-xs text-zinc-300 font-sans leading-relaxed">{item.description}</p>
                    {item.tag && (
                      <span className="inline-block text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-cyan-300">
                        {item.tag}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Inject Simulation CTA */}
          <div className="p-4 border-t border-zinc-800 bg-black/40">
            <button
              onClick={() => {
                simulateAlert();
              }}
              className="w-full py-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-cyan-300 hover:text-cyan-200 border border-zinc-700/60 font-mono text-xs flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>SIMULATE REAL-TIME NETWORK EVENT</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
