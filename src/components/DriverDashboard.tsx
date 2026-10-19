import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Van, DocumentItem, EmailNotification } from '../types';
import {
  Users,
  Plus,
  Minus,
  ShieldCheck,
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Bus,
  PlusCircle,
  ExternalLink,
  Star,
  MessageSquare,
  Mail,
  MessageCircle,
  Phone,
  Check,
  Inbox,
  Eye,
  X,
  Send,
} from 'lucide-react';

interface DriverDashboardProps {
  onOpenRegisterVan: () => void;
}

export const DriverDashboard: React.FC<DriverDashboardProps> = ({
  onOpenRegisterVan,
}) => {
  const {
    currentUser,
    vans,
    updateVanSeats,
    setVanAvailableSeats,
    addDocumentToVan,
    notifications,
    acceptSeatRequest,
    updateNotificationStatus,
  } = useAuth();

  // Find the van for this driver, or default to the first van
  const driverVan = vans.find((v) => v.driverId === currentUser?.id) || vans[0];

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [docName, setDocName] = useState('Certificado Inhabilidad para Trabajar con Menores');
  const [docInstitution, setDocInstitution] = useState('Servicio de Registro Civil e Identificación');
  const [docNumber, setDocNumber] = useState('');
  const [docExpiry, setDocExpiry] = useState('2026-12-31');

  // Preview Email modal state
  const [viewingEmailNotif, setViewingEmailNotif] = useState<EmailNotification | null>(null);

  if (!driverVan) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto text-amber-700 mb-4">
          <Bus className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Aún no tienes un furgón registrado</h2>
        <p className="text-slate-600 mb-6">
          Inscribe los datos de tu vehículo y sube los documentos exigidos por el Ministerio de Transportes.
        </p>
        <button
          onClick={onOpenRegisterVan}
          className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl shadow-sm transition-colors inline-flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Inscribir Mi Furgón Escolar</span>
        </button>
      </div>
    );
  }

  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docNumber.trim()) return;

    addDocumentToVan(driverVan.id, {
      code: `DOC-${Date.now()}`,
      name: docName,
      institution: docInstitution,
      status: 'verified',
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: docExpiry,
      documentNumber: docNumber,
      verifiedBy: 'Equipo de Validación Automática MTT FurgónSeguro',
      notes: 'Documento procesado y certificado con éxito.',
    });

    setShowUploadModal(false);
    setDocNumber('');
  };

  // Filter notifications for this driver
  const driverNotifications = notifications.filter(
    (n) =>
      n.driverId === driverVan.driverId ||
      n.vanId === driverVan.id ||
      n.driverEmail === currentUser?.email
  );

  const pendingCount = driverNotifications.filter((n) => n.status === 'pending').length;
  const reviews = driverVan.reviews || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner: Driver & Van Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <img
            src={driverVan.driverPhoto}
            alt={driverVan.driverName}
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">{driverVan.driverName}</h1>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Chofer Verificado MTT
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Furgón <strong className="text-slate-800">{driverVan.brandModel}</strong> ({driverVan.year}) · Patente:{' '}
              <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-900 font-bold">
                {driverVan.patente}
              </span>
            </p>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span>{driverVan.comuna}</span>
              <span>·</span>
              <span>RENASTRE: {driverVan.mttRegistryNumber}</span>
              <span>·</span>
              <span>Email para alertas: {currentUser?.email || 'chofer@furgonseguro.cl'}</span>
            </div>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Subir Documento</span>
          </button>
          <button
            onClick={onOpenRegisterVan}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Bus className="w-3.5 h-3.5" />
            <span>Inscribir Otro Furgón</span>
          </button>
        </div>
      </div>

      {/* SECTION: EMAIL NOTIFICATIONS & SEAT REQUESTS INBOX */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold relative">
              <Mail className="w-5 h-5" />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white text-[11px] font-bold flex items-center justify-center animate-bounce">
                  {pendingCount}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Alertas por Correo y Solicitudes de Cupos</span>
                <span className="bg-amber-100 text-amber-900 text-xs px-2 py-0.5 rounded-full font-bold">
                  {driverNotifications.length} recibidas
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Notificaciones automáticas enviadas a tu casilla cada vez que un apoderado solicita cupos en tu furgón
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Casilla conectada:{' '}
            <strong className="text-slate-800 font-mono">
              {currentUser?.email || 'chofer@furgonseguro.cl'}
            </strong>
          </div>
        </div>

        {driverNotifications.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs bg-slate-50 rounded-xl border border-slate-200">
            Aún no has recibido solicitudes de cupo. Cuando los apoderados soliciten cupos, recibirás un correo y aparecerá aquí.
          </div>
        ) : (
          <div className="space-y-4">
            {driverNotifications.map((notif) => {
              const cleanPhone = notif.parentPhone.replace(/[^0-9]/g, '');
              const whatsappReplyUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                `Hola ${notif.parentName}, le escribe ${driverVan.driverName}. Recibí su solicitud por correo electrónico a través de FurgónSeguro para el alumno ${notif.studentName} (${notif.schoolName}). Le confirmo que...`
              )}`;

              return (
                <div
                  key={notif.id}
                  className={`p-4 rounded-xl border transition-all ${
                    notif.status === 'pending'
                      ? 'bg-amber-50/50 border-amber-300'
                      : notif.status === 'accepted'
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Left: Email Details & Student Information */}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{notif.subject}</span>
                        {notif.status === 'pending' && (
                          <span className="bg-amber-100 text-amber-900 border border-amber-200 text-[10px] px-2 py-0.5 rounded-full font-bold">
                            Pendiente de Confirmación
                          </span>
                        )}
                        {notif.status === 'accepted' && (
                          <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Cupo Asignado al Alumno
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400">· {notif.sentAt}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                        <div className="p-2 bg-white rounded-lg border border-slate-200">
                          <span className="text-slate-400 block text-[10px] uppercase">Apoderado</span>
                          <span className="font-bold text-slate-900">{notif.parentName}</span>
                          <span className="text-slate-600 block text-[11px]">{notif.parentPhone}</span>
                        </div>

                        <div className="p-2 bg-white rounded-lg border border-slate-200">
                          <span className="text-slate-400 block text-[10px] uppercase">Alumno / Colegio</span>
                          <span className="font-bold text-slate-900">{notif.studentName} ({notif.studentGrade})</span>
                          <span className="text-slate-600 block text-[11px] truncate">{notif.schoolName}</span>
                        </div>

                        <div className="p-2 bg-white rounded-lg border border-slate-200">
                          <span className="text-slate-400 block text-[10px] uppercase">Retiro / Turno</span>
                          <span className="font-bold text-slate-900">{notif.shift}</span>
                          <span className="text-slate-600 block text-[11px] truncate">{notif.pickupAddress}</span>
                        </div>
                      </div>

                      {notif.message && (
                        <div className="text-xs text-slate-700 bg-white/80 p-2.5 rounded-lg border border-slate-200 italic">
                          "{notif.message}"
                        </div>
                      )}

                      {/* Delivery proof badge */}
                      <div className="flex items-center gap-2 text-[11px] text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>
                          Notificación despachada con éxito a tu correo:{' '}
                          <strong className="font-mono">{notif.driverEmail}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-wrap lg:flex-col gap-2 shrink-0">
                      {notif.status === 'pending' && (
                        <button
                          onClick={() => acceptSeatRequest(notif.id)}
                          disabled={driverVan.availableSeats <= 0}
                          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                          title="Aceptar solicitud y descontar 1 cupo disponible automáticamente"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Asignar Cupo (-1)</span>
                        </button>
                      )}

                      <a
                        href={whatsappReplyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Responder WhatsApp</span>
                      </a>

                      <button
                        onClick={() => setViewingEmailNotif(notif)}
                        className="px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver Correo Completo</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Grid: 1. Cupos Manager & Ratings | 2. Documents Checklist & Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Real-time Cupos & Rating Card */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card: Cupos Manager */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-500" />
                  Control de Cupos Disponibles
                </h3>
                <p className="text-xs text-slate-500">
                  Actualiza en vivo los asientos libres para que los apoderados los vean
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-center">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Cupos Libres Publicados
              </div>
              <div className="text-5xl font-black text-slate-900 font-mono my-2">
                {driverVan.availableSeats}
                <span className="text-xl font-medium text-slate-400"> / {driverVan.totalSeats}</span>
              </div>
              <div className="text-xs text-slate-600 mb-4">
                {driverVan.availableSeats > 0 ? (
                  <span className="text-emerald-700 font-bold">
                    Visible en la plataforma con opción de solicitud por correo y WhatsApp
                  </span>
                ) : (
                  <span className="text-rose-600 font-bold">
                    Furgón lleno: marcado como Sin Cupos Disponibles
                  </span>
                )}
              </div>

              {/* Incremental Controls */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => updateVanSeats(driverVan.id, -1)}
                  disabled={driverVan.availableSeats <= 0}
                  className="w-12 h-12 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-800 flex items-center justify-center font-bold text-lg disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-colors"
                  title="Restar 1 cupo (ej. nuevo alumno matriculado)"
                >
                  <Minus className="w-5 h-5" />
                </button>

                <div className="text-xs font-semibold text-slate-700">
                  {driverVan.availableSeats} disponibles
                </div>

                <button
                  onClick={() => updateVanSeats(driverVan.id, 1)}
                  disabled={driverVan.availableSeats >= driverVan.totalSeats}
                  className="w-12 h-12 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center font-bold text-lg disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-colors"
                  title="Sumar 1 cupo (ej. cupo liberado)"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Set Row */}
              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-center gap-2">
                <span className="text-[11px] text-slate-500">Fijar directo:</span>
                {[0, 1, 2, 4, 6].map((num) => (
                  <button
                    key={num}
                    onClick={() => setVanAvailableSeats(driverVan.id, num)}
                    className="px-2.5 py-1 text-xs font-bold rounded-md bg-white hover:bg-amber-100 border border-slate-200 text-slate-700"
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Rating Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Reputación y Reseñas</span>
              </h3>
              <span className="text-xs font-bold font-mono text-amber-600">
                ★ {driverVan.driverRating}
              </span>
            </div>

            <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-center justify-between">
              <span>Valoraciones recibidas:</span>
              <strong className="font-mono text-slate-900 text-sm">
                {driverVan.driverReviewsCount} apoderados
              </strong>
            </div>

            <div className="text-xs text-slate-500 leading-relaxed">
              Las opiniones favorables de apoderados tras el periodo de servicio escolar aumentan
              significativamente las solicitudes por correo recibidas.
            </div>
          </div>
        </div>

        {/* Right Column: Documentation Dossier & Reviews */}
        <div className="lg:col-span-7 space-y-6">
          {/* Documents Checklist */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  Documentación Exigida por Normativa MTT y Registro Civil
                </h3>
                <p className="text-xs text-slate-500">
                  Todos tus certificados legales revisados para operar con tranquilidad
                </p>
              </div>
              <button
                onClick={() => setShowUploadModal(true)}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Añadir documento</span>
              </button>
            </div>

            {/* Documents Table / List */}
            <div className="space-y-3">
              {driverVan.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{doc.name}</span>
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] px-2 py-0.5 rounded-full font-bold">
                        Vigente
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500">
                      Emisor: <strong className="text-slate-700">{doc.institution}</strong> · N°:{' '}
                      <span className="font-mono text-slate-800">{doc.documentNumber}</span>
                    </div>

                    {doc.notes && (
                      <div className="text-[11px] text-slate-600 italic">"{doc.notes}"</div>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Vence</div>
                    <div className="text-xs font-mono font-bold text-slate-800">{doc.expiryDate}</div>
                    <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                      Verificado por MTT
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Received Reviews from Parents */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-500" />
              <span>Reseñas de Apoderados ({reviews.length})</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Comentarios compartidos por familias de tus alumnos sobre la calidad de tu servicio
            </p>

            <div className="space-y-3">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{rev.parentName}</span>
                      <span className="text-[11px] text-slate-500">({rev.schoolName})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-bold font-mono text-slate-900">{rev.rating}</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400">Periodo: {rev.servicePeriod}</div>
                  <p className="text-xs text-slate-700 italic">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: View Simulated Delivered Email Card */}
      {viewingEmailNotif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold">Correo Electrónico Entregado en Casilla</span>
              </div>
              <button
                onClick={() => setViewingEmailNotif(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {/* Email headers */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 text-slate-600 font-mono text-[11px]">
                <div><strong>De:</strong> notificaciones@furgonseguro.cl (FurgónSeguro Notificaciones)</div>
                <div><strong>Para:</strong> {viewingEmailNotif.driverEmail} ({viewingEmailNotif.driverName})</div>
                <div><strong>Fecha:</strong> {viewingEmailNotif.sentAt}</div>
                <div><strong>Asunto:</strong> {viewingEmailNotif.subject}</div>
              </div>

              {/* Email Body template */}
              <div className="border border-slate-200 rounded-xl p-5 space-y-4 bg-white">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center font-black text-slate-950">
                    <Bus className="w-4 h-4" />
                  </div>
                  <span className="font-extrabold text-slate-900 text-sm">FurgónSeguro Notificaciones</span>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm">
                    ¡Hola {viewingEmailNotif.driverName}! Un nuevo apoderado ha solicitado cupo en tu furgón.
                  </h4>
                  <p className="text-slate-600">
                    El apoderado <strong>{viewingEmailNotif.parentName}</strong> ha revisado tu furgón patente{' '}
                    <strong>{viewingEmailNotif.vanPatente}</strong> y te ha enviado los siguientes datos para coordinar
                    el servicio:
                  </p>
                </div>

                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5 text-slate-800">
                  <div><strong>Nombre del Alumno:</strong> {viewingEmailNotif.studentName} ({viewingEmailNotif.studentGrade})</div>
                  <div><strong>Colegio de Destino:</strong> {viewingEmailNotif.schoolName}</div>
                  <div><strong>Dirección de Retiro:</strong> {viewingEmailNotif.pickupAddress}</div>
                  <div><strong>Turno Solicitado:</strong> {viewingEmailNotif.shift}</div>
                  <div><strong>Teléfono Móvil del Apoderado:</strong> {viewingEmailNotif.parentPhone}</div>
                  <div><strong>Correo del Apoderado:</strong> {viewingEmailNotif.parentEmail}</div>
                </div>

                {viewingEmailNotif.message && (
                  <div>
                    <div className="text-slate-500 font-bold mb-1">Mensaje del Apoderado:</div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 italic">
                      "{viewingEmailNotif.message}"
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setViewingEmailNotif(null)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs"
                >
                  Cerrar Vista
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Subir Documento */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Cargar o Renovar Documento</h3>
            <p className="text-xs text-slate-500 mb-4">
              Ingresa los datos del certificado emitido por la institución oficial.
            </p>

            <form onSubmit={handleUploadDocument} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tipo de Documento
                </label>
                <select
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  <option value="Certificado Inhabilidad para Trabajar con Menores">
                    Certificado Inhabilidad para Trabajar con Menores (Registro Civil)
                  </option>
                  <option value="Licencia de Conducir Profesional Clase A1 / A3">
                    Licencia de Conducir Profesional Clase A1 / A3
                  </option>
                  <option value="Revisión Técnica Especial Transporte Escolar">
                    Revisión Técnica Especial Transporte Escolar
                  </option>
                  <option value="Inscripción Registro Nacional Transporte Escolar (RENASTRE)">
                    Inscripción RENASTRE MTT
                  </option>
                  <option value="Seguro Obligatorio SOAP Escolar">
                    Seguro Obligatorio SOAP Escolar
                  </option>
                  <option value="Hoja de Vida del Conductor">Hoja de Vida del Conductor</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Institución Emisora
                </label>
                <input
                  type="text"
                  value={docInstitution}
                  onChange={(e) => setDocInstitution(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Número de Folio / Código
                  </label>
                  <input
                    type="text"
                    required
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    placeholder="Ej: FOL-2026-991"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Fecha de Vencimiento
                  </label>
                  <input
                    type="date"
                    value={docExpiry}
                    onChange={(e) => setDocExpiry(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center bg-slate-50">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <span className="text-xs text-slate-600 block font-medium">
                  Adjuntar PDF o Foto del Certificado
                </span>
                <span className="text-[10px] text-slate-400">Formatos permitidos: PDF, JPG, PNG (hasta 10MB)</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors"
                >
                  Validar y Guardar Documento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
