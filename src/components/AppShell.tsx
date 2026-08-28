import { Outlet, Navigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useTheme } from '@/hooks/useTheme';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

export default function AppShell() {
  const currentUser = useStore((s) => s.currentUser);
  useTheme();

  if (!currentUser) return <Navigate to="/" replace />;

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
