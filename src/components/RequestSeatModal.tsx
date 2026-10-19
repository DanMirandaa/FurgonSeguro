import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Van, EmailNotification } from '../types';
import {
  X,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Bus,
  School,
  MapPin,
  Clock,
  User,
  ShieldCheck,
} from 'lucide-react';

interface RequestSeatModalProps {
  van: Van;
  onClose: () => void;
  onSuccess: (notification: EmailNotification) => void;
}

export const RequestSeatModal: React.FC<RequestSeatModalProps> = ({
  van,
  onClose,
  onSuccess,
}) => {
  const { currentUser, isLoggedIn, sendSeatRequestNotification, openAuthModalWithIntent } =
    useAuth();

  const [studentName, setStudentName] = useState(
    currentUser?.childrenNames?.[0]?.split('(')[0]?.trim() || ''
  );
  const [studentGrade, setStudentGrade] = useState('5° Básico');
  const [schoolName, setSchoolName] = useState(van.schools[0] || '');
  const [pickupAddress, setPickupAddress] = useState(
    currentUser?.comuna ? `Sector ${currentUser.comuna}` : 'Av. Principal'
  );
  const [shift, setShift] = useState<string>(van.shifts[0] || 'Mañana');
  const [message, setMessage] = useState(
    'Hola, me interesa reservar un cupo para mi hijo/a para este año escolar. ¿Tiene disponibilidad en su recorrido?'
  );

  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState<EmailNotification | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isLoggedIn) {
      onClose();
      openAuthModalWithIntent('login');
      return;
    }

    if (!studentName.trim()) {
      setError('Por favor indica el nombre del estudiante.');
      return;
    }

    if (!schoolName.trim()) {
      setError('Por favor indica el colegio de destino.');
      return;
    }

    if (!pickupAddress.trim()) {
      setError('Por favor indica la dirección o sector de retiro.');
      return;
    }

    setIsSending(true);

    setTimeout(() => {
      const result = sendSeatRequestNotification({
        vanId: van.id,
        studentName: studentName.trim(),
        studentGrade,
        schoolName: schoolName.trim(),
        pickupAddress: pickupAddress.trim(),
        shift,
        message: message.trim(),
      });

      setIsSending(false);

      if (!result.success || !result.notification) {
        setError(result.error || 'Ocurrió un error al enviar la solicitud.');
        return;
      }

      setSentSuccess(result.notification);
      onSuccess(result.notification);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Solicitar Cupo a {van.driverName}
              </h2>
              <p className="text-xs text-slate-500">
                Furgón {van.brandModel} ({van.patente}) · {van.availableSeats} cupos libres
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {sentSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                ¡Alerta por Correo Enviada con Éxito!
              </h3>
              <p className="text-xs text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
                Se ha despachado una notificación instantánea al correo del chofer{' '}
                <strong className="text-slate-900">{sentSuccess.driverName}</strong> con todos los
                datos del escolar y tus datos de contacto ({sentSuccess.parentPhone}).
              </p>
            </div>

            {/* Email Preview Card */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-1.5 text-slate-700">
              <div className="flex items-center justify-between text-slate-500 text-[11px] pb-1 border-b border-slate-200">
                <span>Para: {sentSuccess.driverEmail}</span>
                <span className="font-semibold text-emerald-600">Estado: Enviado</span>
              </div>
              <div className="font-bold text-slate-900 text-xs pt-1">{sentSuccess.subject}</div>
              <div className="text-[11px]">
                <strong>Escolar:</strong> {sentSuccess.studentName} ({sentSuccess.studentGrade})
              </div>
              <div className="text-[11px]">
                <strong>Colegio:</strong> {sentSuccess.schoolName} · <strong>Turno:</strong>{' '}
                {sentSuccess.shift}
              </div>
              <div className="text-[11px]">
                <strong>Retiro:</strong> {sentSuccess.pickupAddress}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
            >
              Cerrar y Volver
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
            {/* Notice */}
            <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl flex items-start gap-2.5 text-xs text-blue-950">
              <Mail className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <span>
                <strong>Notificación Directa por Email:</strong> Al presionar enviar, el chofer recibirá
                un correo electrónico formal notificándole sobre tu interés para coordinar el cupo y la
                ruta.
              </span>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Student info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Nombre del Escolar</span>
                </label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Ej: Lucas Morales"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Curso o Nivel</label>
                <input
                  type="text"
                  value={studentGrade}
                  onChange={(e) => setStudentGrade(e.target.value)}
                  placeholder="Ej: 5° Básico / Kínder"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* School & Shift */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <School className="w-3.5 h-3.5 text-slate-500" />
                  <span>Colegio de Destino</span>
                </label>
                <input
                  type="text"
                  required
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="Ej: Colegio San Ignacio"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Turno Requerido</span>
                </label>
                <select
                  value={shift}
                  onChange={(e) => setShift(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  {van.shifts.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>Dirección o Sector de Retiro</span>
              </label>
              <input
                type="text"
                required
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                placeholder="Ej: Av. Charles Hamilton 10450, Las Condes"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Parent message */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mensaje o Consulta Adicional (Opcional)
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Consultas de horarios, tarifas especiales, etc..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Parent contact overview */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Tus datos de apoderado:</span>
                <span>{currentUser?.name || 'Apoderado'} · {currentUser?.phone}</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700">Verificado</span>
            </div>

            {/* Buttons */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSending}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isSending ? (
                  <span>Enviando notificación por correo...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar Solicitud y Alertar por Email</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
