import React, { useState } from 'react';
import { useUniverseData } from '../../hooks/useUniverseData';
import {
  RecordingItem,
  LetterItem,
  ImportantDateItem,
  GardenFlowerItem,
  CinemaMediaItem,
  LittleThingItem,
  FutureMuseumItem,
} from '../../types/universeData';
import {
  Sparkles,
  Radio,
  Mail,
  Calendar,
  Flower2,
  Film,
  Bookmark,
  Compass,
  Plus,
  Trash2,
  Edit3,
  Copy,
  Check,
  Lock,
  Eye,
  Database,
  Music,
} from 'lucide-react';

export const UniverseManager: React.FC = () => {
  const {
    recordings,
    letters,
    dates,
    flowers,
    cinema,
    littleThings,
    futureMuseum,
    saveRecording,
    deleteRecording,
    saveLetter,
    deleteLetter,
    saveDate,
    deleteDate,
    saveFlower,
    deleteFlower,
    saveCinemaItem,
    deleteCinemaItem,
    saveLittleThing,
    deleteLittleThing,
    saveFutureMuseumItem,
    deleteFutureMuseumItem,
  } = useUniverseData();

  type SubTab = 'recordings' | 'letters' | 'dates' | 'flowers' | 'cinema' | 'littleThings' | 'futureMuseum';
  const [activeTab, setActiveTab] = useState<SubTab>('recordings');
  const [copiedSql, setCopiedSql] = useState(false);
  const [showSqlModal, setShowSqlModal] = useState(false);

  const [editingRecording, setEditingRecording] = useState<Partial<RecordingItem> | null>(null);
  const [editingLetter, setEditingLetter] = useState<Partial<LetterItem> | null>(null);
  const [editingDate, setEditingDate] = useState<Partial<ImportantDateItem> | null>(null);
  const [editingFlower, setEditingFlower] = useState<Partial<GardenFlowerItem> | null>(null);
  const [editingCinema, setEditingCinema] = useState<Partial<CinemaMediaItem> | null>(null);
  const [editingLittleThing, setEditingLittleThing] = useState<Partial<LittleThingItem> | null>(null);
  const [editingFutureMuseum, setEditingFutureMuseum] = useState<Partial<FutureMuseumItem> | null>(null);

  const UNIVERSE_SQL = `-- Planet Uto Universe Schema – paste in Supabase SQL Editor
CREATE TABLE IF NOT EXISTS public.universe_recordings (id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, title TEXT NOT NULL, description TEXT, audio_url TEXT NOT NULL, artwork_url TEXT, category TEXT NOT NULL DEFAULT 'Little Voicenotes', duration TEXT, date_recorded TEXT, is_published BOOLEAN DEFAULT true, order_index INTEGER DEFAULT 0, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.universe_letters (id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, title TEXT NOT NULL, content TEXT NOT NULL, category TEXT NOT NULL DEFAULT 'Open When You Miss Me', cover_artwork TEXT, unlock_date TIMESTAMPTZ, is_locked BOOLEAN DEFAULT false, is_published BOOLEAN DEFAULT true, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.universe_dates (id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, title TEXT NOT NULL, target_date TIMESTAMPTZ NOT NULL, category TEXT NOT NULL DEFAULT 'Milestone', description TEXT, country_connection TEXT, is_highlighted BOOLEAN DEFAULT false, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.universe_flowers (id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, flower_name TEXT NOT NULL, flower_type TEXT NOT NULL DEFAULT 'Vintage Rose', milestone_title TEXT NOT NULL, story TEXT NOT NULL, bloom_date TEXT NOT NULL, color TEXT DEFAULT '#F472B6', artwork_url TEXT, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.universe_cinema (id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, title TEXT NOT NULL, caption TEXT, media_type TEXT NOT NULL DEFAULT 'photo', media_url TEXT NOT NULL, thumbnail_url TEXT, event_date TEXT, recap_month TEXT, recap_year TEXT, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.universe_little_things (id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, title TEXT NOT NULL, quote_or_memory TEXT NOT NULL, context TEXT, category TEXT DEFAULT 'Funny Things She Said', date_noted TEXT, image_url TEXT, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.universe_future_museum (id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, title TEXT NOT NULL, category TEXT NOT NULL DEFAULT 'Adventures', status TEXT NOT NULL DEFAULT 'someday', target_location TEXT, notes TEXT, reflection TEXT, photo_url TEXT, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
ALTER TABLE public.universe_recordings ENABLE ROW LEVEL SECURITY; ALTER TABLE public.universe_letters ENABLE ROW LEVEL SECURITY; ALTER TABLE public.universe_dates ENABLE ROW LEVEL SECURITY; ALTER TABLE public.universe_flowers ENABLE ROW LEVEL SECURITY; ALTER TABLE public.universe_cinema ENABLE ROW LEVEL SECURITY; ALTER TABLE public.universe_little_things ENABLE ROW LEVEL SECURITY; ALTER TABLE public.universe_future_museum ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.universe_recordings TO anon, authenticated; GRANT ALL ON public.universe_letters TO anon, authenticated; GRANT ALL ON public.universe_dates TO anon, authenticated; GRANT ALL ON public.universe_flowers TO anon, authenticated; GRANT ALL ON public.universe_cinema TO anon, authenticated; GRANT ALL ON public.universe_little_things TO anon, authenticated; GRANT ALL ON public.universe_future_museum TO anon, authenticated;
CREATE POLICY "Public read recordings" ON public.universe_recordings FOR SELECT TO anon, authenticated USING (true); CREATE POLICY "Public write recordings" ON public.universe_recordings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public read letters" ON public.universe_letters FOR SELECT TO anon, authenticated USING (true); CREATE POLICY "Public write letters" ON public.universe_letters FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public read dates" ON public.universe_dates FOR SELECT TO anon, authenticated USING (true); CREATE POLICY "Public write dates" ON public.universe_dates FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public read flowers" ON public.universe_flowers FOR SELECT TO anon, authenticated USING (true); CREATE POLICY "Public write flowers" ON public.universe_flowers FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public read cinema" ON public.universe_cinema FOR SELECT TO anon, authenticated USING (true); CREATE POLICY "Public write cinema" ON public.universe_cinema FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public read little_things" ON public.universe_little_things FOR SELECT TO anon, authenticated USING (true); CREATE POLICY "Public write little_things" ON public.universe_little_things FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public read future_museum" ON public.universe_future_museum FOR SELECT TO anon, authenticated USING (true); CREATE POLICY "Public write future_museum" ON public.universe_future_museum FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(UNIVERSE_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const TABS = [
    { id: 'recordings', label: 'Audio Room', icon: Radio, count: recordings.length },
    { id: 'letters', label: 'Post Office', icon: Mail, count: letters.length },
    { id: 'dates', label: 'Observatory', icon: Calendar, count: dates.length },
    { id: 'flowers', label: 'Garden', icon: Flower2, count: flowers.length },
    { id: 'cinema', label: 'Cinema', icon: Film, count: cinema.length },
    { id: 'littleThings', label: 'Little Things', icon: Bookmark, count: littleThings.length },
    { id: 'futureMuseum', label: 'Future Museum', icon: Compass, count: futureMuseum.length },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 rounded-2xl bg-white/70 border border-[#F8D7E3]/60 backdrop-blur-sm shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAD4E0]/60 border border-[#D4607A]/30 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#D4607A]" />
          </div>
          <div>
            <h3 className="font-serif font-medium text-[#4D2531] text-sm">Planet Uto — Universe Studio</h3>
            <p className="text-xs text-[#8E4D60]">Manage recordings, letters, garden memories, cinema reels, and the future museum.</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSqlModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs bg-purple-100/60 text-purple-700 hover:bg-purple-100 border border-purple-200/60 transition-colors"
          >
            <Database className="w-3.5 h-3.5" />
            <span>DB Setup SQL</span>
          </button>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs bg-[#D4607A] text-white hover:bg-[#C0566E] transition-colors shadow-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Universe</span>
          </a>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex flex-wrap gap-1.5 p-1.5 bg-white/60 border border-[#F8D7E3]/60 rounded-2xl backdrop-blur-sm">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SubTab)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                isActive ? 'bg-[#4D2531] text-white shadow-xs' : 'text-[#4D2531]/70 hover:text-[#4D2531] hover:bg-[#FAD4E0]/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-[#FAD4E0]/50 text-[#4D2531]/70'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── RECORDINGS ── */}
      {activeTab === 'recordings' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-serif text-base text-[#4D2531]">The Listening Room — Voicenotes & Songs</h4>
              <p className="text-xs text-[#8E4D60]">Recordings made specifically for Jessica with custom categories and playback.</p>
            </div>
            <button
              onClick={() => setEditingRecording({ id: `rec_${Date.now()}`, title: '', description: '', audio_url: '', category: 'Little Voicenotes', duration: '', date_recorded: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), is_published: true })}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#D4607A] text-white text-xs font-medium hover:bg-[#C0566E] shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /><span>Add Recording</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recordings.map((rec) => (
              <div key={rec.id} className="p-4 rounded-2xl bg-white/80 border border-[#F8D7E3]/60 hover:border-[#D4607A]/40 transition-all shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FAD4E0]/70 border border-[#D4607A]/30 flex items-center justify-center">
                      <Music className="w-5 h-5 text-[#D4607A]" />
                    </div>
                    <div>
                      <h5 className="font-medium text-[#4D2531] text-sm leading-snug">{rec.title}</h5>
                      <span className="text-[11px] text-[#D4607A] font-medium px-2 py-0.5 rounded-full bg-[#FAD4E0]/50 inline-block mt-0.5">{rec.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button onClick={() => setEditingRecording(rec)} className="p-1.5 rounded-lg text-[#4D2531]/60 hover:text-[#4D2531] hover:bg-[#FAD4E0]/60" title="Edit"><Edit3 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => deleteRecording(rec.id)} className="p-1.5 rounded-lg text-red-500/70 hover:text-red-600 hover:bg-red-50" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                {rec.description && <p className="text-xs text-[#4D2531]/80 italic font-serif line-clamp-2">"{rec.description}"</p>}
                {rec.audio_url && (
                  <audio controls className="w-full h-8" src={rec.audio_url} preload="none">Your browser does not support audio.</audio>
                )}
                <div className="flex items-center justify-between text-[11px] text-[#4D2531]/50 pt-1 border-t border-[#F8D7E3]/40">
                  <span>{rec.date_recorded || 'Recently added'}</span>
                  <span>{rec.duration || '—'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── LETTERS ── */}
      {activeTab === 'letters' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-serif text-base text-[#4D2531]">The Post Office — Open-When Letters</h4>
              <p className="text-xs text-[#8E4D60]">Wax-sealed notes, date-locked envelopes, and open-when surprises for Jessica.</p>
            </div>
            <button
              onClick={() => setEditingLetter({ id: `letter_${Date.now()}`, title: '', content: '', category: 'Open When You Miss Me', is_locked: false, is_published: true })}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#D4607A] text-white text-xs font-medium hover:bg-[#C0566E] shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /><span>Write Letter</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {letters.map((letter) => (
              <div key={letter.id} className="p-4 rounded-2xl bg-white/80 border border-[#F8D7E3]/60 hover:border-[#D4607A]/40 transition-all shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FAD4E0]/60 border border-[#D4607A]/30 flex items-center justify-center">
                      {letter.is_locked ? <Lock className="w-5 h-5 text-amber-600" /> : <Mail className="w-5 h-5 text-[#D4607A]" />}
                    </div>
                    <div>
                      <h5 className="font-medium text-[#4D2531] text-sm">{letter.title}</h5>
                      <span className="text-[11px] text-[#D4607A] font-medium px-2 py-0.5 rounded-full bg-[#FAD4E0]/50 inline-block mt-0.5">{letter.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button onClick={() => setEditingLetter(letter)} className="p-1.5 rounded-lg text-[#4D2531]/60 hover:text-[#4D2531] hover:bg-[#FAD4E0]/60" title="Edit"><Edit3 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => deleteLetter(letter.id)} className="p-1.5 rounded-lg text-red-500/70 hover:text-red-600 hover:bg-red-50" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <p className="text-xs text-[#4D2531]/80 font-serif line-clamp-3 bg-[#FAD4E0]/20 p-2.5 rounded-xl border border-[#F8D7E3]/40">{letter.content}</p>
                <div className="flex items-center justify-between text-[11px] text-[#4D2531]/60 pt-1">
                  <span>{letter.unlock_date ? `Unlocks ${new Date(letter.unlock_date).toLocaleDateString()}` : 'Available anytime'}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${letter.is_locked ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>{letter.is_locked ? 'Locked' : 'Open'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── DATES ── */}
      {activeTab === 'dates' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-serif text-base text-[#4D2531]">The Observatory — Countdowns & Milestones</h4>
              <p className="text-xs text-[#8E4D60]">Graduation, anniversaries, reunions, and important constellations.</p>
            </div>
            <button
              onClick={() => setEditingDate({ id: `date_${Date.now()}`, title: '', target_date: new Date(Date.now() + 86400000 * 30).toISOString(), category: 'Milestone', country_connection: 'Nigeria ↔ Romania', is_highlighted: false })}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#D4607A] text-white text-xs font-medium hover:bg-[#C0566E] shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /><span>Add Milestone</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dates.map((dateItem) => (
              <div key={dateItem.id} className="p-4 rounded-2xl bg-white/80 border border-[#F8D7E3]/60 hover:border-[#D4607A]/40 transition-all shadow-xs space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h5 className="font-medium text-[#4D2531] text-sm">{dateItem.title}</h5>
                    <span className="text-[11px] text-[#D4607A] font-medium">{new Date(dateItem.target_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button onClick={() => setEditingDate(dateItem)} className="p-1.5 rounded-lg text-[#4D2531]/60 hover:text-[#4D2531] hover:bg-[#FAD4E0]/60" title="Edit"><Edit3 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => deleteDate(dateItem.id)} className="p-1.5 rounded-lg text-red-500/70 hover:text-red-600 hover:bg-red-50" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                {dateItem.description && <p className="text-xs text-[#4D2531]/70 font-serif italic">{dateItem.description}</p>}
                <div className="flex items-center justify-between text-[11px] text-[#4D2531]/60 pt-1 border-t border-[#F8D7E3]/40">
                  <span>{dateItem.country_connection || 'Lagos ↔ Bucharest'}</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#FAD4E0]/60 text-[#4D2531] text-[10px]">{dateItem.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── FLOWERS ── */}
      {activeTab === 'flowers' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-serif text-base text-[#4D2531]">The Enchanted Garden — Blooming Memories</h4>
              <p className="text-xs text-[#8E4D60]">Every flower represents an unforgettable milestone in your love story.</p>
            </div>
            <button
              onClick={() => setEditingFlower({ id: `flw_${Date.now()}`, flower_name: 'Blush Rose', flower_type: 'Vintage Rose', milestone_title: '', story: '', bloom_date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), color: '#F472B6' })}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#D4607A] text-white text-xs font-medium hover:bg-[#C0566E] shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /><span>Plant Flower</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {flowers.map((flw) => (
              <div key={flw.id} className="p-4 rounded-2xl bg-white/80 border border-[#F8D7E3]/60 hover:border-[#D4607A]/40 transition-all shadow-xs space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-xs" style={{ backgroundColor: flw.color || '#F472B6' }}>🌸</div>
                    <div>
                      <h5 className="font-medium text-[#4D2531] text-sm">{flw.milestone_title}</h5>
                      <span className="text-[11px] text-[#D4607A]">{flw.flower_name} · {flw.bloom_date}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button onClick={() => setEditingFlower(flw)} className="p-1.5 rounded-lg text-[#4D2531]/60 hover:text-[#4D2531] hover:bg-[#FAD4E0]/60" title="Edit"><Edit3 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => deleteFlower(flw.id)} className="p-1.5 rounded-lg text-red-500/70 hover:text-red-600 hover:bg-red-50" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <p className="text-xs text-[#4D2531]/80 font-serif italic line-clamp-3 bg-[#FAD4E0]/20 p-2.5 rounded-xl">{flw.story}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CINEMA ── */}
      {activeTab === 'cinema' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-serif text-base text-[#4D2531]">Our Little Cinema — Videos & Photo Stills</h4>
              <p className="text-xs text-[#8E4D60]">Cinema reels, video clips, and photo memories for your private theater.</p>
            </div>
            <button
              onClick={() => setEditingCinema({ id: `cin_${Date.now()}`, title: '', caption: '', media_type: 'photo', media_url: '', recap_year: new Date().getFullYear().toString() })}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#D4607A] text-white text-xs font-medium hover:bg-[#C0566E] shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /><span>Add Reel</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cinema.map((item) => (
              <div key={item.id} className="p-4 rounded-2xl bg-white/80 border border-[#F8D7E3]/60 hover:border-[#D4607A]/40 transition-all shadow-xs space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h5 className="font-medium text-[#4D2531] text-sm">{item.title}</h5>
                    <span className="text-[11px] text-[#D4607A]">{item.recap_month ? `${item.recap_month} ` : ''}{item.recap_year} · {item.media_type.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button onClick={() => setEditingCinema(item)} className="p-1.5 rounded-lg text-[#4D2531]/60 hover:text-[#4D2531] hover:bg-[#FAD4E0]/60" title="Edit"><Edit3 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => deleteCinemaItem(item.id)} className="p-1.5 rounded-lg text-red-500/70 hover:text-red-600 hover:bg-red-50" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                {item.caption && <p className="text-xs text-[#4D2531]/80 font-serif italic">{item.caption}</p>}
                {item.media_url && <p className="text-[11px] text-[#4D2531]/40 truncate">URL: {item.media_url}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── LITTLE THINGS ── */}
      {activeTab === 'littleThings' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-serif text-base text-[#4D2531]">The Little Things Archive — Quotes & Quirks</h4>
              <p className="text-xs text-[#8E4D60]">Small phrases, inside jokes, and the moments that make Jessica who she is.</p>
            </div>
            <button
              onClick={() => setEditingLittleThing({ id: `lt_${Date.now()}`, title: '', quote_or_memory: '', context: '', category: 'Funny Things She Said', date_noted: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) })}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#D4607A] text-white text-xs font-medium hover:bg-[#C0566E] shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /><span>Add Memory</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {littleThings.map((lt) => (
              <div key={lt.id} className="p-4 rounded-2xl bg-white/80 border border-[#F8D7E3]/60 hover:border-[#D4607A]/40 transition-all shadow-xs space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h5 className="font-medium text-[#4D2531] text-sm">{lt.title}</h5>
                    <span className="text-[11px] text-[#D4607A]">{lt.category}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button onClick={() => setEditingLittleThing(lt)} className="p-1.5 rounded-lg text-[#4D2531]/60 hover:text-[#4D2531] hover:bg-[#FAD4E0]/60" title="Edit"><Edit3 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => deleteLittleThing(lt.id)} className="p-1.5 rounded-lg text-red-500/70 hover:text-red-600 hover:bg-red-50" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <p className="text-xs text-[#4D2531]/90 font-serif italic bg-[#FAD4E0]/30 p-2.5 rounded-xl border border-[#F8D7E3]/40">"{lt.quote_or_memory}"</p>
                {lt.context && <p className="text-[11px] text-[#4D2531]/60">{lt.context}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── FUTURE MUSEUM ── */}
      {activeTab === 'futureMuseum' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-serif text-base text-[#4D2531]">The Future Museum — Shared Bucket List</h4>
              <p className="text-xs text-[#8E4D60]">Adventures ahead, traditions to begin, and places to discover together.</p>
            </div>
            <button
              onClick={() => setEditingFutureMuseum({ id: `fm_${Date.now()}`, title: '', category: 'Places to Visit', status: 'someday', target_location: '', notes: '' })}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#D4607A] text-white text-xs font-medium hover:bg-[#C0566E] shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /><span>Add Bucket Item</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {futureMuseum.map((fm) => (
              <div key={fm.id} className="p-4 rounded-2xl bg-white/80 border border-[#F8D7E3]/60 hover:border-[#D4607A]/40 transition-all shadow-xs space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h5 className="font-medium text-[#4D2531] text-sm">{fm.title}</h5>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className="text-[11px] text-[#D4607A]">{fm.category}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAD4E0]/60 text-[#4D2531] uppercase font-mono">{fm.status}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button onClick={() => setEditingFutureMuseum(fm)} className="p-1.5 rounded-lg text-[#4D2531]/60 hover:text-[#4D2531] hover:bg-[#FAD4E0]/60" title="Edit"><Edit3 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => deleteFutureMuseumItem(fm.id)} className="p-1.5 rounded-lg text-red-500/70 hover:text-red-600 hover:bg-red-50" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                {fm.target_location && <p className="text-[11px] text-[#4D2531]/60">📍 {fm.target_location}</p>}
                {fm.notes && <p className="text-xs text-[#4D2531]/80 font-serif italic bg-[#FAD4E0]/20 p-2 rounded-lg">{fm.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ MODALS ═══ */}

      {/* Recording Modal */}
      {editingRecording && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#F8D7E3] space-y-4 max-h-[90vh] overflow-y-auto">
            <h4 className="font-serif text-lg text-[#4D2531] font-medium">
              {recordings.some((r) => r.id === editingRecording.id) ? 'Edit Recording' : 'New Recording'}
            </h4>
            <div>
              <label className="block text-xs font-medium text-[#4D2531] mb-1">Title</label>
              <input type="text" value={editingRecording.title || ''} onChange={(e) => setEditingRecording({ ...editingRecording, title: e.target.value })} placeholder="e.g. November 4 Song (Acoustic)" className="w-full px-3 py-2 rounded-xl border border-[#F8D7E3]/80 text-sm focus:outline-hidden focus:border-[#D4607A]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#4D2531] mb-1">Category</label>
              <select value={editingRecording.category || 'Little Voicenotes'} onChange={(e) => setEditingRecording({ ...editingRecording, category: e.target.value as RecordingItem['category'] })} className="w-full px-3 py-2 rounded-xl border border-[#F8D7E3]/80 text-sm focus:outline-hidden focus:border-[#D4607A]">
                {['Spoken Letters', 'Little Voicenotes', 'Songs for You', 'For When You Miss Me', 'Special Occasions', 'Just Because'].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#4D2531] mb-1">Audio URL (direct .mp3 / .m4a / .wav link)</label>
              <input type="text" value={editingRecording.audio_url || ''} onChange={(e) => setEditingRecording({ ...editingRecording, audio_url: e.target.value })} placeholder="https://..." className="w-full px-3 py-2 rounded-xl border border-[#F8D7E3]/80 text-sm focus:outline-hidden focus:border-[#D4607A]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#4D2531] mb-1">Duration (e.g. 3:15)</label>
                <input type="text" value={editingRecording.duration || ''} onChange={(e) => setEditingRecording({ ...editingRecording, duration: e.target.value })} placeholder="2:45" className="w-full px-3 py-2 rounded-xl border border-[#F8D7E3]/80 text-sm focus:outline-hidden focus:border-[#D4607A]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#4D2531] mb-1">Date Recorded</label>
                <input type="text" value={editingRecording.date_recorded || ''} onChange={(e) => setEditingRecording({ ...editingRecording, date_recorded: e.target.value })} placeholder="Nov 4, 2024" className="w-full px-3 py-2 rounded-xl border border-[#F8D7E3]/80 text-sm focus:outline-hidden focus:border-[#D4607A]" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#4D2531] mb-1">Description / Backstory</label>
              <textarea value={editingRecording.description || ''} onChange={(e) => setEditingRecording({ ...editingRecording, description: e.target.value })} rows={3} placeholder="Why I made this for you..." className="w-full px-3 py-2 rounded-xl border border-[#F8D7E3]/80 text-sm focus:outline-hidden focus:border-[#D4607A]" />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button onClick={() => setEditingRecording(null)} className="px-4 py-2 rounded-xl text-xs text-[#4D2531]/70 hover:bg-[#FAD4E0]/40">Cancel</button>
              <button onClick={async () => { if (editingRecording.title && editingRecording.audio_url) { await saveRecording(editingRecording as RecordingItem); setEditingRecording(null); } }} disabled={!editingRecording.title || !editingRecording.audio_url} className="px-4 py-2 rounded-xl text-xs bg-[#D4607A] text-white font-medium hover:bg-[#C0566E] disabled:opacity-50">Save Recording</button>
            </div>
          </div>
        </div>
      )}

      {/* Letter Modal */}
      {editingLetter && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#F8D7E3] space-y-4 max-h-[90vh] overflow-y-auto">
            <h4 className="font-serif text-lg text-[#4D2531] font-medium">
              {letters.some((l) => l.id === editingLetter.id) ? 'Edit Letter' : 'Compose Letter'}
            </h4>
            <div>
              <label className="block text-xs font-medium text-[#4D2531] mb-1">Letter Title / Envelope Label</label>
              <input type="text" value={editingLetter.title || ''} onChange={(e) => setEditingLetter({ ...editingLetter, title: e.target.value })} placeholder="e.g. Open When You Can't Sleep" className="w-full px-3 py-2 rounded-xl border border-[#F8D7E3]/80 text-sm focus:outline-hidden focus:border-[#D4607A]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#4D2531] mb-1">Category</label>
              <select value={editingLetter.category || 'Open When You Miss Me'} onChange={(e) => setEditingLetter({ ...editingLetter, category: e.target.value as LetterItem['category'] })} className="w-full px-3 py-2 rounded-xl border border-[#F8D7E3]/80 text-sm focus:outline-hidden focus:border-[#D4607A]">
                {["Open When You Miss Me", "Open When You Need Encouragement", "Open When You Can't Sleep", "Open When You Need a Reminder", "Special Occasions", "Just Because"].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#4D2531] mb-1">Letter Content</label>
              <textarea value={editingLetter.content || ''} onChange={(e) => setEditingLetter({ ...editingLetter, content: e.target.value })} rows={6} placeholder="Write your words here..." className="w-full px-3 py-2 rounded-xl border border-[#F8D7E3]/80 text-sm focus:outline-hidden focus:border-[#D4607A] font-serif leading-relaxed" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#4D2531] mb-1">Unlock Date (Optional)</label>
                <input type="date" value={editingLetter.unlock_date ? editingLetter.unlock_date.split('T')[0] : ''} onChange={(e) => setEditingLetter({ ...editingLetter, unlock_date: e.target.value ? new Date(e.target.value).toISOString() : undefined })} className="w-full px-3 py-2 rounded-xl border border-[#F8D7E3]/80 text-xs focus:outline-hidden focus:border-[#D4607A]" />
              </div>
              <div className="flex items-center pt-5">
                <label className="flex items-center space-x-2 text-xs text-[#4D2531] cursor-pointer">
                  <input type="checkbox" checked={editingLetter.is_locked || false} onChange={(e) => setEditingLetter({ ...editingLetter, is_locked: e.target.checked })} className="rounded-sm text-[#D4607A] focus:ring-[#D4607A]" />
                  <span>Date-Lock Letter</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button onClick={() => setEditingLetter(null)} className="px-4 py-2 rounded-xl text-xs text-[#4D2531]/70 hover:bg-[#FAD4E0]/40">Cancel</button>
              <button onClick={async () => { if (editingLetter.title && editingLetter.content) { await saveLetter(editingLetter as LetterItem); setEditingLetter(null); } }} disabled={!editingLetter.title || !editingLetter.content} className="px-4 py-2 rounded-xl text-xs bg-[#D4607A] text-white font-medium hover:bg-[#C0566E] disabled:opacity-50">Seal Letter</button>
            </div>
          </div>
        </div>
      )}

      {/* Date Modal */}
      {editingDate && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#F8D7E3] space-y-4 max-h-[90vh] overflow-y-auto">
            <h4 className="font-serif text-lg text-[#4D2531] font-medium">
              {dates.some((d) => d.id === editingDate.id) ? 'Edit Milestone' : 'Add Milestone Date'}
            </h4>
            <div>
              <label className="block text-xs font-medium text-[#4D2531] mb-1">Title</label>
              <input type="text" value={editingDate.title || ''} onChange={(e) => setEditingDate({ ...editingDate, title: e.target.value })} placeholder="e.g. Jessica's Medical Graduation" className="w-full px-3 py-2 rounded-xl border border-[#F8D7E3]/80 text-sm focus:outline-hidden focus:border-[#D4607A]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#4D2531] mb-1">Target Date</label>
                <input type="date" value={editingDate.target_date ? editingDate.target_date.split('T')[0] : ''} onChange={(e) => setEditingDate({ ...editingDate, target_date: new Date(e.target.value).toISOString() })} className="w-full px-3 py-2 rounded-xl border border-[#F8D7E3]/80 text-sm focus:outline-hidden focus:border-[#D4607A]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#4D2531] mb-1">Category</label>
                <select value={editingDate.category || 'Milestone'} onChange={(e) => setEditingDate({ ...editingDate, category: e.target.value as ImportantDateItem['category'] })} className="w-full px-3 py-2 rounded-xl border border-[#F8D7E3]/80 text-sm focus:outline-hidden focus:border-[#D4607A]">
                  {['Graduation', 'Anniversary', 'Birthday', 'Meeting', 'Milestone'].map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#4D2531] mb-1">Connection / Location</label>
              <input type="text" value={editingDate.country_connection || ''} onChange={(e) => setEditingDate({ ...editingDate, country_connection: e.target.value })} placeholder="Lagos, Nigeria ↔ Bucharest, Romania" className="w-full px-3 py-2 rounded-xl border border-[#F8D7E3]/80 text-sm focus:outline-hidden focus:border-[#D4607A]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#4D2531] mb-1">Description</label>
              <textarea value={editingDate.description || ''} onChange={(e) => setEditingDate({ ...editingDate, description: e.target.value })} rows={3} placeholder="What this day means to us..." className="w-full px-3 py-2 rounded-xl border border-[#F8D7E3]/80 text-sm focus:outline-hidden focus:border-[#D4607A]" />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button onClick={() => setEditingDate(null)} className="px-4 py-2 rounded-xl text-xs text-[#4D2531]/70 hover:bg-[#FAD4E0]/40">Cancel</button>
              <button onClick={async () => { if (editingDate.title && editingDate.target_date) { await saveDate(editingDate as ImportantDateItem); setEditingDate(null); } }} disabled={!editingDate.title || !editingDate.target_date} className="px-4 py-2 rounded-xl text-xs bg-[#D4607A] text-white font-medium hover:bg-[#C0566E] disabled:opacity-50">Save Date</button>
            </div>
          </div>
        </div>
      )}

      {/* Flower Modal */}
      {editingFlower && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#F8D7E3] space-y-4 max-h-[90vh] overflow-y-auto">
            <h4 className="font-serif text-lg text-[#4D2531] font-medium">
              {flowers.some((f) => f.id === editingFlower.id) ? 'Edit Flower Memory' : 'Plant New Flower'}
            </h4>
            <div>
              <label className="block text-xs font-medium text-[#4D2531] mb-1">Milestone Memory Title</label>
              <input type="text" value={editingFlower.milestone_title || ''} onChange={(e) => setEditingFlower({ ...editingFlower, milestone_title: e.target.value })} placeholder="e.g. The Night We First Spoke" className="w-full px-3 py-2 rounded-xl border border-[#F8D7E3]/80 text-sm focus:outline-hidden focus:border-[#D4607A]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#4D2531] mb-1">Flower Name</label>
                <input type="text" value={editingFlower.flower_name || ''} onChange={(e) => setEditingFlower({ ...editingFlower, flower_name: e.target.value })} placeholder="e.g. Blush Vintage Rose" className="w-full px-3 py-2 rounded-xl border border-[#F8D7E3]/80 text-sm focus:outline-hidden focus:border-[#D4607A]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#4D2531] mb-1">Flower Type</label>
                <select value={editingFlower.flower_type || 'Vintage Rose'} onChange={(e) => setEditingFlower({ ...editingFlower, flower_type: e.target.value as GardenFlowerItem['flower_type'] })} className="w-full px-3 py-2 rounded-xl border border-[#F8D7E3]/80 text-sm focus:outline-hidden focus:border-[#D4607A]">
                  {['Vintage Rose', 'Princess Peony', 'Celestial Lily', 'Stardust Orchid', 'Sweet Hydrangea'].map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#4D2531] mb-1">Bloom Date</label>
                <input type="text" value={editingFlower.bloom_date || ''} onChange={(e) => setEditingFlower({ ...editingFlower, bloom_date: e.target.value })} placeholder="e.g. November 2024" className="w-full px-3 py-2 rounded-xl border border-[#F8D7E3]/80 text-sm focus:outline-hidden focus:border-[#D4607A]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#4D2531] mb-1">Petal Color</label>
                <input type="color" value={editingFlower.color || '#F472B6'} onChange={(e) => setEditingFlower({ ...editingFlower, color: e.target.value })} className="w-full h-9 rounded-xl border border-[#F8D7E3]/80 cursor-pointer" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#4D2531] mb-1">The Memory / Backstory</label>
              <textarea value={editingFlower.story || ''} onChange={(e) => setEditingFlower({ ...editingFlower, story: e.target.value })} rows={4} placeholder="What happened on this day and why it blossomed..." className="w-full px-3 py-2 rounded-xl border border-[#F8D7E3]/80 text-sm focus:outline-hidden focus:border-[#D4607A] font-serif italic" />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button onClick={() => setEditingFlower(null)} className="px-4 py-2 rounded-xl text-xs text-[#4D2531]/70 hover:bg-[#FAD4E0]/40">Cancel</button>
              <button onClick={async () => { if (editingFlower.milestone_title && editingFlower.story) { await saveFlower(editingFlower as GardenFlowerItem); setEditingFlower(null); } }} disabled={!editingFlower.milestone_title || !editingFlower.story} className="px-4 py-2 rounded-xl text-xs bg-[#D4607A] text-white font-medium hover:bg-[#C0566E] disabled:opacity-50">Save Bloom</button>
            </div>
          </div>
        </div>
      )}

      {/* Cinema Modal */}
      {editingCinema && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#F8D7E3] space-y-4 max-h-[90vh] overflow-y-auto">
            <h4 className="font-serif text-lg text-[#4D2531] font-medium">
              {cinema.some((c) => c.id === editingCinema.id) ? 'Edit Cinema Reel' : 'Add Cinema Reel'}
            </h4>
            <div>
              <label className="block text-xs font-medium text-[#4D2531] mb-1">Title</label>
              <input type="text" value={editingCinema.title || ''} onChange={(e) => setEditingCinema({ ...editingCinema, title: e.target.value })} placeholder="e.g. Chapter 1 — The First Glimpse" className="w-full px-3 py-2 rounded-xl border border-[#F8D7E3]/80 text-sm focus:outline-hidden focus:border-[#D4607A]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#4D2531] mb-1">Media Type</label>
                <select value={editingCinema.media_type || 'photo'} onChange={(e) => setEditingCinema({ ...editingCinema, media_type: e.target.value as CinemaMediaItem['media_type'] })} className="w-full px-3 py-2 rounded-xl border border-[#F8D7E3]/80 text-sm focus:outline-hidden focus:border-[#D4607A]">
                  <option value="photo">Photo Still</option>
                  <option value="video">Video Reel</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#4D2531] mb-1">Year</label>
                <input type="text" value={editingCinema.recap_year || ''} onChange={(e) => setEditingCinema({ ...editingCinema, recap_year: e.target.value })} placeholder="2025" className="w-full px-3 py-2 rounded-xl border border-[#F8D7E3]/80 text-sm focus:outline-hidden focus:border-[#D4607A]" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#4D2531] mb-1">Media URL (direct link)</label>
              <input type="text" value={editingCinema.media_url || ''} onChange={(e) => setEditingCinema({ ...editingCinema, media_url: e.target.value })} placeholder="https://..." className="w-full px-3 py-2 rounded-xl border border-[#F8D7E3]/80 text-sm focus:outline-hidden focus:border-[#D4607A]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#4D2531] mb-1">Caption / Story</label>
              <textarea value={editingCinema.caption || ''} onChange={(e) => setEditingCinema({ ...editingCinema, caption: e.target.value })} rows={3} placeholder="The feeling of this moment..." className="w-full px-3 py-2 rounded-xl border border-[#F8D7E3]/80 text-sm focus:outline-hidden focus:border-[#D4607A]" />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button onClick={() => setEditingCinema(null)} className="px-4 py-2 rounded-xl text-xs text-[#4D2531]/70 hover:bg-[#FAD4E0]/40">Cancel</button>
              <button onClick={async () => { if (editingCinema.title && editingCinema.media_url) { await saveCinemaItem(editingCinema as CinemaMediaItem); setEditingCinema(null); } }} disabled={!editingCinema.title || !editingCinema.media_url} className="px-4 py-2 rounded-xl text-xs bg-[#D4607A] text-white font-medium hover:bg-[#C0566E] disabled:opacity-50">Save Reel</button>
            </div>
          </div>
        </div>
      )}

      {/* Little Thing Modal */}
      {editingLittleThing && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#F8D7E3] space-y-4 max-h-[90vh] overflow-y-auto">
            <h4 className="font-serif text-lg text-[#4D2531] font-medium">
              {littleThings.some((l) => l.id === editingLittleThing.id) ? 'Edit Little Thing' : 'Add Little Thing'}
            </h4>
            <div>
              <label className="block text-xs font-medium text-[#4D2531] mb-1">Title</label>
              <input type="text" value={editingLittleThing.title || ''} onChange={(e) => setEditingLittleThing({ ...editingLittleThing, title: e.target.value })} placeholder="e.g. Sleepy Pronunciation" className="w-full px-3 py-2 rounded-xl border border-[#F8D7E3]/80 text-sm focus:outline-hidden focus:border-[#D4607A]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#4D2531] mb-1">Category</label>
              <select value={editingLittleThing.category || 'Funny Things She Said'} onChange={(e) => setEditingLittleThing({ ...editingLittleThing, category: e.target.value as LittleThingItem['category'] })} className="w-full px-3 py-2 rounded-xl border border-[#F8D7E3]/80 text-sm focus:outline-hidden focus:border-[#D4607A]">
                {["Funny Things She Said", "Little Details I Remember", "Favourite Conversations", "Things She Was Excited About", "Inside Jokes", "Random Memories", "Things I Never Want to Forget"].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#4D2531] mb-1">Quote or Memory</label>
              <textarea value={editingLittleThing.quote_or_memory || ''} onChange={(e) => setEditingLittleThing({ ...editingLittleThing, quote_or_memory: e.target.value })} rows={3} placeholder="The exact quote or quirky moment..." className="w-full px-3 py-2 rounded-xl border border-[#F8D7E3]/80 text-sm focus:outline-hidden focus:border-[#D4607A] font-serif italic" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#4D2531] mb-1">Context / Backstory</label>
              <textarea value={editingLittleThing.context || ''} onChange={(e) => setEditingLittleThing({ ...editingLittleThing, context: e.target.value })} rows={2} placeholder="Why this made me smile..." className="w-full px-3 py-2 rounded-xl border border-[#F8D7E3]/80 text-sm focus:outline-hidden focus:border-[#D4607A]" />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button onClick={() => setEditingLittleThing(null)} className="px-4 py-2 rounded-xl text-xs text-[#4D2531]/70 hover:bg-[#FAD4E0]/40">Cancel</button>
              <button onClick={async () => { if (editingLittleThing.title && editingLittleThing.quote_or_memory) { await saveLittleThing(editingLittleThing as LittleThingItem); setEditingLittleThing(null); } }} disabled={!editingLittleThing.title || !editingLittleThing.quote_or_memory} className="px-4 py-2 rounded-xl text-xs bg-[#D4607A] text-white font-medium hover:bg-[#C0566E] disabled:opacity-50">Save Memory</button>
            </div>
          </div>
        </div>
      )}

      {/* Future Museum Modal */}
      {editingFutureMuseum && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#F8D7E3] space-y-4 max-h-[90vh] overflow-y-auto">
            <h4 className="font-serif text-lg text-[#4D2531] font-medium">
              {futureMuseum.some((f) => f.id === editingFutureMuseum.id) ? 'Edit Dream' : 'Add Dream / Bucket Item'}
            </h4>
            <div>
              <label className="block text-xs font-medium text-[#4D2531] mb-1">Title</label>
              <input type="text" value={editingFutureMuseum.title || ''} onChange={(e) => setEditingFutureMuseum({ ...editingFutureMuseum, title: e.target.value })} placeholder="e.g. Picnic by Lake Como" className="w-full px-3 py-2 rounded-xl border border-[#F8D7E3]/80 text-sm focus:outline-hidden focus:border-[#D4607A]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#4D2531] mb-1">Category</label>
                <select value={editingFutureMuseum.category || 'Places to Visit'} onChange={(e) => setEditingFutureMuseum({ ...editingFutureMuseum, category: e.target.value as FutureMuseumItem['category'] })} className="w-full px-3 py-2 rounded-xl border border-[#F8D7E3]/80 text-sm focus:outline-hidden focus:border-[#D4607A]">
                  {['Adventures', 'Places to Visit', 'Restaurants to Try', 'Traditions to Begin', 'Things to Experience'].map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#4D2531] mb-1">Status</label>
                <select value={editingFutureMuseum.status || 'someday'} onChange={(e) => setEditingFutureMuseum({ ...editingFutureMuseum, status: e.target.value as FutureMuseumItem['status'] })} className="w-full px-3 py-2 rounded-xl border border-[#F8D7E3]/80 text-sm focus:outline-hidden focus:border-[#D4607A]">
                  <option value="someday">Someday Wish</option>
                  <option value="planned">Planned / In The Works</option>
                  <option value="experienced">Lived & Cherished</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#4D2531] mb-1">Location / Target</label>
              <input type="text" value={editingFutureMuseum.target_location || ''} onChange={(e) => setEditingFutureMuseum({ ...editingFutureMuseum, target_location: e.target.value })} placeholder="e.g. Italy, France, or Our Kitchen" className="w-full px-3 py-2 rounded-xl border border-[#F8D7E3]/80 text-sm focus:outline-hidden focus:border-[#D4607A]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#4D2531] mb-1">Notes / Plan</label>
              <textarea value={editingFutureMuseum.notes || ''} onChange={(e) => setEditingFutureMuseum({ ...editingFutureMuseum, notes: e.target.value })} rows={3} placeholder="What we'll do together..." className="w-full px-3 py-2 rounded-xl border border-[#F8D7E3]/80 text-sm focus:outline-hidden focus:border-[#D4607A]" />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button onClick={() => setEditingFutureMuseum(null)} className="px-4 py-2 rounded-xl text-xs text-[#4D2531]/70 hover:bg-[#FAD4E0]/40">Cancel</button>
              <button onClick={async () => { if (editingFutureMuseum.title) { await saveFutureMuseumItem(editingFutureMuseum as FutureMuseumItem); setEditingFutureMuseum(null); } }} disabled={!editingFutureMuseum.title} className="px-4 py-2 rounded-xl text-xs bg-[#D4607A] text-white font-medium hover:bg-[#C0566E] disabled:opacity-50">Save Dream</button>
            </div>
          </div>
        </div>
      )}

      {/* SQL Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#F8D7E3] space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#F8D7E3]">
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-[#D4607A]" />
                <h3 className="font-serif text-lg font-medium text-[#4D2531]">Supabase Schema — Planet Uto Universe</h3>
              </div>
              <button onClick={() => setShowSqlModal(false)} className="p-1 rounded-lg text-[#4D2531]/60 hover:text-[#4D2531] hover:bg-[#FAD4E0]">✕</button>
            </div>
            <p className="text-xs text-[#4D2531]/80 leading-relaxed">Copy this SQL and paste it into the <strong>SQL Editor</strong> in your Supabase dashboard. Creates all 7 universe tables. Your existing <code>poems</code> and <code>jessica_content</code> tables are 100% untouched.</p>
            <pre className="flex-1 overflow-auto bg-slate-900 text-pink-200 text-xs p-4 rounded-xl font-mono leading-relaxed border border-slate-700 whitespace-pre-wrap">{UNIVERSE_SQL}</pre>
            <div className="flex justify-end space-x-2 pt-2">
              <button onClick={handleCopySql} className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#D4607A] text-white text-xs font-medium hover:bg-[#C0566E] shadow-xs">
                {copiedSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSql ? 'Copied!' : 'Copy SQL'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
