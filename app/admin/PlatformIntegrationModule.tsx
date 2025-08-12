
'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

interface Integration {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  isActive: boolean;
  configuration: any;
  lastSync?: string;
  fields: ConfigField[];
  popularity?: 'high' | 'medium' | 'low';
}

interface ConfigField {
  name: string;
  label: string;
  type: 'text' | 'password' | 'url' | 'select' | 'textarea' | 'number';
  required: boolean;
  placeholder?: string;
  options?: string[];
}

interface CategoryStats {
  total: number;
  active: number;
  inactive: number;
}

const PlatformIntegrationModule = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [filteredIntegrations, setFilteredIntegrations] = useState<Integration[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [configData, setConfigData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = [
    { 
      id: 'all', 
      name: 'Todas las Integraciones', 
      icon: 'ri-apps-2-line',
      description: 'Ver todas las integraciones disponibles'
    },
    { 
      id: 'crm', 
      name: 'CRM y Ventas', 
      icon: 'ri-customer-service-line',
      description: 'Gestión de clientes y relaciones comerciales'
    },
    { 
      id: 'communication', 
      name: 'Comunicación', 
      icon: 'ri-chat-3-line',
      description: 'Herramientas de comunicación empresarial'
    },
    { 
      id: 'productivity', 
      name: 'Productividad', 
      icon: 'ri-briefcase-line',
      description: 'Suites de oficina y gestión de tareas'
    },
    { 
      id: 'payment', 
      name: 'Pagos y Facturación', 
      icon: 'ri-secure-payment-line',
      description: 'Procesamiento de pagos y facturación'
    },
    { 
      id: 'marketing', 
      name: 'Marketing Digital', 
      icon: 'ri-megaphone-line',
      description: 'Email marketing y automatización'
    },
    { 
      id: 'storage', 
      name: 'Almacenamiento', 
      icon: 'ri-cloud-line',
      description: 'Almacenamiento en la nube y documentos'
    },
    { 
      id: 'analytics', 
      name: 'Analíticas', 
      icon: 'ri-bar-chart-line',
      description: 'Análisis de datos y métricas'
    },
    { 
      id: 'automation', 
      name: 'Automatización', 
      icon: 'ri-robot-line',
      description: 'Workflows y automatización de procesos'
    },
    { 
      id: 'security', 
      name: 'Seguridad', 
      icon: 'ri-shield-check-line',
      description: 'Autenticación y seguridad empresarial'
    },
    { 
      id: 'social', 
      name: 'Redes Sociales', 
      icon: 'ri-share-line',
      description: 'Gestión de redes sociales y marketing'
    },
    { 
      id: 'ecommerce', 
      name: 'E-commerce', 
      icon: 'ri-shopping-cart-line',
      description: 'Plataformas de comercio electrónico'
    }
  ];

  const defaultIntegrations: Integration[] = [
    // CRM y Ventas
    {
      id: 'salesforce',
      name: 'Salesforce',
      category: 'crm',
      icon: 'ri-customer-service-2-fill',
      description: 'Plataforma CRM líder mundial para gestión de clientes y ventas empresariales',
      isActive: false,
      configuration: {},
      popularity: 'high',
      fields: [
        { name: 'consumerKey', label: 'Consumer Key', type: 'text', required: true },
        { name: 'consumerSecret', label: 'Consumer Secret', type: 'password', required: true },
        { name: 'instanceUrl', label: 'URL de Instancia', type: 'url', required: true, placeholder: 'https://yourinstance.salesforce.com' },
        { name: 'apiVersion', label: 'Versión de API', type: 'select', required: true, options: ['v58.0', 'v57.0', 'v56.0'] }
      ]
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      category: 'crm',
      icon: 'ri-customer-service-fill',
      description: 'Plataforma integral de CRM, marketing y ventas para empresas en crecimiento',
      isActive: false,
      configuration: {},
      popularity: 'high',
      fields: [
        { name: 'apiToken', label: 'Token de API', type: 'password', required: true },
        { name: 'portalId', label: 'ID del Portal', type: 'text', required: true },
        { name: 'syncContacts', label: 'Sincronizar Contactos', type: 'select', required: false, options: ['true', 'false'] }
      ]
    },
    {
      id: 'pipedrive',
      name: 'Pipedrive',
      category: 'crm',
      icon: 'ri-pie-chart-fill',
      description: 'CRM diseñado específicamente para equipos de ventas y seguimiento de leads',
      isActive: false,
      configuration: {},
      popularity: 'medium',
      fields: [
        { name: 'apiToken', label: 'Token de API', type: 'password', required: true },
        { name: 'companyDomain', label: 'Dominio de la Empresa', type: 'text', required: true, placeholder: 'yourcompany' }
      ]
    },
    {
      id: 'zoho',
      name: 'Zoho CRM',
      category: 'crm',
      icon: 'ri-contacts-book-fill',
      description: 'Solución CRM completa para empresas en crecimiento con funciones avanzadas',
      isActive: false,
      configuration: {},
      popularity: 'medium',
      fields: [
        { name: 'clientId', label: 'ID del Cliente', type: 'text', required: true },
        { name: 'clientSecret', label: 'Secret del Cliente', type: 'password', required: true },
        { name: 'redirectUri', label: 'URI de Redirección', type: 'url', required: true }
      ]
    },

    // Comunicación
    {
      id: 'slack',
      name: 'Slack',
      category: 'communication',
      icon: 'ri-slack-fill',
      description: 'Plataforma de comunicación empresarial para equipos modernos y colaboración',
      isActive: false,
      configuration: {},
      popularity: 'high',
      fields: [
        { name: 'botToken', label: 'Token del Bot', type: 'password', required: true },
        { name: 'webhookUrl', label: 'URL del Webhook', type: 'url', required: false },
        { name: 'defaultChannel', label: 'Canal por Defecto', type: 'text', required: true, placeholder: '#general' }
      ]
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      category: 'communication',
      icon: 'ri-microsoft-fill',
      description: 'Plataforma de colaboración empresarial de Microsoft para reuniones y chat',
      isActive: false,
      configuration: {},
      popularity: 'high',
      fields: [
        { name: 'tenantId', label: 'ID del Tenant', type: 'text', required: true },
        { name: 'clientId', label: 'ID del Cliente', type: 'text', required: true },
        { name: 'clientSecret', label: 'Secret del Cliente', type: 'password', required: true }
      ]
    },
    {
      id: 'discord',
      name: 'Discord',
      category: 'communication',
      icon: 'ri-discord-fill',
      description: 'Plataforma de comunicación por voz, video y texto para comunidades',
      isActive: false,
      configuration: {},
      popularity: 'medium',
      fields: [
        { name: 'botToken', label: 'Token del Bot', type: 'password', required: true },
        { name: 'guildId', label: 'ID del Servidor', type: 'text', required: true },
        { name: 'webhookUrl', label: 'URL del Webhook', type: 'url', required: false }
      ]
    },
    {
      id: 'telegram',
      name: 'Telegram',
      category: 'communication',
      icon: 'ri-telegram-fill',
      description: 'Servicio de mensajería instantánea seguro para notificaciones empresariales',
      isActive: false,
      configuration: {},
      popularity: 'medium',
      fields: [
        { name: 'botToken', label: 'Token del Bot', type: 'password', required: true },
        { name: 'chatId', label: 'ID del Chat', type: 'text', required: true }
      ]
    },

    // Productividad
    {
      id: 'google-workspace',
      name: 'Google Workspace',
      category: 'productivity',
      icon: 'ri-google-fill',
      description: 'Suite de productividad de Google con Gmail, Drive, Calendar y más',
      isActive: false,
      configuration: {},
      popularity: 'high',
      fields: [
        { name: 'clientId', label: 'ID del Cliente', type: 'text', required: true },
        { name: 'clientSecret', label: 'Secret del Cliente', type: 'password', required: true },
        { name: 'serviceAccountKey', label: 'Clave de Cuenta de Servicio', type: 'textarea', required: true }
      ]
    },
    {
      id: 'office365',
      name: 'Microsoft 365',
      category: 'productivity',
      icon: 'ri-microsoft-fill',
      description: 'Suite de productividad empresarial de Microsoft con Office y más',
      isActive: false,
      configuration: {},
      popularity: 'high',
      fields: [
        { name: 'tenantId', label: 'ID del Tenant', type: 'text', required: true },
        { name: 'clientId', label: 'ID del Cliente', type: 'text', required: true },
        { name: 'clientSecret', label: 'Secret del Cliente', type: 'password', required: true }
      ]
    },
    {
      id: 'notion',
      name: 'Notion',
      category: 'productivity',
      icon: 'ri-notion-fill',
      description: 'Workspace todo en uno para notas, documentos y gestión de proyectos',
      isActive: false,
      configuration: {},
      popularity: 'medium',
      fields: [
        { name: 'apiToken', label: 'Token de Integración', type: 'password', required: true },
        { name: 'databaseId', label: 'ID de la Base de Datos', type: 'text', required: false }
      ]
    },
    {
      id: 'trello',
      name: 'Trello',
      category: 'productivity',
      icon: 'ri-trello-fill',
      description: 'Herramienta de gestión de proyectos con tableros estilo Kanban',
      isActive: false,
      configuration: {},
      popularity: 'medium',
      fields: [
        { name: 'apiKey', label: 'Clave de API', type: 'text', required: true },
        { name: 'apiToken', label: 'Token de API', type: 'password', required: true },
        { name: 'boardId', label: 'ID del Tablero', type: 'text', required: false }
      ]
    },
    {
      id: 'asana',
      name: 'Asana',
      category: 'productivity',
      icon: 'ri-task-fill',
      description: 'Plataforma de gestión de trabajo y proyectos para equipos colaborativos',
      isActive: false,
      configuration: {},
      popularity: 'medium',
      fields: [
        { name: 'accessToken', label: 'Token de Acceso Personal', type: 'password', required: true },
        { name: 'workspaceId', label: 'ID del Workspace', type: 'text', required: false }
      ]
    },

    // Pagos y Facturación
    {
      id: 'stripe',
      name: 'Stripe',
      category: 'payment',
      icon: 'ri-bank-card-fill',
      description: 'Plataforma líder de procesamiento de pagos online para empresas modernas',
      isActive: false,
      configuration: {},
      popularity: 'high',
      fields: [
        { name: 'publishableKey', label: 'Clave Publicable', type: 'text', required: true },
        { name: 'secretKey', label: 'Clave Secreta', type: 'password', required: true },
        { name: 'webhookSecret', label: 'Secret del Webhook', type: 'password', required: false }
      ]
    },
    {
      id: 'paypal',
      name: 'PayPal',
      category: 'payment',
      icon: 'ri-paypal-fill',
      description: 'Sistema de pagos digitales seguro reconocido mundialmente',
      isActive: false,
      configuration: {},
      popularity: 'high',
      fields: [
        { name: 'clientId', label: 'ID del Cliente', type: 'text', required: true },
        { name: 'clientSecret', label: 'Secret del Cliente', type: 'password', required: true },
        { name: 'environment', label: 'Entorno', type: 'select', required: true, options: ['sandbox', 'production'] }
      ]
    },
    {
      id: 'square',
      name: 'Square',
      category: 'payment',
      icon: 'ri-square-fill',
      description: 'Solución completa de pagos para comercios físicos y online',
      isActive: false,
      configuration: {},
      popularity: 'medium',
      fields: [
        { name: 'applicationId', label: 'ID de la Aplicación', type: 'text', required: true },
        { name: 'accessToken', label: 'Token de Acceso', type: 'password', required: true },
        { name: 'locationId', label: 'ID de Ubicación', type: 'text', required: true }
      ]
    },

    // Marketing Digital
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      category: 'marketing',
      icon: 'ri-mail-send-fill',
      description: 'Plataforma de email marketing y automatización para empresas',
      isActive: false,
      configuration: {},
      popularity: 'high',
      fields: [
        { name: 'apiKey', label: 'Clave de API', type: 'password', required: true },
        { name: 'serverPrefix', label: 'Prefijo del Servidor', type: 'text', required: true, placeholder: 'us1' },
        { name: 'listId', label: 'ID de la Lista', type: 'text', required: false }
      ]
    },
    {
      id: 'sendinblue',
      name: 'Brevo (SendinBlue)',
      category: 'marketing',
      icon: 'ri-mail-line',
      description: 'Plataforma de email marketing y SMS para comunicación empresarial',
      isActive: false,
      configuration: {},
      popularity: 'medium',
      fields: [
        { name: 'apiKey', label: 'Clave de API', type: 'password', required: true },
        { name: 'smtpKey', label: 'Clave SMTP', type: 'password', required: false }
      ]
    },
    {
      id: 'constant-contact',
      name: 'Constant Contact',
      category: 'marketing',
      icon: 'ri-contacts-fill',
      description: 'Herramienta de email marketing diseñada para pequeñas empresas',
      isActive: false,
      configuration: {},
      popularity: 'low',
      fields: [
        { name: 'apiKey', label: 'Clave de API', type: 'password', required: true },
        { name: 'accessToken', label: 'Token de Acceso', type: 'password', required: true }
      ]
    },

    // Almacenamiento
    {
      id: 'dropbox',
      name: 'Dropbox',
      category: 'storage',
      icon: 'ri-dropbox-fill',
      description: 'Servicio de almacenamiento en la nube para archivos y documentos',
      isActive: false,
      configuration: {},
      popularity: 'medium',
      fields: [
        { name: 'accessToken', label: 'Token de Acceso', type: 'password', required: true },
        { name: 'appKey', label: 'Clave de Aplicación', type: 'text', required: true }
      ]
    },
    {
      id: 'google-drive',
      name: 'Google Drive',
      category: 'storage',
      icon: 'ri-google-fill',
      description: 'Almacenamiento en la nube y colaboración de documentos de Google',
      isActive: false,
      configuration: {},
      popularity: 'high',
      fields: [
        { name: 'clientId', label: 'ID del Cliente', type: 'text', required: true },
        { name: 'clientSecret', label: 'Secret del Cliente', type: 'password', required: true },
        { name: 'serviceAccountKey', label: 'Clave de Cuenta de Servicio', type: 'textarea', required: true }
      ]
    },
    {
      id: 'onedrive',
      name: 'OneDrive',
      category: 'storage',
      icon: 'ri-microsoft-fill',
      description: 'Servicio de almacenamiento en la nube empresarial de Microsoft',
      isActive: false,
      configuration: {},
      popularity: 'medium',
      fields: [
        { name: 'clientId', label: 'ID del Cliente', type: 'text', required: true },
        { name: 'clientSecret', label: 'Secret del Cliente', type: 'password', required: true },
        { name: 'tenantId', label: 'ID del Tenant', type: 'text', required: true }
      ]
    },

    // Analíticas
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      category: 'analytics',
      icon: 'ri-line-chart-fill',
      description: 'Plataforma de análisis web más utilizada para métricas y comportamiento',
      isActive: false,
      configuration: {},
      popularity: 'high',
      fields: [
        { name: 'trackingId', label: 'ID de Seguimiento', type: 'text', required: true, placeholder: 'GA_TRACKING_ID' },
        { name: 'serviceAccountKey', label: 'Clave de Cuenta de Servicio', type: 'textarea', required: true }
      ]
    },
    {
      id: 'mixpanel',
      name: 'Mixpanel',
      category: 'analytics',
      icon: 'ri-pie-chart-2-fill',
      description: 'Análisis avanzado de productos y comportamiento de usuarios',
      isActive: false,
      configuration: {},
      popularity: 'medium',
      fields: [
        { name: 'projectToken', label: 'Token del Proyecto', type: 'password', required: true },
        { name: 'apiSecret', label: 'Secret de API', type: 'password', required: true }
      ]
    },
    {
      id: 'hotjar',
      name: 'Hotjar',
      category: 'analytics',
      icon: 'ri-fire-fill',
      description: 'Análisis de comportamiento de usuarios con mapas de calor y grabaciones',
      isActive: false,
      configuration: {},
      popularity: 'medium',
      fields: [
        { name: 'siteId', label: 'ID del Sitio', type: 'text', required: true },
        { name: 'apiKey', label: 'Clave de API', type: 'password', required: true }
      ]
    },

    // Automatización
    {
      id: 'zapier',
      name: 'Zapier',
      category: 'automation',
      icon: 'ri-flashlight-fill',
      description: 'Automatización de flujos de trabajo entre aplicaciones empresariales',
      isActive: false,
      configuration: {},
      popularity: 'high',
      fields: [
        { name: 'apiKey', label: 'Clave de API', type: 'password', required: true },
        { name: 'webhookUrl', label: 'URL del Webhook', type: 'url', required: false }
      ]
    },
    {
      id: 'integromat',
      name: 'Make (Integromat)',
      category: 'automation',
      icon: 'ri-settings-3-fill',
      description: 'Plataforma de automatización visual para procesos complejos',
      isActive: false,
      configuration: {},
      popularity: 'medium',
      fields: [
        { name: 'apiKey', label: 'Clave de API', type: 'password', required: true },
        { name: 'webhookUrl', label: 'URL del Webhook', type: 'url', required: false }
      ]
    },
    {
      id: 'ifttt',
      name: 'IFTTT',
      category: 'automation',
      icon: 'ri-link-m',
      description: 'Automatización simple: "Si esto, entonces aquello" para tareas básicas',
      isActive: false,
      configuration: {},   // <-- Fixed missing configuration object
      popularity: 'low',
      fields: [
        { name: 'webhookKey', label: 'Clave del Webhook', type: 'password', required: true },
        { name: 'eventName', label: 'Nombre del Evento', type: 'text', required: true }
      ]
    },

    // Seguridad
    {
      id: 'auth0',
      name: 'Auth0',
      category: 'security',
      icon: 'ri-shield-user-fill',
      description: 'Plataforma de autenticación y autorización para aplicaciones modernas',
      isActive: false,
      configuration: {},
      popularity: 'high',
      fields: [
        { name: 'domain', label: 'Dominio', type: 'text', required: true, placeholder: 'your-domain.auth0.com' },
        { name: 'clientId', label: 'ID del Cliente', type: 'text', required: true },
        { name: 'clientSecret', label: 'Secret del Cliente', type: 'password', required: true }
      ]
    },
    {
      id: 'okta',
      name: 'Okta',
      category: 'security',
      icon: 'ri-shield-check-fill',
      description: 'Gestión de identidad empresarial y acceso seguro a aplicaciones',
      isActive: false,
      configuration: {},
      popularity: 'medium',
      fields: [
        { name: 'domain', label: 'Dominio de Okta', type: 'text', required: true, placeholder: 'your-domain.okta.com' },
        { name: 'apiToken', label: 'Token de API', type: 'password', required: true }
      ]
    },

    // Redes Sociales
    {
      id: 'facebook',
      name: 'Facebook',
      category: 'social',
      icon: 'ri-facebook-fill',
      description: 'Integración con Facebook y Meta para marketing y publicidad',
      isActive: false,
      configuration: {},
      popularity: 'high',
      fields: [
        { name: 'appId', label: 'ID de la Aplicación', type: 'text', required: true },
        { name: 'appSecret', label: 'Secret de la Aplicación', type: 'password', required: true },
        { name: 'accessToken', label: 'Token de Acceso', type: 'password', required: true }
      ]
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      category: 'social',
      icon: 'ri-twitter-x-fill',
      description: 'Integración con la plataforma social Twitter/X para marketing',
      isActive: false,
      configuration: {},
      popularity: 'medium',
      fields: [
        { name: 'apiKey', label: 'Clave de API', type: 'text', required: true },
        { name: 'apiSecret', label: 'Secret de API', type: 'password', required: true },
        { name: 'accessToken', label: 'Token de Acceso', type: 'password', required: true },
        { name: 'accessTokenSecret', label: 'Secret del Token de Acceso', type: 'password', required: true }
      ]
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      category: 'social',
      icon: 'ri-linkedin-fill',
      description: 'Red social profesional para marketing B2B y reclutamiento',
      isActive: false,
      configuration: {},
      popularity: 'medium',
      fields: [
        { name: 'clientId', label: 'ID del Cliente', type: 'text', required: true },
        { name: 'clientSecret', label: 'Secret del Cliente', type: 'password', required: true }
      ]
    },
    {
      id: 'instagram',
      name: 'Instagram',
      category: 'social',
      icon: 'ri-instagram-fill',
      description: 'Integración con Instagram Business para marketing visual',
      isActive: false,
      configuration: {},
      popularity: 'medium',
      fields: [
        { name: 'appId', label: 'ID de la Aplicación', type: 'text', required: true },
        { name: 'appSecret', label: 'Secret de la Aplicación', type: 'password', required: true },
        { name: 'accessToken', label: 'Token de Acceso', type: 'password', required: true }
      ]
    },

    // E-commerce
    {
      id: 'shopify',
      name: 'Shopify',
      category: 'ecommerce',
      icon: 'ri-shopping-bag-fill',
      description: 'Plataforma líder de comercio electrónico para tiendas online',
      isActive: false,
      configuration: {},
      popularity: 'high',
      fields: [
        { name: 'shopName', label: 'Nombre de la Tienda', type: 'text', required: true, placeholder: 'your-shop' },
        { name: 'apiKey', label: 'Clave de API', type: 'text', required: true },
        { name: 'apiSecret', label: 'Secret de API', type: 'password', required: true },
        { name: 'accessToken', label: 'Token de Acceso', type: 'password', required: true }
      ]
    },
    {
      id: 'woocommerce',
      name: 'WooCommerce',
      category: 'ecommerce',
      icon: 'ri-store-fill',
      description: 'Plugin de e-commerce para WordPress más utilizado mundialmente',
      isActive: false,
      configuration: {},
      popularity: 'high',
      fields: [
        { name: 'siteUrl', label: 'URL del Sitio', type: 'url', required: true, placeholder: 'https://yoursite.com' },
        { name: 'consumerKey', label: 'Consumer Key', type: 'text', required: true },
        { name: 'consumerSecret', label: 'Consumer Secret', type: 'password', required: true }
      ]
    },
    {
      id: 'magento',
      name: 'Magento',
      category: 'ecommerce',
      icon: 'ri-shopping-cart-2-fill',
      description: 'Plataforma de e-commerce empresarial para grandes tiendas online',
      isActive: false,
      configuration: {},
      popularity: 'medium',
      fields: [
        { name: 'baseUrl', label: 'URL Base', type: 'url', required: true, placeholder: 'https://yourstore.com' },
        { name: 'adminToken', label: 'Token de Administrador', type: 'password', required: true }
      ]
    }
  ];

  useEffect(() => {
    loadIntegrations();
  }, []);

  useEffect(() => {
    filterIntegrations();
  }, [integrations, activeCategory, searchTerm]);

  const loadIntegrations = async () => {
    try {
      console.log('🔄 Cargando integraciones de plataformas...');
      
      if (!supabase) {
        console.error('❌ Cliente de Supabase no inicializado');
        setIntegrations(defaultIntegrations);
        return;
      }

      const { data, error } = await supabase
        .from('platform_integrations')
        .select('*');

      if (error) {
        console.warn('⚠️ Error en consulta de base de datos:', error.message);
        setIntegrations(defaultIntegrations);
        return;
      }

      const mergedIntegrations = defaultIntegrations.map(defaultInt => {
        const savedInt = data?.find(saved => saved.platform_id === defaultInt.id);
        return savedInt
          ? {
              ...defaultInt,
              isActive: savedInt.is_active || false,
              configuration: savedInt.configuration || {},
              lastSync: savedInt.last_sync
            }
          : defaultInt;
      });

      setIntegrations(mergedIntegrations);
      console.log('✅ Integraciones cargadas correctamente:', mergedIntegrations.length, 'integraciones');

    } catch (error) {
      console.error('❌ Error cargando integraciones:', error);
      setIntegrations(defaultIntegrations);
    }
  };

  const filterIntegrations = () => {
    let filtered = integrations;

    if (activeCategory !== 'all') {
      filtered = filtered.filter(int => int.category === activeCategory);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        int =>
          int.name.toLowerCase().includes(term) ||
          int.description.toLowerCase().includes(term)
      );
    }

    setFilteredIntegrations(filtered);
  };

  const openConfigModal = (integration: Integration) => {
    setSelectedIntegration(integration);
    setConfigData(integration.configuration || {});
    setIsConfigModalOpen(true);
  };

  const closeConfigModal = () => {
    setIsConfigModalOpen(false);
    setSelectedIntegration(null);
    setConfigData({});
  };

  const handleConfigChange = (fieldName: string, value: string) => {
    setConfigData(prev => ({ ...prev, [fieldName]: value }));
  };

  const saveConfiguration = async () => {
    if (!selectedIntegration) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('platform_integrations')
        .upsert({
          platform_id: selectedIntegration.id,
          platform_name: selectedIntegration.name,
          category: selectedIntegration.category,
          configuration: configData,
          is_active: true,
          last_sync: new Date().toISOString()
        });

      if (error) {
        console.error('Error guardando configuración:', error);
        alert('Error al guardar la configuración: ' + error.message);
        return;
      }

      await loadIntegrations();
      closeConfigModal();
      alert('✅ Configuración guardada exitosamente');

    } catch (error) {
      console.error('Error guardando configuración:', error);
      alert('Error al guardar la configuración');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleIntegration = async (integration: Integration) => {
    try {
      const newStatus = !integration.isActive;

      const { error } = await supabase
        .from('platform_integrations')
        .upsert({
          platform_id: integration.id,
          platform_name: integration.name,
          category: integration.category,
          configuration: integration.configuration || {},
          is_active: newStatus,
          last_sync: newStatus ? new Date().toISOString() : null
        });

      if (error) {
        console.error('Error cambiando estado de integración:', error);
        return;
      }

      await loadIntegrations();

    } catch (error) {
      console.error('Error cambiando estado de integración:', error);
    }
  };

  const getStats = () => {
    const total = integrations.length;
    const active = integrations.filter(int => int.isActive).length;
    const byCategory = categories.reduce((acc, cat) => {
      if (cat.id !== 'all') {
        const categoryStats: CategoryStats = {
          total: integrations.filter(int => int.category === cat.id).length,
          active: integrations.filter(int => int.category === cat.id && int.isActive).length,
          inactive: integrations.filter(int => int.category === cat.id && !int.isActive).length
        };
        acc[cat.id] = categoryStats;
      }
      return acc;
    }, {} as Record<string, CategoryStats>);
    return { total, active, byCategory };
  };

  const stats = getStats();

  const getPopularityBadge = (popularity?: string) => {
    switch (popularity) {
      case 'high':
        return <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Popular</span>;
      case 'medium':
        return <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">Recomendado</span>;
      case 'low':
        return <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium">Especializado</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Profesional */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Centro de Integraciones</h1>
            <p className="text-blue-100 text-lg mb-4">
              Conecta tu plataforma con más de {stats.total} servicios externos para automatizar procesos empresariales
            </p>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-blue-100">Integraciones</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-300">{stats.active}</div>
                <div className="text-sm text-blue-100">Activas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{categories.length - 1}</div>
                <div className="text-sm text-blue-100">Categorías</div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <i className="ri-shield-check-line text-green-300"></i>
                <span className="font-medium">Estado del Sistema</span>
              </div>
              <div className="text-sm text-blue-100">Todas las integraciones operativas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Búsqueda y Controles */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Buscar integraciones..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Vista:</span>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                <i className="ri-grid-line"></i>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                <i className="ri-list-check"></i>
              </button>
            </div>
            
            {(searchTerm || activeCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('all');
                }}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                <i className="ri-close-line mr-1"></i>
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {filteredIntegrations.length !== integrations.length && (
          <div className="mt-4 text-sm text-gray-600">
            Mostrando {filteredIntegrations.length} de {integrations.length} integraciones
          </div>
        )}
      </div>

      {/* Navegación por Categorías Profesional */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Categorías de Integración</h2>
          <p className="text-gray-600">Explora integraciones organizadas por funcionalidad empresarial</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
          {categories.map(category => {
            const categoryStats = category.id === 'all' 
              ? { total: stats.total, active: stats.active, inactive: stats.total - stats.active }
              : stats.byCategory[category.id] || { total: 0, active: 0, inactive: 0 };

            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-left group ${
                  activeCategory === category.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    activeCategory === category.id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                  }`}>
                    <i className={`${category.icon} text-xl`}></i>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      activeCategory === category.id ? 'text-blue-600' : 'text-gray-900'
                    }`}>
                      {categoryStats.total}
                    </div>
                    <div className="text-xs text-gray-500">integraciones</div>
                  </div>
                </div>

                <h3 className={`font-semibold mb-1 ${
                  activeCategory === category.id ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  {category.name}
                </h3>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {category.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {categoryStats.active > 0 && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                        {categoryStats.active} activas
                      </span>
                    )}
                    {categoryStats.inactive > 0 && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {categoryStats.inactive} disponibles
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lista de Integraciones */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {activeCategory === 'all' 
                  ? 'Todas las Integraciones' 
                  : categories.find(c => c.id === activeCategory)?.name
                }
              </h2>
              <p className="text-gray-600 mt-1">
                {filteredIntegrations.length} integraciones disponibles
              </p>
            </div>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredIntegrations.map(integration => (
              <div
                key={integration.id}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${
                      integration.isActive 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <i className={`${integration.icon} text-xl`}></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {integration.name}
                      </h3>
                      {getPopularityBadge(integration.popularity)}
                    </div>
                  </div>

                  <button
                    onClick={() => toggleIntegration(integration)}
                    className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                      integration.isActive
                        ? 'bg-green-100 text-green-600 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title={integration.isActive ? 'Desactivar' : 'Activar'}
                  >
                    <i className={`ri-${integration.isActive ? 'pause' : 'play'}-line text-sm`}></i>
                  </button>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                  {integration.description}
                </p>

                {integration.isActive && integration.lastSync && (
                  <div className="mb-4 text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                    <i className="ri-check-line mr-1"></i>
                    Última sincronización: {new Date(integration.lastSync).toLocaleDateString('es-ES')}
                  </div>
                )}

                <button
                  onClick={() => openConfigModal(integration)}
                  className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <i className="ri-settings-3-line mr-2"></i>
                  Configurar Integración
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredIntegrations.map(integration => (
              <div key={integration.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${
                      integration.isActive 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <i className={`${integration.icon} text-xl`}></i>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                        {getPopularityBadge(integration.popularity)}
                        {integration.isActive && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                            Activa
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {integration.description}
                      </p>
                      {integration.isActive && integration.lastSync && (
                        <p className="text-xs text-green-600 mt-1">
                          <i className="ri-check-line mr-1"></i>
                          Última sincronización: {new Date(integration.lastSync).toLocaleDateString('es-ES')}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleIntegration(integration)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        integration.isActive
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {integration.isActive ? 'Desactivar' : 'Activar'}
                    </button>
                    <button
                      onClick={() => openConfigModal(integration)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <i className="ri-settings-3-line mr-2"></i>
                      Configurar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredIntegrations.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-search-line text-2xl text-gray-400"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron integraciones</h3>
            <p className="text-gray-600 mb-4">
              Prueba ajustando los filtros de búsqueda o selecciona una categoría diferente.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveCategory('all');
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ver todas las integraciones
            </button>
          </div>
        )}
      </div>

      {/* Modal de Configuración */}
      {isConfigModalOpen && selectedIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-xl">
                    <i className={`${selectedIntegration.icon} text-xl text-blue-600`}></i>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Configurar {selectedIntegration.name}
                    </h2>
                    <p className="text-sm text-gray-600">{selectedIntegration.description}</p>
                  </div>
                </div>
                <button
                  onClick={closeConfigModal}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {selectedIntegration.fields.map(field => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>

                    {field.type === 'select' ? (
                      <select
                        value={configData[field.name] || ''}
                        onChange={e => handleConfigChange(field.name, e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                      >
                        <option value="">Seleccionar...</option>
                        {field.options?.map(option => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        value={configData[field.name] || ''}
                        onChange={e => handleConfigChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    ) : (
                      <input
                        type={field.type}
                        value={configData[field.name] || ''}
                        onChange={e => handleConfigChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <i className="ri-information-line text-blue-600 text-lg mt-0.5"></i>
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">Información de Seguridad</h4>
                    <p className="text-sm text-blue-700">
                      Todas las credenciales se almacenan de forma segura y encriptada. 
                      Nunca compartimos tu información con terceros sin tu consentimiento.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 p-6">
              <div className="flex justify-end space-x-4">
                <button
                  onClick={closeConfigModal}
                  className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveConfiguration}
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
                >
                  {isLoading ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <i className="ri-save-line mr-2"></i>
                      Guardar Configuración
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer con Información */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <i className="ri-plug-line text-green-600 text-xl"></i>
          </div>
          <div>
            <h3 className="font-bold text-green-800 mb-1">Centro de Integraciones Empresariales</h3>
            <p className="text-green-700">
              Conecta tu plataforma con las mejores herramientas empresariales del mercado. 
              Automatiza procesos, sincroniza datos y mejora la productividad de tu equipo.
            </p>
            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-green-600">
              <div>✅ Configuración simplificada</div>
              <div>✅ Conexiones seguras</div>
              <div>✅ Sincronización automática</div>
              <div>✅ Soporte técnico incluido</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformIntegrationModule;
