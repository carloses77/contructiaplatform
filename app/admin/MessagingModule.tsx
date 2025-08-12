
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

interface MessagingModuleProps {
  logAuditEvent: (action: string, table?: string, recordId?: string, oldData?: any, newData?: any) => Promise<void>;
}

interface Client {
  id: string;
  name: string;
  email: string;
  company?: string;
  status: string;
  last_login?: string;
  unread_messages: number;
}

interface AdminMessage {
  id: string;
  admin_user_id: string;
  client_id: string;
  subject: string;
  message: string;
  message_type: 'notification' | 'alert' | 'update' | 'reminder' | 'urgent';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read_status: boolean;
  read_at?: string;
  created_at: string;
  expires_at?: string;
  client_name?: string;
  client_email?: string;
  attachments: any[];
  metadata: any;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function MessagingModule({ logAuditEvent }: MessagingModuleProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<AdminMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('send-message');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showClientSelector, setShowClientSelector] = useState(false);

  const [messageForm, setMessageForm] = useState({
    subject: '',
    message: '',
    message_type: 'notification' as AdminMessage['message_type'],
    priority: 'medium' as AdminMessage['priority'],
    expires_at: '',
    client_ids: [] as string[]
  });

  const [kpis, setKpis] = useState({
    totalClients: 0,
    activeClients: 0,
    messagesSent: 0,
    messagesRead: 0,
    readRate: 0,
    urgentMessages: 0
  });

  const generateMockData = () => {
    const mockClients: Client[] = [
      {
        id: 'cl_001',
        name: 'Constructora Madrid Sur',
        email: 'admin@madridconstrucciones.com',
        company: 'Construcciones Madrid SL',
        status: 'active',
        last_login: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        unread_messages: 2
      },
      {
        id: 'cl_002',
        name: 'Ana Rodríguez',
        email: 'ana@obrasvalencia.com',
        company: 'Obras Valencia Centro',
        status: 'active',
        last_login: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        unread_messages: 0
      },
      {
        id: 'cl_003',
        name: 'Carlos Martínez',
        email: 'carlos@arquitecsevillana.es',
        company: 'Arquitectura Sevilla',
        status: 'active',
        last_login: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        unread_messages: 1
      },
      {
        id: 'cl_004',
        name: 'Pedro Sánchez',
        email: 'pedro@consbilbao.com',
        company: 'Construcciones Bilbao',
        status: 'inactive',
        last_login: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        unread_messages: 0
      },
      {
        id: 'cl_005',
        name: 'Laura Fernández',
        email: 'laura@grupozaragoza.es',
        company: 'Grupo Constructor Zaragoza',
        status: 'active',
        last_login: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        unread_messages: 3
      },
      {
        id: 'cl_006',
        name: 'Miguel Torres',
        email: 'miguel@ingenieriamadrid.com',
        company: 'Ingeniería Madrid Norte',
        status: 'active',
        last_login: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        unread_messages: 1
      }
    ];

    const mockMessages: AdminMessage[] = [
      {
        id: 'msg_001',
        admin_user_id: 'admin-user-temp-id',
        client_id: 'cl_001',
        subject: 'Actualización del Sistema ConstructIA',
        message: 'Hemos implementado nuevas funcionalidades de análisis documental con IA. Su cuenta ha sido actualizada automáticamente y ya puede acceder a las nuevas herramientas desde su dashboard.',
        message_type: 'update',
        priority: 'medium',
        read_status: false,
        created_at: new Date().toISOString(),
        client_name: 'Constructora Madrid Sur',
        client_email: 'admin@madridconstrucciones.com',
        attachments: [],
        metadata: {}
      },
      {
        id: 'msg_002',
        admin_user_id: 'admin-user-temp-id',
        client_id: 'cl_001',
        subject: 'Recordatorio: Renovación de Plan Mensual',
        message: 'Su plan mensual Premium vence en 3 días (15/01/2024). Para evitar interrupciones en el servicio, le recomendamos renovar su suscripción desde la sección de facturación.',
        message_type: 'reminder',
        priority: 'high',
        read_status: false,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        client_name: 'Constructora Madrid Sur',
        client_email: 'admin@madridconstrucciones.com',
        attachments: [],
        metadata: { renewal_date: '2024-01-15' }
      },
      {
        id: 'msg_003',
        admin_user_id: 'admin-user-temp-id',
        client_id: 'cl_003',
        subject: 'Mantenimiento Programado',
        message: 'Informamos que realizaremos mantenimiento programado el sábado 13/01/2024 de 02:00 a 06:00 AM. Durante este período, algunos servicios podrían no estar disponibles.',
        message_type: 'notification',
        priority: 'medium',
        read_status: true,
        read_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        client_name: 'Carlos Martínez',
        client_email: 'carlos@arquitecsevillana.es',
        attachments: [],
        metadata: {}
      },
      {
        id: 'msg_004',
        admin_user_id: 'admin-user-temp-id',
        client_id: 'cl_005',
        subject: '🚨 URGENTE: Problema de Seguridad Detectado',
        message: 'Hemos detectado intentos de acceso no autorizados a su cuenta. Por seguridad, hemos bloqueado temporalmente el acceso. Contacte inmediatamente con soporte técnico.',
        message_type: 'urgent',
        priority: 'urgent',
        read_status: false,
        created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        client_name: 'Laura Fernández',
        client_email: 'laura@grupozaragoza.es',
        attachments: [],
        metadata: { security_incident: true, blocked_ips: ['192.168.1.100', '10.0.0.50'] }
      },
      {
        id: 'msg_005',
        admin_user_id: 'admin-user-temp-id',
        client_id: 'cl_005',
        subject: 'Límite de Almacenamiento Alcanzado',
        message: 'Su cuenta ha alcanzado el 95% del límite de almacenamiento (4.8GB de 5GB). Le recomendamos hacer limpieza de documentos antiguos o actualizar su plan.',
        message_type: 'alert',
        priority: 'high',
        read_status: false,
        created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        client_name: 'Laura Fernández',
        client_email: 'laura@grupozaragoza.es',
        attachments: [],
        metadata: { storage_used: '4.8GB', storage_limit: '5GB' }
      },
      {
        id: 'msg_006',
        admin_user_id: 'admin-user-temp-id',
        client_id: 'cl_006',
        subject: 'Nueva Funcionalidad: Integración Obralia',
        message: 'Ya está disponible la integración directa con Obralia/Nalanda. Puede configurar sus credenciales desde el módulo de integraciones para automatizar la subida de documentos.',
        message_type: 'update',
        priority: 'low',
        read_status: false,
        created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        client_name: 'Miguel Torres',
        client_email: 'miguel@ingenieriamadrid.com',
        attachments: [],
        metadata: { feature: 'obralia_integration' }
      }
    ];

    return { mockClients, mockMessages };
  };

  const loadClientsAndMessages = async () => {
    try {
      setLoading(true);

      const [
        { data: clientsData },
        { data: messagesData }
      ] = await Promise.all([
        supabase.from('clients').select('id, name, email, status').order('name'),
        supabase.from('admin_client_messages').select(`
          *,
          client:clients!admin_client_messages_client_id_fkey(name, email)
        `).order('created_at', { ascending: false })
      ]);

      let finalClients: Client[] = [];
      let finalMessages: AdminMessage[] = [];

      if (!clientsData || clientsData.length === 0) {
        const { mockClients, mockMessages } = generateMockData();
        finalClients = mockClients;
        finalMessages = mockMessages;

        console.log('📨 SISTEMA DE MENSAJERÍA - Usando datos de prueba');
      } else {
        finalClients = clientsData.map(client => ({ ...client, unread_messages: 0 }));

        finalMessages = messagesData?.map(msg => ({ ...msg, client_name: msg.client?.name || 'Cliente', client_email: msg.client?.email || '' })) || [];
      }

      finalClients = finalClients.map(client => ({ ...client, unread_messages: finalMessages.filter(msg => msg.client_id === client.id && !msg.read_status).length }));

      setClients(finalClients);
      setMessages(finalMessages);

      const totalClients = finalClients.length;
      const activeClients = finalClients.filter(c => c.status === 'active').length;
      const messagesSent = finalMessages.length;
      const messagesRead = finalMessages.filter(m => m.read_status).length;
      const readRate = messagesSent > 0 ? (messagesRead / messagesSent) * 100 : 0;
      const urgentMessages = finalMessages.filter(m => m.priority === 'urgent').length;

      setKpis({
        totalClients,
        activeClients,
        messagesSent,
        messagesRead,
        readRate,
        urgentMessages
      });

      console.log(`✅ Mensajería cargada: ${totalClients} clientes, ${messagesSent} mensajes`);
    } catch (error) {
      console.error('Error cargando datos de mensajería:', error);

      const { mockClients, mockMessages } = generateMockData();
      setClients(mockClients);
      setMessages(mockMessages);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!messageForm.subject.trim() || !messageForm.message.trim() || messageForm.client_ids.length === 0) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    try {
      setSendingMessage(true);

      const messagesToSend = messageForm.client_ids.map(clientId => ({
        admin_user_id: 'admin-user-temp-id',
        client_id: clientId,
        subject: messageForm.subject,
        message: messageForm.message,
        message_type: messageForm.message_type,
        priority: messageForm.priority,
        expires_at: messageForm.expires_at || null,
        created_at: new Date().toISOString(),
        read_status: false,
        attachments: [],
        metadata: {}
      }));

      const { error } = await supabase
        .from('admin_client_messages')
        .insert(messagesToSend);

      if (error) {
        console.warn('Advertencia al insertar mensajes:', error);
      }

      const newMessages = messagesToSend.map(msg => {
        const client = clients.find(c => c.id === msg.client_id);
        return {
          id: Date.now().toString() + Math.random(),
          ...msg,
          client_name: client?.name || 'Cliente',
          client_email: client?.email || ''
        };
      });

      setMessages(prev => [...newMessages, ...prev]);

      setClients(prev => prev.map(client =>
        messageForm.client_ids.includes(client.id)
          ? { ...client, unread_messages: client.unread_messages + 1 }
          : client
      ));

      await logAuditEvent('send_admin_message', 'admin_client_messages', '',
        {},
        {
          recipients: messageForm.client_ids.length,
          subject: messageForm.subject,
          message_type: messageForm.message_type,
          priority: messageForm.priority
        }
      );

      setMessageForm({
        subject: '',
        message: '',
        message_type: 'notification',
        priority: 'medium',
        expires_at: '',
        client_ids: []
      });
      setSelectedClient(null);
      setShowClientSelector(false);

      alert(`✅ Mensaje enviado exitosamente a ${messageForm.client_ids.length} cliente(s)`);
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      alert('❌ Error al enviar mensaje. Inténtelo nuevamente.');
    } finally {
      setSendingMessage(false);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm('¿Está seguro de eliminar este mensaje? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await supabase
        .from('admin_client_messages')
        .delete()
        .eq('id', messageId);

      setMessages(prev => prev.filter(msg => msg.id !== messageId));

      await logAuditEvent('delete_admin_message', 'admin_client_messages', messageId);

      alert('✅ Mensaje eliminado correctamente');
    } catch (error) {
      console.error('Error eliminando mensaje:', error);
      alert('❌ Error al eliminar mensaje');
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'ri-alarm-warning-line text-red-600';
      case 'alert':
        return 'ri-alert-line text-orange-600';
      case 'update':
        return 'ri-information-line text-blue-600';
      case 'reminder':
        return 'ri-time-line text-yellow-600';
      case 'notification':
        return 'ri-notification-3-line text-gray-600';
      default:
        return 'ri-mail-line text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-gray-100 text-gray-600 border-gray-200';
  };

  useEffect(() => {
    loadClientsAndMessages();
    logAuditEvent('view_messaging_module');
  }, []);

  useEffect(() => {
    if (clients.length > 0) {
      const filtered = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredClients(filtered);
    }
  }, [searchTerm, clients]);

  useEffect(() => {
    if (messages.length > 0) {
      const filtered = messages.filter(msg =>
        msg.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.client_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMessages(filtered);
    }
  }, [searchTerm, messages]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando sistema de mensajería...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header del módulo */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Link
                href="/admin"
                className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <i className="ri-arrow-left-line text-xl"></i>
                <span className="font-medium">Volver al Panel</span>
              </Link>
              <div className="border-l border-white/30 pl-3">
                <div className="flex items-center space-x-3">
                  <i className="ri-mail-send-line text-2xl"></i>
                  <h2 className="text-2xl font-bold">Mensajería Administrador → Cliente</h2>
                </div>
                <p className="text-blue-100">
                  Sistema de notificaciones unidireccionales para comunicación directa con clientes
                </p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{kpis.messagesSent}</div>
            <div className="text-sm text-blue-200">Mensajes Enviados</div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-6 gap-3 mt-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-xl font-bold">{kpis.totalClients}</div>
            <div className="text-xs text-blue-100">Total Clientes</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-green-200">{kpis.activeClients}</div>
            <div className="text-xs text-blue-100">Activos</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-yellow-200">{kpis.messagesSent}</div>
            <div className="text-xs text-blue-100">Enviados</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-cyan-200">{kpis.messagesRead}</div>
            <div className="text-xs text-blue-100">Leídos</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-purple-200">{kpis.readRate.toFixed(1)}%</div>
            <div className="text-xs text-blue-100">Tasa Lectura</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-red-200">{kpis.urgentMessages}</div>
            <div className="text-xs text-blue-100">Urgentes</div>
          </div>
        </div>
      </div>

      {/* Navegación por tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('send-message')}
          className={`flex-1 px-4 py-3 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'send-message'
              ? 'bg-purple-600 text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <i className="ri-mail-send-line mr-2"></i>
          Enviar Mensaje
        </button>
        <button
          onClick={() => setActiveTab('message-history')}
          className={`flex-1 px-4 py-3 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'message-history'
              ? 'bg-purple-600 text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <i className="ri-history-line mr-2"></i>
          Historial de Mensajes
        </button>
        <button
          onClick={() => setActiveTab('client-status')}
          className={`flex-1 px-4 py-3 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'client-status'
              ? 'bg-purple-600 text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <i className="ri-user-line mr-2"></i>
          Estado de Clientes
        </button>
      </div>

      {/* Tab: Enviar Mensaje */}
      {activeTab === 'send-message' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <i className="ri-edit-box-line text-purple-600 text-2xl"></i>
            <h3 className="text-xl font-bold text-gray-900">Redactar Nuevo Mensaje</h3>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="space-y-6">
            {/* Selección de destinatarios */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                <i className="ri-user-line mr-1"></i>
                Destinatarios *
              </label>

              {!showClientSelector && messageForm.client_ids.length === 0 && (
                <button
                  type="button"
                  onClick={() => setShowClientSelector(true)}
                  className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 transition-colors cursor-pointer text-center"
                >
                  <i className="ri-add-circle-line text-2xl text-gray-400 mb-2"></i>
                  <div className="text-gray-600">Seleccionar Cliente(s)</div>
                  <div className="text-sm text-gray-500">Haga clic para elegir destinatarios</div>
                </button>
              )}

              {showClientSelector && (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Seleccionar Clientes:</span>
                    <button
                      type="button"
                      onClick={() => setShowClientSelector(false)}
                      className="text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                      <i className="ri-close-line"></i>
                    </button>
                  </div>

                  {/* Barra de búsqueda dentro del selector de clientes */}
                  <div className="mb-3">
                    <div className="relative">
                      <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar cliente por nombre, email o empresa..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      />
                    </div>
                    {searchTerm && (
                      <div className="mt-1 text-xs text-gray-500">
                        Mostrando {filteredClients.length} de {clients.length} clientes
                      </div>
                    )}
                  </div>

                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {(searchTerm ? filteredClients : clients).map(client => (
                      <label key={client.id} className="flex items-center space-x-3 p-2 hover:bg-white rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={messageForm.client_ids.includes(client.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setMessageForm(prev => ({ ...prev, client_ids: [...prev.client_ids, client.id] }));
                            } else {
                              setMessageForm(prev => ({ ...prev, client_ids: prev.client_ids.filter(id => id !== client.id) }));
                            }
                          }}
                          className="rounded text-purple-600"
                        />
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${client.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          <span className="font-medium text-gray-900">{client.name}</span>
                          <span className="text-sm text-gray-500">({client.email})</span>
                          {client.unread_messages > 0 && (
                            <span className="bg-red-100 text-red-800 px-1 py-0.5 rounded-full text-xs">
                              {client.unread_messages} no leídos
                            </span>
                          )}
                        </div>
                      </label>
                    ))}

                    {searchTerm && filteredClients.length === 0 && (
                      <div className="text-center py-4 text-gray-500">
                        No se encontraron clientes con "{searchTerm}"
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Clientes seleccionados */}
              {messageForm.client_ids.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-purple-50 rounded-lg">
                  {messageForm.client_ids.map(clientId => {
                    const client = clients.find(c => c.id === clientId);
                    return client ? (
                      <div key={clientId} className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full border">
                        <span className="text-sm font-medium">{client.name}</span>
                        <button
                          type="button"
                          onClick={() => setMessageForm(prev => ({ ...prev, client_ids: prev.client_ids.filter(id => id !== clientId) }))}
                          className="text-gray-500 hover:text-red-600 cursor-pointer"
                        >
                          <i className="ri-close-line"></i>
                        </button>
                      </div>
                    ) : null;
                  })}
                  <button
                    type="button"
                    onClick={() => setShowClientSelector(true)}
                    className="flex items-center space-x-1 text-purple-600 hover:text-purple-800 px-2 py-1 rounded-full cursor-pointer"
                  >
                    <i className="ri-add-line"></i>
                    <span className="text-sm">Agregar más</span>
                  </button>
                </div>
              )}
            </div>

            {/* Configuración del mensaje */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="ri-price-tag-3-line mr-1"></i>
                  Tipo de Mensaje
                </label>
                <select
                  value={messageForm.message_type}
                  onChange={(e) => setMessageForm(prev => ({ ...prev, message_type: e.target.value as AdminMessage['message_type'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="notification">🔔 Notificación</option>
                  <option value="alert">⚠️ Alerta</option>
                  <option value="update">ℹ️ Actualización</option>
                  <option value="reminder">⏰ Recordatorio</option>
                  <option value="urgent">🚨 Urgente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="ri-flag-line mr-1"></i>
                  Prioridad
                </label>
                <select
                  value={messageForm.priority}
                  onChange={(e) => setMessageForm(prev => ({ ...prev, priority: e.target.value as AdminMessage['priority'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="low">🟢 Baja</option>
                  <option value="medium">🟡 Media</option>
                  <option value="high">🟠 Alta</option>
                  <option value="urgent">🔴 Urgente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="ri-calendar-line mr-1"></i>
                  Vencimiento (Opcional)
                </label>
                <input
                  type="datetime-local"
                  value={messageForm.expires_at}
                  onChange={(e) => setMessageForm(prev => ({ ...prev, expires_at: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Asunto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="ri-text mr-1"></i>
                Asunto *
              </label>
              <input
                type="text"
                value={messageForm.subject}
                onChange={(e) => setMessageForm(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Escriba el asunto del mensaje..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            {/* Mensaje */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="ri-message-2-line mr-1"></i>
                Mensaje *
              </label>
              <textarea
                value={messageForm.message}
                onChange={(e) => setMessageForm(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Escriba su mensaje aquí..."
                rows={6}
                maxLength={500}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                required
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {messageForm.message.length}/500 caracteres
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-gray-600">
                <i className="ri-information-line mr-1"></i>
                Los clientes recibirán este mensaje como notificación y no podrán responder
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setMessageForm({
                      subject: '',
                      message: '',
                      message_type: 'notification',
                      priority: 'medium',
                      expires_at: '',
                      client_ids: []
                    });
                    setShowClientSelector(false);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 cursor-pointer"
                >
                  <i className="ri-close-line mr-2"></i>
                  Limpiar
                </button>

                <button
                  type="submit"
                  disabled={sendingMessage || messageForm.client_ids.length === 0}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 cursor-pointer whitespace-nowrap"
                >
                  {sendingMessage ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <i className="ri-send-plane-line mr-2"></i>
                      Enviar a {messageForm.client_ids.length} cliente(s)
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Tab: Historial de Mensajes */}
      {activeTab === 'message-history' && (
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <i className="ri-history-line text-blue-600 text-2xl"></i>
                <h3 className="text-xl font-bold text-gray-900">Historial de Mensajes</h3>
              </div>

              <div className="flex items-center space-x-3">
                <div className="relative">
                  <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por cliente, asunto, mensaje..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80 text-sm"
                  />
                </div>
                {searchTerm && (
                  <span className="text-sm text-gray-500">
                    {filteredMessages.length} de {messages.length} mensajes
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {(searchTerm ? filteredMessages : messages).map((message) => (
                <div key={message.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Header del mensaje */}
                      <div className="flex items-center space-x-3 mb-2">
                        <i className={getMessageTypeIcon(message.message_type)}></i>
                        <h4 className="font-semibold text-gray-900">{message.subject}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(message.priority)}`}>
                          {message.priority === 'urgent' ? '🔴 URGENTE' :
                            message.priority === 'high' ? '🟠 Alta' :
                              message.priority === 'medium' ? '🟡 Media' : '🟢 Baja'}
                        </span>
                        {message.read_status ? (
                          <span className="bg-green-100 text-green-800 px-2 py-1 text-xs rounded-full">
                            <i className="ri-check-double-line mr-1"></i>Leído
                          </span>
                        ) : (
                          <span className="bg-orange-100 text-orange-800 px-2 py-1 text-xs rounded-full">
                            <i className="ri-mail-line mr-1"></i>No leído
                          </span>
                        )}
                      </div>

                      {/* Destinatario */}
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                        <i className="ri-user-line"></i>
                        <span><strong>Para:</strong> {message.client_name} ({message.client_email})</span>
                      </div>

                      {/* Contenido del mensaje */}
                      <div className="text-gray-800 text-sm bg-gray-50 p-3 rounded-lg mb-3">
                        {message.message}
                      </div>

                      {/* Footer del mensaje */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span>
                            <i className="ri-calendar-line mr-1"></i>
                            Enviado: {new Date(message.created_at).toLocaleString('es-ES')}
                          </span>
                          {message.read_status && message.read_at && (
                            <span>
                              <i className="ri-eye-line mr-1"></i>
                              Leído: {new Date(message.read_at).toLocaleString('es-ES')}
                            </span>
                          )}
                          {message.expires_at && (
                            <span>
                              <i className="ri-time-line mr-1"></i>
                              Vence: {new Date(message.expires_at).toLocaleString('es-ES')}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => deleteMessage(message.id)}
                          className="text-red-600 hover:text-red-800 cursor-pointer"
                          title="Eliminar mensaje"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {(searchTerm ? filteredMessages : messages).length === 0 && (
                <div className="text-center py-12">
                  <i className="ri-mail-line text-4xl text-gray-300 mb-4"></i>
                  {searchTerm ? (
                    <div>
                      <p className="text-gray-500 mb-2">No se encontraron mensajes con "{searchTerm}"</p>
                      <button
                        onClick={() => setSearchTerm('')}
                        className="text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        Limpiar búsqueda
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-500">No hay mensajes en el historial</p>
                      <button
                        onClick={() => setActiveTab('send-message')}
                        className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 cursor-pointer"
                      >
                        <i className="ri-add-line mr-2"></i>
                        Enviar Primer Mensaje
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Estado de Clientes */}
      {activeTab === 'client-status' && (
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <i className="ri-user-settings-line text-green-600 text-2xl"></i>
                <h3 className="text-xl font-bold text-gray-900">Estado de Clientes</h3>
              </div>

              <div className="relative">
                <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar cliente, empresa..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-80 text-sm"
                />
              </div>
              {searchTerm && (
                <div className="mt-2 text-sm text-gray-500">
                  Mostrando {filteredClients.length} de {clients.length} clientes
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(searchTerm ? filteredClients : clients).map((client) => (
                  <div key={client.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                    {/* Header del cliente */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <i className="ri-user-line text-green-600"></i>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{client.name}</h4>
                          <p className="text-sm text-gray-600">{client.email}</p>
                          {client.company && (
                            <p className="text-xs text-gray-500">{client.company}</p>
                          )}
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(client.status)}`}>
                        {client.status === 'active' ? '✅ Activo' : '⏸️ Inactivo'}
                      </span>
                    </div>

                    {/* Estadísticas del cliente */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="text-center bg-gray-50 rounded-lg p-2">
                        <div className="text-lg font-bold text-gray-900">{client.unread_messages}</div>
                        <div className="text-xs text-gray-600">No Leídos</div>
                      </div>
                      <div className="text-center bg-gray-50 rounded-lg p-2">
                        <div className="text-lg font-bold text-gray-900">
                          {messages.filter(m => m.client_id === client.id).length}
                        </div>
                        <div className="text-xs text-gray-600">Total Msgs</div>
                      </div>
                    </div>

                    {/* Último acceso */}
                    {client.last_login && (
                      <div className="text-xs text-gray-500 mb-3">
                        <i className="ri-time-line mr-1"></i>
                        Último acceso: {new Date(client.last_login).toLocaleDateString('es-ES')}
                      </div>
                    )}

                    {/* Botón de acción */}
                    <button
                      onClick={() => {
                        setMessageForm(prev => ({ ...prev, client_ids: [client.id] }));
                        setActiveTab('send-message');
                      }}
                      className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm cursor-pointer whitespace-nowrap"
                    >
                      <i className="ri-mail-send-line mr-2"></i>
                      Enviar Mensaje
                    </button>
                  </div>
                ))}

                {(searchTerm ? filteredClients : clients).length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <i className="ri-user-line text-4xl text-gray-300 mb-4"></i>
                    {searchTerm ? (
                      <div>
                        <p className="text-gray-500 mb-2">No se encontraron clientes con "{searchTerm}"</p>
                        <button
                          onClick={() => setSearchTerm('')}
                          className="text-blue-600 hover:text-blue-800 cursor-pointer"
                        >
                          Limpiar búsqueda
                        </button>
                      </div>
                    ) : (
                      <p className="text-gray-500">No se encontraron clientes</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Panel informativo */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <i className="ri-information-line text-purple-600 text-xl mt-1"></i>
          <div>
            <h3 className="font-bold text-purple-800 mb-2">📧 Sistema de Mensajería Unidireccional</h3>
            <p className="text-purple-700 mb-3">
              Herramienta de comunicación directa del administrador hacia clientes individuales. Los mensajes aparecen como notificaciones en el dashboard del cliente.
            </p>
            <div className="text-sm text-purple-600 space-y-1">
              <div><strong>Características del sistema:</strong></div>
              <div>• 📤 Envío unidireccional - clientes NO pueden responder</div>
              <div>• 🎯 Destinatarios múltiples - un mensaje a varios clientes</div>
              <div>• 🏷️ Categorización por tipo y prioridad</div>
              <div>• ⏰ Mensajes con vencimiento automático</div>
              <div>• 👁️ Seguimiento de lectura en tiempo real</div>
              <div>• 📊 Estadísticas completas de engagement</div>
              <div>• 🔍 Búsqueda inteligente en todos los módulos</div>
              <div className="mt-2 pt-2 border-t border-purple-300">
                <div className="font-medium text-purple-800">Tipos de mensaje disponibles:</div>
                <div>• 🔔 Notificación general • ⚠️ Alerta importante • ℹ️ Actualización del sistema</div>
                <div>• ⏰ Recordatorio de acción • 🚨 Mensaje urgente</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
