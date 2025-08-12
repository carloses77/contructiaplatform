'use client';

import { useState } from 'react';
import { authenticateClient, setUserSession } from '../lib/auth';

interface ClientLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ClientLoginModal({ isOpen, onClose, onSuccess }: ClientLoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const client = await authenticateClient(email, password);
      
      if (client) {
        setUserSession(client, 'client');
        onSuccess();
        onClose();
        resetForm();
      } else {
        setError('Credenciales incorrectas');
      }
    } catch (error) {
      setError('Error al iniciar sesión');
      console.error('Error login cliente:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
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
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-user-line text-blue-600 text-xl"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Acceso Cliente</h3>
              <p className="text-sm text-gray-600">Ingresa con tus credenciales</p>
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="ri-mail-line mr-2"></i>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  placeholder="Tu contraseña"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <i className="ri-information-line text-green-600 mt-0.5"></i>
                <div className="text-sm text-green-700">
                  <p className="font-medium mb-1">Credenciales de Prueba:</p>
                  <p>Email: cliente@test.com</p>
                  <p>Contraseña: password123</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer whitespace-nowrap"
            >
              {loading ? (
                <>
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                  Ingresando...
                </>
              ) : (
                <>
                  <i className="ri-login-circle-line mr-2"></i>
                  Ingresar al Panel
                </>
              )}
            </button>
          </form>

          {/* Enlaces adicionales */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center space-y-2">
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer">
                ¿Olvidaste tu contraseña?
              </button>
              <div className="text-sm text-gray-600">
                ¿No tienes cuenta? 
                <button className="text-blue-600 hover:text-blue-800 font-medium ml-1 cursor-pointer">
                  Regístrate aquí
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex items-center justify-center text-sm text-gray-600">
            <i className="ri-shield-check-line mr-2 text-blue-600"></i>
            Conexión segura y cifrada
          </div>
        </div>
      </div>
    </div>
  );
}