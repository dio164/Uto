import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Lock, Mail, AlertCircle, KeyRound, Sparkles, BookOpen } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onReturnToJournal: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onReturnToJournal,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    if (!isSupabaseConfigured) {
      // In demo mode without Supabase credentials
      sessionStorage.setItem('poetry_admin_session', 'demo_admin');
      setLoading(false);
      onLoginSuccess();
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else if (data.session) {
        onLoginSuccess();
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md paper-texture rounded-2xl p-6 sm:p-8 shadow-book border border-[#DE9EB0]/50 relative">
        {/* Ornate corner touches */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-[#FAF0F3] border border-[#DE9EB0]/60 mx-auto flex items-center justify-center mb-3 text-[#B77973] shadow-sm">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="font-blackletter text-3xl text-[#4D2531]">Curator's Desk</h2>
          <p className="font-poem italic text-base text-[#8B737C] mt-1">
            Access the poetry journal collection
          </p>
        </div>

        {/* Supabase status notice */}
        {!isSupabaseConfigured && (
          <div className="mb-5 p-3.5 rounded-lg bg-[#FAF0F3] border border-[#DE9EB0]/60 text-xs text-[#743F4D]">
            <div className="flex items-center space-x-2 font-medium mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#B77973]" />
              <span>Offline / Demo Mode Active</span>
            </div>
            <p className="text-[#8B737C] leading-relaxed">
              Supabase environment variables are not yet configured. You can sign in immediately in demo mode to preview adding and editing poems.
            </p>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider text-[#743F4D] mb-1.5 font-medium">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#C98598] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required={isSupabaseConfigured}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isSupabaseConfigured ? "curator@example.com" : "demo@poetry.com (optional)"}
                className="w-full pl-9 pr-3 py-2 text-sm bg-[#FAF0F3]/60 border border-[#DE9EB0]/60 rounded-lg text-[#392B30] placeholder-[#AF99A2] focus:outline-none focus:ring-2 focus:ring-[#C98598]/50 focus:border-[#C98598]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-sans uppercase tracking-wider text-[#743F4D] mb-1.5 font-medium">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#C98598] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required={isSupabaseConfigured}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isSupabaseConfigured ? "••••••••" : "Leave blank for demo access"}
                className="w-full pl-9 pr-3 py-2 text-sm bg-[#FAF0F3]/60 border border-[#DE9EB0]/60 rounded-lg text-[#392B30] placeholder-[#AF99A2] focus:outline-none focus:ring-2 focus:ring-[#C98598]/50 focus:border-[#C98598]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 rounded-lg bg-gradient-to-r from-[#8E4D60] to-[#743F4D] hover:from-[#743F4D] hover:to-[#4D2531] text-[#FFF9F2] font-poem text-lg tracking-wide shadow-md hover:shadow-lg transition-all active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? "Authenticating..." : isSupabaseConfigured ? "Sign In to Journal" : "Enter Curator Mode"}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#DE9EB0]/40 text-center">
          <button
            onClick={onReturnToJournal}
            className="inline-flex items-center space-x-1.5 text-xs text-[#8E4D60] hover:text-[#4D2531] font-sans tracking-wide transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Return to Poetry Journal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
