import { useState, useCallback, useEffect } from 'react';
import { JESSICA_CONTENT, TimelineEntry, AppreciationItem } from '../config/jessicaContent';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEY = 'uto_jessica_custom_content';

interface StoredJessicaContent {
  timeline: TimelineEntry[];
  appreciations: AppreciationItem[];
}

export function useJessicaContent() {
  const [timeline, setTimeline] = useState<TimelineEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoredJessicaContent = JSON.parse(saved);
        if (Array.isArray(parsed.timeline) && parsed.timeline.length > 0) {
          return parsed.timeline;
        }
      }
    } catch (e) {
      console.warn('Failed to load saved Jessica content from localStorage', e);
    }
    return JESSICA_CONTENT.timeline.entries;
  });

  const [appreciations, setAppreciations] = useState<AppreciationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoredJessicaContent = JSON.parse(saved);
        if (Array.isArray(parsed.appreciations) && parsed.appreciations.length > 0) {
          return parsed.appreciations;
        }
      }
    } catch (e) {
      console.warn('Failed to load saved Jessica appreciations from localStorage', e);
    }
    return JESSICA_CONTENT.appreciations.items;
  });

  const [isDbSynced, setIsDbSynced] = useState<boolean>(false);
  const [dbError, setDbError] = useState<string | null>(null);

  // Fetch cloud content from Supabase on mount
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let isMounted = true;

    const fetchCloudContent = async () => {
      try {
        const { data, error } = await supabase
          .from('jessica_content')
          .select('timeline, appreciations')
          .eq('id', 'current')
          .maybeSingle();

        if (error) {
          console.warn('[Supabase] Could not fetch jessica_content:', error.message);
          if (isMounted) {
            setDbError(error.message);
            setIsDbSynced(false);
          }
          return;
        }

        if (data && isMounted) {
          let hasCloudUpdates = false;

          if (Array.isArray(data.timeline) && data.timeline.length > 0) {
            setTimeline(data.timeline);
            hasCloudUpdates = true;
          }

          if (Array.isArray(data.appreciations) && data.appreciations.length > 0) {
            setAppreciations(data.appreciations);
            hasCloudUpdates = true;
          }

          if (hasCloudUpdates) {
            try {
              localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                  timeline: data.timeline || [],
                  appreciations: data.appreciations || [],
                })
              );
            } catch {
              // Ignore localStorage quota errors
            }
          }

          setIsDbSynced(true);
          setDbError(null);
        } else if (isMounted) {
          // Table exists but no row yet
          setIsDbSynced(true);
        }
      } catch (err) {
        console.warn('[Supabase] Exception checking jessica_content:', err);
        if (isMounted) {
          setIsDbSynced(false);
        }
      }
    };

    fetchCloudContent();

    return () => {
      isMounted = false;
    };
  }, []);

  // Save changes both to localStorage and Supabase
  const persistContent = useCallback(
    async (newTimeline: TimelineEntry[], newAppreciations: AppreciationItem[]) => {
      // 1. Immediately cache in localStorage for fast offline rendering
      try {
        const payload: StoredJessicaContent = {
          timeline: newTimeline,
          appreciations: newAppreciations,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch (err) {
        console.error('Failed to save to localStorage', err);
      }

      // 2. Persist to Supabase if available
      if (isSupabaseConfigured) {
        try {
          const { error } = await supabase.from('jessica_content').upsert(
            {
              id: 'current',
              timeline: newTimeline,
              appreciations: newAppreciations,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'id' }
          );

          if (error) {
            console.error('[Supabase] Failed to save jessica_content:', error.message);
            setDbError(error.message);
            setIsDbSynced(false);
          } else {
            setIsDbSynced(true);
            setDbError(null);
          }
        } catch (err) {
          console.error('[Supabase] Exception saving jessica_content:', err);
          setIsDbSynced(false);
        }
      }
    },
    []
  );

  // Timeline CRUD
  const addTimelineEntry = useCallback(
    (entry: Omit<TimelineEntry, 'id'>) => {
      const newEntry: TimelineEntry = {
        ...entry,
        id: 'timeline-' + Date.now(),
      };
      setTimeline((prev) => {
        const updated = [...prev, newEntry];
        persistContent(updated, appreciations);
        return updated;
      });
      return newEntry;
    },
    [appreciations, persistContent]
  );

  const updateTimelineEntry = useCallback(
    (id: string, updatedFields: Partial<TimelineEntry>) => {
      setTimeline((prev) => {
        const updated = prev.map((item) =>
          item.id === id ? { ...item, ...updatedFields } : item
        );
        persistContent(updated, appreciations);
        return updated;
      });
    },
    [appreciations, persistContent]
  );

  const deleteTimelineEntry = useCallback(
    (id: string) => {
      setTimeline((prev) => {
        const updated = prev.filter((item) => item.id !== id);
        persistContent(updated, appreciations);
        return updated;
      });
    },
    [appreciations, persistContent]
  );

  // Appreciation CRUD
  const addAppreciationItem = useCallback(
    (item: Omit<AppreciationItem, 'id'>) => {
      const newItem: AppreciationItem = {
        ...item,
        id: 'appreciation-' + Date.now(),
      };
      setAppreciations((prev) => {
        const updated = [...prev, newItem];
        persistContent(timeline, updated);
        return updated;
      });
      return newItem;
    },
    [timeline, persistContent]
  );

  const updateAppreciationItem = useCallback(
    (id: string, updatedFields: Partial<AppreciationItem>) => {
      setAppreciations((prev) => {
        const updated = prev.map((item) =>
          item.id === id ? { ...item, ...updatedFields } : item
        );
        persistContent(timeline, updated);
        return updated;
      });
    },
    [timeline, persistContent]
  );

  const deleteAppreciationItem = useCallback(
    (id: string) => {
      setAppreciations((prev) => {
        const updated = prev.filter((item) => item.id !== id);
        persistContent(timeline, updated);
        return updated;
      });
    },
    [timeline, persistContent]
  );

  // Reset to original preset values
  const resetToDefaults = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setTimeline(JESSICA_CONTENT.timeline.entries);
    setAppreciations(JESSICA_CONTENT.appreciations.items);
    if (isSupabaseConfigured) {
      persistContent(JESSICA_CONTENT.timeline.entries, JESSICA_CONTENT.appreciations.items);
    }
  }, [persistContent]);

  return {
    timeline,
    appreciations,
    isDbSynced,
    dbError,
    addTimelineEntry,
    updateTimelineEntry,
    deleteTimelineEntry,
    addAppreciationItem,
    updateAppreciationItem,
    deleteAppreciationItem,
    resetToDefaults,
  };
}
