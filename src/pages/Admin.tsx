import React from 'react';
import { AdminPanel } from '../components/Admin/AdminPanel';
import { Poem, PoemFormData } from '../types/poem';
import { FloatingPetals } from '../components/Decorative/FloatingPetals';
import { AmbientDust } from '../components/Decorative/AmbientDust';

interface AdminPageProps {
  poems: Poem[];
  onReturnToJournal: () => void;
  onNavigateToJessica?: () => void;
  onAddPoem: (data: PoemFormData) => Promise<{ success: boolean; error?: string }>;
  onUpdatePoem: (id: string, data: Partial<PoemFormData>) => Promise<{ success: boolean; error?: string }>;
  onDeletePoem: (id: string) => Promise<{ success: boolean; error?: string }>;
  onReorderPoems: (reordered: Poem[]) => Promise<{ success: boolean }>;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  poems,
  onReturnToJournal,
  onNavigateToJessica,
  onAddPoem,
  onUpdatePoem,
  onDeletePoem,
  onReorderPoems,
}) => {
  return (
    <div className="relative min-h-screen">
      <FloatingPetals />
      <AmbientDust />
      <div className="relative z-20">
        <AdminPanel
          poems={poems}
          onReturnToJournal={onReturnToJournal}
          onNavigateToJessica={onNavigateToJessica}
          onAddPoem={onAddPoem}
          onUpdatePoem={onUpdatePoem}
          onDeletePoem={onDeletePoem}
          onReorderPoems={onReorderPoems}
        />
      </div>
    </div>
  );
};
