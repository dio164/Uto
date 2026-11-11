import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  RecordingItem,
  LetterItem,
  ImportantDateItem,
  GardenFlowerItem,
  CinemaMediaItem,
  LittleThingItem,
  FutureMuseumItem,
} from '../types/universeData';
import {
  DEFAULT_RECORDINGS,
  DEFAULT_LETTERS,
  DEFAULT_DATES,
  DEFAULT_FLOWERS,
  DEFAULT_CINEMA,
  DEFAULT_LITTLE_THINGS,
  DEFAULT_FUTURE_MUSEUM,
} from '../config/universeDefaults';

const STORAGE_KEYS = {
  recordings: 'uto_universe_recordings',
  letters: 'uto_universe_letters',
  dates: 'uto_universe_dates',
  flowers: 'uto_universe_flowers',
  cinema: 'uto_universe_cinema',
  littleThings: 'uto_universe_little_things',
  futureMuseum: 'uto_universe_future_museum',
};

function getLocalOrFallback<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return fallback;
}

export function useUniverseData() {
  const [recordings, setRecordings] = useState<RecordingItem[]>(() =>
    getLocalOrFallback(STORAGE_KEYS.recordings, DEFAULT_RECORDINGS)
  );
  const [letters, setLetters] = useState<LetterItem[]>(() =>
    getLocalOrFallback(STORAGE_KEYS.letters, DEFAULT_LETTERS)
  );
  const [dates, setDates] = useState<ImportantDateItem[]>(() =>
    getLocalOrFallback(STORAGE_KEYS.dates, DEFAULT_DATES)
  );
  const [flowers, setFlowers] = useState<GardenFlowerItem[]>(() =>
    getLocalOrFallback(STORAGE_KEYS.flowers, DEFAULT_FLOWERS)
  );
  const [cinema, setCinema] = useState<CinemaMediaItem[]>(() =>
    getLocalOrFallback(STORAGE_KEYS.cinema, DEFAULT_CINEMA)
  );
  const [littleThings, setLittleThings] = useState<LittleThingItem[]>(() =>
    getLocalOrFallback(STORAGE_KEYS.littleThings, DEFAULT_LITTLE_THINGS)
  );
  const [futureMuseum, setFutureMuseum] = useState<FutureMuseumItem[]>(() =>
    getLocalOrFallback(STORAGE_KEYS.futureMuseum, DEFAULT_FUTURE_MUSEUM)
  );

  const [isLoading, setIsLoading] = useState(true);

  // Initial fetch from Supabase
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function loadAll() {
      try {
        const [
          recRes,
          letRes,
          dateRes,
          flwRes,
          cinRes,
          ltRes,
          fmRes,
        ] = await Promise.allSettled([
          supabase.from('universe_recordings').select('*').order('created_at', { ascending: false }),
          supabase.from('universe_letters').select('*').order('created_at', { ascending: false }),
          supabase.from('universe_dates').select('*').order('target_date', { ascending: true }),
          supabase.from('universe_flowers').select('*').order('created_at', { ascending: true }),
          supabase.from('universe_cinema').select('*').order('created_at', { ascending: false }),
          supabase.from('universe_little_things').select('*').order('created_at', { ascending: false }),
          supabase.from('universe_future_museum').select('*').order('created_at', { ascending: false }),
        ]);

        if (!isMounted) return;

        if (recRes.status === 'fulfilled' && recRes.value.data && recRes.value.data.length > 0) {
          setRecordings(recRes.value.data);
          try { localStorage.setItem(STORAGE_KEYS.recordings, JSON.stringify(recRes.value.data)); } catch {}
        }
        if (letRes.status === 'fulfilled' && letRes.value.data && letRes.value.data.length > 0) {
          setLetters(letRes.value.data);
          try { localStorage.setItem(STORAGE_KEYS.letters, JSON.stringify(letRes.value.data)); } catch {}
        }
        if (dateRes.status === 'fulfilled' && dateRes.value.data && dateRes.value.data.length > 0) {
          setDates(dateRes.value.data);
          try { localStorage.setItem(STORAGE_KEYS.dates, JSON.stringify(dateRes.value.data)); } catch {}
        }
        if (flwRes.status === 'fulfilled' && flwRes.value.data && flwRes.value.data.length > 0) {
          setFlowers(flwRes.value.data);
          try { localStorage.setItem(STORAGE_KEYS.flowers, JSON.stringify(flwRes.value.data)); } catch {}
        }
        if (cinRes.status === 'fulfilled' && cinRes.value.data && cinRes.value.data.length > 0) {
          setCinema(cinRes.value.data);
          try { localStorage.setItem(STORAGE_KEYS.cinema, JSON.stringify(cinRes.value.data)); } catch {}
        }
        if (ltRes.status === 'fulfilled' && ltRes.value.data && ltRes.value.data.length > 0) {
          setLittleThings(ltRes.value.data);
          try { localStorage.setItem(STORAGE_KEYS.littleThings, JSON.stringify(ltRes.value.data)); } catch {}
        }
        if (fmRes.status === 'fulfilled' && fmRes.value.data && fmRes.value.data.length > 0) {
          setFutureMuseum(fmRes.value.data);
          try { localStorage.setItem(STORAGE_KEYS.futureMuseum, JSON.stringify(fmRes.value.data)); } catch {}
        }
      } catch (err) {
        console.warn('Failed to load universe cloud content:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadAll();

    return () => {
      isMounted = false;
    };
  }, []);

  // CRUD Helpers
  const saveRecording = useCallback(async (item: RecordingItem) => {
    setRecordings((prev) => {
      const exists = prev.some((x) => x.id === item.id);
      const updated = exists ? prev.map((x) => (x.id === item.id ? item : x)) : [item, ...prev];
      try { localStorage.setItem(STORAGE_KEYS.recordings, JSON.stringify(updated)); } catch {}
      return updated;
    });

    if (isSupabaseConfigured) {
      try {
        await supabase.from('universe_recordings').upsert(item);
      } catch (e) {
        console.warn('Could not upsert recording to Supabase', e);
      }
    }
  }, []);

  const deleteRecording = useCallback(async (id: string) => {
    setRecordings((prev) => {
      const updated = prev.filter((x) => x.id !== id);
      try { localStorage.setItem(STORAGE_KEYS.recordings, JSON.stringify(updated)); } catch {}
      return updated;
    });

    if (isSupabaseConfigured) {
      try {
        await supabase.from('universe_recordings').delete().eq('id', id);
      } catch (e) {
        console.warn('Could not delete recording from Supabase', e);
      }
    }
  }, []);

  const saveLetter = useCallback(async (item: LetterItem) => {
    setLetters((prev) => {
      const exists = prev.some((x) => x.id === item.id);
      const updated = exists ? prev.map((x) => (x.id === item.id ? item : x)) : [item, ...prev];
      try { localStorage.setItem(STORAGE_KEYS.letters, JSON.stringify(updated)); } catch {}
      return updated;
    });

    if (isSupabaseConfigured) {
      try {
        await supabase.from('universe_letters').upsert(item);
      } catch (e) {
        console.warn('Could not upsert letter to Supabase', e);
      }
    }
  }, []);

  const deleteLetter = useCallback(async (id: string) => {
    setLetters((prev) => {
      const updated = prev.filter((x) => x.id !== id);
      try { localStorage.setItem(STORAGE_KEYS.letters, JSON.stringify(updated)); } catch {}
      return updated;
    });

    if (isSupabaseConfigured) {
      try {
        await supabase.from('universe_letters').delete().eq('id', id);
      } catch (e) {
        console.warn('Could not delete letter from Supabase', e);
      }
    }
  }, []);

  const saveDate = useCallback(async (item: ImportantDateItem) => {
    setDates((prev) => {
      const exists = prev.some((x) => x.id === item.id);
      const updated = exists ? prev.map((x) => (x.id === item.id ? item : x)) : [...prev, item];
      try { localStorage.setItem(STORAGE_KEYS.dates, JSON.stringify(updated)); } catch {}
      return updated;
    });

    if (isSupabaseConfigured) {
      try {
        await supabase.from('universe_dates').upsert(item);
      } catch (e) {
        console.warn('Could not upsert date to Supabase', e);
      }
    }
  }, []);

  const deleteDate = useCallback(async (id: string) => {
    setDates((prev) => {
      const updated = prev.filter((x) => x.id !== id);
      try { localStorage.setItem(STORAGE_KEYS.dates, JSON.stringify(updated)); } catch {}
      return updated;
    });

    if (isSupabaseConfigured) {
      try {
        await supabase.from('universe_dates').delete().eq('id', id);
      } catch (e) {
        console.warn('Could not delete date from Supabase', e);
      }
    }
  }, []);

  const saveFlower = useCallback(async (item: GardenFlowerItem) => {
    setFlowers((prev) => {
      const exists = prev.some((x) => x.id === item.id);
      const updated = exists ? prev.map((x) => (x.id === item.id ? item : x)) : [...prev, item];
      try { localStorage.setItem(STORAGE_KEYS.flowers, JSON.stringify(updated)); } catch {}
      return updated;
    });

    if (isSupabaseConfigured) {
      try {
        await supabase.from('universe_flowers').upsert(item);
      } catch (e) {
        console.warn('Could not upsert flower to Supabase', e);
      }
    }
  }, []);

  const deleteFlower = useCallback(async (id: string) => {
    setFlowers((prev) => {
      const updated = prev.filter((x) => x.id !== id);
      try { localStorage.setItem(STORAGE_KEYS.flowers, JSON.stringify(updated)); } catch {}
      return updated;
    });

    if (isSupabaseConfigured) {
      try {
        await supabase.from('universe_flowers').delete().eq('id', id);
      } catch (e) {
        console.warn('Could not delete flower from Supabase', e);
      }
    }
  }, []);

  const saveCinemaItem = useCallback(async (item: CinemaMediaItem) => {
    setCinema((prev) => {
      const exists = prev.some((x) => x.id === item.id);
      const updated = exists ? prev.map((x) => (x.id === item.id ? item : x)) : [item, ...prev];
      try { localStorage.setItem(STORAGE_KEYS.cinema, JSON.stringify(updated)); } catch {}
      return updated;
    });

    if (isSupabaseConfigured) {
      try {
        await supabase.from('universe_cinema').upsert(item);
      } catch (e) {
        console.warn('Could not upsert cinema item to Supabase', e);
      }
    }
  }, []);

  const deleteCinemaItem = useCallback(async (id: string) => {
    setCinema((prev) => {
      const updated = prev.filter((x) => x.id !== id);
      try { localStorage.setItem(STORAGE_KEYS.cinema, JSON.stringify(updated)); } catch {}
      return updated;
    });

    if (isSupabaseConfigured) {
      try {
        await supabase.from('universe_cinema').delete().eq('id', id);
      } catch (e) {
        console.warn('Could not delete cinema item from Supabase', e);
      }
    }
  }, []);

  const saveLittleThing = useCallback(async (item: LittleThingItem) => {
    setLittleThings((prev) => {
      const exists = prev.some((x) => x.id === item.id);
      const updated = exists ? prev.map((x) => (x.id === item.id ? item : x)) : [item, ...prev];
      try { localStorage.setItem(STORAGE_KEYS.littleThings, JSON.stringify(updated)); } catch {}
      return updated;
    });

    if (isSupabaseConfigured) {
      try {
        await supabase.from('universe_little_things').upsert(item);
      } catch (e) {
        console.warn('Could not upsert little thing to Supabase', e);
      }
    }
  }, []);

  const deleteLittleThing = useCallback(async (id: string) => {
    setLittleThings((prev) => {
      const updated = prev.filter((x) => x.id !== id);
      try { localStorage.setItem(STORAGE_KEYS.littleThings, JSON.stringify(updated)); } catch {}
      return updated;
    });

    if (isSupabaseConfigured) {
      try {
        await supabase.from('universe_little_things').delete().eq('id', id);
      } catch (e) {
        console.warn('Could not delete little thing from Supabase', e);
      }
    }
  }, []);

  const saveFutureMuseumItem = useCallback(async (item: FutureMuseumItem) => {
    setFutureMuseum((prev) => {
      const exists = prev.some((x) => x.id === item.id);
      const updated = exists ? prev.map((x) => (x.id === item.id ? item : x)) : [item, ...prev];
      try { localStorage.setItem(STORAGE_KEYS.futureMuseum, JSON.stringify(updated)); } catch {}
      return updated;
    });

    if (isSupabaseConfigured) {
      try {
        await supabase.from('universe_future_museum').upsert(item);
      } catch (e) {
        console.warn('Could not upsert future museum item to Supabase', e);
      }
    }
  }, []);

  const deleteFutureMuseumItem = useCallback(async (id: string) => {
    setFutureMuseum((prev) => {
      const updated = prev.filter((x) => x.id !== id);
      try { localStorage.setItem(STORAGE_KEYS.futureMuseum, JSON.stringify(updated)); } catch {}
      return updated;
    });

    if (isSupabaseConfigured) {
      try {
        await supabase.from('universe_future_museum').delete().eq('id', id);
      } catch (e) {
        console.warn('Could not delete future museum item from Supabase', e);
      }
    }
  }, []);

  return {
    recordings,
    letters,
    dates,
    flowers,
    cinema,
    littleThings,
    futureMuseum,
    isLoading,
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
  };
}

