import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Bus, ShieldCheck, CheckCircle2, ChevronRight, ArrowLeft } from 'lucide-react';
import { CHILEAN_COMUNAS } from '../data/mockData';

interface RegisterVanModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const RegisterVanModal: React.FC<RegisterVanModalProps> = ({ onClose, onSuccess }) => {
  const { currentUser, addNewVan } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Vehicle
  const [patente, setPatente] = useState('');
  const [brandModel, setBrandModel] = useState('Mercedes-Benz Sprinter');
  const [year, setYear] = useState<number>(2023);
  const [totalSeats, setTotalSeats] = useState<number>(18);
  const [availableSeats, setAvailableSeats] = useState<number>(5);

  // Step 2: Coverage & Service
  const [comuna, setComuna] = useState('Las Condes');
  const [sectors, setSectors] = useState('San Carlos de Apoquindo, Los Dominicos');
  const [schools, setSchools] = useState('Colegio San Ignacio, The Grange School');
  const [shifts, setShifts] = useState<('Mañana' | 'Tarde' | 'Jornada Completa')[]>([
    'Mañana',
    'Tarde',
  ]);
  const [monthlyFee, setMonthlyFee] = useState<number>(85000);
  const [assistantName, setAssistantName] = useState('Tía Asistente (Acompañante acreditada)');

  // Step 3: Documents Checklist state
  const [hasLicense, setHasLicense] = useState(true);
  const [hasInhabilityCert, setHasInhabilityCert] = useState(true);
  const [hasTechnicalRev, setHasTechnicalRev] = useState(true);
  const [hasRenastre, setHasRenastre] = useState(true);
  const [hasSoap, setHasSoap] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const driverName = currentUser?.name || 'Tío Conductor';
    const driverPhone = currentUser?.phone || '+56 9 9876 5432';

    addNewVan({
      driverId: currentUser?.id || `driver-${Date.now()}`,
      driverName,
      driverPhone,
      driverPhoto: '/src/assets/images/driver_verification_trust_1792376115803.jpg',
      patente: patente.toUpperCase() || 'KJ-99-44',
      brandModel,
      year: Number(year),
      totalSeats: Number(totalSeats),
      availableSeats: Number(availableSeats),
      comuna,
      sectors: sectors.split(',').map((s) => s.trim()),
      schools: schools.split(',').map((s) => s.trim()),
      shifts,
      monthlyFee: Number(monthlyFee),
      mttRegistryNumber: `MTT-RENASTRE-${Math.floor(10000 + Math.random() * 90000)}-RM`,
      image: '/src/assets/images/van_sprinter_school_1792376115512.jpg',
      assistantName,
      description: `Servicio formal de transporte escolar con chofer profesional y asistente a bordo. Furgón modelo ${brandModel} año ${year} con capacidad para ${totalSeats} alumnos.`,
      documents: [
        {
          id: `doc-${Date.now()}-1`,
          code: 'LIC-A1A3',
          name: 'Licencia de Conducir Profesional Clase A1 / A3',
          institution: `Dirección de Tránsito - I. Municipalidad de ${comuna}`,
          status: 'verified',
          issueDate: '2024-01-10',
          expiryDate: '2028-01-10',
          documentNumber: `LIC-PRO-${Math.floor(100000 + Math.random() * 900000)}`,
          verifiedBy: 'Equipo Legal FurgónSeguro',
        },
        {
          id: `doc-${Date.now()}-2`,
          code: 'CERT-INHAB',
          name: 'Certificado Inhabilidad Menores (Registro Civil)',
          institution: 'Servicio de Registro Civil e Identificación de Chile',
          status: 'verified',
          issueDate: '2026-03-01',
          expiryDate: '2026-09-01',
          documentNumber: `RCIV-INHAB-${Math.floor(10000 + Math.random() * 90000)}`,
          verifiedBy: 'Verificación Automática Registro Civil',
        },
        {
          id: `doc-${Date.now()}-3`,
          code: 'REV-TECNICA',
          name: 'Revisión Técnica Especial Transporte Escolar',
          institution: 'Planta de Revisión Técnica Especializada PRT',
          status: 'verified',
          issueDate: '2026-01-15',
          expiryDate: '2026-07-15',
          documentNumber: `PRT-RT-${Math.floor(10000 + Math.random() * 90000)}`,
          verifiedBy: 'Equipo Inspector',
        },
        {
          id: `doc-${Date.now()}-4`,
          code: 'RENASTRE-MTT',
          name: 'Inscripción RENASTRE MTT Vigente',
          institution: 'SEREMITT RM',
          status: 'verified',
          issueDate: '2024-03-01',
          expiryDate: '2028-03-01',
          documentNumber: `MTT-RENASTRE-${Math.floor(10000 + Math.random() * 90000)}-RM`,
          verifiedBy: 'Ministerio de Transportes y Telecomunicaciones',
        },
        {
          id: `doc-${Date.now()}-5`,
          code: 'SOAP-ESCOLAR',
          name: 'Seguro Obligatorio SOAP Escolar',
          institution: 'Compañía de Seguros BCI / MAPFRE',
          status: 'verified',
          issueDate: '2026-03-01',
          expiryDate: '2027-03-31',
          documentNumber: `POL-SOAP-${Math.floor(1000 + Math.random() * 9000)}`,
          verifiedBy: 'Equipo Legal FurgónSeguro',
        },
      ],
    });

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center text-slate-950 font-bold">
              <Bus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Inscripción de Furgón Escolar</h2>
              <p className="text-xs text-slate-500">
                Paso {step} de 3 · Formulario oficial para conductores certificados
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

        {/* Step progress */}
        <div className="flex items-center px-6 py-2.5 bg-slate-100/70 border-b border-slate-200 text-xs font-semibold">
          <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-amber-700 font-bold' : 'text-slate-400'}`}>
            <span className="w-5 h-5 rounded-full bg-white border border-current flex items-center justify-center text-[10px]">
              1
            </span>
            <span>Vehículo y Cupos</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 mx-2" />
          <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-amber-700 font-bold' : 'text-slate-400'}`}>
            <span className="w-5 h-5 rounded-full bg-white border border-current flex items-center justify-center text-[10px]">
              2
            </span>
            <span>Recorrido y Colegios</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 mx-2" />
          <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-amber-700 font-bold' : 'text-slate-400'}`}>
            <span className="w-5 h-5 rounded-full bg-white border border-current flex items-center justify-center text-[10px]">
              3
            </span>
            <span>Verificación Legal</span>
          </div>
        </div>

        {/* Body Form */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Patente del Furgón (Chile)
                  </label>
                  <input
                    type="text"
                    required
                    value={patente}
                    onChange={(e) => setPatente(e.target.value.toUpperCase())}
                    placeholder="Ej: KJ-84-21"
                    className="w-full px-3 py-2 text-sm uppercase font-mono font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Formato 4 letras o 2 letras + 4 números</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Marca y Modelo
                  </label>
                  <input
                    type="text"
                    required
                    value={brandModel}
                    onChange={(e) => setBrandModel(e.target.value)}
                    placeholder="Ej: Mercedes-Benz Sprinter / Hyundai H1"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Año Vehículo</label>
                  <input
                    type="number"
                    min="2010"
                    max="2026"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Capacidad Total Asientos
                  </label>
                  <input
                    type="number"
                    min="8"
                    max="35"
                    value={totalSeats}
                    onChange={(e) => setTotalSeats(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cupos Libres Iniciales
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={totalSeats}
                    value={availableSeats}
                    onChange={(e) => setAvailableSeats(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-bold text-emerald-700 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nombre de Acompañante / Tía Asistente (Requerido si transporta preescolares)
                </label>
                <input
                  type="text"
                  value={assistantName}
                  onChange={(e) => setAssistantName(e.target.value)}
                  placeholder="Ej: Tía Marcela Gómez (Certificada MTT)"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Comuna Principal</label>
                <select
                  value={comuna}
                  onChange={(e) => setComuna(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  {CHILEAN_COMUNAS.filter((c) => c !== 'Todas las comunas').map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sectores o Barrios que Cubres (separados por coma)
                </label>
                <input
                  type="text"
                  value={sectors}
                  onChange={(e) => setSectors(e.target.value)}
                  placeholder="Ej: San Carlos de Apoquindo, Los Dominicos, Estoril"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Colegios y Escuelas que Atiendes (separados por coma)
                </label>
                <input
                  type="text"
                  value={schools}
                  onChange={(e) => setSchools(e.target.value)}
                  placeholder="Ej: Colegio San Ignacio, The Grange School, Colegio Andino"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tarifa Mensual Referencial (CLP $)
                  </label>
                  <input
                    type="number"
                    step="5000"
                    value={monthlyFee}
                    onChange={(e) => setMonthlyFee(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Precio sugerido por alumno/mes</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Turnos Disponibles
                  </label>
                  <div className="space-y-1.5 mt-1 text-xs">
                    {(['Mañana', 'Tarde', 'Jornada Completa'] as const).map((shift) => (
                      <label key={shift} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={shifts.includes(shift)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setShifts([...shifts, shift]);
                            } else {
                              setShifts(shifts.filter((s) => s !== shift));
                            }
                          }}
                          className="w-3.5 h-3.5 text-amber-500 rounded border-slate-300 focus:ring-amber-400"
                        />
                        <span>{shift}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-950">
                  <span className="font-bold block">Compromiso de Verificación FurgónSeguro:</span>
                  Para proteger a los escolares y garantizar la confianza de los apoderados, confirmamos
                  que dispones de la documentación exigida por la ley chilena.
                </div>
              </div>

              <div className="space-y-3">
                <label className="p-3 border rounded-xl flex items-start gap-3 cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={hasLicense}
                    onChange={(e) => setHasLicense(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Licencia de Conducir Profesional Clase A1 o A3 vigente
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Habilita legalmente para transporte remunerado de escolares.
                    </span>
                  </div>
                </label>

                <label className="p-3 border rounded-xl flex items-start gap-3 cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={hasInhabilityCert}
                    onChange={(e) => setHasInhabilityCert(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Certificado de Inhabilidad para Trabajar con Menores (Registro Civil)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Emitido gratuitamente por el Registro Civil e Identificación de Chile.
                    </span>
                  </div>
                </label>

                <label className="p-3 border rounded-xl flex items-start gap-3 cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={hasTechnicalRev}
                    onChange={(e) => setHasTechnicalRev(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Revisión Técnica Clase A Especial Transporte Escolar al día
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Con chequeo obligatorio de cinturones, luces de emergencia y tacógrafo.
                    </span>
                  </div>
                </label>

                <label className="p-3 border rounded-xl flex items-start gap-3 cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={hasRenastre}
                    onChange={(e) => setHasRenastre(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Inscripción en Registro Nacional de Transporte Escolar (RENASTRE MTT)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Acreditación oficial SEREMITT de la Región Metropolitana.
                    </span>
                  </div>
                </label>

                <label className="p-3 border rounded-xl flex items-start gap-3 cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={hasSoap}
                    onChange={(e) => setHasSoap(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Seguro Obligatorio de Accidentes Personales (SOAP Escolar)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Póliza con cobertura para la totalidad de los pasajeros escolares.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as any)}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Atrás</span>
            </button>
          ) : (
            <div></div>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && !patente.trim()) {
                  alert('Por favor ingresa la patente de tu furgón');
                  return;
                }
                setStep((s) => (s + 1) as any);
              }}
              className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <span>Continuar al Paso {step + 1}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!hasLicense || !hasInhabilityCert || !hasTechnicalRev || !hasRenastre || !hasSoap}
              className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Publicar Furgón y Habilitar Cupos</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
