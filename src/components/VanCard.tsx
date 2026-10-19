import React from 'react';
import { Van } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  MapPin,
  School,
  Clock,
  Phone,
  MessageCircle,
  Lock,
  Bookmark,
  FileCheck2,
  Users,
  Star,
  Mail,
} from 'lucide-react';

interface VanCardProps {
  van: Van;
  onOpenDetails: (van: Van) => void;
  onOpenDocs: (van: Van) => void;
}

export const VanCard: React.FC<VanCardProps> = ({
  van,
  onOpenDetails,
  onOpenDocs,
}) => {
  const { isLoggedIn, currentUser, savedVanIds, toggleSaveVan, openAuthModalWithIntent } = useAuth();
  const isSaved = savedVanIds.includes(van.id);

  // Clean phone number for WhatsApp URL
  const cleanPhone = van.driverPhone.replace(/[^0-9]/g, '');
  const parentName = currentUser?.name || 'Apoderado';
  const whatsappMessage = encodeURIComponent(
    `Hola ${van.driverName}, le escribo a través de FurgónSeguro. Mi nombre es ${parentName} y me interesa consultar por un cupo de transporte escolar para el furgón patente ${van.patente}. ¿Podría entregarme más información sobre los colegios y horarios?`
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappMessage}`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col justify-between">
      <div>
        {/* Top Image & Header */}
        <div className="relative h-48 bg-slate-100 overflow-hidden">
          <img
            src={van.image}
            alt={`${van.brandModel} - Furgón Escolar de ${van.driverName}`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />

          {/* Patente Badge on Image */}
          <div className="absolute top-3 left-3 bg-slate-900/90 text-white font-mono text-xs px-2.5 py-1 rounded-md font-bold tracking-wider shadow-sm flex items-center gap-1.5 border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>{van.patente}</span>
          </div>

          {/* Save / Favorite Button */}
          <button
            onClick={() => toggleSaveVan(van.id)}
            title={isSaved ? 'Quitar de guardados' : 'Guardar furgón'}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
              isSaved
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'bg-white/80 text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>

          {/* Verification Banner */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <div className="bg-emerald-600/95 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verificado MTT & Registro Civil</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5">
          {/* Driver & Van Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3
                className="text-base font-bold text-slate-900 leading-snug hover:text-amber-600 transition-colors cursor-pointer"
                onClick={() => onOpenDetails(van)}
              >
                {van.driverName}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {van.brandModel} ({van.year})
              </p>
            </div>

            {/* Cupos Disponibles Badge */}
            <div className="text-right shrink-0">
              <div
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                  van.availableSeats > 0
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>
                  {van.availableSeats > 0
                    ? `${van.availableSeats} cupos libres`
                    : 'Sin cupos disponibles'}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Capacidad: {van.totalSeats} asientos
              </div>
            </div>
          </div>

          {/* Star Rating summary line */}
          <div
            onClick={() => onOpenDetails(van)}
            className="flex items-center gap-1.5 text-xs text-amber-700 font-semibold mb-3 cursor-pointer hover:underline"
          >
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3.5 h-3.5 ${
                    Math.round(van.driverRating) >= s
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-300'
                  }`}
                />
              ))}
            </div>
            <span className="font-bold font-mono text-slate-900">{van.driverRating}</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500 font-normal">
              ({van.driverReviewsCount} valoraciones de apoderados)
            </span>
          </div>

          {/* Key Info: Comuna & Schools */}
          <div className="space-y-2 text-xs text-slate-600 mb-4">
            <div className="flex items-center gap-2 text-slate-700">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="font-semibold">{van.comuna}</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-500 truncate">{van.sectors.slice(0, 2).join(', ')}</span>
            </div>

            <div className="flex items-start gap-2">
              <School className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-medium text-slate-800">Colegios que cubre:</span>{' '}
                <span className="text-slate-600 line-clamp-1">
                  {van.schools.join(' · ')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Turnos: {van.shifts.join(', ')}</span>
            </div>
          </div>

          {/* Legal Checklist indicator */}
          <div className="py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
            <button
              onClick={() => onOpenDocs(van)}
              className="text-slate-700 hover:text-amber-600 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              <span>Documentación Legal Completa</span>
            </button>
            <span className="text-[11px] font-mono text-slate-600 font-semibold">
              ${van.monthlyFee.toLocaleString('es-CL')} / mes
            </span>
          </div>
        </div>
      </div>

      {/* Footer Actions: Contact & Details */}
      <div className="p-5 pt-0 border-t border-slate-100 mt-2 space-y-2.5">
        {/* WhatsApp & Email Request Section: ONLY visible if logged in */}
        {isLoggedIn ? (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onOpenDetails(van)}
              className="py-2.5 px-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Solicitar Cupo</span>
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        ) : (
          <div>
            <button
              onClick={() => openAuthModalWithIntent('whatsapp')}
              className="w-full py-2.5 px-3 bg-slate-100 hover:bg-amber-50 border border-slate-200 hover:border-amber-400 text-slate-800 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all group"
            >
              <Lock className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
              <span>Inicia sesión para ver WhatsApp y teléfono</span>
            </button>
            <p className="text-[10px] text-center text-slate-500 mt-1">
              Protección de privacidad para choferes y apoderados
            </p>
          </div>
        )}

        {/* View Details Button */}
        <button
          onClick={() => onOpenDetails(van)}
          className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs transition-colors text-center"
        >
          Ver Ficha, Reseñas y Certificados Oficiales
        </button>
      </div>
    </div>
  );
};
