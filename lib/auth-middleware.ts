'use client';

import { useEffect, useState } from 'react';
import { getUserSession, clearUserSession, AdminUser, ClientUser } from './auth';

// Hook para verificar autenticación de administrador
export const useAdminAuth = () => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const adminUser = getUserSession('admin') as AdminUser | null;
      
      if (adminUser) {
        setUser(adminUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const logout = () => {
    clearUserSession('admin');
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  return { user, loading, isAuthenticated, logout };
};

// Hook para verificar autenticación de cliente
export const useClientAuth = () => {
  const [user, setUser] = useState<ClientUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const clientUser = getUserSession('client') as ClientUser | null;
      
      if (clientUser) {
        setUser(clientUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const logout = () => {
    clearUserSession('client');
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  return { user, loading, isAuthenticated, logout };
};

// Componente protector para rutas de administrador
interface AdminProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const AdminProtectedRoute = ({ children, fallback }: AdminProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback || (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-lock-line text-red-600 text-2xl"></i>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Acceso Restringido</h2>
          <p className="text-gray-600 mb-6">Necesitas estar autenticado como administrador para acceder a esta página.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Componente protector para rutas de cliente
interface ClientProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ClientProtectedRoute = ({ children, fallback }: ClientProtectedRouteProps) => {
  const { isAuthenticated, loading } = useClientAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback || (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-user-line text-blue-600 text-2xl"></i>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Acceso de Cliente Requerido</h2>
          <p className="text-gray-600 mb-6">Necesitas estar autenticado como cliente para acceder a tu panel.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};