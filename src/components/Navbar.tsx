import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bus, User, LogOut, ShieldCheck, PlusCircle } from 'lucide-react';

interface NavbarProps {
  activeTab: 'catalog' | 'dashboard' | 'requirements';
  setActiveTab: (tab: 'catalog' | 'dashboard' | 'requirements') => void;
  onOpenRegisterVan: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenRegisterVan,
}) => {
  const { currentUser, role, isLoggedIn, logout, openAuthModalWithIntent } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element Brand wordmark */}
          <button
            onClick={() => setActiveTab('catalog')}
            className="flex items-center gap-2.5 text-left text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-400 flex items-center justify-center text-slate-950 font-black shadow-sm group-hover:bg-amber-300 transition-colors">
              <Bus className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-slate-900 text-lg">
              Furgón<span className="text-amber-500">Seguro</span>
            </span>
          </button>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'catalog'
                  ? 'text-amber-600 font-semibold border-b-2 border-amber-500'
                  : ''
              }`}
            >
              Furgones Escolares
            </button>
            <button
              onClick={() => setActiveTab('requirements')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1.5 ${
                activeTab === 'requirements'
                  ? 'text-amber-600 font-semibold border-b-2 border-amber-500'
                  : ''
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Documentación y Requisitos MTT
            </button>
            {isLoggedIn && (
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                  activeTab === 'dashboard'
                    ? 'text-amber-600 font-semibold border-b-2 border-amber-500'
                    : ''
                }`}
              >
                {role === 'conductor' ? 'Mi Portal Conductor' : 'Mi Panel Apoderado'}
              </button>
            )}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            {isLoggedIn && currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-medium text-slate-800"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center font-bold text-slate-900 text-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="hidden sm:inline-block max-w-[120px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <span className="text-[11px] text-slate-500 hidden md:inline">
                    ({currentUser.role === 'conductor' ? 'Chofer' : 'Apoderado'})
                  </span>
                </button>

                {role === 'conductor' && (
                  <button
                    onClick={onOpenRegisterVan}
                    className="hidden lg:flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 rounded-lg hover:bg-amber-300 transition-colors whitespace-nowrap shadow-sm"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Inscribir Furgón
                  </button>
                )}

                <button
                  onClick={logout}
                  title="Cerrar sesión"
                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 text-xs"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Salir</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModalWithIntent('login')}
                  className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5" />
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => openAuthModalWithIntent('register_driver')}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
                >
                  Inscribir Furgón
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile secondary navigation */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-100 text-xs">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`py-1 px-2 ${activeTab === 'catalog' ? 'text-amber-600 font-bold' : 'text-slate-600'}`}
          >
            Furgones
          </button>
          <button
            onClick={() => setActiveTab('requirements')}
            className={`py-1 px-2 ${activeTab === 'requirements' ? 'text-amber-600 font-bold' : 'text-slate-600'}`}
          >
            Requisitos MTT
          </button>
          {isLoggedIn && (
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-1 px-2 ${activeTab === 'dashboard' ? 'text-amber-600 font-bold' : 'text-slate-600'}`}
            >
              Mi Panel
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
