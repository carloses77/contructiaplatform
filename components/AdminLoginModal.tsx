'use client';

import { useState } from 'react';
import { authenticateAdmin, setUserSession, verifyAdminPassphrase } from '../lib/auth';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminLoginModal({ isOpen, onClose, onSuccess }: AdminLoginModalProps) {
  const [step, setStep] = useState<'passphrase' | 'login'>('passphrase');
  const [passphrase, setPassphrase] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handlePassphraseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (verifyAdminPassphrase(passphrase)) {
      setStep('login');
    } else {
      setError('Palabra de paso incorrecta');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const adminUser = await authenticateAdmin(email, password);
      
      if (adminUser) {
        setUserSession(adminUser, 'admin');
        onSuccess();
        onClose();
        resetForm();
      } else {
        setError('Credenciales incorrectas');
      }
    } catch (error) {
      setError('Error al iniciar sesión');
      console.error('Error login admin:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep('passphrase');
    setPassphrase('');
    setEmail('');
    setPassword('');
    setError('');
    setShowPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <i className="ri-shield-keyhole-line text-red-600 text-xl"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {step === 'passphrase' ? 'Acceso Protegido' : 'Login Administrador'}
              </h3>
              <p className="text-sm text-gray-600">
                {step === 'passphrase' ? 'Introduce la palabra de paso' : 'Credenciales de administrador'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {step === 'passphrase' ? (
            // Paso 1: Palabra de paso
            <div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2">
                  <i className="ri-alert-line text-red-600"></i>
                  <div>
                    <h4 className="font-medium text-red-800">Área Restringida</h4>
                    <p className="text-sm text-red-700">Solo administradores autorizados</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handlePassphraseSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="ri-key-line mr-2"></i>
                    Palabra de Paso
                  </label>
                  <input
                    type="password"
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    placeholder="Introduce la palabra de paso..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Esta palabra de paso protege el acceso al panel de administración
                  </p>
                </div>

                {error && (
                  <div className="bg-red-100 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <i className="ri-error-warning-line text-red-600"></i>
                      <span className="text-sm text-red-700">{error}</span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-arrow-right-line mr-2"></i>
                  Continuar
                </button>
              </form>
            </div>
          ) : (
            // Paso 2: Login de administrador
            <div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2">
                  <i className="ri-check-line text-green-600"></i>
                  <div>
                    <h4 className="font-medium text-green-800">Acceso Verificado</h4>
                    <p className="text-sm text-green-700">Introduce tus credenciales de administrador</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="ri-mail-line mr-2"></i>
                    Email Administrador
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@constructia.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="ri-lock-line mr-2"></i>
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Contraseña de administrador"
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <i className={showPassword ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-100 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <i className="ri-error-warning-line text-red-600"></i>
                      <span className="text-sm text-red-700">{error}</span>
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <i className="ri-information-line text-blue-600 mt-0.5"></i>
                    <div className="text-sm text-blue-700">
                      <p className="font-medium mb-1">Credenciales de Prueba:</p>
                      <p>Email: admin@constructia.com</p>
                      <p>Contraseña: superadmin123</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setStep('passphrase')}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-arrow-left-line mr-2"></i>
                    Volver
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 cursor-pointer whitespace-nowrap"
                  >
                    {loading ? (
                      <>
                        <i className="ri-loader-4-line animate-spin mr-2"></i>
                        Ingresando...
                      </>
                    ) : (
                      <>
                        <i className="ri-login-circle-line mr-2"></i>
                        Ingresar
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex items-center justify-center text-sm text-gray-600">
            <i className="ri-shield-check-line mr-2 text-green-600"></i>
            Acceso seguro con autenticación de doble capa
          </div>
        </div>
      </div>
    </div>
  );
}