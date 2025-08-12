
import Link from 'next/link';

export default function PoliticaCookies() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity cursor-pointer">
              <img 
                src="https://static.readdy.ai/image/a46e05e0e46521768ae523a2d6c02dff/115802210ec057f189cdb973cb3ac2b8.png" 
                alt="ConstructIA" 
                className="h-12 w-auto"
              />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Política de Cookies</h1>
              <p className="text-gray-600">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          
          <h2>1. ¿QUÉ SON LAS COOKIES?</h2>
          <p>
            Las cookies son pequeños archivos de texto que se almacenan en su dispositivo (ordenador, tablet, smartphone) 
            cuando visita nuestro sitio web <strong>constructia.com</strong> y utiliza la plataforma <strong>ConstructIA</strong>. 
            Estas cookies nos permiten reconocer su dispositivo y recordar información sobre su visita.
          </p>

          <div className="bg-blue-50 p-6 rounded-lg">
            <h3>Información de la Empresa</h3>
            <p><strong>Responsable:</strong> ConstructIA</p>
            <p><strong>Domicilio:</strong> España</p>
            <p><strong>Email:</strong> cookies@constructia.com</p>
            <p><strong>Web:</strong> https://constructia.com</p>
          </div>

          <h2>2. TIPOS DE COOKIES QUE UTILIZAMOS</h2>

          <h3>2.1. Según su Finalidad</h3>

          <h4>Cookies Técnicas (Necesarias)</h4>
          <p>Son imprescindibles para el funcionamiento básico del sitio web y no requieren consentimiento:</p>
          <div className="bg-green-50 p-4 rounded-lg">
            <ul>
              <li><strong>constructia_session:</strong> Mantiene su sesión activa</li>
              <li><strong>constructia_auth:</strong> Autentica su identidad</li>
              <li><strong>constructia_security:</strong> Protege contra ataques CSRF</li>
              <li><strong>constructia_lang:</strong> Recuerda su idioma preferido</li>
              <li><strong>constructia_consent:</strong> Almacena sus preferencias de cookies</li>
            </ul>
          </div>

          <h4>Cookies de Funcionalidad</h4>
          <p>Mejoran la funcionalidad y personalización del sitio:</p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <ul>
              <li><strong>constructia_preferences:</strong> Guarda sus preferencias de interfaz</li>
              <li><strong>constructia_dashboard:</strong> Recuerda la configuración de su panel</li>
              <li><strong>constructia_projects:</strong> Mantiene sus proyectos recientes</li>
              <li><strong>constructia_filters:</strong> Conserva sus filtros de búsqueda</li>
              <li><strong>constructia_theme:</strong> Modo claro/oscuro seleccionado</li>
            </ul>
          </div>

          <h4>Cookies Analíticas</h4>
          <p>Nos ayudan a entender cómo usa nuestro sitio web:</p>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <ul>
              <li><strong>_ga:</strong> Google Analytics - Identifica usuarios únicos</li>
              <li><strong>_ga_[ID]:</strong> Google Analytics 4 - Datos de sesión</li>
              <li><strong>_gid:</strong> Google Analytics - Identifica usuarios únicos (24h)</li>
              <li><strong>constructia_analytics:</strong> Métricas internas de uso</li>
              <li><strong>constructia_performance:</strong> Rendimiento de la aplicación</li>
            </ul>
          </div>

          <h4>Cookies de Marketing</h4>
          <p>Se utilizan para mostrar publicidad relevante:</p>
          <div className="bg-purple-50 p-4 rounded-lg">
            <ul>
              <li><strong>_fbp:</strong> Facebook Pixel - Seguimiento de conversiones</li>
              <li><strong>_gcl_au:</strong> Google Ads - Conversiones de anuncios</li>
              <li><strong>linkedin_oauth:</strong> LinkedIn - Seguimiento profesional</li>
              <li><strong>constructia_campaign:</strong> Seguimiento de campañas internas</li>
            </ul>
          </div>

          <h3>2.2. Según su Duración</h3>

          <h4>Cookies de Sesión</h4>
          <p>Se eliminan cuando cierra el navegador:</p>
          <ul>
            <li>constructia_session</li>
            <li>constructia_csrf_token</li>
            <li>constructia_temp_data</li>
          </ul>

          <h4>Cookies Persistentes</h4>
          <p>Permanecen en su dispositivo durante un tiempo determinado:</p>
          <ul>
            <li><strong>constructia_auth:</strong> 30 días</li>
            <li><strong>constructia_preferences:</strong> 1 año</li>
            <li><strong>constructia_consent:</strong> 1 año</li>
            <li><strong>_ga:</strong> 2 años</li>
            <li><strong>_fbp:</strong> 90 días</li>
          </ul>

          <h3>2.3. Según su Titularidad</h3>

          <h4>Cookies Propias</h4>
          <p>Enviadas por nuestros servidores:</p>
          <ul>
            <li>Todas las cookies que empiezan por "constructia_"</li>
            <li>Cookies de autenticación y sesión</li>
            <li>Cookies de preferencias del usuario</li>
          </ul>

          <h4>Cookies de Terceros</h4>
          <p>Enviadas por servicios externos que utilizamos:</p>
          <ul>
            <li><strong>Google Analytics:</strong> _ga, _gid, _ga_[ID]</li>
            <li><strong>Google Ads:</strong> _gcl_au, conversion tracking</li>
            <li><strong>Facebook:</strong> _fbp, fr</li>
            <li><strong>LinkedIn:</strong> linkedin_oauth</li>
            <li><strong>Stripe:</strong> __stripe_mid, __stripe_sid</li>
            <li><strong>Supabase:</strong> sb-[project]-auth-token</li>
          </ul>

          <h2>3. COOKIES ESPECÍFICAS DE CONSTRUCTIA</h2>

          <h3>3.1. Cookies de la Plataforma</h3>
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 p-3 text-left">Cookie</th>
                <th className="border border-gray-300 p-3 text-left">Propósito</th>
                <th className="border border-gray-300 p-3 text-left">Duración</th>
                <th className="border border-gray-300 p-3 text-left">Tipo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-3">constructia_user_id</td>
                <td className="border border-gray-300 p-3">Identificación única del usuario</td>
                <td className="border border-gray-300 p-3">30 días</td>
                <td className="border border-gray-300 p-3">Necesaria</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3">constructia_plan</td>
                <td className="border border-gray-300 p-3">Plan de suscripción activo</td>
                <td className="border border-gray-300 p-3">24 horas</td>
                <td className="border border-gray-300 p-3">Funcional</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3">constructia_tokens</td>
                <td className="border border-gray-300 p-3">Tokens disponibles del usuario</td>
                <td className="border border-gray-300 p-3">1 hora</td>
                <td className="border border-gray-300 p-3">Funcional</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3">constructia_obralia_sync</td>
                <td className="border border-gray-300 p-3">Estado de sincronización con Obralia</td>
                <td className="border border-gray-300 p-3">12 horas</td>
                <td className="border border-gray-300 p-3">Funcional</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3">constructia_ai_usage</td>
                <td className="border border-gray-300 p-3">Seguimiento uso de IA</td>
                <td className="border border-gray-300 p-3">7 días</td>
                <td className="border border-gray-300 p-3">Analítica</td>
              </tr>
            </tbody>
          </table>

          <h3>3.2. Cookies de Integraciones</h3>
          <ul>
            <li><strong>obralia_connection:</strong> Estado de conexión con Obralia (4 horas)</li>
            <li><strong>gemini_api_status:</strong> Estado de la API de Gemini (2 horas)</li>
            <li><strong>stripe_payment_intent:</strong> Intención de pago activa (30 minutos)</li>
            <li><strong>sepa_mandate:</strong> Estado del mandato SEPA (30 días)</li>
          </ul>

          <h2>4. GESTIÓN DE COOKIES</h2>

          <h3>4.1. Panel de Preferencias</h3>
          <p>
            Puede gestionar sus preferencias de cookies desde nuestro panel de configuración, 
            accesible desde el banner de cookies o desde el enlace "Configurar Cookies" en el footer.
          </p>

          <div className="bg-green-50 p-6 rounded-lg">
            <h4>Opciones Disponibles:</h4>
            <ul>
              <li>✅ <strong>Necesarias:</strong> Siempre activas (no se pueden desactivar)</li>
              <li>🔧 <strong>Funcionalidad:</strong> Mejoran la experiencia de usuario</li>
              <li>📊 <strong>Analíticas:</strong> Nos ayudan a mejorar el sitio</li>
              <li>📢 <strong>Marketing:</strong> Publicidad personalizada</li>
            </ul>
          </div>

          <h3>4.2. Configuración del Navegador</h3>
          <p>También puede gestionar las cookies directamente desde su navegador:</p>

          <h4>Google Chrome</h4>
          <p>Configuración → Privacidad y seguridad → Cookies y otros datos de sitios</p>

          <h4>Mozilla Firefox</h4>
          <p>Opciones → Privacidad y seguridad → Cookies y datos del sitio web</p>

          <h4>Safari</h4>
          <p>Preferencias → Privacidad → Gestionar datos de sitios web</p>

          <h4>Microsoft Edge</h4>
          <p>Configuración → Cookies y permisos del sitio → Cookies y datos almacenados</p>

          <h3>4.3. Navegación Privada</h3>
          <p>
            Puede usar el modo privado/incógnito de su navegador para evitar que se almacenen cookies:
          </p>
          <ul>
            <li><strong>Chrome:</strong> Ctrl+Shift+N</li>
            <li><strong>Firefox:</strong> Ctrl+Shift+P</li>
            <li><strong>Safari:</strong> Cmd+Shift+N</li>
            <li><strong>Edge:</strong> Ctrl+Shift+N</li>
          </ul>

          <h2>5. COOKIES DE TERCEROS</h2>

          <h3>5.1. Google Analytics</h3>
          <p>
            Utilizamos Google Analytics para analizar el uso de nuestro sitio web. 
            Puede obtener más información y desactivarlo en:
            <a href="https://tools.google.com/dlpage/gaoptout" className="text-green-600 hover:text-green-800 underline" target="_blank" rel="noopener noreferrer">
              https://tools.google.com/dlpage/gaoptout
            </a>
          </p>

          <h3>5.2. Google Ads</h3>
          <p>
            Para personalizar anuncios. Puede gestionar sus preferencias en:
            <a href="https://adssettings.google.com" className="text-green-600 hover:text-green-800 underline" target="_blank" rel="noopener noreferrer">
              https://adssettings.google.com
            </a>
          </p>

          <h3>5.3. Facebook Pixel</h3>
          <p>
            Para seguimiento de conversiones. Más información en:
            <a href="https://www.facebook.com/privacy/explanation" className="text-green-600 hover:text-green-800 underline" target="_blank" rel="noopener noreferrer">
              https://www.facebook.com/privacy/explanation
            </a>
          </p>

          <h3>5.4. LinkedIn Insight Tag</h3>
          <p>
            Para análisis profesional. Configuración en:
            <a href="https://www.linkedin.com/psettings/guest-controls" className="text-green-600 hover:text-green-800 underline" target="_blank" rel="noopener noreferrer">
              https://www.linkedin.com/psettings/guest-controls
            </a>
          </p>

          <h2>6. IMPACTO DE DESACTIVAR COOKIES</h2>

          <h3>6.1. Cookies Necesarias</h3>
          <p>Si se desactivan (no recomendado), podría experimentar:</p>
          <ul>
            <li>❌ Imposibilidad de iniciar sesión</li>
            <li>❌ Pérdida de datos de formularios</li>
            <li>❌ Problemas de seguridad CSRF</li>
            <li>❌ Funcionalidades básicas no disponibles</li>
          </ul>

          <h3>6.2. Cookies Funcionales</h3>
          <p>Si se desactivan:</p>
          <ul>
            <li>⚠️ Pérdida de preferencias personalizadas</li>
            <li>⚠️ Configuración de dashboard no se guarda</li>
            <li>⚠️ Idioma se resetea en cada visita</li>
            <li>⚠️ Filtros de búsqueda no se recuerdan</li>
          </ul>

          <h3>6.3. Cookies Analíticas</h3>
          <p>Si se desactivan:</p>
          <ul>
            <li>ℹ️ No afecta la funcionalidad del sitio</li>
            <li>ℹ️ Sus visitas no se contabilizan en estadísticas</li>
            <li>ℹ️ No podemos mejorar la experiencia basándonos en su uso</li>
          </ul>

          <h3>6.4. Cookies de Marketing</h3>
          <p>Si se desactivan:</p>
          <ul>
            <li>📢 Anuncios menos relevantes</li>
            <li>📢 No se registran conversiones de campañas</li>
            <li>📢 Experiencia publicitaria menos personalizada</li>
          </ul>

          <h2>7. SEGURIDAD Y PRIVACIDAD</h2>

          <h3>7.1. Medidas de Seguridad</h3>
          <p>Todas nuestras cookies están protegidas con:</p>
          <ul>
            <li><strong>Secure flag:</strong> Solo se transmiten por HTTPS</li>
            <li><strong>HttpOnly flag:</strong> No accesibles desde JavaScript (cuando es apropiado)</li>
            <li><strong>SameSite:</strong> Protección contra ataques CSRF</li>
            <li><strong>Cifrado:</strong> Contenido cifrado cuando contiene datos sensibles</li>
          </ul>

          <h3>7.2. Datos Personales en Cookies</h3>
          <p>
            Las cookies pueden contener identificadores únicos pero nunca información personal 
            directa como nombres, emails o números de teléfono. Toda información personal 
            se almacena de forma segura en nuestros servidores.
          </p>

          <h2>8. COOKIES EN APLICACIONES MÓVILES</h2>
          <p>
            Si utiliza ConstructIA a través de aplicaciones móviles, estas pueden usar 
            tecnologías similares a las cookies:
          </p>
          <ul>
            <li><strong>Local Storage:</strong> Almacenamiento local de preferencias</li>
            <li><strong>Session Storage:</strong> Datos temporales de sesión</li>
            <li><strong>Cache Storage:</strong> Mejora del rendimiento</li>
            <li><strong>IndexedDB:</strong> Base de datos local para offline</li>
          </ul>

          <h2>9. TRANSFERENCIAS INTERNACIONALES</h2>
          <p>
            Algunos de nuestros proveedores de cookies pueden transferir datos fuera del EEE:
          </p>
          <ul>
            <li><strong>Google (Analytics, Ads):</strong> USA - Adequacy Decision + DPA</li>
            <li><strong>Facebook:</strong> USA - Standard Contractual Clauses</li>
            <li><strong>LinkedIn:</strong> USA - Adequacy Decision</li>
          </ul>

          <h2>10. ACTUALIZACIONES</h2>
          <p>
            Esta Política de Cookies se actualiza regularmente para reflejar cambios en:
          </p>
          <ul>
            <li>Nuevas funcionalidades de la plataforma</li>
            <li>Cambios en la legislación aplicable</li>
            <li>Nuevas integraciones de terceros</li>
            <li>Mejoras en las medidas de seguridad</li>
          </ul>

          <h2>11. HERRAMIENTAS DE CONTROL ADICIONALES</h2>

          <h3>11.1. Do Not Track</h3>
          <p>
            Respetamos las señales "Do Not Track" del navegador para cookies analíticas y de marketing.
          </p>

          <h3>11.2. Global Privacy Control</h3>
          <p>
            Compatible con el estándar Global Privacy Control (GPC) para automación de preferencias.
          </p>

          <h3>11.3. Consent Management Platform</h3>
          <p>
            Utilizamos una plataforma de gestión de consentimientos que cumple con IAB TCF v2.0.
          </p>

          <h2>12. DERECHOS DEL USUARIO</h2>
          <p>En relación con las cookies, usted tiene derecho a:</p>
          <ul>
            <li><strong>Información:</strong> Conocer qué cookies utilizamos</li>
            <li><strong>Acceso:</strong> Acceder a sus preferencias de cookies</li>
            <li><strong>Rectificación:</strong> Modificar sus preferencias</li>
            <li><strong>Oposición:</strong> Rechazar cookies no esenciales</li>
            <li><strong>Supresión:</strong> Eliminar cookies almacenadas</li>
            <li><strong>Portabilidad:</strong> Exportar sus preferencias</li>
          </ul>

          <h2>13. CONTACTO Y SOPORTE</h2>
          <p>Para cualquier consulta sobre cookies:</p>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p><strong>Email cookies:</strong> cookies@constructia.com</p>
            <p><strong>Email DPO:</strong> dpo@constructia.com</p>
            <p><strong>Teléfono:</strong> +34 XXX XXX XXX</p>
            <p><strong>Horario:</strong> Lunes a Viernes, 9:00-18:00 CET</p>
          </div>

          <h2>14. RECURSOS ADICIONALES</h2>
          <p>Enlaces útiles sobre cookies:</p>
          <ul>
            <li><a href="https://www.aepd.es/es/guias/guia-cookies" className="text-green-600 hover:text-green-800 underline" target="_blank" rel="noopener noreferrer">Guía AEPD sobre Cookies</a></li>
            <li><a href="https://www.allaboutcookies.org" className="text-green-600 hover:text-green-800 underline" target="_blank" rel="noopener noreferrer">All About Cookies</a></li>
            <li><a href="https://www.youronlinechoices.com" className="text-green-600 hover:text-green-800 underline" target="_blank" rel="noopener noreferrer">Your Online Choices</a></li>
          </ul>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <Link 
                href="/" 
                className="text-green-600 hover:text-green-800 font-medium flex items-center cursor-pointer"
              >
                <i className="ri-arrow-left-line mr-2"></i>
                Volver al inicio
              </Link>
              <p className="text-sm text-gray-500">
                Documento actualizado el {new Date().toLocaleDateString('es-ES')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
