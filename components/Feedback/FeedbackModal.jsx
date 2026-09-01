'use client';

import React, { useState } from 'react';
import { MessageSquare, Star, Send, X, CheckCircle2, Heart, Sparkles, Loader2 } from 'lucide-react';

const CATEGORIES = [
  { id: 'accuracy', label: '🖐️ Gesture Accuracy' },
  { id: 'performance', label: '⚡ Speed & Performance' },
  { id: 'ui', label: '🎨 Design & Usability' },
  { id: 'feature', label: '💡 Feature Request' },
  { id: 'bug', label: '🐛 Bug Report' },
];

export default function FeedbackModal({ isOpen, onClose }) {
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState('accuracy');
  const [comment, setComment] = useState('');
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !email.trim() || !email.includes('@') || isSending) return;

    setIsSending(true);

    const feedbackPayload = {
      _subject: `New GestureFlow Feedback (${rating}/5 Stars)`,
      _replyto: email.trim(),
      _autoresponse: `Thank you for sharing your feedback with GestureFlow! We have received your submission (${rating}/5 Stars) and will review your thoughts. A copy of your submission is included below.`,
      rating: `${rating} / 5 Stars`,
      category: category,
      comment: comment.trim(),
      user_email: email.trim(),
      timestamp: new Date().toLocaleString(),
    };

    try {
      // Send real-time email directly to bjbhatt@duck.com + copy to sender
      await fetch('https://formsubmit.co/ajax/bjbhatt@duck.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(feedbackPayload),
      });

      // Save local backup copy in localStorage
      const existing = JSON.parse(localStorage.getItem('gestureflow_feedback') || '[]');
      existing.unshift({ id: Date.now(), ...feedbackPayload });
      localStorage.setItem('gestureflow_feedback', JSON.stringify(existing));
    } catch (err) {
      console.warn('[Feedback] Email endpoint fallback:', err);
    } finally {
      setIsSending(false);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setComment('');
        setEmail('');
        onClose();
      }, 2500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-slate-900/95 border-2 border-cyan-500/40 p-5 sm:p-8 rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col space-y-4 sm:space-y-5 transform animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-100 tracking-tight flex items-center space-x-2">
                <span>Share Feedback</span>
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </h3>
              <p className="text-xs text-slate-400">Help us improve GestureFlow!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          /* Submission Success Card */
          <div className="py-8 text-center space-y-3 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto shadow-xl shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <h4 className="text-lg font-bold text-slate-100">Thank You for Your Feedback!</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Your thoughts help make GestureFlow faster, smoother, and more intuitive for everyone.
            </p>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Star Rating */}
            <div className="space-y-1.5 text-center">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                HOW WAS YOUR EXPERIENCE?
              </label>
              <div className="flex items-center justify-center space-x-2 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-7 h-7 transition-colors ${
                        star <= rating
                          ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                          : 'text-slate-700 hover:text-slate-500'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Category Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                CATEGORY
              </label>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      category === cat.id
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20 scale-105'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback Message */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                YOUR FEEDBACK / SUGGESTION
              </label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us what you liked, or what we can improve..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-2xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Required Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>YOUR EMAIL (REQUIRED)</span>
                <span className="text-[10px] text-cyan-400 font-normal">A copy will be sent to your inbox</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!comment.trim() || !email.trim() || !email.includes('@') || isSending}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center space-x-2"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending Feedback...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Feedback</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
