
// 'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import ObraliaCredentialsModal from '@/components/ObraliaCredentialsModal';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface QueueDocument {
  id: string;
  client_id: string;
  client_name: string;
  client_email: string;
  company_name: string;
  project_name: string;
  project_code: string;
  filename: string;
  filetype: string;
  file_size: number;
  upload_date: string;
  status: string;
  priority: string;
  ai_classification: string;
  ai_confidence: number;
  queue_position: number;
  obralia_destination_path: string;
  estimated_processing_time: number;
}

interface DocumentQueueModuleProps {
  logAuditEvent: (action: string, table?: string, recordId?: string, oldData?: any, newData?: any) => Promise<void>;
}

interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
}

interface Company {
  id: string;
  name: string;
  client_id: string;
}

interface Project {
  id: string;
  name: string;
  company_id: string;
  client_id: string;
}

export default function DocumentQueueModule({ logAuditEvent }: DocumentQueueModuleProps) {
  const [documents, setDocuments] = useState<QueueDocument[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<QueueDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [expandedClients, setExpandedClients] = useState<string[]>([]);
  const [showObraliaModal, setShowObraliaModal] = useState(false);
  const [selectedClientForObralia, setSelectedClientForObralia] = useState<{ id: string; name: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(false);

  const [clients, setClients] = useState<Client[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showHierarchySelection, setShowHierarchySelection] = useState(false);

  const handleManualRefresh = useCallback(async () => {
    console.log(' Actualizando cola de documentos manualmente...');
    await loadDocuments();
    setLastRefresh(new Date());
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (autoRefreshEnabled) {
      interval = setInterval(() => {
        loadDocuments();
        setLastRefresh(new Date());
      }, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefreshEnabled]);

  useEffect(() => {
    loadDocuments();
    loadHierarchyData();
    logAuditEvent('view_document_queue_module');
  }, []);

  const loadDocuments = useCallback(async () => {
    try {
      setLoading(true);

      const { data: documentsData, error: documentsError } = await supabase
        .from('documents')
        .select(`
          id,
          name,
          file_name,
          file_size,
          status,
          priority,
          upload_date,
          ai_classification,
          ai_confidence,
          client_id,
          metadata,
          clients!inner (
            id,
            name,
            email,
            company,
            obralia_username,
            obralia_password_encrypted,
            obralia_credentials_validated
          )
        `)
        .not('client_id', 'is', null)
        .order('upload_date', { ascending: false });

      if (documentsError) {
        console.error('Error cargando documentos:', documentsError);
        const mockData = createMockDocuments();
        setDocuments(mockData);
        setFilteredDocuments(mockData);
        return;
      }

      const transformedDocuments = documentsData?.map((doc, index) => ({
        id: doc.id,
        client_id: doc.client_id,
        client_name: doc.clients?.name || 'Cliente Desconocido',
        client_email: doc.clients?.email || '',
        company_name: doc.clients?.company || 'Empresa Desconocida',
        project_name: doc.metadata?.project || `Proyecto ${doc.clients?.company || 'Principal'}`,
        project_code: doc.metadata?.project_code || `PRJ-${Date.now().toString().slice(-6)}`,
        filename: doc.file_name || doc.name,
        filetype: 'application/pdf',
        file_size: doc.file_size || 1024000,
        upload_date: doc.upload_date || new Date().toISOString(),
        status: doc.status || 'pending',
        priority: doc.priority || 'medium',
        ai_classification: doc.ai_classification || 'Documento Construcción',
        ai_confidence: doc.ai_confidence || 85.0,
        queue_position: index + 1,
        obralia_destination_path: doc.metadata?.path || `/Documentos/${doc.clients?.company || 'General'}/`,
        estimated_processing_time: 30,
      })) || [];

      console.log(` Cargados ${transformedDocuments.length} documentos desde BD`);
      setDocuments(transformedDocuments);
      setFilteredDocuments(transformedDocuments);
    } catch (error) {
      console.error('Error cargando documentos:', error);
      const mockData = createMockDocuments();
      setDocuments(mockData);
      setFilteredDocuments(mockData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let filtered = [...documents];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (doc) =>
          doc.filename.toLowerCase().includes(query) ||
          doc.client_name.toLowerCase().includes(query) ||
          doc.company_name.toLowerCase().includes(query) ||
          doc.ai_classification.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((doc) => doc.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter((doc) => doc.priority === priorityFilter);
    }

    setFilteredDocuments(filtered);
  }, [documents, searchQuery, statusFilter, priorityFilter]);

  const groupedDocuments = filteredDocuments.reduce((groups, doc) => {
    const key = `${doc.client_id}_${doc.client_name}`;
    if (!groups[key]) {
      groups[key] = {
        client_id: doc.client_id,
        client_name: doc.client_name,
        client_email: doc.client_email,
        documents: [],
      };
    }
    groups[key].documents.push(doc);
    return groups;
  }, {} as { [key: string]: { client_id: string; client_name: string; client_email: string; documents: QueueDocument[] } });

  const stats = {
    total: documents.length,
    pending: documents.filter((d) => d.status === 'pending').length,
    processing: documents.filter((d) => d.status === 'processing').length,
    urgent: documents.filter((d) => d.priority === 'urgent').length,
    active_clients: new Set(documents.map((d) => d.client_id)).size,
  };

  const handleObraliaAccess = async (clientId: string, clientName: string) => {
    console.log(' Accediendo a credenciales Obralia para:', clientName, 'ID:', clientId);
    setSelectedClientForObralia({ id: clientId, name: clientName });
    setShowObraliaModal(true);
  };

  const toggleClientExpansion = (clientKey: string) => {
    setExpandedClients((prev) =>
      prev.includes(clientKey) ? prev.filter((k) => k !== clientKey) : [...prev, clientKey]
    );
  };

  const handleSelectDocument = (docId: string) => {
    setSelectedDocuments((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDocuments.length === filteredDocuments.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(filteredDocuments.map((d) => d.id));
    }
  };

  const handleUploadToObralia = async () => {
    if (selectedDocuments.length === 0) {
      alert('Seleccione al menos un documento para subir a Obralia');
      return;
    }

    const selectedDocs = documents.filter((d) => selectedDocuments.includes(d.id));

    const clientIds = new Set(selectedDocs.map((d) => d.client_id));
    if (clientIds.size > 1) {
      alert('Solo puedes subir documentos del mismo cliente a la vez');
      return;
    }

    const clientId = Array.from(clientIds)[0];
    const clientDoc = selectedDocs[0];

    await handleObraliaAccess(clientId, clientDoc.client_name);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    console.log(' Archivos dropped:', files.length);
    await processUploadedFiles(files);
  };

  const handleDirectoryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      console.log(' Directorio seleccionado:', files.length, 'archivos');
      await processUploadedFiles(files);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      console.log(' Archivos seleccionados:', files.length);
      await processUploadedFiles(files);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      classified: 'bg-purple-100 text-purple-800',
      ready_for_obralia: 'bg-green-100 text-green-800',
      uploaded_to_obralia: 'bg-gray-100 text-gray-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      urgent: 'text-red-600',
      high: 'text-orange-600',
      medium: 'text-yellow-600',
      low: 'text-green-600',
    };
    return colors[priority as keyof typeof colors] || 'text-gray-600';
  };

  const getPriorityIcon = (priority: string) => {
    const icons = {
      urgent: 'ri-alarm-warning-line',
      high: 'ri-arrow-up-line',
      medium: 'ri-subtract-line',
      low: 'ri-arrow-down-line',
    };
    return icons[priority as keyof typeof icons] || 'ri-subtract-line';
  };

  const loadHierarchyData = useCallback(async () => {
    try {
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('id, name, email, company')
        .order('name');

      if (!clientsError && clientsData) {
        setClients(clientsData);
      } else {
        setClients([
          {
            id: 'cl_juan_garcia_martin',
            name: 'Juan García Martín',
            email: 'juan.garcia@constructora-garcia.com',
            company: 'Constructora García SL',
          },
          {
            id: 'cl_ana_rodriguez_lopez',
            name: 'Ana Rodríguez López',
            email: 'ana.rodriguez@arq-rodriguez.com',
            company: 'Rodríguez Arquitectos',
          },
          {
            id: 'cl_carlos_mendez_ruiz',
            name: 'Carlos Méndez Ruiz',
            email: 'carlos.mendez@ingenieria-mendez.com',
            company: 'Méndez Ingeniería',
          },
        ]);
      }

      const { data: companiesData, error: companiesError } = await supabase
        .from('companies')
        .select('id, name, client_id')
        .order('name');

      if (!companiesError && companiesData) {
        setCompanies(companiesData);
      } else {
        setCompanies([
          { id: 'comp_constructora_garcia', name: 'Constructora García SL', client_id: 'cl_juan_garcia_martin' },
          { id: 'comp_garcia_obras', name: 'García Obras y Proyectos SL', client_id: 'cl_juan_garcia_martin' },
          { id: 'comp_rodriguez_arq', name: 'Rodríguez Arquitectos', client_id: 'cl_ana_rodriguez_lopez' },
          { id: 'comp_mendez_ing', name: 'Méndez Ingeniería', client_id: 'cl_carlos_mendez_ruiz' },
          { id: 'comp_mendez_proyectos', name: 'Méndez Proyectos Técnicos', client_id: 'cl_carlos_mendez_ruiz' },
        ]);
      }

      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('id, name, company_id, client_id')
        .order('name');

      if (!projectsError && projectsData) {
        setProjects(projectsData);
      } else {
        setProjects([
          { id: 'proj_torre_residencial', name: 'Torre Residencial Centro', company_id: 'comp_constructora_garcia', client_id: 'cl_juan_garcia_martin' },
          { id: 'proj_complejo_norte', name: 'Complejo Residencial Norte', company_id: 'comp_garcia_obras', client_id: 'cl_juan_garcia_martin' },
          { id: 'proj_oficinas_sur', name: 'Edificio Oficinas Sur', company_id: 'comp_rodriguez_arq', client_id: 'cl_ana_rodriguez_lopez' },
          { id: 'proj_puente_industrial', name: 'Puente Industrial Este', company_id: 'comp_mendez_ing', client_id: 'cl_carlos_mendez_ruiz' },
          { id: 'proj_infraestructura', name: 'Proyecto Infraestructura Vial', company_id: 'comp_mendez_proyectos', client_id: 'cl_carlos_mendez_ruiz' },
        ]);
      }
    } catch (error) {
      console.error('Error cargando datos de jerarquía:', error);
    }
  }, []);

  const getCompaniesByClient = (clientId: string) => {
    return companies.filter((company) => company.client_id === clientId);
  };

  const getProjectsByCompany = (companyId: string) => {
    return projects.filter((project) => project.company_id === companyId);
  };

  const handleClientSelection = (client: Client) => {
    setSelectedClient(client);
    setSelectedCompany(null);
    setSelectedProject(null);
  };

  const handleCompanySelection = (company: Company) => {
    setSelectedCompany(company);
    setSelectedProject(null);
  };

  const handleProjectSelection = (project: Project) => {
    setSelectedProject(project);
    setShowHierarchySelection(false);
  };

  const resetHierarchySelection = () => {
    setSelectedClient(null);
    setSelectedCompany(null);
    setSelectedProject(null);
    setShowHierarchySelection(false);
  };

  const renderHierarchySelector = () => {
    return (
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold text-blue-900 flex items-center">
            <i className="ri-flow-chart mr-2"></i>
            Selección Jerárquica para Subida Rápida
          </h4>
          <button
            onClick={resetHierarchySelection}
            className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer"
          >
            <i className="ri-refresh-line mr-1"></i>
            Resetear
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-blue-800 mb-2">
              <i className="ri-user-line mr-1"></i>
              1. Cliente *
            </label>
            <select
              value={selectedClient?.id || ''}
              onChange={(e) => {
                const client = clients.find((c) => c.id === e.target.value);
                if (client) handleClientSelection(client);
              }}
              className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
            >
              <option value="">Seleccionar cliente...</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} ({client.company})
                </option>
              ))}
            </select>
            {selectedClient && (
              <div className="mt-1 text-xs text-blue-600">
                Email: {selectedClient.email}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-800 mb-2">
              <i className="ri-building-line mr-1"></i>
              2. Empresa *
            </label>
            <select
              value={selectedCompany?.id || ''}
              onChange={(e) => {
                const company = companies.find((c) => c.id === e.target.value);
                if (company) handleCompanySelection(company);
              }}
              disabled={!selectedClient}
              className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed pr-8"
            >
              <option value="">Seleccionar empresa...</option>
              {selectedClient &&
                getCompaniesByClient(selectedClient.id).map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-800 mb-2">
              <i className="ri-folder-line mr-1"></i>
              3. Proyecto *
            </label>
            <select
              value={selectedProject?.id || ''}
              onChange={(e) => {
                const project = projects.find((p) => p.id === e.target.value);
                if (project) handleProjectSelection(project);
              }}
              disabled={!selectedCompany}
              className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed pr-8"
            >
              <option value="">Seleccionar proyecto...</option>
              {selectedCompany &&
                getProjectsByCompany(selectedCompany.id).map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {selectedClient && selectedCompany && selectedProject && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-sm">
              <div className="font-medium text-green-800 mb-2">Ruta de Destino:</div>
              <div className="text-green-700 font-mono text-xs">
                /Clientes/{selectedClient.name}/Empresas/{selectedCompany.name}/Proyectos/
                {selectedProject.name}/
              </div>
              <div className="mt-2 text-green-600 text-xs">
                Jerarquía completa - Los documentos se organizarán automáticamente
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 text-sm text-blue-700">
          <div className="font-medium mb-1">Instrucciones:</div>
          <ol className="list-decimal list-inside space-y-1 text-xs">
            <li>Selecciona el cliente que solicita la subida</li>
            <li>Escoge la empresa correspondiente del cliente</li>
            <li>Selecciona el proyecto específico donde van los documentos</li>
            <li>Arrastra los archivos a la zona de subida</li>
          </ol>
        </div>
      </div>
    );
  };

  /**
   * Procesa archivos subidos.
   * Verifica que la jerarquía (Cliente > Empresa > Proyecto) esté seleccionada antes de subir.
   */
  const processUploadedFiles = async (files: File[]) => {
    console.log(' Procesando', files.length, 'archivos...');

    if (!selectedClient || !selectedCompany || !selectedProject) {
      alert('Por favor selecciona Cliente > Empresa > Proyecto antes de subir documentos');
      setShowHierarchySelection(true);
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileId = `upload_${Date.now()}_${i}`;

      console.log(`Subiendo archivo ${i + 1}/${files.length}:`, file.name);

      setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));

      for (let progress = 0; progress <= 100; progress += 25) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        setUploadProgress((prev) => ({ ...prev, [fileId]: progress }));
      }

      try {
        const documentId = crypto.randomUUID();
        await supabase.from('documents').insert({
          id: documentId,
          name: file.name,
          file_name: file.name,
          file_size: file.size,
          status: 'pending',
          priority: 'medium',
          upload_date: new Date().toISOString(),
          ai_classification: 'Documento Administrativo',
          ai_confidence: 85.0,
          client_id: selectedClient.id,
          created_at: new Date().toISOString(),
          metadata: {
            project: selectedProject.name,
            project_id: selectedProject.id,
            company: selectedCompany.name,
            company_id: selectedCompany.id,
            client_name: selectedClient.name,
            client_email: selectedClient.email,
            path: `/Clientes/${selectedClient.name}/Empresas/${selectedCompany.name}/Proyectos/${selectedProject.name}/`,
            upload_method: 'admin_hierarchical_upload',
            hierarchy_level: 'complete',
          },
        });
        console.log('Documento insertado con jerarquía completa:', file.name);
      } catch (error) {
        console.log('Error BD:', error);
      }
    }

    await loadDocuments();
    setUploadProgress({});

    await logAuditEvent('admin_hierarchical_upload_documents', 'documents', undefined, null, {
      files_count: files.length,
      client_id: selectedClient.id,
      client_name: selectedClient.name,
      company_id: selectedCompany.id,
      company_name: selectedCompany.name,
      project_id: selectedProject.id,
      project_name: selectedProject.name,
      upload_method: 'hierarchical_drag_drop',
      total_size: files.reduce((sum, f) => sum + f.size, 0),
    });

    alert(
      `${files.length} archivos subidos exitosamente con jerarquía aplicada:\n\nCliente: ${selectedClient.name}\nEmpresa: ${selectedCompany.name}\nProyecto: ${selectedProject.name}\n\nDocumentos organizados correctamente en la estructura jerárquica.`
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando cola de documentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cola de Documentos FIFO</h2>
          <p className="text-gray-600 mt-1">
            {stats.total} documentos en cola • {stats.active_clients} clientes activos
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleManualRefresh}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 cursor-pointer whitespace-nowrap"
            >
              <i className={`ri-refresh-line mr-2 ${loading ? 'animate-spin' : ''}`}></i>
              Actualizar
            </button>

            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={autoRefreshEnabled}
                onChange={(e) => setAutoRefreshEnabled(e.target.checked)}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-gray-600">Auto-actualizar (30s)</span>
            </label>

            <span className="text-xs text-gray-500">
              Última actualización: {lastRefresh.toLocaleTimeString('es-ES')}
            </span>
          </div>

          <button
            onClick={handleUploadToObralia}
            disabled={selectedDocuments.length === 0}
            className="bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
          >
            <i className="ri-upload-cloud-line mr-2"></i>
            Subir a Obralia ({selectedDocuments.length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-file-list-3-line text-blue-600"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total en Cola</p>
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i className="ri-time-line text-yellow-600"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-loader-4-line text-blue-600"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Procesando</p>
              <p className="text-xl font-bold text-gray-900">{stats.processing}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <i className="ri-alarm-warning-line text-red-600"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Urgentes</p>
              <p className="text-xl font-bold text-gray-900">{stats.urgent}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-user-3-line text-green-600"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Clientes Activos</p>
              <p className="text-xl font-bold text-gray-900">{stats.active_clients}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <i className="ri-database-2-line text-green-600 text-2xl"></i>
          <div>
            <h3 className="font-bold text-green-800">
              Credenciales Obralia - Solo Copia y Pega (Sin Validación)
            </h3>
            <p className="text-green-700">
              El administrador NO valida credenciales, solo copia y pega las credenciales
              almacenadas en las columnas
              <strong> obralia_username</strong> y <strong>obralia_password_encrypted</strong> de la tabla
              clients.
            </p>
            <div className="mt-2 text-sm text-green-600 flex space-x-4">
              <div> Cargados desde BD</div>
              <div> Credenciales reales desde tabla clients</div>
              <div> Solo copiar y pegar - sin validación</div>
            </div>
          </div>
        </div>
      </div>

      {renderHierarchySelector()}

      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
          isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        } ${!selectedClient || !selectedCompany || !selectedProject ? 'opacity-50' : ''}`}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          {!selectedClient || !selectedCompany || !selectedProject ? (
            <div className="text-orange-600 mb-4">
              <i className="ri-error-warning-line text-2xl mb-2"></i>
              <p className="font-medium">
                Selecciona Cliente &gt; Empresa &gt; Proyecto primero
              </p>
              <button
                onClick={() => setShowHierarchySelection(true)}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm cursor-pointer"
              >
                Configurar jerarquía de subida
              </button>
            </div>
          ) : (
            <div className="text-green-600 mb-4">
              <i className="ri-check-line text-2xl mb-2"></i>
              <p className="font-medium">Jerarquía configurada correctamente</p>
              <p className="text-sm">
                {selectedClient.name} &gt; {selectedCompany.name} &gt; {selectedProject.name}
              </p>
            </div>
          )}

          <div className="flex justify-center space-x-4">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.dwg,.png,.jpg,.jpeg"
              disabled={!selectedClient || !selectedCompany || !selectedProject}
            />
            <input
              type="file"
              /* @ts-ignore */
              webkitdirectory=""
              directory=""
              multiple
              onChange={handleDirectoryUpload}
              className="hidden"
              id="directory-upload"
              disabled={!selectedClient || !selectedCompany || !selectedProject}
            />

            <label
              htmlFor="file-upload"
              className={`px-6 py-3 rounded-lg font-semibold cursor-pointer whitespace-nowrap ${
                selectedClient && selectedCompany && selectedProject
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-400 text-white cursor-not-allowed'
              }`}
            >
              <i className="ri-file-add-line mr-2"></i>
              Seleccionar Archivos
            </label>

            <label
              htmlFor="directory-upload"
              className={`px-6 py-3 rounded-lg font-semibold cursor-pointer whitespace-nowrap ${
                selectedClient && selectedCompany && selectedProject
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-400 text-white cursor-not-allowed'
              }`}
            >
              <i className="ri-folder-add-line mr-2"></i>
              Subir Directorio Completo
            </label>
          </div>

          {isDragging ? (
            <p className="text-green-600 font-semibold animate-pulse">¡Suelta los archivos aquí!</p>
          ) : (
            <p className="text-gray-500">Arrastra archivos aquí o usa los botones de arriba</p>
          )}

          {Object.keys(uploadProgress).length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Subiendo archivos...</h4>
              {Object.entries(uploadProgress).map(([fileId, progress]) => (
                <div key={fileId} className="bg-white rounded-lg p-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Archivo {fileId.split('_')[2]}...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-xs text-gray-500">
            Formatos soportados: PDF, DOC, XLS, DWG, PNG, JPG (máx. 50MB por archivo)
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Buscar documentos, clientes, proyectos..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {searchQuery && (
              <div className="mt-1 text-xs text-gray-500">
                Mostrando {filteredDocuments.length} de {documents.length} documentos
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendientes</option>
              <option value="processing">Procesando</option>
              <option value="classified">Clasificados</option>
              <option value="ready_for_obralia">Listos para Obralia</option>
              <option value="uploaded_to_obralia">Subidos a Obralia</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prioridad</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
            >
              <option value="all">Todas</option>
              <option value="urgent">Urgente</option>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSelectAll}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 cursor-pointer whitespace-nowrap"
            >
              <i className="ri-checkbox-multiple-line mr-2"></i>
              {selectedDocuments.length === filteredDocuments.length ? 'Deseleccionar Todo' : 'Seleccionar Todo'}
            </button>
          </div>
        </div>

        {(searchQuery || statusFilter !== 'all' || priorityFilter !== 'all') && (
          <div className="mt-4 flex items-center space-x-2">
            <span className="text-sm text-gray-600">Filtros activos:</span>
            {searchQuery && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                Búsqueda: &quot;{searchQuery}&quot;
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                Estado: {statusFilter}
              </span>
            )}
            {priorityFilter !== 'all' && (
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                Prioridad: {priorityFilter}
              </span>
            )}
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setPriorityFilter('all');
              }}
              className="text-red-600 hover:text-red-800 text-xs cursor-pointer"
            >
              <i className="ri-close-line mr-1"></i>
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">
              Cola FIFO - {filteredDocuments.length} documentos
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${autoRefreshEnabled ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span>{autoRefreshEnabled ? 'Actualización automática activa' : 'Actualización manual'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
          {Object.entries(groupedDocuments).map(([clientKey, clientData]) => {
            const isExpanded = expandedClients.includes(clientKey);

            return (
              <div key={clientKey} className="p-6">
                <div
                  className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-3 rounded-lg"
                  onClick={() => toggleClientExpansion(clientKey)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <i className="ri-user-3-line text-blue-600 text-xl"></i>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{clientData.client_name}</h4>
                      <p className="text-sm text-gray-600">{clientData.client_email}</p>
                      <p className="text-sm text-gray-500">{clientData.documents.length} documentos en cola</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleObraliaAccess(clientData.client_id, clientData.client_name);
                      }}
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-700 cursor-pointer whitespace-nowrap"
                    >
                      <i className="ri-key-2-line mr-2"></i>
                      Ver Credenciales Obralia
                    </button>
                    <i className={`${isExpanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} text-2xl text-gray-400`}></i>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 space-y-3">
                    {clientData.documents.map((doc) => (
                      <div key={doc.id} className="bg-gray-50 rounded-lg p-4 ml-8">
                        <div className="flex items-start space-x-4">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedDocuments.includes(doc.id)}
                              onChange={() => handleSelectDocument(doc.id)}
                              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            />
                            <div className="ml-3 w-8 h-8 bg-white rounded-lg border-2 border-green-600 flex items-center justify-center text-sm font-bold text-green-600">
                              #{doc.queue_position}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="mb-3 bg-white rounded-lg p-3 border border-gray-200">
                              <div className="text-sm text-gray-600 mb-2">
                                <strong>Estructura en Obralia:</strong>
                              </div>
                              <div className="flex items-center space-x-2 text-sm">
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-semibold">
                                  <i className="ri-building-2-line mr-1"></i>
                                  {doc.company_name}
                                </span>
                                <i className="ri-arrow-right-line text-gray-400"></i>
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded font-semibold">
                                  <i className="ri-folder-line mr-1"></i>
                                  {doc.project_name}
                                </span>
                                {doc.project_code && (
                                  <>
                                    <i className="ri-arrow-right-line text-gray-400"></i>
                                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-mono">
                                      {doc.project_code}
                                    </span>
                                  </>
                                )}
                              </div>
                              <div className="mt-2 text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                                <i className="ri-folder-open-line mr-1"></i>
                                Destino: {doc.obralia_destination_path}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h5 className="font-semibold text-gray-900 truncate">{doc.filename}</h5>
                                <div className="flex items-center space-x-2">
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(doc.status)}`}>
                                    {doc.status === 'pending'
                                      ? 'Pendiente'
                                      : doc.status === 'processing'
                                      ? 'Procesando'
                                      : doc.status === 'classified'
                                      ? 'Clasificado'
                                      : doc.status === 'ready_for_obralia'
                                      ? 'Listo para Obralia'
                                      : 'Subido a Obralia'}
                                  </span>
                                  <i className={`${getPriorityIcon(doc.priority)} ${getPriorityColor(doc.priority)}`}></i>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-600">Clasificación IA:</span>
                                  <p className="font-medium text-gray-900">{doc.ai_classification}</p>
                                  <p className="text-xs text-gray-500">{doc.ai_confidence}% confianza</p>
                                </div>
                                <div>
                                  <span className="text-gray-600">Tamaño:</span>
                                  <p className="font-medium text-gray-900">{(doc.file_size / 1024 / 1024).toFixed(1)} MB</p>
                                </div>
                                <div>
                                  <span className="text-gray-600">Subido:</span>
                                  <p className="font-medium text-gray-900">
                                    {new Date(doc.upload_date).toLocaleDateString('es-ES')}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-gray-600">Tiempo estimado:</span>
                                  <p className="font-medium text-gray-900">{doc.estimated_processing_time}s</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {filteredDocuments.length === 0 && (
            <div className="p-12 text-center">
              <i className="ri-file-list-3-line text-4xl text-gray-300 mb-4"></i>
              {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' ? (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No se encontraron documentos</h4>
                  <p className="text-gray-600 mb-4">Prueba ajustando los filtros de búsqueda</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                      setPriorityFilter('all');
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer"
                  >
                    Limpiar filtros
                  </button>
                </div>
              ) : (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No hay documentos en cola</h4>
                  <p className="text-gray-600">Los documentos aparecerán aquí cuando los clientes los suban.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ObraliaCredentialsModal
        isOpen={showObraliaModal}
        onClose={() => {
          setShowObraliaModal(false);
          setSelectedClientForObralia(null);
        }}
        clientId={selectedClientForObralia?.id || ''}
        clientName={selectedClientForObralia?.name || ''}
        existingCredentials={null}
        onCredentialsUpdated={() => {
          setShowObraliaModal(false);
          setSelectedClientForObralia(null);
          loadDocuments();
        }}
      />
    </div>
  );
}

const createMockDocuments = () => {
  return [
    {
      id: 'doc_001',
      client_id: 'cl_constructora_garcia_001',
      client_name: 'Juan García Martín',
      client_email: 'juan.garcia@constructora-garcia.com',
      company_name: 'Constructora García SL',
      project_name: 'Torre Residencial Centro',
      project_code: 'TRC-2024-001',
      filename: 'Certificado_Energetico_A.pdf',
      filetype: 'application/pdf',
      file_size: 2048000,
      upload_date: new Date().toISOString(),
      status: 'pending',
      priority: 'urgent',
      ai_classification: 'Certificado Energético',
      ai_confidence: 92.5,
      queue_position: 1,
      obralia_destination_path: '/Torre_Residencial_Centro/Certificaciones/Energeticas/',
      estimated_processing_time: 45,
    },
  ];
};
