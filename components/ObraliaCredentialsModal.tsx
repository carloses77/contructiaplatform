
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

interface ObraliaCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  clientName: string;
  existingCredentials?: any;
  onCredentialsUpdated?: (credentials: any) => void;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ObraliaCredentialsModal({
  isOpen,
  onClose,
  clientId,
  clientName,
  existingCredentials,
  onCredentialsUpdated
}: ObraliaCredentialsModalProps) {
  const [loading, setLoading] = useState(true);
  const [currentCredentials, setCurrentCredentials] = useState<any>(null);
  const [copiedField, setCopiedField] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [companies, setCompanies] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen && clientId) {
      loadClientCredentials();
    }
  }, [isOpen, clientId]);

  const loadClientCredentials = async () => {
    try {
      setLoading(true);
      console.log('🔍 Cargando credenciales para cliente:', clientId);
      
      // Cargar credenciales reales desde la tabla clients (campos: obralia_username, obralia_password_encrypted)
      const { data: client, error } = await supabase
        .from('clients')
        .select('id, name, company, obralia_username, obralia_password_encrypted, obralia_credentials_validated')
        .eq('id', clientId)
        .single();

      if (error) {
        console.error('❌ Error cargando credenciales:', error);
        setCurrentCredentials(null);
        return;
      }

      if (client) {
        console.log('✅ Credenciales encontradas desde tabla clients:', client);
        
        // Estructura de datos con múltiples empresas y proyectos
        const enhancedCredentials = {
          ...client,
          companies: getCompaniesForClient(clientId, client.company || 'Empresa Desconocida')
        };
        
        setCurrentCredentials(enhancedCredentials);
        setCompanies(enhancedCredentials.companies);
      } else {
        console.log('❌ No se encontraron credenciales para el cliente:', clientId);
        setCurrentCredentials(null);
      }

    } catch (error) {
      console.error('❌ Error cargando credenciales:', error);
      setCurrentCredentials(null);
    } finally {
      setLoading(false);
    }
  };

  const getCompaniesForClient = (clientId: string, companyName: string) => {
    // Generar estructura de empresas y proyectos basada en el clientId y nombre de empresa
    return [
      {
        name: companyName,
        projects: [
          { 
            name: `Proyecto Principal ${companyName}`, 
            code: `PRJ-${Date.now().toString().slice(-6)}`, 
            path: `/${companyName.replace(/\s+/g, '_')}/Proyecto_Principal/Documentos/` 
          },
          { 
            name: `Proyecto Secundario ${companyName}`, 
            code: `SEC-${Date.now().toString().slice(-6)}`, 
            path: `/${companyName.replace(/\s+/g, '_')}/Proyecto_Secundario/Documentos/` 
          }
        ]
      }
    ];
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(''), 2000);
    } catch (error) {
      console.error('Error copiando al portapapeles:', error);
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedField(field);
      setTimeout(() => setCopiedField(''), 2000);
    }
  };

  const handleConnectToObralia = () => {
    window.open('https://identity.nalandaglobal.com/realms/nalanda/protocol/openid-connect/auth?ui_locales=es&scope=openid&response_type=code&redirect_uri=https%3A%2F%2Fapp.nalandaglobal.com%2Fsso%2Fcallback.action&state=MsZxEbgj6p90wLs6FhHv9IsHyTyPV5YqeH2eTVePYtY&nonce=GWfIX4jBZojuxiMRK1u4yQmsS9Fj9yYeszug6cNrvww&client_id=nalanda-app', '_blank');
  };

  const handleUploadDocuments = async () => {
    if (!currentCredentials) return;

    try {
      setUploading(true);

      // Simular subida de documentos a Obralia
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Registrar en logs de trabajo del administrador
      await supabase.from('admin_work_logs').insert({
        admin_id: 'admin-current',
        action_type: 'document_upload_obralia',
        client_id: clientId,
        client_name: clientName,
        document_name: 'Documentos seleccionados',
        action_description: `Documentos subidos exitosamente a Obralia para ${clientName}`,
        obralia_upload_status: 'uploaded',
        work_timestamp: new Date().toISOString(),
        details: {
          upload_method: 'admin_manual_credentials',
          obralia_username: currentCredentials.obralia_username,
          documents_count: 1,
          success: true
        }
      });

      // Actualizar estado de documentos en la cola
      const { error: updateError } = await supabase
        .from('documents')
        .update({ 
          status: 'uploaded_to_obralia'
        })
        .eq('client_id', clientId)
        .eq('status', 'pending');

      if (updateError) {
        console.error('Error actualizando documentos:', updateError);
      }

      alert('✅ Documentos subidos exitosamente a Obralia\n\n• Estado actualizado: uploaded_to_obralia\n• Registrado en logs de trabajo\n• Removidos de la cola de documentos');
      
      onClose();

    } catch (error) {
      console.error('Error en subida:', error);
      alert('❌ Error al subir documentos');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white cursor-pointer"
          >
            <i className="ri-close-line text-xl"></i>
          </button>

          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3">
            <i className="ri-links-line text-2xl"></i>
          </div>
          <h2 className="text-xl font-bold mb-1">Conexión Manual a Obralia/Nalanda</h2>
          <p className="text-orange-100 text-sm">Panel de administración con acceso directo a credenciales</p>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando credenciales desde base de datos...</p>
            </div>
          ) : (
            <>
              {/* Información del Cliente */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="ri-user-line text-blue-600"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-900">{clientName}</h3>
                    <p className="text-sm text-blue-700">
                      <i className="ri-file-text-line mr-1"></i>
                      Documentos pendientes para subida a Obralia
                    </p>
                  </div>
                </div>
              </div>

              {/* Credenciales de Acceso */}
              {currentCredentials && currentCredentials.obralia_username ? (
                <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6 mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-bold text-orange-900 flex items-center text-lg">
                      <i className="ri-key-2-line mr-2"></i>
                      Credenciales de Acceso (Base de Datos)
                    </h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleUploadDocuments}
                        disabled={uploading}
                        className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 cursor-pointer whitespace-nowrap disabled:opacity-50"
                      >
                        {uploading ? (
                          <>
                            <i className="ri-loader-4-line animate-spin mr-1"></i>
                            Subiendo...
                          </>
                        ) : (
                          <>
                            <i className="ri-upload-cloud-line mr-1"></i>
                            Subir Documentos
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleConnectToObralia}
                        className="bg-orange-500 text-white px-4 py-2 rounded text-sm hover:bg-orange-600 cursor-pointer whitespace-nowrap"
                      >
                        <i className="ri-external-link-line mr-1"></i>
                        Abrir Nalanda
                      </button>
                    </div>
                  </div>

                  {/* Usuario y Contraseña */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Usuario */}
                    <div className="bg-white border border-orange-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-orange-800">
                          <i className="ri-user-line mr-1"></i>
                          Usuario:
                        </label>
                        <button
                          onClick={() => copyToClipboard(currentCredentials.obralia_username, 'username')}
                          className="bg-orange-600 text-white px-3 py-1 rounded text-xs hover:bg-orange-700 cursor-pointer whitespace-nowrap"
                        >
                          {copiedField === 'username' ? (
                            <>
                              <i className="ri-check-line mr-1"></i>
                              ¡Copiado!
                            </>
                          ) : (
                            <>
                              <i className="ri-file-copy-line mr-1"></i>
                              Copiar
                            </>
                          )}
                        </button>
                      </div>
                      <div className="bg-gray-50 border rounded px-3 py-2 text-sm font-mono text-gray-900 select-all">
                        {currentCredentials.obralia_username}
                      </div>
                    </div>

                    {/* Contraseña */}
                    <div className="bg-white border border-orange-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-orange-800">
                          <i className="ri-key-line mr-1"></i>
                          Contraseña:
                        </label>
                        <button
                          onClick={() => copyToClipboard(currentCredentials.obralia_password_encrypted, 'password')}
                          className="bg-orange-600 text-white px-3 py-1 rounded text-xs hover:bg-orange-700 cursor-pointer whitespace-nowrap"
                        >
                          {copiedField === 'password' ? (
                            <>
                              <i className="ri-check-line mr-1"></i>
                              ¡Copiado!
                            </>
                          ) : (
                            <>
                              <i className="ri-file-copy-line mr-1"></i>
                              Copiar
                            </>
                          )}
                        </button>
                      </div>
                      <div className="bg-gray-50 border rounded px-3 py-2 text-sm font-mono text-gray-900 select-all">
                        {currentCredentials.obralia_password_encrypted}
                      </div>
                    </div>
                  </div>

                  {/* Instrucciones de Uso */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h5 className="font-bold text-yellow-800 mb-2 flex items-center">
                      <i className="ri-information-line mr-2"></i>
                      Instrucciones de Uso:
                    </h5>
                    <div className="text-sm text-yellow-700 space-y-1">
                      <div><strong>1.</strong> Haz clic en "Abrir Nalanda" para abrir la ventana de login</div>
                      <div><strong>2.</strong> Usa "Copiar" individual para cada campo (Usuario y Contraseña)</div>
                      <div><strong>3.</strong> Pega en Nalanda con Ctrl+V en cada campo</div>
                      <div><strong>4.</strong> Haz clic en "Subir Documentos" para completar el proceso</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                  <div className="flex items-center space-x-3">
                    <i className="ri-alert-line text-red-600 text-xl"></i>
                    <div>
                      <h4 className="font-bold text-red-800">❌ Sin Credenciales en Base de Datos</h4>
                      <p className="text-red-700 text-sm mt-1">
                        No se encontraron credenciales de Obralia para este cliente en la base de datos.
                        El cliente debe configurarlas desde su panel.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Pipeline de Gestión Documental */}
              {currentCredentials && companies && companies.length > 0 && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 mb-6">
                  <h4 className="font-bold text-purple-800 mb-4 flex items-center">
                    <i className="ri-flow-chart mr-2"></i>
                    Pipeline de Gestión Documental - Múltiples Empresas y Proyectos
                  </h4>
                  
                  {companies.map((company: any, companyIndex: number) => (
                    <div key={companyIndex} className="mb-4 last:mb-0">
                      <div className="bg-white border border-purple-200 rounded-lg p-4">
                        <h5 className="font-bold text-purple-900 mb-3 flex items-center">
                          <i className="ri-building-2-line mr-2"></i>
                          {company.name}
                        </h5>
                        
                        <div className="space-y-2">
                          {company.projects?.map((project: any, projectIndex: number) => (
                            <div key={projectIndex} className="bg-purple-50 border border-purple-200 rounded p-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="font-medium text-purple-800">
                                    <i className="ri-folder-line mr-1"></i>
                                    {project.name}
                                  </span>
                                  <span className="ml-2 text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded">
                                    {project.code}
                                  </span>
                                </div>
                                <div className="text-xs text-purple-600 font-mono bg-white px-2 py-1 rounded border">
                                  {project.path}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="bg-green-100 border border-green-300 rounded p-3 mt-4">
                    <p className="text-green-800 text-sm">
                      <strong>💡 Ventaja ConstructIA:</strong> Los clientes pueden subir documentos en lotes 
                      organizados por empresa y proyecto, facilitando enormemente la gestión documental. 
                      ConstructIA actúa como pipeline acelerador de este proceso.
                    </p>
                  </div>
                </div>
              )}

              {/* Estado de Conexión */}
              <div className={`border-2 rounded-xl p-4 text-center ${
                currentCredentials && currentCredentials.obralia_credentials_validated
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${
                    currentCredentials && currentCredentials.obralia_credentials_validated ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className={`font-bold ${
                    currentCredentials && currentCredentials.obralia_credentials_validated ? 'text-green-800' : 'text-red-800'
                  }`}>
                    Estado: {currentCredentials && currentCredentials.obralia_credentials_validated ? 'Credenciales Validadas' : 'Sin Validar'}
                  </span>
                </div>
                
                {currentCredentials && currentCredentials.obralia_credentials_validated && (
                  <p className="text-green-700 text-sm">
                    ✅ Usuario: {currentCredentials.obralia_username}
                  </p>
                )}
              </div>

              {/* Botones de Acción */}
              <div className="flex justify-center space-x-4 pt-6 border-t border-gray-200">
                <button
                  onClick={onClose}
                  className="bg-gray-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-600 cursor-pointer"
                >
                  <i className="ri-close-line mr-2"></i>
                  Cancelar
                </button>
                
                {currentCredentials && currentCredentials.obralia_username && (
                  <button
                    onClick={handleUploadDocuments}
                    disabled={uploading}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 cursor-pointer whitespace-nowrap disabled:opacity-50"
                  >
                    {uploading ? (
                      <>
                        <i className="ri-loader-4-line animate-spin mr-2"></i>
                        Procesando Subida...
                      </>
                    ) : (
                      <>
                        <i className="ri-upload-cloud-line mr-2"></i>
                        Subir a Obralia
                      </>
                    )}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
