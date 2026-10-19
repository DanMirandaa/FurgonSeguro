import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { VanCard } from './components/VanCard';
import { DriverDashboard } from './components/DriverDashboard';
import { ParentDashboard } from './components/ParentDashboard';
import { RequirementsTab } from './components/RequirementsTab';
import { VanDetailModal } from './components/VanDetailModal';
import { AuthModal } from './components/AuthModal';
import { RegisterVanModal } from './components/RegisterVanModal';
import { Footer } from './components/Footer';
import { Van } from './types';
import {
  Bus,
  Search,
  Filter,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowUpDown,
  Lock,
} from 'lucide-react';

function MainAppContent() {
  const {
    vans,
    isLoggedIn,
    role,
    currentUser,
    logout,
    showAuthModal,
    setShowAuthModal,
    openAuthModalWithIntent,
  } = useAuth();

  // Navigation state: catalog | dashboard | requirements
  const [activeTab, setActiveTab] = useState<'catalog' | 'dashboard' | 'requirements'>('catalog');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComuna, setSelectedComuna] = useState('Todas las comunas');
  const [onlyAvailableSeats, setOnlyAvailableSeats] = useState(false);
  const [selectedShift, setSelectedShift] = useState<string>('todos');
  const [sortBy, setSortBy] = useState<'seats' | 'rating' | 'fee'>('seats');

  // Modal states
  const [selectedVanIdForDetails, setSelectedVanIdForDetails] = useState<string | null>(null);
  const [isRegisterVanOpen, setIsRegisterVanOpen] = useState(false);

  const selectedVanForDetails = vans.find((v) => v.id === selectedVanIdForDetails) || null;

  // Filter logic
  const filteredVans = vans.filter((van) => {
    // Search query matches driver name, brand, schools, comuna or sectors
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = van.driverName.toLowerCase().includes(q);
      const matchBrand = van.brandModel.toLowerCase().includes(q);
      const matchComuna = van.comuna.toLowerCase().includes(q);
      const matchSchools = van.schools.some((s) => s.toLowerCase().includes(q));
      const matchSectors = van.sectors.some((s) => s.toLowerCase().includes(q));
      const matchPatente = van.patente.toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchComuna && !matchSchools && !matchSectors && !matchPatente) {
        return false;
      }
    }

    // Comuna filter
    if (selectedComuna !== 'Todas las comunas' && van.comuna !== selectedComuna) {
      return false;
    }

    // Only available seats filter
    if (onlyAvailableSeats && van.availableSeats <= 0) {
      return false;
    }

    // Shift filter
    if (selectedShift !== 'todos') {
      if (selectedShift === 'manana' && !van.shifts.includes('Mañana')) return false;
      if (selectedShift === 'tarde' && !van.shifts.includes('Tarde')) return false;
      if (selectedShift === 'completa' && !van.shifts.includes('Jornada Completa')) return false;
    }

    return true;
  });

  // Sorting logic
  filteredVans.sort((a, b) => {
    if (sortBy === 'seats') {
      return b.availableSeats - a.availableSeats;
    }
    if (sortBy === 'rating') {
      return b.driverRating - a.driverRating;
    }
    if (sortBy === 'fee') {
      return a.monthlyFee - b.monthlyFee;
    }
    return 0;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenRegisterVan={() => setIsRegisterVanOpen(true)}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        {/* TAB 1: Catalog of Vans */}
        {activeTab === 'catalog' && (
          <div>
            {/* Hero Section */}
            <Hero
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedComuna={selectedComuna}
              setSelectedComuna={setSelectedComuna}
              onlyAvailableSeats={onlyAvailableSeats}
              setOnlyAvailableSeats={setOnlyAvailableSeats}
              onExploreClick={() => {
                const el = document.getElementById('catalog-results');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onRegisterVanClick={() => {
                if (!isLoggedIn) {
                  openAuthModalWithIntent('register_driver');
                } else if (role === 'conductor') {
                  setIsRegisterVanOpen(true);
                } else {
                  setActiveTab('dashboard');
                }
              }}
            />

            {/* Catalog Grid Section */}
            <section id="catalog-results" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              {/* Header & Filter Controls Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Furgones Escolares con Cupos y Documentación
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Mostrando <strong className="text-slate-800 font-mono">{filteredVans.length}</strong> furgones con
                    documentación reglamentaria y antecedentes al día
                  </p>
                </div>

                {/* Filter & Sort Controls */}
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  {/* Shift Filter */}
                  <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                    <button
                      onClick={() => setSelectedShift('todos')}
                      className={`px-2.5 py-1 rounded font-medium transition-colors ${
                        selectedShift === 'todos' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-600'
                      }`}
                    >
                      Todos
                    </button>
                    <button
                      onClick={() => setSelectedShift('manana')}
                      className={`px-2.5 py-1 rounded font-medium transition-colors ${
                        selectedShift === 'manana' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-600'
                      }`}
                    >
                      Mañana
                    </button>
                    <button
                      onClick={() => setSelectedShift('tarde')}
                      className={`px-2.5 py-1 rounded font-medium transition-colors ${
                        selectedShift === 'tarde' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-600'
                      }`}
                    >
                      Tarde
                    </button>
                  </div>

                  {/* Sort By */}
                  <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-500 font-medium">Ordenar:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
                    >
                      <option value="seats">Más Cupos Libres</option>
                      <option value="rating">Mejor Calificados</option>
                      <option value="fee">Menor Tarifa Mensual</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notice for Guest Users regarding WhatsApp */}
              {!isLoggedIn && (
                <div className="mb-8 p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center text-slate-950 shrink-0 font-bold">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-amber-950">
                        ¿Deseas contactar a los conductores por WhatsApp?
                      </div>
                      <div className="text-xs text-amber-800">
                        Inicia sesión con tu cuenta de apoderado o chofer para desbloquear los teléfonos y el botón
                        directo de WhatsApp de cada furgón escolar.
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => openAuthModalWithIntent('whatsapp')}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors whitespace-nowrap"
                  >
                    Iniciar Sesión / Registrarse
                  </button>
                </div>
              )}

              {/* Grid of Vans */}
              {filteredVans.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                  <Bus className="w-12 h-12 text-slate-300 mx-auto" />
                  <h3 className="text-lg font-bold text-slate-800">No encontramos furgones con esos filtros</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Prueba cambiando la comuna, borrando la búsqueda o desmarcando la opción de "solo con cupos".
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedComuna('Todas las comunas');
                      setOnlyAvailableSeats(false);
                      setSelectedShift('todos');
                    }}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg transition-colors"
                  >
                    Restablecer Filtros
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVans.map((van) => (
                    <VanCard
                      key={van.id}
                      van={van}
                      onOpenDetails={(v) => setSelectedVanIdForDetails(v.id)}
                      onOpenDocs={(v) => setSelectedVanIdForDetails(v.id)}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* TAB 2: Conductor / Apoderado Dashboard */}
        {activeTab === 'dashboard' && (
          <div>
            {role === 'conductor' ? (
              <DriverDashboard
                onOpenRegisterVan={() => setIsRegisterVanOpen(true)}
              />
            ) : (
              <ParentDashboard
                onOpenDetails={(v) => setSelectedVanIdForDetails(v.id)}
                onOpenDocs={(v) => setSelectedVanIdForDetails(v.id)}
                onBrowseVans={() => setActiveTab('catalog')}
              />
            )}
          </div>
        )}

        {/* TAB 3: Requirements & Verification Guide */}
        {activeTab === 'requirements' && (
          <RequirementsTab
            onRegisterVan={() => {
              if (!isLoggedIn) {
                openAuthModalWithIntent('register_driver');
              } else {
                setIsRegisterVanOpen(true);
              }
            }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onSelectTab={(t) => setActiveTab(t)} />

      {/* Modals */}
      {selectedVanForDetails && (
        <VanDetailModal
          van={selectedVanForDetails}
          onClose={() => setSelectedVanIdForDetails(null)}
        />
      )}

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccessRole={(userRole) => {
            if (userRole === 'conductor') {
              setActiveTab('dashboard');
            }
          }}
        />
      )}

      {isRegisterVanOpen && (
        <RegisterVanModal
          onClose={() => setIsRegisterVanOpen(false)}
          onSuccess={() => {
            setActiveTab('dashboard');
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
