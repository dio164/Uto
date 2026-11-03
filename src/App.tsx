import { useState, useEffect, useCallback } from 'react';
import { usePoems } from './hooks/usePoems';
import { Home } from './pages/Home';
import { AdminPage } from './pages/Admin';
import { JessicaPage } from './pages/Jessica';

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
    if (pathname.startsWith('/jessica') || hash === '#jessica') {
      return '/jessica';
    }
    return '/';
  };

  // Simple, robust client-side route tracking (supports /, /admin, and /jessica)
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
  }, []);

  if (currentPath === '/admin') {
    return (
      <AdminPage
        poems={poems}
        onReturnToJournal={() => navigateTo('/')}
        onAddPoem={addPoem}
        onUpdatePoem={updatePoem}
        onDeletePoem={deletePoem}
        onReorderPoems={reorderPoems}
      />
    );
  }

  if (currentPath === '/jessica') {
    return (
      <JessicaPage
        poems={poems}
        onNavigateToHome={() => navigateTo('/')}
      />
    );
  }

  return (
    <Home
      poems={poems}
      loading={loading}
      error={error}
      onRefetch={refetch}
      onNavigateToAdmin={() => navigateTo('/admin')}
    />
  );
}

export default App;
