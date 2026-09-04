import React, { useState } from 'react';
import { Poem } from '../../types/poem';
import { 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  Edit3, 
  Trash2, 
  Search, 
  BookOpen, 
  Calendar, 
  Layers 
} from 'lucide-react';

interface PoemListProps {
  poems: Poem[];
  onNewPoem: () => void;
  onEditPoem: (poem: Poem) => void;
  onDeletePoem: (id: string) => Promise<{ success: boolean; error?: string }>;
  onReorder: (reorderedPoems: Poem[]) => Promise<{ success: boolean }>;
}

export const PoemList: React.FC<PoemListProps> = ({
  poems,
  onNewPoem,
  onEditPoem,
  onDeletePoem,
  onReorder,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredPoems = poems.filter((poem) =>
    poem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (poem.subtitle && poem.subtitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
    poem.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Move poem up
  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const newPoems = [...poems];
    const temp = newPoems[index - 1];
    newPoems[index - 1] = newPoems[index];
    newPoems[index] = temp;
    await onReorder(newPoems);
  };

  // Move poem down
  const handleMoveDown = async (index: number) => {
    if (index === poems.length - 1) return;
    const newPoems = [...poems];
    const temp = newPoems[index + 1];
    newPoems[index + 1] = newPoems[index];
    newPoems[index] = temp;
    await onReorder(newPoems);
  };

  // Confirm delete
  const confirmDelete = async (id: string) => {
    setIsDeleting(true);
    await onDeletePoem(id);
    setIsDeleting(false);
    setDeletingId(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Top Header & New Poem Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 paper-texture p-4 sm:p-6 rounded-2xl border border-[#DE9EB0]/50 shadow-sm">
        <div>
          <h2 className="font-blackletter text-3xl text-[#4D2531]">Poetry Archives</h2>
          <p className="font-poem italic text-base text-[#8B737C]">
            {poems.length} {poems.length === 1 ? 'verse' : 'verses'} currently bound in the journal
          </p>
        </div>

        <button
          onClick={onNewPoem}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8E4D60] to-[#743F4D] hover:from-[#743F4D] hover:to-[#4D2531] text-[#FFF9F2] font-poem text-lg shadow-md hover:shadow-lg transition-all flex items-center space-x-2 active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" />
          <span>+ New Poem</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#C98598] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search verses by title, stanzas, or subtitle..."
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FFF9F2]/80 backdrop-blur-sm border border-[#DE9EB0]/50 rounded-xl text-[#392B30] placeholder-[#AF99A2] focus:outline-none focus:ring-2 focus:ring-[#C98598]/50 shadow-sm"
        />
      </div>

      {/* Poems List */}
      {filteredPoems.length === 0 ? (
        <div className="paper-texture rounded-2xl p-10 text-center border border-[#DE9EB0]/40 shadow-sm">
          <BookOpen className="w-8 h-8 text-[#C98598] mx-auto mb-3 opacity-60" />
          <h3 className="font-poem italic text-2xl text-[#743F4D]">
            {searchTerm ? 'No verses match your search.' : 'The pages are waiting for words.'}
          </h3>
          <p className="font-sans text-xs text-[#8B737C] mt-2">
            Click "+ New Poem" above to begin weaving words.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPoems.map((poem, index) => {
            const isFirst = index === 0;
            const isLast = index === filteredPoems.length - 1;

            return (
              <div
                key={poem.id}
                className="paper-texture rounded-xl p-4 sm:p-5 border border-[#DE9EB0]/40 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Poem Info */}
                <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#FAF0F3] border border-[#DE9EB0]/60 flex items-center justify-center shrink-0 mt-1">
                    <span className="font-poem text-sm text-[#743F4D] font-medium">
                      #{index + 1}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-blackletter text-2xl text-[#4D2531] truncate">
                      {poem.title}
                    </h3>

                    {poem.subtitle && (
                      <p className="font-poem italic text-sm text-[#8B737C] truncate">
                        {poem.subtitle}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-[#AF99A2] font-sans">
                      {poem.poem_date && (
                        <span className="flex items-center space-x-1 text-[#B77973]">
                          <Calendar className="w-3 h-3" />
                          <span>{poem.poem_date}</span>
                        </span>
                      )}
                      <span className="flex items-center space-x-1">
                        <Layers className="w-3 h-3" />
                        <span>Order: {poem.order_index}</span>
                      </span>
                    </div>

                    {/* Short snippet preview */}
                    <p className="font-poem italic text-sm text-[#392B30]/75 line-clamp-2 mt-2 leading-relaxed">
                      {poem.body.split('\n').filter(Boolean).slice(0, 2).join(' / ')}
                    </p>
                  </div>
                </div>

                {/* Actions: Reorder, Edit, Delete */}
                <div className="flex items-center space-x-1.5 self-end sm:self-center shrink-0">
                  {/* Reorder Up */}
                  <button
                    onClick={() => handleMoveUp(index)}
                    disabled={isFirst || Boolean(searchTerm)}
                    title="Move up"
                    className={`p-2 rounded-lg transition-colors ${
                      isFirst || Boolean(searchTerm)
                        ? 'text-[#DE9EB0]/40 cursor-not-allowed'
                        : 'text-[#743F4D] hover:bg-[#FAF0F3] hover:text-[#4D2531]'
                    }`}
                    aria-label="Move poem up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>

                  {/* Reorder Down */}
                  <button
                    onClick={() => handleMoveDown(index)}
                    disabled={isLast || Boolean(searchTerm)}
                    title="Move down"
                    className={`p-2 rounded-lg transition-colors ${
                      isLast || Boolean(searchTerm)
                        ? 'text-[#DE9EB0]/40 cursor-not-allowed'
                        : 'text-[#743F4D] hover:bg-[#FAF0F3] hover:text-[#4D2531]'
                    }`}
                    aria-label="Move poem down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>

                  <div className="h-4 w-[1px] bg-[#DE9EB0]/40 mx-1" />

                  {/* Edit */}
                  <button
                    onClick={() => onEditPoem(poem)}
                    title="Edit poem"
                    className="p-2 rounded-lg text-[#8E4D60] hover:bg-[#FAF0F3] hover:text-[#4D2531] transition-colors"
                    aria-label="Edit poem"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => setDeletingId(poem.id)}
                    title="Delete poem"
                    className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                    aria-label="Delete poem"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-[#2A131A]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm paper-texture rounded-2xl p-6 border border-[#DE9EB0]/60 shadow-book-lg text-center animate-in fade-in zoom-in-95 duration-200">
            <Trash2 className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <h3 className="font-blackletter text-2xl text-[#4D2531]">Burn This Page?</h3>
            <p className="font-poem italic text-base text-[#8B737C] mt-2">
              This poem will be permanently removed from the journal. This cannot be undone.
            </p>
            <div className="flex items-center justify-center space-x-3 mt-6">
              <button
                onClick={() => setDeletingId(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg border border-[#DE9EB0] text-[#743F4D] text-sm hover:bg-[#FAF0F3] transition-colors"
              >
                Keep Page
              </button>
              <button
                onClick={() => confirmDelete(deletingId)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium shadow-sm transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Poem'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
