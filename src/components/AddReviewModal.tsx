import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Van } from '../types';
import { X, Star, ShieldCheck, CheckCircle2, MessageSquare, AlertCircle, School, Calendar } from 'lucide-react';

interface AddReviewModalProps {
  van: Van;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddReviewModal: React.FC<AddReviewModalProps> = ({ van, onClose, onSuccess }) => {
  const { currentUser, isLoggedIn, role, addReviewToVan, openAuthModalWithIntent } = useAuth();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [servicePeriod, setServicePeriod] = useState('Año Escolar Completo 2025');
  const [schoolName, setSchoolName] = useState(van.schools[0] || 'Colegio San Ignacio');
  const [punctuality, setPunctuality] = useState<number>(5);
  const [safety, setSafety] = useState<number>(5);
  const [treatment, setTreatment] = useState<number>(5);
  const [error, setError] = useState('');

  const starLabels: Record<number, string> = {
    1: 'Insatisfactorio',
    2: 'Regular',
    3: 'Bueno',
    4: 'Muy Bueno',
    5: 'Excelente (100% Recomendado)',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isLoggedIn) {
      onClose();
      openAuthModalWithIntent('login');
      return;
    }

    if (role !== 'apoderado') {
      setError('Solo los usuarios registrados como apoderados pueden calificar a un conductor.');
      return;
    }

    if (!comment.trim() || comment.trim().length < 15) {
      setError('Por favor escribe un comentario de al menos 15 caracteres contando tu experiencia con el conductor.');
      return;
    }

    addReviewToVan(van.id, {
      vanId: van.id,
      driverId: van.driverId,
      parentId: currentUser?.id || 'apoderado-id',
      parentName: currentUser?.name || 'Apoderado Verificado',
      schoolName,
      rating,
      comment: comment.trim(),
      servicePeriod,
      aspects: {
        punctuality,
        safety,
        treatment,
      },
    });

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Calificar a {van.driverName}
              </h2>
              <p className="text-xs text-slate-500">
                Furgón {van.brandModel} ({van.patente})
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Trust notice */}
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>
              <strong>Comunidad de Confianza:</strong> Tus valoraciones ayudan a otros apoderados a
              elegir el transporte escolar de sus hijos con total seguridad.
            </span>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Interactive Star Picker */}
          <div className="text-center py-2 bg-slate-50 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
              Calificación General del Servicio
            </label>
            <div className="flex items-center justify-center gap-2 mb-1">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = (hoverRating || rating) >= star;
                return (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-slate-300 hover:scale-110 transition-transform focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        isFilled ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <div className="text-xs font-bold text-amber-700">
              {starLabels[hoverRating || rating]} ({hoverRating || rating} de 5 estrellas)
            </div>
          </div>

          {/* Service Period & School */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Periodo del Servicio</span>
              </label>
              <select
                value={servicePeriod}
                onChange={(e) => setServicePeriod(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white"
              >
                <option value="Año Escolar Completo 2025">Año Escolar Completo 2025</option>
                <option value="1er Semestre 2025">1er Semestre 2025</option>
                <option value="2do Semestre 2025">2do Semestre 2025</option>
                <option value="Más de 2 años continuo">Más de 2 años continuo</option>
                <option value="1 a 3 meses de servicio">1 a 3 meses de servicio</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <School className="w-3.5 h-3.5 text-slate-500" />
                <span>Colegio de tu hijo/a</span>
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
          </div>

          {/* Sub-ratings: Puntualidad, Seguridad, Trato */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Aspectos Específicos
            </div>

            {/* Puntualidad */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">Puntualidad en las mañanas:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setPunctuality(num)}
                    className={`w-6 h-6 rounded text-xs font-bold transition-colors ${
                      punctuality >= num
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'bg-white border border-slate-200 text-slate-400'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Seguridad vial */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">Seguridad y prudencia al volante:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setSafety(num)}
                    className={`w-6 h-6 rounded text-xs font-bold transition-colors ${
                      safety >= num
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'bg-white border border-slate-200 text-slate-400'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Trato con los niños */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">Trato y cuidado a los niños:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setTreatment(num)}
                    className={`w-6 h-6 rounded text-xs font-bold transition-colors ${
                      treatment >= num
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'bg-white border border-slate-200 text-slate-400'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Comment text */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>Tu Reseña y Experiencia Personal</span>
              <span className="text-[10px] text-slate-400 font-normal">Mínimo 15 caracteres</span>
            </label>
            <textarea
              rows={4}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe cómo ha sido el servicio: puntualidad, trato de los tíos del furgón, comunicación por WhatsApp, uso de cinturones, etc..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            />
          </div>

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
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Publicar Reseña</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
