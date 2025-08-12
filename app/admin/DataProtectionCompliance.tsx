'use client';

import { useState, useEffect } from 'react';

export default function DataProtectionCompliance() {
  const [complianceChecks, setComplianceChecks] = useState([
    {
      category: 'Principios Fundamentales LOPD',
      checks: [
        { name: 'Licitud del tratamiento', status: 'compliant', description: 'Base legal establecida para todos los tratamientos' },
        { name: 'Minimización de datos', status: 'compliant', description: 'Solo se recopilan datos necesarios' },
        { name: 'Exactitud de datos', status: 'compliant', description: 'Mecanismos de actualización implementados' },
        { name: 'Limitación de conservación', status: 'compliant', description: 'Períodos de retención definidos' }
      ]
    },
    {
      category: 'Derechos de los Interesados',
      checks: [
        { name: 'Derecho de acceso', status: 'compliant', description: 'Sistema de consulta de datos personales' },
        { name: 'Derecho de rectificación', status: 'compliant', description: 'Proceso de corrección de datos' },
        { name: 'Derecho de supresión', status: 'compliant', description: 'Eliminación segura de datos' },
        { name: 'Derecho de portabilidad', status: 'compliant', description: 'Exportación de datos en formato estándar' }
      ]
    },
    {
      category: 'Seguridad Técnica',
      checks: [
        { name: 'Cifrado de datos', status: 'compliant', description: 'Datos cifrados en reposo y tránsito' },
        { name: 'Control de acceso', status: 'compliant', description: 'Autenticación y autorización robusta' },
        { name: 'Logs de auditoría', status: 'compliant', description: 'Registro inviolable de actividades' },
        { name: 'Backup seguro', status: 'compliant', description: 'Copias de seguridad cifradas' }
      ]
    },
    {
      category: 'Gobernanza y Organización',
      checks: [
        { name: 'Registro de actividades', status: 'compliant', description: 'Inventario completo de tratamientos' },
        { name: 'Evaluaciones de impacto', status: 'compliant', description: 'DPIA realizadas para tratamientos de alto riesgo' },
        { name: 'Formación del personal', status: 'warning', description: 'Pendiente formación trimestral' },
        { name: 'Procedimientos de breach', status: 'compliant', description: 'Plan de respuesta a incidentes' }
      ]
    }
  ]);

  const [privacyMetrics, setPrivacyMetrics] = useState({
    totalDataSubjects: 1247,
    dataRetentionCompliance: 98.5,
    accessRequests: 15,
    dataBreaches: 0,
    consentRate: 94.2,
    complianceScore: 96.8
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'non-compliant':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'ri-checkbox-circle-line text-green-600';
      case 'warning':
        return 'ri-alert-line text-yellow-600';
      case 'non-compliant':
        return 'ri-close-circle-line text-red-600';
      default:
        return 'ri-information-line text-gray-600';
    }
  };

  const generateComplianceReport = () => {
    alert('Generando reporte de cumplimiento LOPD...');
  };

  const updateComplianceItem = (categoryIndex: number, itemIndex: number) => {
    // Simular actualización de estado de cumplimiento
    alert('Esta acción requiere autorización del DPO (Delegado de Protección de Datos)');
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cumplimiento de Protección de Datos</h2>
          <p className="text-gray-600 mt-1">
            Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de derechos digitales
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={generateComplianceReport}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <i className="ri-file-shield-line mr-2"></i>
            Reporte LOPD
          </button>
        </div>
      </div>

      {/* Métricas de Cumplimiento */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Puntuación Global</p>
              <p className="text-2xl font-bold text-green-600">{privacyMetrics.complianceScore}%</p>
            </div>
            <i className="ri-shield-check-line text-green-600 text-2xl"></i>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sujetos de Datos</p>
              <p className="text-2xl font-bold text-blue-600">{privacyMetrics.totalDataSubjects.toLocaleString()}</p>
            </div>
            <i className="ri-user-3-line text-blue-600 text-2xl"></i>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Retención Datos</p>
              <p className="text-2xl font-bold text-purple-600">{privacyMetrics.dataRetentionCompliance}%</p>
            </div>
            <i className="ri-time-line text-purple-600 text-2xl"></i>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Solicitudes Acceso</p>
              <p className="text-2xl font-bold text-yellow-600">{privacyMetrics.accessRequests}</p>
            </div>
            <i className="ri-question-answer-line text-yellow-600 text-2xl"></i>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Brechas de Datos</p>
              <p className="text-2xl font-bold text-red-600">{privacyMetrics.dataBreaches}</p>
            </div>
            <i className="ri-alarm-warning-line text-red-600 text-2xl"></i>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-cyan-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Consentimientos</p>
              <p className="text-2xl font-bold text-cyan-600">{privacyMetrics.consentRate}%</p>
            </div>
            <i className="ri-hand-heart-line text-cyan-600 text-2xl"></i>
          </div>
        </div>
      </div>

      {/* Estado de Cumplimiento por Categorías */}
      <div className="space-y-6">
        {complianceChecks.map((category, categoryIndex) => (
          <div key={categoryIndex} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{category.category}</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {category.checks.map((check, checkIndex) => (
                  <div key={checkIndex} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <i className={getStatusIcon(check.status)}></i>
                      <div>
                        <h4 className="font-medium text-gray-900">{check.name}</h4>
                        <p className="text-sm text-gray-600">{check.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(check.status)}`}>
                        {check.status === 'compliant' && 'Cumple'}
                        {check.status === 'warning' && 'Atención'}
                        {check.status === 'non-compliant' && 'No Cumple'}
                      </span>
                      <button
                        onClick={() => updateComplianceItem(categoryIndex, checkIndex)}
                        className="text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        <i className="ri-settings-3-line"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Derechos de los Interesados */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Gestión de Derechos de los Interesados</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-4 text-center transition-colors cursor-pointer">
            <i className="ri-eye-line text-blue-600 text-2xl mb-2"></i>
            <h4 className="font-medium text-blue-800">Derecho de Acceso</h4>
            <p className="text-sm text-blue-600 mt-1">Consultar datos personales</p>
          </button>

          <button className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-4 text-center transition-colors cursor-pointer">
            <i className="ri-edit-line text-green-600 text-2xl mb-2"></i>
            <h4 className="font-medium text-green-800">Derecho de Rectificación</h4>
            <p className="text-sm text-green-600 mt-1">Corregir datos inexactos</p>
          </button>

          <button className="bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg p-4 text-center transition-colors cursor-pointer">
            <i className="ri-delete-bin-line text-red-600 text-2xl mb-2"></i>
            <h4 className="font-medium text-red-800">Derecho de Supresión</h4>
            <p className="text-sm text-red-600 mt-1">Eliminar datos personales</p>
          </button>

          <button className="bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-4 text-center transition-colors cursor-pointer">
            <i className="ri-download-line text-purple-600 text-2xl mb-2"></i>
            <h4 className="font-medium text-purple-800">Derecho de Portabilidad</h4>
            <p className="text-sm text-purple-600 mt-1">Exportar datos</p>
          </button>
        </div>
      </div>

      {/* Certificaciones y Compliance */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 border border-green-200">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <i className="ri-medal-line text-green-600 text-2xl"></i>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Certificación LOPD 2025</h3>
            <p className="text-gray-700 mb-4">
              Esta plataforma cumple íntegramente con la Ley Orgánica 3/2018 de Protección de Datos Personales 
              y garantía de derechos digitales, así como con el Reglamento General de Protección de Datos (RGPD).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <i className="ri-check-line text-green-600"></i>
                <span>Cifrado AES-256</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="ri-check-line text-green-600"></i>
                <span>Logs inviolables</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="ri-check-line text-green-600"></i>
                <span>Auditorías regulares</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="ri-check-line text-green-600"></i>
                <span>DPO certificado</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="ri-check-line text-green-600"></i>
                <span>Pseudonimización</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="ri-check-line text-green-600"></i>
                <span>Minimización de datos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alertas de Cumplimiento */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <i className="ri-alert-line text-yellow-600 text-xl mt-1"></i>
          <div>
            <h3 className="font-bold text-yellow-800 mb-2">Recordatorio de Formación</h3>
            <p className="text-yellow-700 mb-3">
              La formación trimestral en protección de datos está pendiente para el personal de administración.
            </p>
            <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-700 transition-colors cursor-pointer">
              <i className="ri-calendar-line mr-2"></i>
              Programar Formación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}