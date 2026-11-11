import { useState, useEffect, useCallback } from 'react';
import { usePoems } from './hooks/usePoems';
import { Home } from './pages/Home';
import { AdminPage } from './pages/Admin';
import { JessicaPage } from './pages/Jessica';
import { BookReaderPage } from './pages/BookReaderPage';
import { ObservatoryPage } from './pages/ObservatoryPage';
import { PostOfficePage } from './pages/PostOfficePage';
import { ListeningRoomPage } from './pages/ListeningRoomPage';
import { GardenPage } from './pages/GardenPage';
import { CinemaPage } from './pages/CinemaPage';
import { LittleThingsPage } from './pages/LittleThingsPage';
import { FutureMuseumPage } from './pages/FutureMuseumPage';

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

  // 5. The Observatory
  if (currentPath === '/observatory') {
    return <ObservatoryPage onNavigateBack={() => navigateTo('/')} />;
  }

  // 6. The Post Office
  if (currentPath === '/post-office') {
    return <PostOfficePage onNavigateBack={() => navigateTo('/')} />;
  }

  // 7. The Listening Room
  if (currentPath === '/listening-room') {
    return <ListeningRoomPage onNavigateBack={() => navigateTo('/')} />;
  }

  // 8. The Enchanted Garden
  if (currentPath === '/garden') {
    return <GardenPage onNavigateBack={() => navigateTo('/')} />;
  }

  // 9. Our Little Cinema
  if (currentPath === '/cinema') {
    return <CinemaPage onNavigateBack={() => navigateTo('/')} />;
  }

  // 10. The Little Things Archive
  if (currentPath === '/little-things') {
    return <LittleThingsPage onNavigateBack={() => navigateTo('/')} />;
  }

  // 11. The Future Museum
  if (currentPath === '/future-museum') {
    return <FutureMuseumPage onNavigateBack={() => navigateTo('/')} />;
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
