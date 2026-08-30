import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  Terminal,
  ShieldCheck,
  Sparkles,
  Trash2,
  ArrowUpRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';

export const ContactSection: React.FC = () => {
  const { submissions, addSubmission, clearSubmissions, playSound, addNotification } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [priority, setPriority] = useState<'Routine' | 'High' | 'Critical Protocol'>('Routine');
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const presets = [
    { label: 'Cluster Deployment', text: 'Requesting deployment specifications for 8,192 vNode enterprise spatial grid.' },
    { label: 'Security Audit', text: 'Inquiring regarding Post-Quantum Kyber-1024 verification whitepaper and benchmarks.' },
    { label: 'Custom Ring Buffer', text: 'Need custom lock-free memory bindings for low-latency financial trading UI.' },
  ];

  const validate = () => {
    const errs: { name?: string; email?: string; message?: string } = {};
    if (!name.trim()) errs.name = 'Protocol identifier (name) is required';
    if (!email.trim()) {
      errs.email = 'Transmission relay (email) is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please provide a valid relay email address';
    }
    if (!message.trim()) {
      errs.message = 'Payload message content cannot be empty';
    } else if (message.length < 10) {
      errs.message = 'Message must contain at least 10 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      playSound('error');
      return;
    }

    setIsSubmitting(true);
    playSound('switch');

    setTimeout(() => {
      addSubmission({
        name,
        email,
        organization: organization.trim() || 'Autonomous Entity',
        priority,
        message,
        systemFingerprint: `FP-${Math.floor(100 + Math.random() * 900)}-KRYO-NODE`,
      });

      setIsSubmitting(false);
      setSubmitSuccess(true);
      playSound('success');

      // Trigger celebratory confetti burst
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#06b6d4', '#38bdf8', '#3b82f6'],
        });
      } catch {
        // ignore
      }

      addNotification({
        title: 'Dispatch Protocol Transmitted',
        description: `Priority ${priority} message queued to local ledger. Reference: FP-${Math.floor(100 + Math.random() * 900)}.`,
        type: 'success',
        tag: 'DISPATCH',
      });

      // Clear form inputs
      setName('');
      setEmail('');
      setOrganization('');
      setMessage('');
      setErrors({});

      setTimeout(() => setSubmitSuccess(false), 4000);
    }, 600);
  };

  return (
    <section id="contact" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto select-none">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-800/40 mb-3">
          <Send className="w-3.5 h-3.5" />
          <span>INQUIRY & PROTOCOL DISPATCH</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
          Initialize System Communication
        </h2>
        <p className="text-sm sm:text-base text-zinc-400 mt-2 font-normal">
          Direct dispatch terminal for deployment requests, spatial engine licensing, or cryptographic integration inquiries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Form Console */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 sm:p-8 border border-zinc-800 shadow-2xl relative">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Quick Presets */}
            <div className="space-y-1.5 mb-4">
              <div className="text-[11px] font-mono text-zinc-400">QUICK QUERY PRESETS:</div>
              <div className="flex flex-wrap gap-2">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      playSound('click');
                      setMessage(p.text);
                    }}
                    className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-zinc-800/70 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/50 transition cursor-pointer"
                  >
                    + {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">
                  OPERATOR IDENTIFIER *
                </label>
                <input
                  id="contact-name-input"
                  type="text"
                  placeholder="e.g. Dr. Elena Vance"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: undefined });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-black/40 border text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none transition ${
                    errors.name
                      ? 'border-red-500/80 focus:border-red-500'
                      : 'border-zinc-800 focus:border-cyan-500/80'
                  }`}
                />
                {errors.name && (
                  <div className="flex items-center gap-1 text-[11px] font-mono text-red-400 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.name}</span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">
                  RELAY TRANSMISSION EMAIL *
                </label>
                <input
                  id="contact-email-input"
                  type="email"
                  placeholder="operator@entity.network"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-black/40 border text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none transition ${
                    errors.email
                      ? 'border-red-500/80 focus:border-red-500'
                      : 'border-zinc-800 focus:border-cyan-500/80'
                  }`}
                />
                {errors.email && (
                  <div className="flex items-center gap-1 text-[11px] font-mono text-red-400 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Organization */}
              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">
                  ORGANIZATION / ENTITY
                </label>
                <input
                  id="contact-org-input"
                  type="text"
                  placeholder="Autonomous Labs / Foundation"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-zinc-800 focus:border-cyan-500/80 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none transition"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">
                  PRIORITY PROTOCOL
                </label>
                <select
                  id="contact-priority-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-zinc-800 focus:border-cyan-500/80 text-sm text-zinc-200 focus:outline-none transition font-mono cursor-pointer"
                >
                  <option value="Routine" className="bg-zinc-900 text-white">Routine (Standard Sync)</option>
                  <option value="High" className="bg-zinc-900 text-white">High (Priority Queue)</option>
                  <option value="Critical Protocol" className="bg-zinc-900 text-white">Critical Protocol (Zero-Delay)</option>
                </select>
              </div>
            </div>

            {/* Message Payload */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-mono text-zinc-300">
                  PAYLOAD SPECIFICATIONS *
                </label>
                <span className="text-[10px] font-mono text-zinc-500">{message.length} chars</span>
              </div>
              <textarea
                id="contact-message-input"
                rows={4}
                placeholder="Detail your deployment scale, hardware constraints, or architectural objectives..."
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (errors.message) setErrors({ ...errors, message: undefined });
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl bg-black/40 border text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none transition resize-none ${
                  errors.message
                    ? 'border-red-500/80 focus:border-red-500'
                    : 'border-zinc-800 focus:border-cyan-500/80'
                }`}
              />
              {errors.message && (
                <div className="flex items-center gap-1 text-[11px] font-mono text-red-400 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.message}</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                id="contact-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold font-mono text-sm tracking-tight flex items-center justify-center gap-2 transition active:scale-[0.99] shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
              >
                <Send className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : ''}`} />
                <span>{isSubmitting ? 'ENCRYPTING & DISPATCHING...' : 'DISPATCH PROTOCOL INQUIRY'}</span>
              </button>
            </div>

            {/* Success State Alert */}
            <AnimatePresence>
              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>
                    DISPATCH TRANSMITTED: Persisted to local ledger with hardware cryptographic signature.
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* Right Column: Local Ledger / Submission History */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="glass-panel rounded-2xl p-6 border border-zinc-800 shadow-xl flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span>LOCAL DISPATCH LEDGER</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-zinc-400">
                    {submissions.length} STORED
                  </span>
                  {submissions.length > 0 && (
                    <button
                      onClick={clearSubmissions}
                      className="p-1 rounded text-zinc-500 hover:text-red-400 transition cursor-pointer"
                      title="Clear Ledger History"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Submissions List */}
              <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                {submissions.length === 0 ? (
                  <div className="text-center py-12 text-xs font-mono text-zinc-500">
                    NO ACTIVE DISPATCHES RECORDED IN LOCAL CACHE
                  </div>
                ) : (
                  submissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-3 rounded-xl bg-black/40 border border-zinc-800/80 text-xs font-mono space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{sub.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                          sub.priority === 'Critical Protocol'
                            ? 'bg-red-950 text-red-300 border border-red-800/40'
                            : sub.priority === 'High'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800/40'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {sub.priority}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-400 font-sans line-clamp-2">
                        {sub.message}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-zinc-900">
                        <span>{sub.organization}</span>
                        <span>{sub.timestamp}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-zinc-800/80 text-[11px] font-mono text-zinc-500 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>LOCAL CACHE PERSISTED</span>
              </span>
              <span>AES-256 STATE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
