import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Van } from '../types';
import { VanCard } from './VanCard';
import { AddReviewModal } from './AddReviewModal';
import {
  User,
  Heart,
  Bookmark,
  MapPin,
  Bus,
  ShieldCheck,
  CheckCircle2,
  School,
  Phone,
  Star,
  MessageSquarePlus,
} from 'lucide-react';

interface ParentDashboardProps {
  onOpenDetails: (van: Van) => void;
  onOpenDocs: (van: Van) => void;
  onBrowseVans: () => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  onOpenDetails,
  onOpenDocs,
  onBrowseVans,
}) => {
  const { currentUser, vans, savedVanIds } = useAuth();
  const [vanToReview, setVanToReview] = useState<Van | null>(null);

  const savedVans = vans.filter((v) => savedVanIds.includes(v.id));

  // Find all reviews written by this parent across all vans
  const myReviews = vans.flatMap((v) =>
    (v.reviews || [])
      .filter((r) => r.parentId === currentUser?.id || r.parentName === currentUser?.name)
      .map((r) => ({ ...r, vanName: `${v.driverName} (${v.brandModel} - ${v.patente})` }))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-2xl shadow-sm shrink-0">
            {currentUser?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">{currentUser?.name}</h1>
              <span className="bg-amber-100 text-amber-900 text-xs px-2.5 py-0.5 rounded-full font-bold">
                Cuenta Apoderado Verificada
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Comuna: <strong className="text-slate-800">{currentUser?.comuna}</strong> · Teléfono:{' '}
              <span className="font-mono text-slate-700">{currentUser?.phone}</span> · Email:{' '}
              <span className="text-slate-600">{currentUser?.email}</span>
            </p>
            {currentUser?.childrenNames && currentUser.childrenNames.length > 0 && (
              <div className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                <School className="w-3.5 h-3.5 text-amber-600" />
                <span>Escolares registrados: {currentUser.childrenNames.join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onBrowseVans}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors whitespace-nowrap shadow-sm"
        >
          Explorar Más Furgones
        </button>
      </div>

      {/* Ratings & Community Trust Banner */}
      <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shrink-0">
            <Star className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-950">
              Sistema de Estrellas y Reseñas de Apoderados
            </div>
            <div className="text-xs text-amber-800">
              ¿Contrataste el furgón escolar durante un semestre o año? Deja tu valoración sobre la
              puntualidad, prudencia al volante y trato con los niños para guiar a otras familias.
            </div>
          </div>
        </div>
      </div>

      {/* My Published Reviews Section */}
      {myReviews.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Mis Reseñas Publicadas ({myReviews.length})</span>
          </h2>
          <div className="space-y-3">
            {myReviews.map((rev) => (
              <div key={rev.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{rev.vanName}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-bold font-mono text-slate-800">{rev.rating}</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500">
                  Periodo: {rev.servicePeriod} · {rev.schoolName}
                </div>
                <p className="text-xs text-slate-700 italic">"{rev.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Saved Vans Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-amber-500 fill-current" />
              <span>Mis Furgones Guardados ({savedVans.length})</span>
            </h2>
            <p className="text-xs text-slate-500">
              Furgones que marcaste como favoritos para consultar disponibilidad, tarifas y dejar reseñas
            </p>
          </div>
        </div>

        {savedVans.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
            <Bus className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">Aún no has guardado ningún furgón</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Haz clic en el ícono de marcador en los furgones de tu interés para guardarlos en esta lista.
            </p>
            <button
              onClick={onBrowseVans}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg transition-colors inline-block"
            >
              Explorar Furgones con Cupos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedVans.map((van) => (
              <div key={van.id} className="relative">
                <VanCard
                  van={van}
                  onOpenDetails={onOpenDetails}
                  onOpenDocs={onOpenDocs}
                />
                {/* Direct quick review button */}
                <div className="mt-2 text-center">
                  <button
                    onClick={() => setVanToReview(van)}
                    className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <MessageSquarePlus className="w-4 h-4 text-amber-700" />
                    <span>Calificar a este conductor ({van.driverName.split(' ')[0]})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {vanToReview && (
        <AddReviewModal
          van={vanToReview}
          onClose={() => setVanToReview(null)}
          onSuccess={() => setVanToReview(null)}
        />
      )}
    </div>
  );
};
