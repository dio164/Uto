import React, { useState, useRef } from 'react';
import { TimelineEntry, AppreciationItem } from '../../config/jessicaContent';
import {
  Calendar,
  Heart,
  Plus,
  Trash2,
  Edit3,
  Sparkles,
  ExternalLink,
  RotateCcw,
  Upload,
  X,
  Compass,
  Sun,
  Smile,
  Feather,
  BookOpen,
  Video,
} from 'lucide-react';

interface JessicaManagerProps {
  timeline: TimelineEntry[];
  appreciations: AppreciationItem[];
  onAddTimeline: (entry: Omit<TimelineEntry, 'id'>) => void;
  onUpdateTimeline: (id: string, entry: Partial<TimelineEntry>) => void;
  onDeleteTimeline: (id: string) => void;
  onAddAppreciation: (item: Omit<AppreciationItem, 'id'>) => void;
  onUpdateAppreciation: (id: string, item: Partial<AppreciationItem>) => void;
  onDeleteAppreciation: (id: string) => void;
  onResetDefaults: () => void;
  onViewJessicaPage: () => void;
}

export const JessicaManager: React.FC<JessicaManagerProps> = ({
  timeline,
  appreciations,
  onAddTimeline,
  onUpdateTimeline,
  onDeleteTimeline,
  onAddAppreciation,
  onUpdateAppreciation,
  onDeleteAppreciation,
  onResetDefaults,
  onViewJessicaPage,
}) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'appreciations'>('timeline');

  // Timeline Modal State
  const [editingTimeline, setEditingTimeline] = useState<TimelineEntry | null>(null);
  const [isAddingTimeline, setIsAddingTimeline] = useState(false);
  const [tDate, setTDate] = useState('');
  const [tTitle, setTTitle] = useState('');
  const [tDesc, setTDesc] = useState('');
  const [tCaption, setTCaption] = useState('');
  const [tImage, setTImage] = useState<string | undefined>(undefined);
  const [tIsMilestone, setTIsMilestone] = useState(false);
  const [tVideo, setTVideo] = useState<string | undefined>(undefined);
  const [tVideoCaption, setTVideoCaption] = useState('');

  // Appreciation Modal State
  const [editingAppreciation, setEditingAppreciation] = useState<AppreciationItem | null>(null);
  const [isAddingAppreciation, setIsAddingAppreciation] = useState(false);
  const [aTitle, setATitle] = useState('');
  const [aCategory, setACategory] = useState('');
  const [aDesc, setADesc] = useState('');
  const [aIcon, setAIcon] = useState<'Heart' | 'Sparkles' | 'Compass' | 'BookOpen' | 'Sun' | 'Smile' | 'Feather'>('Heart');
  const [aImage, setAImage] = useState<string | undefined>(undefined);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const appFileInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  // Helper to handle image file upload and convert to base64
  const handleImageFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onComplete: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Read file as data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onComplete(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const openNewTimeline = () => {
    setEditingTimeline(null);
    setTDate('');
    setTTitle('');
    setTDesc('');
    setTCaption('');
    setTImage(undefined);
    setTIsMilestone(false);
    setTVideo(undefined);
    setTVideoCaption('');
    setIsAddingTimeline(true);
  };

  const openEditTimeline = (item: TimelineEntry) => {
    setEditingTimeline(item);
    setTDate(item.date);
    setTTitle(item.title);
    setTDesc(item.description);
    setTCaption(item.imageCaption || '');
    setTImage(item.image);
    setTIsMilestone(Boolean(item.isMilestone));
    setTVideo(item.video);
    setTVideoCaption(item.videoCaption || '');
    setIsAddingTimeline(true);
  };

  const handleSaveTimeline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tTitle.trim() || !tDate.trim()) return;

    const payload = {
      date: tDate.trim(),
      title: tTitle.trim(),
      description: tDesc.trim(),
      imageCaption: tCaption.trim() || undefined,
      image: tImage || undefined,
      isMilestone: tIsMilestone,
      video: tVideo || undefined,
      videoCaption: tVideoCaption.trim() || undefined,
    };

    if (editingTimeline) {
      onUpdateTimeline(editingTimeline.id, payload);
    } else {
      onAddTimeline(payload);
    }
    setIsAddingTimeline(false);
  };

  const openNewAppreciation = () => {
    setEditingAppreciation(null);
    setATitle('');
    setACategory('Character');
    setADesc('');
    setAIcon('Heart');
    setAImage(undefined);
    setIsAddingAppreciation(true);
  };

  const openEditAppreciation = (item: AppreciationItem) => {
    setEditingAppreciation(item);
    setATitle(item.title);
    setACategory(item.category);
    setADesc(item.description);
    setAIcon(item.iconName || 'Heart');
    setAImage(item.image);
    setIsAddingAppreciation(true);
  };

  const handleSaveAppreciation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aTitle.trim()) return;

    const payload = {
      title: aTitle.trim(),
      category: aCategory.trim() || 'Character',
      description: aDesc.trim(),
      iconName: aIcon,
      image: aImage || undefined,
    };

    if (editingAppreciation) {
      onUpdateAppreciation(editingAppreciation.id, payload);
    } else {
      onAddAppreciation(payload);
    }
    setIsAddingAppreciation(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls: Switch between Timeline & Appreciations + Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DE9EB0]/30">
        <div className="flex items-center space-x-2 bg-[#FAF0F3] p-1 rounded-xl border border-[#DE9EB0]/40">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-sans tracking-wide transition-all ${
              activeTab === 'timeline'
                ? 'bg-[#8E4D60] text-[#FFF9F2] shadow-xs font-medium'
                : 'text-[#743F4D] hover:bg-[#F8E4EA]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Our Story ({timeline.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('appreciations')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-sans tracking-wide transition-all ${
              activeTab === 'appreciations'
                ? 'bg-[#8E4D60] text-[#FFF9F2] shadow-xs font-medium'
                : 'text-[#743F4D] hover:bg-[#F8E4EA]'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Things I Love ({appreciations.length})</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {activeTab === 'timeline' ? (
            <button
              onClick={openNewTimeline}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-[#8E4D60] to-[#743F4D] text-[#FFF9F2] text-xs font-sans shadow-sm hover:shadow transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Memory</span>
            </button>
          ) : (
            <button
              onClick={openNewAppreciation}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-[#8E4D60] to-[#743F4D] text-[#FFF9F2] text-xs font-sans shadow-sm hover:shadow transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Appreciation</span>
            </button>
          )}

          <button
            onClick={onViewJessicaPage}
            className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-[#FFF9F2] border border-[#DE9EB0]/50 text-xs font-sans text-[#743F4D] hover:text-[#4D2531] shadow-xs transition-colors"
            title="Preview Uto's Experience"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Preview Page</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset memories and appreciations to initial defaults?')) {
                onResetDefaults();
              }
            }}
            title="Reset to defaults"
            className="p-2 rounded-lg text-[#8B737C] hover:text-[#743F4D] hover:bg-[#FAF0F3] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 1: OUR STORY (TIMELINE) LIST */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'timeline' && (
        <div className="space-y-4">
          {timeline.length === 0 ? (
            <div className="paper-texture rounded-xl p-8 text-center border border-[#DE9EB0]/40">
              <Calendar className="w-8 h-8 text-[#C98598] mx-auto mb-2" />
              <p className="font-poem italic text-lg text-[#743F4D]">No memories yet</p>
              <button
                onClick={openNewTimeline}
                className="mt-3 text-xs font-sans text-[#8E4D60] underline underline-offset-4"
              >
                Add your first memory
              </button>
            </div>
          ) : (
            timeline.map((entry, index) => (
              <div
                key={entry.id}
                className="paper-texture rounded-xl p-4 sm:p-5 border border-[#DE9EB0]/40 shadow-xs flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              >
                <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
                  {/* Photo Thumbnail if present */}
                  {entry.image ? (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-[#DE9EB0]/50 shrink-0 bg-[#FAF0F3]">
                      <img src={entry.image} alt={entry.title} className="w-full h-full object-cover" />
                    </div>
                  ) : entry.video ? (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-[#DE9EB0]/50 shrink-0 bg-[#1A0E12] relative flex items-center justify-center">
                      <video src={entry.video} className="w-full h-full object-cover" muted playsInline preload="metadata" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Video className="w-5 h-5 text-white/80" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#FAF0F3] border border-[#DE9EB0]/60 flex items-center justify-center text-[#B77973] shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-[11px] font-sans font-medium text-[#B77973] uppercase tracking-wider bg-[#FAF0F3] px-2 py-0.5 rounded-md border border-[#DE9EB0]/40">
                        {entry.date}
                      </span>
                      {entry.isMilestone && (
                        <span className="inline-flex items-center space-x-1 text-[10px] font-sans text-[#8E4D60] bg-[#F8E4EA] px-2 py-0.5 rounded-md font-semibold">
                          <Sparkles className="w-3 h-3 text-[#B77973]" />
                          <span>Milestone</span>
                        </span>
                      )}
                    </div>
                    <h4 className="font-poem text-xl text-[#4D2531] font-medium leading-snug">
                      {index + 1}. {entry.title}
                    </h4>
                    <p className="font-poem text-sm text-[#654F57] line-clamp-2 mt-1">
                      {entry.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => openEditTimeline(entry)}
                    className="p-2 rounded-lg text-[#8E4D60] hover:bg-[#FAF0F3] hover:text-[#4D2531] transition-colors"
                    title="Edit memory"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete "${entry.title}"?`)) {
                        onDeleteTimeline(entry.id);
                      }
                    }}
                    className="p-2 rounded-lg text-red-600/70 hover:bg-red-50 hover:text-red-700 transition-colors"
                    title="Delete memory"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 2: THINGS I LOVE (APPRECIATIONS) LIST */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'appreciations' && (
        <div className="space-y-4">
          {appreciations.length === 0 ? (
            <div className="paper-texture rounded-xl p-8 text-center border border-[#DE9EB0]/40">
              <Heart className="w-8 h-8 text-[#C98598] mx-auto mb-2" />
              <p className="font-poem italic text-lg text-[#743F4D]">No appreciations yet</p>
              <button
                onClick={openNewAppreciation}
                className="mt-3 text-xs font-sans text-[#8E4D60] underline underline-offset-4"
              >
                Add your first appreciation
              </button>
            </div>
          ) : (
            appreciations.map((item, index) => (
              <div
                key={item.id}
                className="paper-texture rounded-xl p-4 sm:p-5 border border-[#DE9EB0]/40 shadow-xs flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              >
                <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
                  {item.image ? (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-[#DE9EB0]/50 shrink-0 bg-[#FAF0F3]">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#FAF0F3] border border-[#DE9EB0]/60 flex items-center justify-center text-[#8E4D60] shrink-0">
                      <Heart className="w-4 h-4" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-sans font-medium text-[#B77973] uppercase tracking-wider bg-[#FAF0F3] px-2 py-0.5 rounded-md border border-[#DE9EB0]/40 mb-1 inline-block">
                      {item.category}
                    </span>
                    <h4 className="font-poem text-xl text-[#4D2531] font-medium leading-snug">
                      {index + 1}. {item.title}
                    </h4>
                    <p className="font-poem text-sm text-[#654F57] line-clamp-2 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => openEditAppreciation(item)}
                    className="p-2 rounded-lg text-[#8E4D60] hover:bg-[#FAF0F3] hover:text-[#4D2531] transition-colors"
                    title="Edit appreciation"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete "${item.title}"?`)) {
                        onDeleteAppreciation(item.id);
                      }
                    }}
                    className="p-2 rounded-lg text-red-600/70 hover:bg-red-50 hover:text-red-700 transition-colors"
                    title="Delete appreciation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TIMELINE ADD / EDIT MODAL */}
      {/* ───────────────────────────────────────────────────────────── */}
      {isAddingTimeline && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="paper-texture rounded-2xl max-w-lg w-full p-6 sm:p-8 border border-[#DE9EB0] shadow-book-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#DE9EB0]/40">
              <h3 className="font-poem text-2xl text-[#4D2531]">
                {editingTimeline ? 'Edit Memory' : 'Add New Memory'}
              </h3>
              <button
                onClick={() => setIsAddingTimeline(false)}
                className="text-[#8B737C] hover:text-[#4D2531]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTimeline} className="space-y-4">
              <div>
                <label className="block text-xs font-sans uppercase tracking-wider text-[#743F4D] mb-1 font-medium">
                  Date / Timeframe
                </label>
                <input
                  type="text"
                  required
                  value={tDate}
                  onChange={(e) => setTDate(e.target.value)}
                  placeholder="e.g. July 2026, November 4, 2026"
                  className="w-full px-3 py-2 text-sm bg-[#FAF0F3]/60 border border-[#DE9EB0]/60 rounded-lg text-[#392B30] focus:ring-2 focus:ring-[#C98598]/50 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-sans uppercase tracking-wider text-[#743F4D] mb-1 font-medium">
                  Memory Title
                </label>
                <input
                  type="text"
                  required
                  value={tTitle}
                  onChange={(e) => setTTitle(e.target.value)}
                  placeholder="e.g. How We First Met"
                  className="w-full px-3 py-2 text-sm bg-[#FAF0F3]/60 border border-[#DE9EB0]/60 rounded-lg text-[#392B30] focus:ring-2 focus:ring-[#C98598]/50 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-sans uppercase tracking-wider text-[#743F4D] mb-1 font-medium">
                  Description / Story
                </label>
                <textarea
                  required
                  rows={4}
                  value={tDesc}
                  onChange={(e) => setTDesc(e.target.value)}
                  placeholder="Write the memory here..."
                  className="w-full px-3 py-2 text-sm bg-[#FAF0F3]/60 border border-[#DE9EB0]/60 rounded-lg text-[#392B30] focus:ring-2 focus:ring-[#C98598]/50 outline-none font-poem text-base"
                />
              </div>

              {/* Photo Upload Section */}
              <div className="pt-2 border-t border-[#DE9EB0]/30">
                <label className="block text-xs font-sans uppercase tracking-wider text-[#743F4D] mb-1 font-medium">
                  Photo for this Memory (Optional)
                </label>

                {tImage ? (
                  <div className="relative w-full h-44 rounded-xl overflow-hidden border border-[#DE9EB0]/60 mb-2">
                    <img src={tImage} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setTImage(undefined)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white shadow-md hover:bg-red-700 transition-colors"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-4 border-2 border-dashed border-[#DE9EB0]/70 rounded-xl bg-[#FAF0F3]/40 hover:bg-[#FAF0F3] text-[#743F4D] text-xs font-sans flex flex-col items-center justify-center gap-1 transition-colors"
                    >
                      <Upload className="w-5 h-5 text-[#B77973]" />
                      <span className="font-medium">Upload Photo from your Computer / Phone</span>
                      <span className="text-[10px] text-[#8B737C]">JPG, PNG, WebP supported</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageFileChange(e, (dataUrl) => setTImage(dataUrl))}
                    />

                    {/* Or URL */}
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-sans text-[#AF99A2] uppercase tracking-wider">or link:</span>
                      <input
                        type="text"
                        value={tImage || ''}
                        onChange={(e) => setTImage(e.target.value.trim() || undefined)}
                        placeholder="https://example.com/photo.jpg"
                        className="flex-1 px-2.5 py-1.5 text-xs bg-[#FAF0F3]/60 border border-[#DE9EB0]/50 rounded-lg text-[#392B30] outline-none"
                      />
                    </div>
                  </div>
                )}

                {tImage && (
                  <input
                    type="text"
                    value={tCaption}
                    onChange={(e) => setTCaption(e.target.value)}
                    placeholder="Short photo caption (optional)"
                    className="w-full mt-2 px-3 py-1.5 text-xs bg-[#FAF0F3]/60 border border-[#DE9EB0]/50 rounded-lg text-[#392B30] outline-none"
                  />
                )}
              </div>

              {/* Milestone toggle */}
              <div className="pt-2 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isMilestone"
                  checked={tIsMilestone}
                  onChange={(e) => setTIsMilestone(e.target.checked)}
                  className="rounded border-[#DE9EB0] text-[#8E4D60] focus:ring-[#C98598]"
                />
                <label htmlFor="isMilestone" className="text-xs font-sans text-[#743F4D] font-medium cursor-pointer">
                  Highlight as special milestone (e.g. November 4, 2026)
                </label>
              </div>

              {/* Video Upload Section */}
              <div className="pt-2 border-t border-[#DE9EB0]/30">
                <label className="block text-xs font-sans uppercase tracking-wider text-[#743F4D] mb-1 font-medium">
                  Video for this Memory (Optional)
                </label>

                {tVideo ? (
                  <div className="relative w-full rounded-xl overflow-hidden border border-[#DE9EB0]/60 mb-2 bg-[#1A0E12]">
                    <video src={tVideo} className="w-full h-40 object-cover" muted playsInline preload="metadata" />
                    <button
                      type="button"
                      onClick={() => { setTVideo(undefined); setTVideoCaption(''); }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white shadow-md hover:bg-red-700 transition-colors"
                      title="Remove video"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => videoInputRef.current?.click()}
                      className="w-full py-4 border-2 border-dashed border-[#DE9EB0]/70 rounded-xl bg-[#FAF0F3]/40 hover:bg-[#FAF0F3] text-[#743F4D] text-xs font-sans flex flex-col items-center justify-center gap-1 transition-colors"
                    >
                      <Video className="w-5 h-5 text-[#B77973]" />
                      <span className="font-medium">Upload Video from your Computer / Phone</span>
                      <span className="text-[10px] text-[#8B737C]">MP4, MOV, WebM supported · Large files may take a moment</span>
                    </button>
                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => handleImageFileChange(e, (dataUrl) => setTVideo(dataUrl))}
                    />
                    {/* Or URL */}
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-sans text-[#AF99A2] uppercase tracking-wider">or link:</span>
                      <input
                        type="text"
                        value={tVideo || ''}
                        onChange={(e) => setTVideo(e.target.value.trim() || undefined)}
                        placeholder="https://example.com/video.mp4"
                        className="flex-1 px-2.5 py-1.5 text-xs bg-[#FAF0F3]/60 border border-[#DE9EB0]/50 rounded-lg text-[#392B30] outline-none"
                      />
                    </div>
                  </div>
                )}

                {tVideo && (
                  <input
                    type="text"
                    value={tVideoCaption}
                    onChange={(e) => setTVideoCaption(e.target.value)}
                    placeholder="Short video caption (optional)"
                    className="w-full mt-2 px-3 py-1.5 text-xs bg-[#FAF0F3]/60 border border-[#DE9EB0]/50 rounded-lg text-[#392B30] outline-none"
                  />
                )}
              </div>

              <div className="pt-4 flex items-center justify-end space-x-2 border-t border-[#DE9EB0]/40">
                <button
                  type="button"
                  onClick={() => setIsAddingTimeline(false)}
                  className="px-4 py-2 text-xs font-sans text-[#743F4D] hover:bg-[#FAF0F3] rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-sans rounded-lg bg-gradient-to-r from-[#8E4D60] to-[#743F4D] text-[#FFF9F2] shadow-sm hover:shadow transition-all font-medium"
                >
                  {editingTimeline ? 'Save Changes' : 'Add Memory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* APPRECIATION ADD / EDIT MODAL */}
      {/* ───────────────────────────────────────────────────────────── */}
      {isAddingAppreciation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="paper-texture rounded-2xl max-w-lg w-full p-6 sm:p-8 border border-[#DE9EB0] shadow-book-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#DE9EB0]/40">
              <h3 className="font-poem text-2xl text-[#4D2531]">
                {editingAppreciation ? 'Edit Appreciation' : 'Add Appreciation'}
              </h3>
              <button
                onClick={() => setIsAddingAppreciation(false)}
                className="text-[#8B737C] hover:text-[#4D2531]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAppreciation} className="space-y-4">
              <div>
                <label className="block text-xs font-sans uppercase tracking-wider text-[#743F4D] mb-1 font-medium">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={aTitle}
                  onChange={(e) => setATitle(e.target.value)}
                  placeholder="e.g. Your Genuine Kindness"
                  className="w-full px-3 py-2 text-sm bg-[#FAF0F3]/60 border border-[#DE9EB0]/60 rounded-lg text-[#392B30] focus:ring-2 focus:ring-[#C98598]/50 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-sans uppercase tracking-wider text-[#743F4D] mb-1 font-medium">
                  Category Tag
                </label>
                <input
                  type="text"
                  required
                  value={aCategory}
                  onChange={(e) => setACategory(e.target.value)}
                  placeholder="e.g. Character, Intellect, Joy, Faith"
                  className="w-full px-3 py-2 text-sm bg-[#FAF0F3]/60 border border-[#DE9EB0]/60 rounded-lg text-[#392B30] focus:ring-2 focus:ring-[#C98598]/50 outline-none"
                />
              </div>

              {/* Icon selector */}
              <div>
                <label className="block text-xs font-sans uppercase tracking-wider text-[#743F4D] mb-1.5 font-medium">
                  Choose Icon
                </label>
                <div className="flex items-center space-x-2">
                  {(['Heart', 'Sparkles', 'Compass', 'BookOpen', 'Sun', 'Smile', 'Feather'] as const).map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setAIcon(icon)}
                      className={`p-2 rounded-lg border text-xs flex items-center justify-center transition-all ${
                        aIcon === icon
                          ? 'bg-[#8E4D60] text-white border-[#8E4D60] shadow-xs'
                          : 'bg-[#FAF0F3] text-[#743F4D] border-[#DE9EB0]/50 hover:bg-[#F8E4EA]'
                      }`}
                      title={icon}
                    >
                      {icon === 'Heart' && <Heart className="w-4 h-4" />}
                      {icon === 'Sparkles' && <Sparkles className="w-4 h-4" />}
                      {icon === 'Compass' && <Compass className="w-4 h-4" />}
                      {icon === 'BookOpen' && <BookOpen className="w-4 h-4" />}
                      {icon === 'Sun' && <Sun className="w-4 h-4" />}
                      {icon === 'Smile' && <Smile className="w-4 h-4" />}
                      {icon === 'Feather' && <Feather className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans uppercase tracking-wider text-[#743F4D] mb-1 font-medium">
                  What you love about her
                </label>
                <textarea
                  required
                  rows={4}
                  value={aDesc}
                  onChange={(e) => setADesc(e.target.value)}
                  placeholder="Write your personal appreciation..."
                  className="w-full px-3 py-2 text-sm bg-[#FAF0F3]/60 border border-[#DE9EB0]/60 rounded-lg text-[#392B30] focus:ring-2 focus:ring-[#C98598]/50 outline-none font-poem text-base"
                />
              </div>

              {/* Photo Upload for Appreciation */}
              <div className="pt-2 border-t border-[#DE9EB0]/30">
                <label className="block text-xs font-sans uppercase tracking-wider text-[#743F4D] mb-1 font-medium">
                  Card Photo (Optional)
                </label>
                {aImage ? (
                  <div className="relative w-full h-36 rounded-xl overflow-hidden border border-[#DE9EB0]/60 mb-2">
                    <img src={aImage} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setAImage(undefined)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white shadow-md hover:bg-red-700 transition-colors"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <button
                      type="button"
                      onClick={() => appFileInputRef.current?.click()}
                      className="w-full py-3 border-2 border-dashed border-[#DE9EB0]/70 rounded-xl bg-[#FAF0F3]/40 hover:bg-[#FAF0F3] text-[#743F4D] text-xs font-sans flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Upload className="w-4 h-4 text-[#B77973]" />
                      <span>Upload Photo from device</span>
                    </button>
                    <input
                      ref={appFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageFileChange(e, (dataUrl) => setAImage(dataUrl))}
                    />
                  </div>
                )}
              </div>

              <div className="pt-4 flex items-center justify-end space-x-2 border-t border-[#DE9EB0]/40">
                <button
                  type="button"
                  onClick={() => setIsAddingAppreciation(false)}
                  className="px-4 py-2 text-xs font-sans text-[#743F4D] hover:bg-[#FAF0F3] rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-sans rounded-lg bg-gradient-to-r from-[#8E4D60] to-[#743F4D] text-[#FFF9F2] shadow-sm hover:shadow transition-all font-medium"
                >
                  {editingAppreciation ? 'Save Changes' : 'Add Appreciation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
