import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Cloud, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/' },
  { label: 'Practice', to: '/practice' },
];

export default function AppLayout() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/70">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <NavLink to="/" className="group flex items-center gap-2.5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-700 to-sky-400 text-white shadow-sm transition group-hover:scale-105">
              <Cloud className="h-5 w-5" />
            </span>
            <span className="font-heading text-lg font-extrabold tracking-tight text-slate-900">
              Azure<span className="text-blue-600">Ready</span>
            </span>
          </NavLink>

          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  [
                    'rounded-full px-3.5 py-2 text-sm font-medium transition',
                    isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Button size="sm" className="ml-2 hidden sm:inline-flex" onClick={() => navigate('/practice')}>
              <Play className="mr-1.5 h-3.5 w-3.5" />
              Start quiz
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 text-sm text-slate-500 sm:px-6">
          <p className="font-medium text-slate-700">AzureReady — built for the #1MillionDevs AZ-900 challenge.</p>
          <p className="mt-2 max-w-3xl leading-relaxed">
            AzureReady is an independent learning project and is not affiliated with or endorsed by Microsoft. All
            practice questions are original study material; AZ-900 is a Microsoft certification exam.
          </p>
        </div>
      </footer>
    </div>
  );
}
