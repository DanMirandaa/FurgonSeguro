import React, { useState } from 'react';
import { Van } from '../types';
import { useAuth } from '../context/AuthContext';
import { AddReviewModal } from './AddReviewModal';
import { RequestSeatModal } from './RequestSeatModal';
import {
  X,
  ShieldCheck,
  MapPin,
  School,
  Clock,
  Phone,
  MessageCircle,
  Lock,
  Bookmark,
  Users,
  CheckCircle2,
  Calendar,
  FileText,
  Check,
  Star,
  MessageSquarePlus,
  UserCheck,
  Mail,
} from 'lucide-react';

interface VanDetailModalProps {
  van: Van;
  onClose: () => void;
}

export const VanDetailModal: React.FC<VanDetailModalProps> = ({
  van,
  onClose,
}) => {
  const { isLoggedIn, role, currentUser, savedVanIds, toggleSaveVan, openAuthModalWithIntent } =
    useAuth();
  const isSaved = savedVanIds.includes(van.id);
  const [showAddReview, setShowAddReview] = useState(false);
  const [showRequestSeat, setShowRequestSeat] = useState(false);

  const cleanPhone = van.driverPhone.replace(/[^0-9]/g, '');
  const parentName = currentUser?.name || 'Apoderado';
  const whatsappMessage = encodeURIComponent(
    `Hola ${van.driverName}, le escribo a través de FurgónSeguro. Mi nombre es ${parentName} y me interesa consultar por un cupo de transporte escolar para el furgón patente ${van.patente}. ¿Podría entregarme más información?`
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappMessage}`;

  const reviews = van.reviews || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 text-white font-mono text-xs px-2.5 py-1 rounded-md font-bold tracking-wider flex items-center gap-1.5 border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>{van.patente}</span>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                {van.brandModel} ({van.year})
              </h2>
              <div className="text-xs text-slate-500">
                A cargo de <strong className="text-slate-800">{van.driverName}</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaveVan(van.id)}
              className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isSaved
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current text-amber-500' : ''}`} />
              <span className="hidden sm:inline">{isSaved ? 'Guardado' : 'Guardar'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Visual & Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Van Image */}
            <div className="md:col-span-7 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 relative h-64">
              <img
                src={van.image}
                alt={van.brandModel}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-emerald-600 text-white text-xs px-2.5 py-1 rounded-md font-bold flex items-center gap-1.5 shadow-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>RENASTRE: {van.mttRegistryNumber}</span>
              </div>
            </div>

            {/* Driver Card & Cupos Box */}
            <div className="md:col-span-5 space-y-4">
              {/* Cupos Available Callout */}
              <div
                className={`p-4 rounded-xl border ${
                  van.availableSeats > 0
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50/70 border-rose-200 text-rose-950'
                }`}
              >
                <div className="text-xs font-bold uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Disponibilidad Actual</span>
                  <Users className="w-4 h-4" />
                </div>
                <div className="text-2xl font-black font-mono">
                  {van.availableSeats > 0 ? `${van.availableSeats} Cupos Libres` : 'Sin Cupos Disponibles'}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Capacidad reglamentaria: {van.totalSeats} asientos individuales.
                </div>
              </div>

              {/* Driver identity */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <img
                  src={van.driverPhoto}
                  alt={van.driverName}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-xl object-cover border border-amber-400 shrink-0"
                />
                <div>
                  <div className="text-sm font-bold text-slate-900">{van.driverName}</div>
                  <div className="text-xs text-amber-700 font-semibold flex items-center gap-1 mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                    <span className="font-bold">{van.driverRating}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-600">
                      {van.driverReviewsCount} valoraciones de apoderados
                    </span>
                  </div>
                  {van.assistantName && (
                    <div className="text-[11px] text-slate-600 mt-1.5 font-medium">
                      {van.assistantName}
                    </div>
                  )}
                </div>
              </div>

              {/* Monthly fee */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Tarifa mensual sugerida:</span>
                <span className="font-bold text-sm font-mono text-slate-900">
                  ${van.monthlyFee.toLocaleString('es-CL')} CLP
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
              Descripción del Servicio
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/70 p-4 rounded-xl border border-slate-200">
              {van.description}
            </p>
          </div>

          {/* Schools & Coverage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                <School className="w-4 h-4 text-amber-600" />
                <span>Colegios y Escuelas Cubiertas</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {van.schools.map((school, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                    <span>{school}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>Comuna y Sectores Habituales</span>
              </div>
              <div className="text-xs font-bold text-slate-900 mb-1">{van.comuna}</div>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {van.sectors.map((sector, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></span>
                    <span>{sector}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Full Documentation Audit Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Dossier de Documentación Legal Oficial (Chile)</span>
              </h3>
              <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                100% Verificado
              </span>
            </div>

            <div className="space-y-2 border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
              {van.documents.map((doc) => (
                <div key={doc.id} className="p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{doc.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {doc.institution} · Folio N°: <span className="font-mono text-slate-700">{doc.documentNumber}</span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-[11px] text-slate-400">Vigente hasta: </span>
                    <span className="font-mono font-bold text-slate-800">{doc.expiryDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* REVIEWS & RATINGS SECTION */}
          <div className="pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>Valoraciones y Reseñas de Apoderados ({van.driverReviewsCount})</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Experiencias reales de familias que han contratado este furgón escolar
                </p>
              </div>

              {/* Button to add review */}
              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    onClose();
                    openAuthModalWithIntent('login');
                  } else {
                    setShowAddReview(true);
                  }
                }}
                className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap self-start sm:self-auto"
              >
                <MessageSquarePlus className="w-3.5 h-3.5" />
                <span>Calificar Conductor</span>
              </button>
            </div>

            {/* Scorecard summary */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center mb-4">
              <div className="sm:col-span-4 text-center sm:border-r sm:border-slate-200 sm:pr-4">
                <div className="text-4xl font-black text-slate-900 font-mono">
                  {van.driverRating}
                </div>
                <div className="flex items-center justify-center gap-1 my-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        Math.round(van.driverRating) >= s
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-[11px] text-slate-500">
                  Basado en {van.driverReviewsCount} opiniones de apoderados
                </div>
              </div>

              <div className="sm:col-span-8 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Puntualidad en mañanas:</span>
                  <span className="font-bold font-mono text-slate-800">5.0 / 5.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Seguridad y prudencia vial:</span>
                  <span className="font-bold font-mono text-slate-800">4.9 / 5.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Trato y cuidado con los niños:</span>
                  <span className="font-bold font-mono text-slate-800">5.0 / 5.0</span>
                </div>
              </div>
            </div>

            {/* List of parent reviews */}
            {reviews.length === 0 ? (
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
                Este furgón aún no tiene reseñas públicas. ¡Sé el primer apoderado en calificarlo!
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{rev.parentName}</span>
                        {rev.verifiedApoderado && (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] px-2 py-0.2 rounded-full font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Apoderado Verificado
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                rev.rating >= s
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] font-mono text-slate-400">{rev.date}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-amber-800 bg-amber-50/60 px-2.5 py-1 rounded inline-block">
                      Periodo contratado: <strong>{rev.servicePeriod}</strong> · {rev.schoolName}
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer: Direct WhatsApp CTA or Locked State */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          {isLoggedIn ? (
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-600 text-center sm:text-left">
                <span className="font-bold text-slate-900 block">
                  Teléfono registrado: {van.driverPhone}
                </span>
                <span>Solicita cupo para alertar al chofer por email o escríbele directo por WhatsApp.</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setShowRequestSeat(true)}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <Mail className="w-4 h-4" />
                  <span>Solicitar Cupo (Alerta Email)</span>
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-xs text-slate-600">
                <Lock className="w-5 h-5 text-amber-600 shrink-0" />
                <span>
                  <strong>Contacto Protegido:</strong> Por seguridad de los conductores y escolares, la
                  solicitud con alerta de email y el botón de WhatsApp se habilitan al iniciar sesión.
                </span>
              </div>

              <button
                onClick={() => {
                  onClose();
                  openAuthModalWithIntent('whatsapp');
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition-colors whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Iniciar Sesión para Contactar</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Request Seat Modal */}
      {showRequestSeat && (
        <RequestSeatModal
          van={van}
          onClose={() => setShowRequestSeat(false)}
          onSuccess={() => {
            // kept open inside modal with its own success screen
          }}
        />
      )}

      {/* Add Review Modal */}
      {showAddReview && (
        <AddReviewModal
          van={van}
          onClose={() => setShowAddReview(false)}
          onSuccess={() => {
            setShowAddReview(false);
          }}
        />
      )}
    </div>
  );
};
