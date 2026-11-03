import { useState, useCallback } from 'react';
import { JESSICA_CONTENT, TimelineEntry, AppreciationItem } from '../config/jessicaContent';

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

  // Persist whenever timeline or appreciations change
  const saveToStorage = useCallback((newTimeline: TimelineEntry[], newAppreciations: AppreciationItem[]) => {
    try {
      const payload: StoredJessicaContent = {
        timeline: newTimeline,
        appreciations: newAppreciations,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      console.error('Failed to save Jessica content to localStorage', err);
    }
  }, []);

  // Timeline CRUD
  const addTimelineEntry = useCallback((entry: Omit<TimelineEntry, 'id'>) => {
    const newEntry: TimelineEntry = {
      ...entry,
      id: 'timeline-' + Date.now(),
    };
    setTimeline((prev) => {
      const updated = [...prev, newEntry];
      saveToStorage(updated, appreciations);
      return updated;
    });
    return newEntry;
  }, [appreciations, saveToStorage]);

  const updateTimelineEntry = useCallback((id: string, updatedFields: Partial<TimelineEntry>) => {
    setTimeline((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item));
      saveToStorage(updated, appreciations);
      return updated;
    });
  }, [appreciations, saveToStorage]);

  const deleteTimelineEntry = useCallback((id: string) => {
    setTimeline((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      saveToStorage(updated, appreciations);
      return updated;
    });
  }, [appreciations, saveToStorage]);

  // Appreciation CRUD
  const addAppreciationItem = useCallback((item: Omit<AppreciationItem, 'id'>) => {
    const newItem: AppreciationItem = {
      ...item,
      id: 'appreciation-' + Date.now(),
    };
    setAppreciations((prev) => {
      const updated = [...prev, newItem];
      saveToStorage(timeline, updated);
      return updated;
    });
    return newItem;
  }, [timeline, saveToStorage]);

  const updateAppreciationItem = useCallback((id: string, updatedFields: Partial<AppreciationItem>) => {
    setAppreciations((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item));
      saveToStorage(timeline, updated);
      return updated;
    });
  }, [timeline, saveToStorage]);

  const deleteAppreciationItem = useCallback((id: string) => {
    setAppreciations((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      saveToStorage(timeline, updated);
      return updated;
    });
  }, [timeline, saveToStorage]);

  // Reset to original preset values
  const resetToDefaults = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setTimeline(JESSICA_CONTENT.timeline.entries);
    setAppreciations(JESSICA_CONTENT.appreciations.items);
  }, []);

  return {
    timeline,
    appreciations,
    addTimelineEntry,
    updateTimelineEntry,
    deleteTimelineEntry,
    addAppreciationItem,
    updateAppreciationItem,
    deleteAppreciationItem,
    resetToDefaults,
  };
}
