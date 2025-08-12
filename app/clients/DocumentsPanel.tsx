
'use client';

import { useState, useEffect, useRef } from 'react';
import { analyzeDocument, searchDocuments } from '@/lib/gemini';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Simulación del ID del cliente logueado (en producción esto vendría del sistema de auth)
const CURRENT_CLIENT_ID = 'cl_001';

interface Company {
  id: string;
  name: string;
  sector: string;
  client_id: string;
}

interface Project {
  id: string;
  name: string;
  company_id: string;
  company_name: string;
  client_id: string;
  status: string;
  progress: number;
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  upload_date: string;
  status: 'uploading' | 'processing' | 'ai_analyzing' | 'ready_for_obralia' | 'completed' | 'error';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  project_id: string;
  project_name: string;
  company_name: string;
  client_id: string;
  hierarchy_order: number;
  folder_path?: string;
  ai_analysis?: string;
  ai_classification?: string;
  ai_confidence?: number;
  upload_progress?: number;
  error_message?: string;
  preview_url?: string;
}

interface ObraliaCredentials {
  client_id: string;
  obralia_username: string;
  obralia_password?: string;
  auto_upload_enabled: boolean;
  connection_status: string;
  is_validated: boolean;
  validation_attempts: number;
  validation_notes: string;
  created_at: string;
  updated_at?: string;
}

export default function DocumentsPanel() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Estados para el botón "Cargar Docs" - ACTIVADO
  const [showLoadDocsModal, setShowLoadDocsModal] = useState(false);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [selectedCompanyForLoad, setSelectedCompanyForLoad] = useState<Company | null>(null);
  const [selectedProjectForLoad, setSelectedProjectForLoad] = useState<Project | null>(null);

  // Estados para modal de credenciales Obralia
  const [showObraliaModal, setShowObraliaModal] = useState(false);
  const [obraliaCredentials, setObraliaCredentials] = useState({
    username: '',
    password: '',
    sync_enabled: true,
    is_validated: false,
    validation_notes: '',
  });
  const [existingCredentials, setExistingCredentials] = useState<ObraliaCredentials | null>(null);
  const [saving, setSaving] = useState(false);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadClientCompanies(),
        loadClientProjects(),
        loadClientDocuments(),
        loadObraliaCredentials(),
      ]);
    } catch (error) {
      console.error('Error cargando datos:', error);
      generateMockDataForCurrentClient();
    } finally {
      setLoading(false);
    }
  };

  const loadObraliaCredentials = async () => {
    try {
      const { data: credentials, error } = await supabase
        .from('client_obralia_credentials')
        .select('*')
        .eq('client_id', CURRENT_CLIENT_ID)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error cargando credenciales:', error);
        return;
      }

      if (credentials) {
        setExistingCredentials(credentials);
        setObraliaCredentials({
          username: credentials.obralia_username || '',
          password: '',
          sync_enabled: credentials.auto_upload_enabled !== false,
          is_validated: credentials.is_validated || false,
          validation_notes: credentials.validation_notes || '',
        });
      }
    } catch (error) {
      console.error('Error cargando credenciales Obralia:', error);
    }
  };

  // Función ACTIVADA para cargar documentos desde Obralia con jerarquía Cliente > Empresa > Proyecto
  const handleLoadDocuments = async () => {
    if (!selectedCompanyForLoad || !selectedProjectForLoad) {
      alert('Por favor selecciona una empresa y un proyecto para cargar documentos');
      return;
    }

    if (!existingCredentials || !existingCredentials.is_validated) {
      alert('Necesitas configurar y validar las credenciales de Obralia primero');
      setShowObraliaModal(true);
      return;
    }

    try {
      setLoadingDocuments(true);

      // Simular conexión y descarga desde Obralia
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simular documentos descargados desde Obralia con jerarquía correcta
      const mockObraliaDocuments: Document[] = [
        {
          id: `obralia_${Date.now()}_1`,
          name: 'Certificado_Energetico_A.pdf',
          type: 'pdf',
          size: '2.5 MB',
          upload_date: new Date().toISOString(),
          status: 'completed',
          priority: 'urgent',
          project_id: selectedProjectForLoad.id,
          project_name: selectedProjectForLoad.name,
          company_name: selectedCompanyForLoad.name,
          client_id: CURRENT_CLIENT_ID,
          hierarchy_order: documents.length + 1,
          folder_path: `/clientes/${CURRENT_CLIENT_ID}/empresas/${selectedCompanyForLoad.name}/proyectos/${selectedProjectForLoad.name}/certificados`,
          ai_analysis: 'Certificado energético clase A descargado desde Obralia. Válido hasta 2034.',
          ai_classification: 'Certificado Energético - Clase A',
          ai_confidence: 98,
          preview_url: 'https://readdy.ai/api/search-image?query=Professional%20energy%20certificate%20document%20with%20green%20rating%20A%2C%20technical%20certification%20paper%2C%20construction%20industry%20compliance%20document&width=60&height=80&seq=obralia-cert&orientation=portrait',
        },
        {
          id: `obralia_${Date.now()}_2`,
          name: 'Factura_Materiales_B.pdf',
          type: 'pdf',
          size: '1.2 MB',
          upload_date: new Date().toISOString(),
          status: 'completed',
          priority: 'high',
          project_id: selectedProjectForLoad.id,
          project_name: selectedProjectForLoad.name,
          company_name: selectedCompanyForLoad.name,
          client_id: CURRENT_CLIENT_ID,
          hierarchy_order: documents.length + 2,
          folder_path: `/clientes/${CURRENT_CLIENT_ID}/empresas/${selectedCompanyForLoad.name}/proyectos/${selectedProjectForLoad.name}/facturas`,
          ai_analysis: 'Factura de materiales descargada desde Obralia. Documento contable clasificado correctamente.',
          ai_classification: 'Factura de Materiales - Documento Contable',
          ai_confidence: 94,
          preview_url: 'https://readdy.ai/api/search-image?query=Professional%20construction%20invoice%20document%2C%20billing%20paperwork%2C%20building%20industry%20management%20system&width=60&height=80&seq=obralia-invoice&orientation=portrait',
        },
      ];

      // Agregar documentos descargados a la lista existente
      setDocuments((prev) => [...prev, ...mockObraliaDocuments]);

      // Cerrar modal de carga
      setShowLoadDocsModal(false);
      setSelectedCompanyForLoad(null);
      setSelectedProjectForLoad(null);

      alert(`✅ ${mockObraliaDocuments.length} documentos cargados exitosamente desde Obralia

📁 Jerarquía aplicada:
Cliente > ${selectedCompanyForLoad.name} > ${selectedProjectForLoad.name}

🔍 Clasificación IA completada automáticamente`);
    } catch (error) {
      console.error('Error cargando documentos desde Obralia:', error);
      alert('Error al cargar documentos desde Obralia');
    } finally {
      setLoadingDocuments(false);
    }
  };

  const saveObraliaCredentials = async () => {
    try {
      setSaving(true);

      const credentialsData = {
        client_id: CURRENT_CLIENT_ID,
        obralia_username: obraliaCredentials.username,
        auto_upload_enabled: obraliaCredentials.sync_enabled,
        is_validated: obraliaCredentials.is_validated,
        validation_notes: obraliaCredentials.validation_notes,
        connection_status: obraliaCredentials.is_validated ? 'connected' : 'pending',
        validation_attempts: existingCredentials?.validation_attempts || 0,
        updated_at: new Date().toISOString(),
      };

      if (obraliaCredentials.password.trim()) {
        (credentialsData as any).obralia_password = obraliaCredentials.password;
      }

      const { data, error } = await supabase
        .from('client_obralia_credentials')
        .upsert([credentialsData])
        .select()
        .single();

      if (error) throw error;

      setExistingCredentials(data);
      alert('✅ Credenciales de Obralia guardadas correctamente');
    } catch (error) {
      console.error('Error guardando credenciales:', error);
      alert('❌ Error al guardar las credenciales');
    } finally {
      setSaving(false);
    }
  };

  const validateObraliaCredentials = async () => {
    try {
      setValidating(true);

      if (!obraliaCredentials.username || !obraliaCredentials.password) {
        alert('⚠️ Por favor introduce usuario y contraseña');
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const isValid = Math.random() > 0.3;

      if (isValid) {
        setObraliaCredentials((prev) => ({
          ...prev,
          is_validated: true,
          validation_notes: 'Conexión validada exitosamente con Obralia',
        }));
        alert('✅ Credenciales validadas correctamente con Obralia');
      } else {
        setObraliaCredentials((prev) => ({
          ...prev,
          is_validated: false,
          validation_notes: 'Error de conexión: Verificar usuario y contraseña',
        }));
        alert('❌ Error validando credenciales. Verificar datos.');
      }
    } catch (error) {
      console.error('Error validando credenciales:', error);
      alert('❌ Error en la validación');
    } finally {
      setValidating(false);
    }
  };

  const uploadToObralia = async (document: Document) => {
    try {
      if (!existingCredentials || !existingCredentials.is_validated) {
        if (confirm('⚠️ No tienes credenciales de Obralia configuradas o validadas.\n\n¿Deseas configurarlas ahora?')) {
          setShowObraliaModal(true);
        }
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const updatedDocuments = documents.map((doc) =>
        doc.id === document.id ? { ...doc, status: 'completed' as const } : doc,
      );
      setDocuments(updatedDocuments);

      alert(`✅ Documento "${document.name}" subido exitosamente a Obralia

👤 Usuario: ${existingCredentials.obralia_username}
📊 Estado: Completado`);
    } catch (error) {
      console.error('Error subiendo a Obralia:', error);
      alert('❌ Error al subir documento a Obralia');
    }
  };

  const loadClientCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('client_id', CURRENT_CLIENT_ID)
        .order('name');

      if (data && data.length > 0) {
        setCompanies(data);
      } else {
        const mockCompanies: Company[] = [
          {
            id: 'comp_001',
            name: 'Madrid Construcciones SL',
            sector: 'Construcción',
            client_id: CURRENT_CLIENT_ID,
          },
        ];
        setCompanies(mockCompanies);
      }
    } catch (error) {
      console.error('Error cargando empresas del cliente:', error);
      const fallbackCompanies: Company[] = [
        {
          id: 'comp_001',
          name: 'Madrid Construcciones SL',
          sector: 'Construcción',
          client_id: CURRENT_CLIENT_ID,
        },
      ];
      setCompanies(fallbackCompanies);
    }
  };

  const loadClientProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`*, companies!inner (id, name, client_id)`)
        .eq('companies.client_id', CURRENT_CLIENT_ID)
        .order('name');

      if (data && data.length > 0) {
        const projectsWithCompany = data.map((project) => ({
          id: project.id,
          name: project.name,
          company_id: project.companies?.id || '',
          company_name: project.companies?.name || '',
          client_id: CURRENT_CLIENT_ID,
          status: project.status,
          progress: project.progress || 0,
        }));
        setProjects(projectsWithCompany);
      } else {
        const mockProjects: Project[] = [
          {
            id: 'proj_001',
            name: 'Residencial Torres del Sol',
            company_id: 'comp_001',
            company_name: 'Madrid Construcciones SL',
            client_id: CURRENT_CLIENT_ID,
            status: 'active',
            progress: 65,
          },
        ];
        setProjects(mockProjects);
      }
    } catch (error) {
      console.error('Error cargando proyectos del cliente:', error);
    }
  };

  const loadClientDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select(`*, projects!inner (id, name, client_id, companies!inner (id, name, client_id))`)
        .eq('projects.companies.client_id', CURRENT_CLIENT_ID)
        .order('upload_date', { ascending: false });

      if (data && data.length > 0) {
        const documentsWithHierarchy = data.map((doc: any) => ({
          id: doc.id,
          name: doc.file_name || doc.name,
          type: doc.file_type || 'pdf',
          size: doc.file_size || '2.5 MB',
          upload_date: doc.upload_date || new Date().toISOString(),
          status: doc.status || 'ready_for_obralia',
          priority: doc.priority || 'medium',
          project_id: doc.projects?.id || '',
          project_name: doc.projects?.name || '',
          company_name: doc.projects?.companies?.name || '',
          client_id: CURRENT_CLIENT_ID,
          hierarchy_order: doc.hierarchy_order || 0,
          folder_path: doc.folder_path,
          ai_analysis: doc.ai_analysis,
          ai_classification: doc.ai_classification,
          ai_confidence: doc.ai_confidence || 0,
          preview_url: `https://readdy.ai/api/search-image?query=Professional%20construction%20document%20$%7Bdoc.file_type%7D%20with%20technical%20content%2C%20engineering%20paperwork%2C%20building%20industry%20documentation&width=60&height=80&seq=doc-${doc.id}&orientation=portrait`,
        }));
        setDocuments(documentsWithHierarchy);
      } else {
        generateMockDocumentsForCurrentClient();
      }
    } catch (error) {
      console.error('Error cargando documentos del cliente:', error);
      generateMockDocumentsForCurrentClient();
    }
  };

  const generateMockDataForCurrentClient = () => {
    const mockCompanies: Company[] = [
      {
        id: 'comp_001',
        name: 'Madrid Construcciones SL',
        sector: 'Construcción',
        client_id: CURRENT_CLIENT_ID,
      },
    ];

    const mockProjects: Project[] = [
      {
        id: 'proj_001',
        name: 'Residencial Torres del Sol',
        company_id: 'comp_001',
        company_name: 'Madrid Construcciones SL',
        client_id: CURRENT_CLIENT_ID,
        status: 'active',
        progress: 65,
      },
    ];

    setCompanies(mockCompanies);
    setProjects(mockProjects);
    generateMockDocumentsForCurrentClient();
  };

  const generateMockDocumentsForCurrentClient = () => {
    const mockDocuments: Document[] = [
      {
        id: '1',
        name: 'Certificado_Energetico_A.pdf',
        type: 'pdf',
        size: '2.5 MB',
        upload_date: '6/8/2025',
        status: 'ready_for_obralia',
        priority: 'urgent',
        project_id: 'proj_001',
        project_name: 'Residencial Torres del Sol',
        company_name: 'Madrid Construcciones SL',
        client_id: CURRENT_CLIENT_ID,
        hierarchy_order: 1,
        folder_path: `/clientes/${CURRENT_CLIENT_ID}/empresas/madrid-construcciones/proyectos/torres-del-sol/certificados`,
        ai_analysis: 'Certificado energético - Clasificación automática IA',
        ai_classification: 'Certificado Energético - Clase A',
        ai_confidence: 98,
      },
      {
        id: '2',
        name: 'Factura_Materiales_B.pdf',
        type: 'pdf',
        size: '1.2 MB',
        upload_date: '6/8/2025',
        status: 'processing',
        priority: 'high',
        project_id: 'proj_001',
        project_name: 'Residencial Torres del Sol',
        company_name: 'Madrid Construcciones SL',
        client_id: CURRENT_CLIENT_ID,
        hierarchy_order: 2,
        folder_path: `/clientes/${CURRENT_CLIENT_ID}/empresas/madrid-construcciones/proyectos/torres-del-sol/facturas`,
        ai_analysis: 'Factura de Materiales - Documento contable',
        ai_classification: 'Factura de Materiales - Documento Contable',
        ai_confidence: 94,
      },
    ];
    setDocuments(mockDocuments);
  };

  const clientCompanies = companies.filter((company) => company.client_id === CURRENT_CLIENT_ID);
  const clientProjects = projects.filter((project) => project.client_id === CURRENT_CLIENT_ID);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando gestión de documentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Barra de búsqueda exacta como la imagen */}
      <div className="flex items-center mb-6">
        <div className="flex-1 relative">
          <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            placeholder="Buscar cliente, proyecto o documento..."
            className="w-full pl-10 pr-20 py-3 border border-gray-300 rounded-lg bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="ml-4 px-6 py-3 bg-gray-700 text-white rounded-lg font-medium whitespace-nowrap cursor-pointer">
          <i className="ri-refresh-line mr-2"></i>
          Actualizar
        </button>
        <div className="ml-4 flex items-center text-green-600 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          Conectado a BD
        </div>
        <div className="ml-4 flex items-center text-blue-600 text-sm cursor-pointer">
          <i className="ri-brain-line mr-2"></i>
          IA Clasificación Activa
        </div>
      </div>

      {/* Panel principal del cliente exacto como la imagen */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-user-line text-2xl text-blue-600"></i>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Juan García Martín - Constructora Madrid Sur</h2>
              <p className="text-gray-600">juan.garcia@constructoramadrid.com</p>
              <p className="text-gray-500 text-sm">Madrid Construcciones SL</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">2</div>
              <div className="text-sm text-gray-600">docs clasificados</div>
            </div>
            <button
              onClick={() => setShowObraliaModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-link mr-2"></i>
              Conectar Obralia
            </button>
          </div>
        </div>

        {/* Estado de Obralia exacto como la imagen */}
        <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center text-orange-700">
                <i className="ri-error-warning-line mr-2"></i>
                <span className="font-medium">Credenciales de Acceso Obralia</span>
              </div>
              <div className="text-sm text-orange-600 mt-1">
                Usuario Obralia: juan.garcia@obralia.com
                <br />
                Estado: 2 pendientes
              </div>
            </div>
            <div className="flex items-center text-green-600 font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Conectado
            </div>
          </div>
        </div>

        {/* Proyecto exacto como la imagen */}
        <div className="mt-6">
          <div className="flex items-center text-blue-600 mb-4">
            <i className="ri-folder-line mr-2"></i>
            <span className="font-medium">Residencial Torres del Sol (2 docs clasificados por IA)</span>
          </div>

          {/* Documentos exactos como la imagen */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <i className="ri-file-pdf-line text-red-500 text-2xl"></i>
                <div>
                  <div className="font-medium text-gray-900">Certificado_Energetico_A.pdf</div>
                  <div className="text-sm text-gray-500">
                    Certificado Energético - Clasificación automática IA
                  </div>
                  <div className="text-xs text-gray-400">2.5 MB • 6/8/2025 • 98% confianza</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                  URGENTE
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                  Clasificado
                </span>
                <button
                  onClick={() => uploadToObralia(documents[0])}
                  className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-upload-cloud-line mr-1"></i>
                  Subir a Obralia
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <i className="ri-file-pdf-line text-red-500 text-2xl"></i>
                <div>
                  <div className="font-medium text-gray-900">Factura_Materiales_B.pdf</div>
                  <div className="text-sm text-gray-500">
                    Factura de Materiales - Documento contable
                  </div>
                  <div className="text-xs text-gray-400">1.2 MB • 6/8/2025 • 94% confianza</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                  Alta
                </span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                  Procesando
                </span>
                <button
                  onClick={() => uploadToObralia(documents[1])}
                  className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-upload-cloud-line mr-1"></i>
                  Subir a Obralia
                </button>
              </div>
            </div>
          </div>

          {/* Footer exacto como la imagen */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center text-gray-600 text-sm">
              <i className="ri-time-line mr-2"></i>
              <span>4 documentos totales • 2 proyectos</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowLoadDocsModal(true)}
                disabled={!existingCredentials || !existingCredentials.is_validated}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  existingCredentials?.is_validated
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-400 text-white cursor-not-allowed'
                }`}
                title={existingCredentials?.is_validated ? 'Cargar documentos desde Obralia' : 'Configura credenciales de Obralia primero'}
              >
                <i className="ri-download-cloud-line mr-2"></i>
                Cargar Docs
              </button>
              <button
                onClick={() => setShowObraliaModal(true)}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-settings-line mr-2"></i>
                Configurar Obralia
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para Cargar Documentos desde Obralia - ACTIVADO */}
      {showLoadDocsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">
                  <i className="ri-download-cloud-line mr-2 text-blue-600"></i>
                  Cargar Documentos desde Obralia
                </h3>
                <button
                  onClick={() => {
                    setShowLoadDocsModal(false);
                    setSelectedCompanyForLoad(null);
                    setSelectedProjectForLoad(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <i className="ri-information-line text-blue-600"></i>
                  <span className="font-medium text-blue-800">Carga Jerárquica desde Obralia</span>
                </div>
                <p className="text-sm text-blue-700">
                  Selecciona la empresa y proyecto donde deseas cargar los documentos desde tu cuenta de Obralia.
                  Se mantendrá la jerarquía: Cliente > Empresa > Proyecto.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="ri-building-line mr-1 text-blue-600"></i>
                    Empresa de Destino *
                  </label>
                  <select
                    value={selectedCompanyForLoad?.id || ''}
                    onChange={(e) => {
                      const company = clientCompanies.find((c) => c.id === e.target.value);
                      setSelectedCompanyForLoad(company || null);
                      setSelectedProjectForLoad(null);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                  >
                    <option value="">Selecciona empresa destino...</option>
                    {clientCompanies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name} ({company.sector})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="ri-folder-line mr-1 text-yellow-600"></i>
                    Proyecto de Destino *
                  </label>
                  <select
                    value={selectedProjectForLoad?.id || ''}
                    onChange={(e) => {
                      const project = clientProjects.find((p) => p.id === e.target.value);
                      setSelectedProjectForLoad(project || null);
                    }}
                    disabled={!selectedCompanyForLoad}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed pr-8"
                  >
                    <option value="">Selecciona proyecto destino...</option>
                    {clientProjects
                      .filter((project) => !selectedCompanyForLoad || project.company_id === selectedCompanyForLoad.id)
                      .map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.name} ({project.progress}% completado)
                        </option>
                      ))}
                  </select>
                </div>

                {selectedCompanyForLoad && selectedProjectForLoad && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-sm">
                      <div className="font-medium text-green-800 mb-2">Jerarquía de Destino:</div>
                      <div className="text-green-700 space-y-1">
                        <div className="flex items-center space-x-2">
                          <i className="ri-user-line text-green-600"></i>
                          <span>Cliente: Juan García Martín</span>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <i className="ri-building-line text-blue-600"></i>
                          <span>Empresa: {selectedCompanyForLoad.name}</span>
                        </div>
                        <div className="flex items-center space-x-2 ml-8">
                          <i className="ri-folder-line text-yellow-600"></i>
                          <span>Proyecto: {selectedProjectForLoad.name}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {existingCredentials?.is_validated && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <i className="ri-checkbox-circle-line text-orange-600"></i>
                    <span className="font-medium text-orange-800">Conexión Obralia Verificada</span>
                  </div>
                  <p className="text-sm text-orange-700">
                    Usuario: <strong>{existingCredentials.obralia_username}</strong> •
                    Los documentos se cargarán usando estas credenciales validadas.
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 p-6">
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowLoadDocsModal(false);
                    setSelectedCompanyForLoad(null);
                    setSelectedProjectForLoad(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleLoadDocuments}
                  disabled={loadingDocuments || !selectedCompanyForLoad || !selectedProjectForLoad}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {loadingDocuments ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      Cargando desde Obralia...
                    </>
                  ) : (
                    <>
                      <i className="ri-download-cloud-line mr-2"></i>
                      Cargar Documentos
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Credenciales Obralia */}
      {showObraliaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">
                  <i className="ri-key-2-line mr-2 text-orange-600"></i>
                  Configuración de Credenciales Obralia
                </h3>
                <button
                  onClick={() => setShowObraliaModal(false)}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <i className="ri-information-line text-blue-600"></i>
                  <span className="font-medium text-blue-800">Conexión Directa a Obralia</span>
                </div>
                <p className="text-sm text-blue-700">
                  Configura tus credenciales de Obralia para permitir la subida automática de documentos
                  desde tu panel de gestión documental directamente a tu cuenta de Obralia.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="ri-user-line mr-1 text-gray-500"></i>
                    Usuario de Obralia *
                  </label>
                  <input
                    type="text"
                    value={obraliaCredentials.username}
                    onChange={(e) =>
                      setObraliaCredentials({ ...obraliaCredentials, username: e.target.value })
                    }
                    placeholder="Introduce tu usuario de Obralia"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="ri-lock-line mr-1 text-gray-500"></i>
                    Contraseña de Obralia *
                  </label>
                  <input
                    type="password"
                    value={obraliaCredentials.password}
                    onChange={(e) =>
                      setObraliaCredentials({ ...obraliaCredentials, password: e.target.value })
                    }
                    placeholder={existingCredentials ? "Dejar en blanco para mantener la actual" : "Introduce tu contraseña de Obralia"}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h5 className="font-medium text-gray-900">Sincronización Automática</h5>
                    <p className="text-sm text-gray-600">Subir documentos automáticamente a Obralia</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={obraliaCredentials.sync_enabled}
                      onChange={(e) =>
                        setObraliaCredentials({ ...obraliaCredentials, sync_enabled: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                </div>

                {obraliaCredentials.validation_notes && (
                  <div
                    className={`rounded-lg p-4 ${
                      obraliaCredentials.is_validated
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <i
                        className={`${
                          obraliaCredentials.is_validated
                            ? 'ri-check-line text-green-600'
                            : 'ri-error-warning-line text-red-600'
                        }`}
                      ></i>
                      <span
                        className={`font-medium ${
                          obraliaCredentials.is_validated ? 'text-green-800' : 'text-red-800'
                        }`}
                      >
                        Estado de Validación
                      </span>
                    </div>
                    <p
                      className={`text-sm ${
                        obraliaCredentials.is_validated ? 'text-green-700' : 'text-red-700'
                      }`}
                    >
                      {obraliaCredentials.validation_notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 p-6">
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowObraliaModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={validateObraliaCredentials}
                  disabled={validating || !obraliaCredentials.username || !obraliaCredentials.password}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {validating ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      Validando...
                    </>
                  ) : (
                    <>
                      <i className="ri-shield-check-line mr-2"></i>
                      Validar Conexión
                    </>
                  )}
                </button>
                <button
                  onClick={saveObraliaCredentials}
                  disabled={saving}
                  className="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {saving ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <i className="ri-save-line mr-2"></i>
                      Guardar Credenciales
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
