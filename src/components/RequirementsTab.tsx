import React from 'react';
import {
  ShieldCheck,
  FileCheck2,
  AlertTriangle,
  Bus,
  CheckCircle2,
  Users,
  Award,
  ExternalLink,
} from 'lucide-react';

interface RequirementsTabProps {
  onRegisterVan: () => void;
}

export const RequirementsTab: React.FC<RequirementsTabProps> = ({ onRegisterVan }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-md text-xs font-semibold text-amber-900 mb-3">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span>Normativa del Ministerio de Transportes y Telecomunicaciones (MTT)</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Requisitos Legales y Documentación Obligatoria
        </h2>
        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
          En FurgónSeguro cada transportista es auditado minuciosamente. Ningún vehículo puede
          publicar cupos sin haber validado su documentación ante los organismos del Estado de Chile.
        </p>
      </div>

      {/* Grid of 6 Mandatory Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 font-bold shrink-0">
            1
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Certificado de Inhabilidad para Trabajar con Menores
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Emitido por el <strong>Registro Civil e Identificación</strong>. Acredita que el conductor
              no figura en el Registro de Inhabilidades para condenados por delitos sexuales contra menores.
            </p>
            <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md inline-block">
              ✓ Obligatorio para Conductor y Acompañante
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 font-bold shrink-0">
            2
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Licencia Profesional Clase A1 o A3
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Licencia habilitante profesional otorgada por la Dirección de Tránsito Municipal tras
              aprobar exámenes teóricos, prácticos y psicotécnicos rigurosos.
            </p>
            <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md inline-block">
              ✓ Experiencia profesional certificada
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 font-bold shrink-0">
            3
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Inscripción en RENASTRE (Registro Nacional MTT)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              El furgón debe estar oficialmente autorizado por la Secretaría Regional Ministerial de
              Transportes (SEREMITT). Se entrega cartola identificadora con código QR oficial.
            </p>
            <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md inline-block">
              ✓ Cartola visible en parabrisas
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 font-bold shrink-0">
            4
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Revisión Técnica Semestral Especial Clase A
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              A diferencia de vehículos particulares, los furgones escolares se inspeccionan cada 6
              meses evaluando cinturones de 3 puntas, extintores, piso antideslizante y frenos ABS.
            </p>
            <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md inline-block">
              ✓ Inspección cada 6 meses al día
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 font-bold shrink-0">
            5
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Seguro Obligatorio SOAP Escolar
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Póliza especial contratada para transporte escolar con cobertura médica e indemnización
              para todos los escolares transportados.
            </p>
            <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md inline-block">
              ✓ Póliza vigente ante cualquier siniestro
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 font-bold shrink-0">
            6
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Acompañante Adulto Acreditado
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Si el vehículo transporta a más de cinco niños de nivel preescolar (jardín, prekínder o
              kínder), la ley exige que viaje un acompañante adulto acreditado además del chofer.
            </p>
            <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md inline-block">
              ✓ Cuidado especializado en descensos
            </div>
          </div>
        </div>
      </div>

      {/* CTA Box for Drivers */}
      <div className="p-8 bg-slate-900 rounded-2xl text-white text-center flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
          <Bus className="w-6 h-6" />
        </div>
        <div className="max-w-xl">
          <h3 className="text-2xl font-bold">¿Tienes tu furgón al día y buscas alumnos?</h3>
          <p className="text-sm text-slate-300 mt-2">
            Inscribe tu furgón en minutos, publica tus colegios y comunas de recorrido, y recibe
            consultas de apoderados directamente por WhatsApp.
          </p>
        </div>
        <button
          onClick={onRegisterVan}
          className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-sm transition-colors shadow-sm"
        >
          Inscribir Mi Furgón Escolar Ahora
        </button>
      </div>
    </div>
  );
};
