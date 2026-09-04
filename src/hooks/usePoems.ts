import { useState, useEffect, useCallback } from 'react';
import { Poem, PoemFormData } from '../types/poem';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { SAMPLE_POEMS } from '../config/samplePoems';

export function usePoems() {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch poems from Supabase (or fallback to SAMPLE_POEMS)
  const fetchPoems = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured) {
      // In offline/demo mode, use local storage or bundled sample poems
      try {
        const saved = localStorage.getItem('poetry_journal_demo_poems');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPoems(parsed);
            setLoading(false);
            return;
          }
        }
      } catch {
        // Fallback to sample poems
      }
      setPoems(SAMPLE_POEMS);
      setLoading(false);
      return;
    }

    try {
      const { data, error: sbError } = await supabase
        .from('poems')
        .select('*')
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: true });

      if (sbError) {
        console.error('[Poetry Journal] Supabase fetch error:', sbError);
        setError('The ink has blurred in the rain. Unable to retrieve poems right now.');
        // Fallback to sample poems on network error so book remains readable
        setPoems(SAMPLE_POEMS);
      } else {
        setPoems(data || []);
      }
    } catch (err) {
      console.error('[Poetry Journal] Unexpected error:', err);
      setError('A quiet breeze interrupted our connection. Please try again.');
      setPoems(SAMPLE_POEMS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPoems();
  }, [fetchPoems]);

  // Persist demo changes to localStorage when not configured
  const saveDemoPoems = (newPoems: Poem[]) => {
    setPoems(newPoems);
    try {
      localStorage.setItem('poetry_journal_demo_poems', JSON.stringify(newPoems));
    } catch {
      // Ignore
    }
  };

  // Add a new poem
  const addPoem = async (formData: PoemFormData): Promise<{ success: boolean; error?: string }> => {
    const nextOrder = formData.order_index ?? (poems.length > 0 ? Math.max(...poems.map(p => p.order_index)) + 1 : 0);

    const poemToInsert = {
      title: formData.title.trim(),
      subtitle: formData.subtitle?.trim() || null,
      body: formData.body, // Preserves all stanzas, spaces, and line breaks
      dedication: formData.dedication?.trim() || null,
      poem_date: formData.poem_date?.trim() || null,
      order_index: nextOrder,
    };

    if (!isSupabaseConfigured) {
      const newPoem: Poem = {
        ...poemToInsert,
        id: 'local-' + Date.now(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const updated = [...poems, newPoem].sort((a, b) => a.order_index - b.order_index);
      saveDemoPoems(updated);
      return { success: true };
    }

    try {
      const { data, error: insertError } = await supabase
        .from('poems')
        .insert([poemToInsert])
        .select()
        .single();

      if (insertError) {
        console.error('[Poetry Journal] Insert error:', insertError);
        return { success: false, error: insertError.message };
      }

      if (data) {
        setPoems(prev => [...prev, data].sort((a, b) => a.order_index - b.order_index));
      }
      return { success: true };
    } catch (err) {
      console.error('[Poetry Journal] Insert exception:', err);
      return { success: false, error: 'Failed to save poem to database.' };
    }
  };

  // Update an existing poem
  const updatePoem = async (id: string, formData: Partial<PoemFormData>): Promise<{ success: boolean; error?: string }> => {
    const fieldsToUpdate: Record<string, unknown> = {
      updated_at: new Date().toISOString()
    };
    if (formData.title !== undefined) fieldsToUpdate.title = formData.title.trim();
    if (formData.subtitle !== undefined) fieldsToUpdate.subtitle = formData.subtitle?.trim() || null;
    if (formData.body !== undefined) fieldsToUpdate.body = formData.body;
    if (formData.dedication !== undefined) fieldsToUpdate.dedication = formData.dedication?.trim() || null;
    if (formData.poem_date !== undefined) fieldsToUpdate.poem_date = formData.poem_date?.trim() || null;
    if (formData.order_index !== undefined) fieldsToUpdate.order_index = formData.order_index;

    if (!isSupabaseConfigured) {
      const updated = poems.map(p => p.id === id ? { ...p, ...fieldsToUpdate } : p);
      saveDemoPoems(updated.sort((a, b) => a.order_index - b.order_index));
      return { success: true };
    }

    try {
      const { data, error: updateError } = await supabase
        .from('poems')
        .update(fieldsToUpdate)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        console.error('[Poetry Journal] Update error:', updateError);
        return { success: false, error: updateError.message };
      }

      if (data) {
        setPoems(prev => prev.map(p => p.id === id ? data : p).sort((a, b) => a.order_index - b.order_index));
      }
      return { success: true };
    } catch (err) {
      console.error('[Poetry Journal] Update exception:', err);
      return { success: false, error: 'Failed to update poem.' };
    }
  };

  // Delete a poem
  const deletePoem = async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured) {
      const filtered = poems.filter(p => p.id !== id);
      saveDemoPoems(filtered);
      return { success: true };
    }

    try {
      const { error: deleteError } = await supabase
        .from('poems')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error('[Poetry Journal] Delete error:', deleteError);
        return { success: false, error: deleteError.message };
      }

      setPoems(prev => prev.filter(p => p.id !== id));
      return { success: true };
    } catch (err) {
      console.error('[Poetry Journal] Delete exception:', err);
      return { success: false, error: 'Failed to delete poem.' };
    }
  };

  // Reorder poems (move up or down)
  const reorderPoems = async (reorderedPoems: Poem[]): Promise<{ success: boolean }> => {
    // Re-assign order_index sequentially: 0, 1, 2...
    const updatedList = reorderedPoems.map((poem, index) => ({
      ...poem,
      order_index: index,
    }));

    setPoems(updatedList);

    if (!isSupabaseConfigured) {
      saveDemoPoems(updatedList);
      return { success: true };
    }

    try {
      // Upsert updated order indices
      const updates = updatedList.map(p => ({
        id: p.id,
        title: p.title,
        body: p.body,
        subtitle: p.subtitle,
        dedication: p.dedication,
        poem_date: p.poem_date,
        order_index: p.order_index,
        updated_at: new Date().toISOString()
      }));

      const { error: upsertError } = await supabase
        .from('poems')
        .upsert(updates);

      if (upsertError) {
        console.error('[Poetry Journal] Reorder upsert error:', upsertError);
        return { success: false };
      }
      return { success: true };
    } catch (err) {
      console.error('[Poetry Journal] Reorder exception:', err);
      return { success: false };
    }
  };

  return {
    poems,
    loading,
    error,
    refetch: fetchPoems,
    addPoem,
    updatePoem,
    deletePoem,
    reorderPoems,
    isConfigured: isSupabaseConfigured,
  };
}
