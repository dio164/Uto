import React, { useState } from 'react';
import { Poem, PoemFormData } from '../../types/poem';
import { PoemPage } from '../Book/PoemPage';
import { BookPage } from '../Book/BookPage';
import { Save, X, Eye, Edit3, AlertCircle } from 'lucide-react';

interface PoemEditorProps {
  poem?: Poem | null;
  defaultOrderIndex: number;
  onSave: (data: PoemFormData) => Promise<{ success: boolean; error?: string }>;
  onCancel: () => void;
}

export const PoemEditor: React.FC<PoemEditorProps> = ({
  poem,
  defaultOrderIndex,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<PoemFormData>({
    title: poem?.title || '',
    subtitle: poem?.subtitle || '',
    dedication: poem?.dedication || '',
    poem_date: poem?.poem_date || '',
    body: poem?.body || '',
    order_index: poem?.order_index ?? defaultOrderIndex,
  });

  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrorMessage('Please enter a title for the poem.');
      return;
    }
    if (!formData.body.trim()) {
      setErrorMessage('Please enter or paste the poem text.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    const result = await onSave(formData);
    setIsSaving(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Failed to save poem. Please try again.');
    }
  };

  // Preview mock poem object
  const previewPoem: Poem = {
    id: poem?.id || 'preview-id',
    title: formData.title || 'Untitled Verse',
    subtitle: formData.subtitle || null,
    dedication: formData.dedication || null,
    poem_date: formData.poem_date || null,
    body: formData.body || 'Your verses will appear here as you type or paste them...',
    order_index: formData.order_index,
    created_at: poem?.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return (
    <div className="w-full max-w-5xl mx-auto paper-texture rounded-2xl border border-[#DE9EB0]/50 shadow-book p-4 sm:p-7">
      {/* Editor Top Bar */}
      <div className="flex items-center justify-between border-b border-[#DE9EB0]/40 pb-4 mb-6">
        <div>
          <h2 className="font-blackletter text-2xl sm:text-3xl text-[#4D2531]">
            {poem ? 'Edit Poem' : 'Pen New Poem'}
          </h2>
          <p className="font-poem italic text-sm text-[#8B737C]">
            Line breaks, stanza spaces, and formatting will be preserved exactly as entered.
          </p>
        </div>

        {/* Tab Switcher for Responsive Mobile / Tablet */}
        <div className="flex items-center space-x-2 bg-[#FAF0F3] p-1 rounded-lg border border-[#DE9EB0]/40 md:hidden">
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-sans transition-colors ${
              activeTab === 'editor' ? 'bg-[#C98598] text-white shadow-sm' : 'text-[#743F4D]'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-sans transition-colors ${
              activeTab === 'preview' ? 'bg-[#C98598] text-white shadow-sm' : 'text-[#743F4D]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Grid: Form on Left, Live Book Preview on Right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left Column: Form Controls */}
        <form
          onSubmit={handleSubmit}
          className={`space-y-4 ${activeTab === 'preview' ? 'hidden md:block' : 'block'}`}
        >
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider text-[#743F4D] mb-1 font-medium">
              Poem Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. I Found Your Name"
              className="w-full px-3 py-2 text-base font-poem bg-[#FAF0F3]/60 border border-[#DE9EB0]/60 rounded-lg text-[#392B30] placeholder-[#AF99A2] focus:outline-none focus:ring-2 focus:ring-[#C98598]/50 focus:border-[#C98598]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-sans uppercase tracking-wider text-[#743F4D] mb-1 font-medium">
                Subtitle (Optional)
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="e.g. fragments & late-night confessions"
                className="w-full px-3 py-2 text-sm bg-[#FAF0F3]/60 border border-[#DE9EB0]/60 rounded-lg text-[#392B30] placeholder-[#AF99A2] focus:outline-none focus:ring-2 focus:ring-[#C98598]/50 focus:border-[#C98598]"
              />
            </div>

            <div>
              <label className="block text-xs font-sans uppercase tracking-wider text-[#743F4D] mb-1 font-medium">
                Dedication (Optional)
              </label>
              <input
                type="text"
                value={formData.dedication}
                onChange={(e) => setFormData({ ...formData, dedication: e.target.value })}
                placeholder="e.g. For the one who lingers"
                className="w-full px-3 py-2 text-sm bg-[#FAF0F3]/60 border border-[#DE9EB0]/60 rounded-lg text-[#392B30] placeholder-[#AF99A2] focus:outline-none focus:ring-2 focus:ring-[#C98598]/50 focus:border-[#C98598]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-sans uppercase tracking-wider text-[#743F4D] mb-1 font-medium">
                Date (Optional)
              </label>
              <input
                type="text"
                value={formData.poem_date}
                onChange={(e) => setFormData({ ...formData, poem_date: e.target.value })}
                placeholder="e.g. October 14th"
                className="w-full px-3 py-2 text-sm bg-[#FAF0F3]/60 border border-[#DE9EB0]/60 rounded-lg text-[#392B30] placeholder-[#AF99A2] focus:outline-none focus:ring-2 focus:ring-[#C98598]/50 focus:border-[#C98598]"
              />
            </div>

            <div>
              <label className="block text-xs font-sans uppercase tracking-wider text-[#743F4D] mb-1 font-medium">
                Order Index
              </label>
              <input
                type="number"
                value={formData.order_index}
                onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-2 text-sm bg-[#FAF0F3]/60 border border-[#DE9EB0]/60 rounded-lg text-[#392B30] focus:outline-none focus:ring-2 focus:ring-[#C98598]/50 focus:border-[#C98598]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-sans uppercase tracking-wider text-[#743F4D] font-medium">
                Poem Body * (Copy & Paste Supported)
              </label>
              <span className="text-[11px] font-poem italic text-[#8B737C]">
                Preserves all stanzas and indentation
              </span>
            </div>
            <textarea
              required
              rows={12}
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              placeholder={`I found your name\nbetween the spaces\nof everything\nI never said.\n\nAnd somehow\neven silence\nsounded like you.`}
              className="w-full px-3.5 py-3 text-base font-poem leading-relaxed bg-[#FAF0F3]/70 border border-[#DE9EB0]/60 rounded-lg text-[#392B30] placeholder-[#AF99A2] focus:outline-none focus:ring-2 focus:ring-[#C98598]/50 focus:border-[#C98598] resize-y whitespace-pre"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg border border-[#DE9EB0]/70 text-[#743F4D] hover:bg-[#FAF0F3] text-sm font-sans transition-colors flex items-center space-x-1.5"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#8E4D60] to-[#743F4D] hover:from-[#743F4D] hover:to-[#4D2531] text-[#FFF9F2] font-poem text-lg shadow-md hover:shadow-lg transition-all active:scale-[0.99] flex items-center space-x-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : poem ? 'Update Poem' : 'Publish to Journal'}</span>
            </button>
          </div>
        </form>

        {/* Right Column: Live Book Page Preview */}
        <div className={`${activeTab === 'editor' ? 'hidden md:block' : 'block'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-sans uppercase tracking-wider text-[#743F4D] font-medium flex items-center space-x-1.5">
              <Eye className="w-3.5 h-3.5 text-[#B77973]" />
              <span>Live Book Preview</span>
            </span>
            <span className="text-[11px] font-poem italic text-[#8B737C]">
              Real-time rendering
            </span>
          </div>

          {/* Book Page Frame Preview */}
          <div className="h-[530px] rounded-lg shadow-book border border-[#DE9EB0]/60 overflow-hidden relative">
            <BookPage
              pageNumber={formData.order_index + 1}
              headerTitle={formData.title || 'Untitled'}
              side="right"
              dataDensity="soft"
            >
              <PoemPage poem={previewPoem} />
            </BookPage>
          </div>
        </div>
      </div>
    </div>
  );
};
