import React from 'react';
import { ShieldCheck, Bus, Users, Search, MapPin, ArrowRight, CheckCircle2, MessageCircle } from 'lucide-react';
import { CHILEAN_COMUNAS } from '../data/mockData';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedComuna: string;
  setSelectedComuna: (c: string) => void;
  onlyAvailableSeats: boolean;
  setOnlyAvailableSeats: (b: boolean) => void;
  onExploreClick: () => void;
  onRegisterVanClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  setSearchQuery,
  selectedComuna,
  setSelectedComuna,
  onlyAvailableSeats,
  setOnlyAvailableSeats,
  onExploreClick,
  onRegisterVanClick,
}) => {
  return (
    <section className="relative overflow-hidden bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* 2-Column Balanced Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Proposition, copy, search */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Trust Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200/80 rounded-md text-xs font-semibold text-amber-900 mb-4">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Transporte Escolar 100% Verificado según Normativa MTT Chile</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] [text-wrap:balance]">
                Encuentra el furgón escolar ideal con{' '}
                <span className="text-amber-500">cupos reales</span> y choferes certificados
              </h1>

              <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Conectamos a <strong>apoderados</strong> con <strong>conductores de furgón escolar</strong> que
                cuentan con toda su documentación obligatoria al día: Inhabilidad de Menores en Registro Civil,
                revisión técnica Clase A, inscripción en RENASTRE MTT y contacto directo por WhatsApp al iniciar sesión.
              </p>
            </div>

            {/* Interactive Search & Filter Card */}
            <div className="mt-6 p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl shadow-xs">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3 flex items-center justify-between">
                <span>Buscar por Colegio o Comuna</span>
                <span className="text-emerald-700 text-xs font-medium normal-case flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Contacto directo con el chofer
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                {/* Search Input */}
                <div className="sm:col-span-6 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Colegio, calle o chofer..."
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                {/* Comuna Selector */}
                <div className="sm:col-span-6 relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={selectedComuna}
                    onChange={(e) => setSelectedComuna(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 font-medium appearance-none cursor-pointer"
                  >
                    {CHILEAN_COMUNAS.map((comuna) => (
                      <option key={comuna} value={comuna}>
                        {comuna}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Filter Toggles & Actions */}
              <div className="mt-3.5 pt-3 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={onlyAvailableSeats}
                    onChange={(e) => setOnlyAvailableSeats(e.target.checked)}
                    className="w-4 h-4 text-amber-500 border-slate-300 rounded focus:ring-amber-400"
                  />
                  <span>Mostrar solo con cupos disponibles</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onExploreClick}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <span>Ver Furgones</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={onRegisterVanClick}
                    className="px-3 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg transition-colors"
                  >
                    Inscribir Furgón
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero High-Impact Photography Asset */}
          <div className="lg:col-span-5 relative">
            <div className="relative h-72 sm:h-96 lg:h-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
              <img
                src="/src/assets/images/hero_school_van_1792376115718.jpg"
                alt="Furgón escolar oficial amarillo frente a colegio"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {/* Bottom scrim with trust overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-5 text-white">
                <div className="text-xs font-bold text-amber-400 tracking-wide uppercase mb-1">
                  Seguridad en cada viaje
                </div>
                <div className="text-sm font-semibold">
                  Tíos y Tías certificados con patente y documentación oficial verificada
                </div>
                <div className="text-[11px] text-slate-300 mt-1 flex items-center gap-2">
                  <span>Capacidad regulada</span>
                  <span>·</span>
                  <span>Cinturón individual</span>
                  <span>·</span>
                  <span>Contacto WhatsApp protegido</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Proof & Mechanism Row Below Hero Split */}
        <div className="mt-10 pt-8 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Registro Civil & Inhabilidad</div>
              <div className="text-xs text-slate-500 mt-0.5">
                Certificado obligatorio de no inhabilidad para trabajar con menores.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-800 shrink-0">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">RENASTRE & Revisión A</div>
              <div className="text-xs text-slate-500 mt-0.5">
                Inscripción MTT vigente y revisión técnica especial semestral.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Cupos en Tiempo Real</div>
              <div className="text-xs text-slate-500 mt-0.5">
                Disponibilidad exacta de asientos para evitar sobrecupo escolar.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">WhatsApp Seguro</div>
              <div className="text-xs text-slate-500 mt-0.5">
                Acceso directo al chat del chofer al iniciar sesión con tu cuenta.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
