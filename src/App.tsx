import { useState, useEffect, useCallback } from 'react';
import { usePoems } from './hooks/usePoems';
import { Home } from './pages/Home';
import { AdminPage } from './pages/Admin';

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

  // Simple, robust client-side route tracking (supports /admin and #admin)
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname.startsWith('/admin') || window.location.hash === '#admin') {
        return '/admin';
      }
      return '/';
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname.startsWith('/admin') || window.location.hash === '#admin') {
        setCurrentPath('/admin');
      } else {
        setCurrentPath('/');
      }
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
