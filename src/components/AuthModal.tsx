import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, ShieldCheck, Bus, HeartHandshake, CheckCircle2, AlertCircle, KeyRound, ArrowRight } from 'lucide-react';
import { CHILEAN_COMUNAS } from '../data/mockData';

interface AuthModalProps {
  onClose: () => void;
  onSuccessRole?: (role: 'apoderado' | 'conductor') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccessRole }) => {
  const { login, registerUser, isEmailRegistered, authModalIntent } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>(
    authModalIntent === 'register_driver' ? 'register' : 'login'
  );
  const [selectedRole, setSelectedRole] = useState<'apoderado' | 'conductor'>(
    authModalIntent === 'register_driver' ? 'conductor' : 'apoderado'
  );

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register form
  const [fullName, setFullName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [phone, setPhone] = useState('+56 9 ');
  const [comuna, setComuna] = useState('Las Condes');
  const [childrenInfo, setChildrenInfo] = useState('');
  const [registerErrors, setRegisterErrors] = useState<Record<string, string>>({});
  const [globalRegisterError, setGlobalRegisterError] = useState('');

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim() || !loginEmail.includes('@')) {
      setLoginError('Por favor ingresa un correo electrónico válido');
      return;
    }
    if (!loginPassword) {
      setLoginError('Por favor ingresa tu contraseña');
      return;
    }

    const result = login(loginEmail, loginPassword);
    if (!result.success) {
      setLoginError(result.error || 'Credenciales incorrectas');
      return;
    }

    if (onSuccessRole && result.user) {
      onSuccessRole(result.user.role);
    }
    onClose();
  };

  const handleFillTestCredentials = (role: 'conductor' | 'apoderado') => {
    if (role === 'conductor') {
      setLoginEmail('chofer@furgonseguro.cl');
      setLoginPassword('chofer123');
    } else {
      setLoginEmail('apoderado@furgonseguro.cl');
      setLoginPassword('apoderado123');
    }
    setLoginError('');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalRegisterError('');
    const errors: Record<string, string> = {};

    const cleanEmail = registerEmail.trim().toLowerCase();

    if (!fullName.trim()) errors.fullName = 'El nombre completo es obligatorio';
    if (!cleanEmail || !cleanEmail.includes('@')) {
      errors.email = 'Ingresa un correo electrónico válido';
    } else if (isEmailRegistered(cleanEmail)) {
      errors.email = 'Este correo ya se encuentra registrado';
      setGlobalRegisterError(
        `El correo "${cleanEmail}" ya está registrado en la plataforma. Solo se permite 1 cuenta por correo. Por favor inicia sesión o utiliza otro correo.`
      );
    }

    if (!registerPassword || registerPassword.length < 5) {
      errors.password = 'La contraseña debe tener mínimo 5 caracteres';
    }
    if (phone.length < 9) {
      errors.phone = 'Ingresa un número de celular de contacto (+56 9...)';
    }

    if (Object.keys(errors).length > 0) {
      setRegisterErrors(errors);
      return;
    }

    const result = registerUser({
      name: fullName.trim(),
      email: cleanEmail,
      password: registerPassword,
      phone,
      role: selectedRole,
      comuna,
      childrenNames: selectedRole === 'apoderado' && childrenInfo ? [childrenInfo] : undefined,
    });

    if (!result.success) {
      setGlobalRegisterError(result.error || 'No fue posible registrar la cuenta.');
      return;
    }

    if (onSuccessRole) onSuccessRole(selectedRole);
    onClose();
  };

  const handleSwitchToLoginWithEmail = (emailToPreload: string) => {
    setLoginEmail(emailToPreload);
    setTab('login');
    setGlobalRegisterError('');
    setRegisterErrors({});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden relative">
        {/* Header bar */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center text-slate-950 font-black">
                <Bus className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                {tab === 'login' ? 'Iniciar Sesión en FurgónSeguro' : 'Crear Cuenta Nueva'}
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              {tab === 'login'
                ? 'Ingresa tus credenciales para acceder a contactos y cupos'
                : 'Registra tu perfil como apoderado o conductor certificado'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice for WhatsApp unlock */}
        {authModalIntent === 'whatsapp' && (
          <div className="mx-6 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
            <Lock className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="text-xs text-amber-900 leading-tight">
              <span className="font-semibold block">Seguridad para la comunidad:</span>
              El botón directo de WhatsApp y los datos del transportista están protegidos y sólo son accesibles para usuarios registrados.
            </div>
          </div>
        )}

        <div className="p-6">
          {/* Tab Selector: Iniciar Sesión / Registrarse */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg mb-5">
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setLoginError('');
                setGlobalRegisterError('');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
                tab === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('register');
                setRegisterErrors({});
                setGlobalRegisterError('');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
                tab === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Crear Cuenta (Registro)
            </button>
          </div>

          {/* Tab 1: LOGIN FORM */}
          {tab === 'login' ? (
            <div className="space-y-4">
              {/* Reference box with the 2 official test accounts */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
                <div className="font-bold text-slate-700 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                  <span>Cuentas de Prueba Disponibles:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="font-bold text-slate-900 block">Cuenta Chofer:</span>
                    <span className="text-slate-600 font-mono block">chofer@furgonseguro.cl</span>
                    <span className="text-slate-500 font-mono">Clave: chofer123</span>
                    <button
                      type="button"
                      onClick={() => handleFillTestCredentials('conductor')}
                      className="mt-1 text-amber-600 hover:text-amber-700 font-semibold text-[10px] block underline"
                    >
                      Copiar al formulario
                    </button>
                  </div>

                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="font-bold text-slate-900 block">Cuenta Apoderado:</span>
                    <span className="text-slate-600 font-mono block">apoderado@furgonseguro.cl</span>
                    <span className="text-slate-500 font-mono">Clave: apoderado123</span>
                    <button
                      type="button"
                      onClick={() => handleFillTestCredentials('apoderado')}
                      className="mt-1 text-amber-600 hover:text-amber-700 font-semibold text-[10px] block underline"
                    >
                      Copiar al formulario
                    </button>
                  </div>
                </div>
              </div>

              {loginError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleManualLogin} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      if (loginError) setLoginError('');
                    }}
                    placeholder="tucorreo@ejemplo.cl"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contraseña</label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      if (loginError) setLoginError('');
                    }}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-lg shadow-sm transition-colors mt-2"
                >
                  Ingresar a mi Cuenta
                </button>
              </form>
            </div>
          ) : (
            /* Tab 2: REGISTER FORM */
            <form onSubmit={handleRegister} className="space-y-3.5">
              {/* Duplicate email alert banner */}
              {globalRegisterError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{globalRegisterError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSwitchToLoginWithEmail(registerEmail.trim().toLowerCase())}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                  >
                    <span>Iniciar sesión con este correo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  ¿Cómo te deseas registrar?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('apoderado')}
                    className={`p-2.5 border rounded-xl text-left flex items-start gap-2 transition-all ${
                      selectedRole === 'apoderado'
                        ? 'border-amber-500 bg-amber-50/70 text-amber-950 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <HeartHandshake className={`w-4 h-4 mt-0.5 ${selectedRole === 'apoderado' ? 'text-amber-600' : 'text-slate-400'}`} />
                    <div>
                      <div className="text-xs font-bold">Apoderado/a</div>
                      <div className="text-[10px] text-slate-500 font-normal">Busco transporte escolar</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('conductor')}
                    className={`p-2.5 border rounded-xl text-left flex items-start gap-2 transition-all ${
                      selectedRole === 'conductor'
                        ? 'border-amber-500 bg-amber-50/70 text-amber-950 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Bus className={`w-4 h-4 mt-0.5 ${selectedRole === 'conductor' ? 'text-amber-600' : 'text-slate-400'}`} />
                    <div>
                      <div className="text-xs font-bold">Chofer / Tío(a)</div>
                      <div className="text-[10px] text-slate-500 font-normal">Ofrezco furgón y cupos</div>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (registerErrors.fullName) {
                      setRegisterErrors((prev) => ({ ...prev, fullName: '' }));
                    }
                  }}
                  placeholder="Ej: Marcelo González"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
                {registerErrors.fullName && (
                  <p className="text-xs text-rose-500 mt-1">{registerErrors.fullName}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-slate-700">Correo Electrónico</label>
                    <span className="text-[10px] text-slate-400">1 cuenta por correo</span>
                  </div>
                  <input
                    type="email"
                    required
                    value={registerEmail}
                    onChange={(e) => {
                      setRegisterEmail(e.target.value);
                      setGlobalRegisterError('');
                      if (registerErrors.email) {
                        setRegisterErrors((prev) => ({ ...prev, email: '' }));
                      }
                    }}
                    placeholder="tucorreo@email.com"
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 ${
                      registerErrors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                    }`}
                  />
                  {registerErrors.email && (
                    <p className="text-xs text-rose-500 mt-1 font-medium">{registerErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Contraseña</label>
                  <input
                    type="password"
                    required
                    value={registerPassword}
                    onChange={(e) => {
                      setRegisterPassword(e.target.value);
                      if (registerErrors.password) {
                        setRegisterErrors((prev) => ({ ...prev, password: '' }));
                      }
                    }}
                    placeholder="Mínimo 5 caracteres"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                  {registerErrors.password && (
                    <p className="text-xs text-rose-500 mt-1">{registerErrors.password}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Teléfono Móvil</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (registerErrors.phone) {
                        setRegisterErrors((prev) => ({ ...prev, phone: '' }));
                      }
                    }}
                    placeholder="+56 9 1234 5678"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                  {registerErrors.phone && (
                    <p className="text-xs text-rose-500 mt-1">{registerErrors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Comuna Base</label>
                  <select
                    value={comuna}
                    onChange={(e) => setComuna(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                  >
                    {CHILEAN_COMUNAS.filter((c) => c !== 'Todas las comunas').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedRole === 'apoderado' ? (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Colegios de Interés / Hijos (Opcional)
                  </label>
                  <input
                    type="text"
                    value={childrenInfo}
                    onChange={(e) => setChildrenInfo(e.target.value)}
                    placeholder="Ej: Colegio San Ignacio, 4° Básico"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    Al registrarte como chofer podrás inscribir tu furgón y cargar los certificados de Inhabilidad, RENASTRE y Revisión Técnica en tu panel.
                  </span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-lg shadow-sm transition-colors mt-2"
              >
                Crear Mi Cuenta
              </button>
            </form>
          )}

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-500">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>1 cuenta por correo · Datos protegidos y verificación oficial chilena</span>
          </div>
        </div>
      </div>
    </div>
  );
};
