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
        className="bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col space-y-4 transform animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3.5">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 tracking-tight flex items-center space-x-1.5">
                <span>Share Feedback</span>
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              </h3>
              <p className="text-[11px] text-slate-400">Help us improve GestureFlow!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted ? (
          /* Submission Success Card */
          <div className="py-6 text-center space-y-3 animate-in zoom-in-95 duration-300">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-100">Thank You for Your Feedback!</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Your thoughts help make GestureFlow faster, smoother, and more intuitive for everyone.
            </p>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Star Rating */}
            <div className="space-y-1.5 text-center">
              <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                HOW WAS YOUR EXPERIENCE?
              </label>
              <div className="flex items-center justify-center space-x-2 pt-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        star <= rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-700 hover:text-slate-500'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Category Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                CATEGORY
              </label>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      category === cat.id
                        ? 'bg-blue-600 text-white font-medium'
                        : 'bg-slate-950 text-slate-400 border border-slate-800/80 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback Message */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                YOUR FEEDBACK / SUGGESTION
              </label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us what you liked, or what we can improve..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Required Email */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>YOUR EMAIL (REQUIRED)</span>
                <span className="text-[10px] text-slate-400 font-normal">A copy will be sent to your inbox</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!comment.trim() || !email.trim() || !email.includes('@') || isSending}
              className="w-full py-2.5 sm:py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-xs transition flex items-center justify-center space-x-2"
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
