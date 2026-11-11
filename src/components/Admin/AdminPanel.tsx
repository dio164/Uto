import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Poem, PoemFormData } from '../../types/poem';
import { AdminLogin } from './AdminLogin';
import { PoemList } from './PoemList';
import { PoemEditor } from './PoemEditor';
import { JessicaManager } from './JessicaManager';
import { UniverseManager } from './UniverseManager';
import { useJessicaContent } from '../../hooks/useJessicaContent';
import { BookOpen, LogOut, Sparkles, Feather, Flower2 } from 'lucide-react';

interface AdminPanelProps {
  poems: Poem[];
  onReturnToJournal: () => void;
  onNavigateToJessica?: () => void;
  onAddPoem: (data: PoemFormData) => Promise<{ success: boolean; error?: string }>;
  onUpdatePoem: (id: string, data: Partial<PoemFormData>) => Promise<{ success: boolean; error?: string }>;
  onDeletePoem: (id: string) => Promise<{ success: boolean; error?: string }>;
  onReorderPoems: (reordered: Poem[]) => Promise<{ success: boolean }>;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  poems,
  onReturnToJournal,
  onNavigateToJessica,
  onAddPoem,
  onUpdatePoem,
  onDeletePoem,
  onReorderPoems,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [editingPoem, setEditingPoem] = useState<Poem | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);
  const [adminTab, setAdminTab] = useState<'poems' | 'jessica' | 'universe'>('poems');

  // Jessica dynamic content hooks
  const jessicaContent = useJessicaContent();

  // Check auth status on mount
  useEffect(() => {
    const checkUser = async () => {
      if (!isSupabaseConfigured) {
        const demoSession = sessionStorage.getItem('poetry_admin_session');
        setIsAuthenticated(Boolean(demoSession));
        setCheckingAuth(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(Boolean(session));
      } catch (err) {
        console.error('Session check error:', err);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkUser();

    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setIsAuthenticated(Boolean(session));
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  const handleSignOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    } else {
      sessionStorage.removeItem('poetry_admin_session');
    }
    setIsAuthenticated(false);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <Feather className="w-8 h-8 text-[#C98598] animate-bounce mb-3" />
        <p className="font-poem italic text-xl text-[#743F4D]">Opening the curator's archives...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLoginSuccess={() => setIsAuthenticated(true)}
        onReturnToJournal={onReturnToJournal}
      />
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      {/* Admin Top Navigation Bar */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-[#DE9EB0]/40 gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-[#FAF0F3] border border-[#DE9EB0]/60 flex items-center justify-center text-[#B77973] shadow-sm">
            <Feather className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-blackletter text-2xl sm:text-3xl text-[#4D2531]">
              Curator's Sanctuary
            </h1>
            <span className="text-[11px] font-sans tracking-widest text-[#8E4D60] uppercase flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-[#B77973]" />
              <span>{isSupabaseConfigured ? 'Supabase Connected' : 'Demo Workspace'}</span>
            </span>
          </div>
        </div>

        {/* Section Navigation Tabs: Poetry Journal vs For Jessica */}
        <div className="flex items-center space-x-2 bg-[#FAF0F3] p-1 rounded-xl border border-[#DE9EB0]/50 shadow-xs self-start md:self-auto">
          <button
            onClick={() => setAdminTab('poems')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-sans tracking-wide transition-all ${
              adminTab === 'poems'
                ? 'bg-[#8E4D60] text-[#FFF9F2] shadow-xs font-medium'
                : 'text-[#743F4D] hover:bg-[#F8E4EA]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Poetry Journal</span>
          </button>

          <button
            onClick={() => setAdminTab('jessica')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-sans tracking-wide transition-all ${
              adminTab === 'jessica'
                ? 'bg-[#8E4D60] text-[#FFF9F2] shadow-xs font-medium'
                : 'text-[#743F4D] hover:bg-[#F8E4EA]'
            }`}
          >
            <Flower2 className="w-3.5 h-3.5" />
            <span>For Uto</span>
          </button>

          <button
            onClick={() => setAdminTab('universe')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-sans tracking-wide transition-all ${
              adminTab === 'universe'
                ? 'bg-[#8E4D60] text-[#FFF9F2] shadow-xs font-medium'
                : 'text-[#743F4D] hover:bg-[#F8E4EA]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Universe Studio</span>
          </button>
        </div>

        {/* Right action buttons */}
        <div className="flex items-center space-x-3 self-end md:self-auto">
          <button
            onClick={onReturnToJournal}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg paper-texture border border-[#DE9EB0]/60 text-[#743F4D] hover:text-[#4D2531] text-xs font-sans tracking-wide shadow-sm hover:shadow transition-all"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>View Journal</span>
          </button>

          <button
            onClick={handleSignOut}
            title="Sign out of curator mode"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-sans text-red-700/80 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        {adminTab === 'universe' ? (
          /* PLANET UTO UNIVERSE STUDIO */
          <UniverseManager />
        ) : adminTab === 'jessica' ? (
          /* JESSICA EXPERIENCE MANAGER */
          <JessicaManager
            timeline={jessicaContent.timeline}
            appreciations={jessicaContent.appreciations}
            onAddTimeline={jessicaContent.addTimelineEntry}
            onUpdateTimeline={jessicaContent.updateTimelineEntry}
            onDeleteTimeline={jessicaContent.deleteTimelineEntry}
            onAddAppreciation={jessicaContent.addAppreciationItem}
            onUpdateAppreciation={jessicaContent.updateAppreciationItem}
            onDeleteAppreciation={jessicaContent.deleteAppreciationItem}
            onResetDefaults={jessicaContent.resetToDefaults}
            isDbSynced={jessicaContent.isDbSynced}
            syncStatus={jessicaContent.syncStatus}
            dbError={jessicaContent.dbError}
            onViewJessicaPage={() => {
              if (onNavigateToJessica) onNavigateToJessica();
              else window.location.href = '/uto';
            }}
          />
        ) : (
          /* POETRY JOURNAL MANAGER (ORIGINAL) */
          isCreatingNew || editingPoem ? (
            <PoemEditor
              poem={editingPoem}
              defaultOrderIndex={poems.length}
              onSave={async (formData) => {
                let res;
                if (editingPoem) {
                  res = await onUpdatePoem(editingPoem.id, formData);
                } else {
                  res = await onAddPoem(formData);
                }
                if (res.success) {
                  setEditingPoem(null);
                  setIsCreatingNew(false);
                }
                return res;
              }}
              onCancel={() => {
                setEditingPoem(null);
                setIsCreatingNew(false);
              }}
            />
          ) : (
            <PoemList
              poems={poems}
              onNewPoem={() => setIsCreatingNew(true)}
              onEditPoem={(poem) => setEditingPoem(poem)}
              onDeletePoem={onDeletePoem}
              onReorder={onReorderPoems}
            />
          )
        )}
      </div>
    </div>
  );
};
