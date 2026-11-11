import { useState, useEffect, useCallback } from 'react';
import { usePoems } from './hooks/usePoems';
import { Home } from './pages/Home';
import { AdminPage } from './pages/Admin';
import { JessicaPage } from './pages/Jessica';
import { BookReaderPage } from './pages/BookReaderPage';

export function App() {
  const {
    poems,
    loading,
    error,
    refetch,
    addPoem,
    updatePoem,
    deletePoem,
    reorderPoems,
  } = usePoems();

  const getPathFromLocation = (): string => {
    if (typeof window === 'undefined') return '/';
    const pathname = window.location.pathname;
    const hash = window.location.hash;

    if (pathname.startsWith('/admin') || hash === '#admin') {
      return '/admin';
    }
    if (pathname.startsWith('/uto') || hash === '#uto' || pathname.startsWith('/jessica') || hash === '#jessica') {
      return '/uto';
    }
    if (pathname.startsWith('/book') || hash === '#book') {
      return '/book';
    }
    if (pathname.startsWith('/observatory') || hash === '#observatory') {
      return '/observatory';
    }
    if (pathname.startsWith('/post-office') || hash === '#post-office') {
      return '/post-office';
    }
    if (pathname.startsWith('/listening-room') || hash === '#listening-room') {
      return '/listening-room';
    }
    if (pathname.startsWith('/garden') || hash === '#garden') {
      return '/garden';
    }
    if (pathname.startsWith('/cinema') || hash === '#cinema') {
      return '/cinema';
    }
    if (pathname.startsWith('/little-things') || hash === '#little-things') {
      return '/little-things';
    }
    if (pathname.startsWith('/future-museum') || hash === '#future-museum') {
      return '/future-museum';
    }
    return '/';
  };

  const [currentPath, setCurrentPath] = useState<string>(getPathFromLocation);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(getPathFromLocation());
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigateTo = useCallback((path: string) => {
    setCurrentPath(path);
    if (window.history && window.history.pushState) {
      window.history.pushState(null, '', path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // 1. Admin Studio
  if (currentPath === '/admin') {
    return (
      <AdminPage
        poems={poems}
        onReturnToJournal={() => navigateTo('/')}
        onNavigateToJessica={() => navigateTo('/uto')}
        onAddPoem={addPoem}
        onUpdatePoem={updatePoem}
        onDeletePoem={deletePoem}
        onReorderPoems={reorderPoems}
      />
    );
  }

  // 2. Dedicated Keepsake for Uto / Jessica
  if (currentPath === '/uto' || currentPath === '/jessica') {
    return (
      <JessicaPage
        poems={poems}
        onNavigateToHome={() => navigateTo('/')}
        onNavigateToAdmin={() => navigateTo('/admin')}
      />
    );
  }

  // 3. The Original Antique Poetry Book Reader
  if (currentPath === '/book') {
    return (
      <BookReaderPage
        poems={poems}
        loading={loading}
        error={error}
        onRefetch={refetch}
        onNavigateToAdmin={() => navigateTo('/admin')}
        onNavigateToJessica={() => navigateTo('/uto')}
        onReturnToUniverse={() => navigateTo('/')}
      />
    );
  }

  // 4. Main Entrance: Planet Uto Landing Page
  return (
    <Home
      poems={poems}
      loading={loading}
      error={error}
      onRefetch={refetch}
      onNavigateToAdmin={() => navigateTo('/admin')}
      onNavigateToJessica={() => navigateTo('/uto')}
      onNavigateToDestination={navigateTo}
    />
  );
}

export default App;
