import React from 'react';
import { Bus, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: 'catalog' | 'requirements' | 'dashboard') => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center text-slate-950 font-black">
                <Bus className="w-4 h-4" />
              </div>
              <span className="text-white font-extrabold text-base tracking-tight">
                Furgón<span className="text-amber-400">Seguro</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Plataforma de confianza para la contratación de transporte escolar en Chile,
              con verificación documental obligatoria ante el Registro Civil y normativas MTT.
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <div className="text-slate-200 font-bold mb-3 uppercase tracking-wider text-[11px]">
              Plataforma
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onSelectTab('catalog')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Buscar Furgones Escolares
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('requirements')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Requisitos Legales MTT
                </button>
              </li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <div className="text-slate-200 font-bold mb-3 uppercase tracking-wider text-[11px]">
              Seguridad & Legal
            </div>
            <ul className="space-y-2">
              <li>
                <span className="text-slate-300">
                  Certificado Inhabilidad Menores (Registro Civil)
                </span>
              </li>
              <li>
                <span className="text-slate-300">
                  Inscripción RENASTRE MTT
                </span>
              </li>
              <li>
                <span className="text-slate-300">
                  Seguro Obligatorio SOAP Escolar
                </span>
              </li>
              <li>
                <span className="text-slate-300">
                  Revisión Técnica Semestral Clase A
                </span>
              </li>
            </ul>
          </div>

          {/* Community & Contact */}
          <div>
            <div className="text-slate-200 font-bold mb-3 uppercase tracking-wider text-[11px]">
              Comunidad Escolar
            </div>
            <p className="text-slate-400 leading-relaxed mb-3">
              ¿Eres transportista escolar en la Región Metropolitana u otra región? Inscribe tu furgón
              y conecta con cientos de familias de tu sector escolar.
            </p>
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Verificación Documental 100% Garantizada</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} FurgónSeguro Chile. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-4">
            <span>Términos del Servicio</span>
            <span>·</span>
            <span>Política de Privacidad</span>
            <span>·</span>
            <span>Contacto Seguro</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
