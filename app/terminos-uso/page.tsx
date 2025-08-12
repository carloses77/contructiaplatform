
'use client';

import Link from 'next/link';

export default function TerminosUso() {
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
              <h1 className="text-2xl font-bold text-gray-900">Términos y Condiciones de Uso</h1>
              <p className="text-gray-600">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          
          <h2>1. INFORMACIÓN GENERAL</h2>
          <p>
            Los presentes Términos y Condiciones de Uso (en adelante, "Términos") regulan el acceso y uso 
            del sitio web <strong>constructia.com</strong> y de la plataforma de gestión documental con 
            inteligencia artificial <strong>ConstructIA</strong> (en adelante, la "Plataforma"), 
            propiedad de ConstructIA (en adelante, la "Empresa").
          </p>

          <div className="bg-blue-50 p-6 rounded-lg">
            <h3>Datos de la Empresa</h3>
            <p><strong>Razón Social:</strong> ConstructIA</p>
            <p><strong>Domicilio:</strong> España</p>
            <p><strong>Email:</strong> legal@constructia.com</p>
            <p><strong>Teléfono:</strong> +34 XXX XXX XXX</p>
          </div>

          <h2>2. OBJETO Y ÁMBITO DE APLICACIÓN</h2>
          <p>
            Los presentes Términos tienen por objeto regular el acceso y uso de la Plataforma ConstructIA, 
            que ofrece servicios de gestión documental especializada en el sector de la construcción mediante 
            tecnología de inteligencia artificial.
          </p>

          <p>
            La utilización de la Plataforma atribuye la condición de usuario (en adelante, "Usuario") 
            e implica la aceptación plena de todos los términos incluidos en este documento, sin reservas ni salvedades.
          </p>

          <h2>3. DESCRIPCIÓN DE SERVICIOS</h2>
          <p>ConstructIA proporciona los siguientes servicios:</p>
          <ul>
            <li><strong>Gestión Documental Inteligente:</strong> Procesamiento, clasificación y análisis de documentos técnicos</li>
            <li><strong>Integración con Obralia:</strong> Sincronización automática de documentos con la plataforma Obralia</li>
            <li><strong>Análisis con IA:</strong> Procesamiento de documentos utilizando Google Gemini AI</li>
            <li><strong>Análisis Predictivo:</strong> Identificación de patrones y predicciones basadas en datos históricos</li>
            <li><strong>Búsqueda Semántica:</strong> Búsqueda avanzada de contenido en documentos</li>
            <li><strong>Reportes y Análisis:</strong> Generación de informes automatizados</li>
            <li><strong>Gestión de Proyectos:</strong> Organización y seguimiento de proyectos de construcción</li>
            <li><strong>API y Integraciones:</strong> Conexión con sistemas externos</li>
          </ul>

          <h2>4. CONDICIONES DE ACCESO Y USO</h2>

          <h3>4.1. Registro de Usuario</h3>
          <p>Para acceder a los servicios de la Plataforma, el Usuario deberá:</p>
          <ul>
            <li>Ser mayor de edad o tener capacidad legal para contratar</li>
            <li>Registrarse proporcionando información veraz, exacta y actualizada</li>
            <li>Mantener la confidencialidad de sus credenciales de acceso</li>
            <li>Aceptar estos Términos y la Política de Privacidad</li>
          </ul>

          <h3>4.2. Obligaciones del Usuario</h3>
          <p>El Usuario se compromete a:</p>
          <ul>
            <li>Utilizar la Plataforma de forma lícita y conforme a estos Términos</li>
            <li>No interferir con el funcionamiento de la Plataforma</li>
            <li>No intentar acceder a áreas restringidas o datos de otros usuarios</li>
            <li>Mantener actualizada su información de contacto</li>
            <li>Cumplir con la normativa aplicable en materia de protección de datos</li>
            <li>No realizar actividades que puedan dañar la reputación de la Empresa</li>
            <li>Usar la Plataforma únicamente para fines profesionales relacionados con la construcción</li>
          </ul>

          <h3>4.3. Prohibiciones</h3>
          <p>Queda expresamente prohibido:</p>
          <ul>
            <li>Utilizar la Plataforma para fines ilegales o no autorizados</li>
            <li>Subir contenido que infrinja derechos de terceros</li>
            <li>Intentar obtener acceso no autorizado a otros sistemas</li>
            <li>Realizar ingeniería inversa del software</li>
            <li>Distribuir malware o código malicioso</li>
            <li>Sobrecargar los servidores con solicitudes excesivas</li>
            <li>Utilizar la Plataforma para spam o comunicaciones no solicitadas</li>
            <li>Revender o sublicenciar el acceso a la Plataforma sin autorización</li>
          </ul>

          <h2>5. PLANES DE SUSCRIPCIÓN Y FACTURACIÓN</h2>

          <h3>5.1. Modalidades de Servicio</h3>
          <p>ConstructIA ofrece diferentes planes de suscripción:</p>
          <ul>
            <li><strong>Plan Básico:</strong> Funcionalidades esenciales con límites de uso</li>
            <li><strong>Plan Professional:</strong> Funcionalidades avanzadas y mayor capacidad</li>
            <li><strong>Plan Premium:</strong> Acceso completo con soporte prioritario</li>
            <li><strong>Plan Enterprise:</strong> Soluciones personalizadas para grandes organizaciones</li>
          </ul>

          <h3>5.2. Precios y Facturación</h3>
          <p>
            Los precios de los servicios están disponibles en la Plataforma y pueden modificarse 
            con notificación previa de 30 días. La facturación se realizará según la modalidad 
            contratada (mensual, trimestral o anual).
          </p>

          <h3>5.3. Tokens y Consumo</h3>
          <p>
            Algunos servicios se facturan mediante un sistema de tokens que se consumen según el uso:
          </p>
          <ul>
            <li>Procesamiento de documentos con IA</li>
            <li>Análisis predictivos avanzados</li>
            <li>Búsquedas semánticas complejas</li>
            <li>Generación de reportes personalizados</li>
          </ul>

          <h2>6. MÉTODOS DE PAGO</h2>
          <p>Los pagos se pueden realizar a través de:</p>
          <ul>
            <li><strong>Tarjeta de crédito/débito:</strong> Visa, Mastercard, American Express</li>
            <li><strong>SEPA Débito Directo:</strong> Domiciliación bancaria en zona SEPA</li>
            <li><strong>Bizum:</strong> Pagos instantáneos</li>
            <li><strong>Transferencia bancaria:</strong> Para pagos anuales o empresariales</li>
            <li><strong>PayPal:</strong> Pagos seguros online</li>
          </ul>

          <h2>7. POLÍTICA DE CANCELACIÓN Y REEMBOLSOS</h2>

          <h3>7.1. Cancelación del Servicio</h3>
          <p>
            El Usuario puede cancelar su suscripción en cualquier momento desde su panel de control. 
            La cancelación será efectiva al final del período de facturación actual.
          </p>

          <h3>7.2. Reembolsos</h3>
          <p>
            Los reembolsos se regirán por las siguientes condiciones:
          </p>
          <ul>
            <li><strong>Período de prueba:</strong> 14 días sin coste desde el registro inicial</li>
            <li><strong>Reembolso proporcional:</strong> En caso de cancelación por causa justificada</li>
            <li><strong>Problemas técnicos:</strong> Reembolso completo si el servicio no funciona correctamente</li>
            <li><strong>Tokens no utilizados:</strong> No son reembolsables pero se mantienen hasta el final del período</li>
          </ul>

          <h2>8. PROPIEDAD INTELECTUAL</h2>

          <h3>8.1. Derechos de la Empresa</h3>
          <p>
            Todos los derechos de propiedad intelectual sobre la Plataforma, incluyendo pero no limitado a:
          </p>
          <ul>
            <li>Software y código fuente</li>
            <li>Diseño y interfaz de usuario</li>
            <li>Logotipos y marcas comerciales</li>
            <li>Algoritmos de inteligencia artificial</li>
            <li>Documentación y manuales</li>
            <li>Bases de datos y estructuras de información</li>
          </ul>
          <p>Son propiedad exclusiva de ConstructIA o de sus licenciantes.</p>

          <h3>8.2. Derechos del Usuario sobre sus Documentos</h3>
          <p>
            El Usuario conserva todos los derechos sobre los documentos y contenidos que suba a la Plataforma. 
            ConstructIA no adquiere ningún derecho de propiedad sobre dichos contenidos, limitándose a 
            procesarlos según las instrucciones del Usuario.
          </p>

          <h3>8.3. Licencia de Uso</h3>
          <p>
            ConstructIA otorga al Usuario una licencia limitada, no exclusiva, no transferible y revocable 
            para utilizar la Plataforma conforme a estos Términos.
          </p>

          <h2>9. PROTECCIÓN DE DATOS Y PRIVACIDAD</h2>
          <p>
            El tratamiento de datos personales se rige por nuestra 
            <Link href="/politica-privacidad" className="text-green-600 hover:text-green-800 font-medium underline">
              Política de Privacidad
            </Link>, 
            que cumple con el RGPD y la LOPDGDD. Destacamos especialmente:
          </p>
          <ul>
            <li>Cifrado end-to-end de todos los documentos</li>
            <li>Segregación completa de datos por cliente</li>
            <li>Logs de auditoría inviolables</li>
            <li>Cumplimiento estricto de normativas de construcción</li>
            <li>Derecho al olvido y portabilidad de datos</li>
          </ul>

          <h2>10. INTELIGENCIA ARTIFICIAL Y PROCESAMIENTO</h2>

          <h3>10.1. Tecnología Utilizada</h3>
          <p>
            ConstructIA utiliza Google Gemini AI para el procesamiento inteligente de documentos. 
            Este procesamiento se realiza con las siguientes garantías:
          </p>
          <ul>
            <li>No se utiliza el contenido para entrenar modelos de IA</li>
            <li>Procesamiento local cuando sea técnicamente posible</li>
            <li>Supervisión humana de resultados críticos</li>
            <li>Transparencia en los algoritmos utilizados</li>
          </ul>

          <h3>10.2. Limitaciones de la IA</h3>
          <p>
            El Usuario reconoce que la inteligencia artificial puede tener limitaciones y se compromete a:
          </p>
          <ul>
            <li>Revisar y validar los resultados generados por IA</li>
            <li>No basar decisiones críticas únicamente en análisis automatizados</li>
            <li>Reportar errores o inconsistencias detectadas</li>
          </ul>

          <h2>11. DISPONIBILIDAD Y SOPORTE TÉCNICO</h2>

          <h3>11.1. Nivel de Servicio</h3>
          <p>ConstructIA se compromete a mantener:</p>
          <ul>
            <li><strong>Disponibilidad:</strong> 99.9% mensual (excluyendo mantenimientos programados)</li>
            <li><strong>Tiempo de mantenimiento:</strong> Máximo 4 horas mensuales, notificadas con 48h de antelación</li>
            <li><strong>Tiempo de respuesta:</strong> API &lt; 2 segundos en el 95% de las consultas</li>
            <li><strong>Copias de seguridad:</strong> Diarias, con retención de 30 días</li>
          </ul>

          <h3>11.2. Soporte al Cliente</h3>
          <p>El soporte técnico se proporciona según el plan contratado:</p>
          <ul>
            <li><strong>Plan Básico:</strong> Email soporte, 48-72h respuesta</li>
            <li><strong>Plan Professional:</strong> Email y chat, 24-48h respuesta</li>
            <li><strong>Plan Premium:</strong> Email, chat y teléfono, 12-24h respuesta</li>
            <li><strong>Plan Enterprise:</strong> Soporte dedicado, 4-8h respuesta crítica</li>
          </ul>

          <h2>12. LIMITACIÓN DE RESPONSABILIDAD</h2>

          <h3>12.1. Exclusiones</h3>
          <p>ConstructIA no será responsable de:</p>
          <ul>
            <li>Daños indirectos, consecuenciales o lucro cesante</li>
            <li>Pérdida de datos debida a acciones del Usuario</li>
            <li>Interrupciones causadas por terceros o fuerza mayor</li>
            <li>Uso inadecuado de la Plataforma por parte del Usuario</li>
            <li>Decisiones tomadas basándose únicamente en análisis automatizados</li>
            <li>Incompatibilidades con software de terceros</li>
          </ul>

          <h3>12.2. Límite de Responsabilidad</h3>
          <p>
            La responsabilidad máxima de ConstructIA se limitará al importe pagado por el Usuario 
            en los 12 meses anteriores al incidente.
          </p>

          <h2>13. FUERZA MAYOR</h2>
          <p>
            ConstructIA no será responsable del incumplimiento de sus obligaciones cuando este se deba 
            a causas de fuerza mayor, incluyendo pero no limitado a:
          </p>
          <ul>
            <li>Desastres naturales</li>
            <li>Conflictos armados o disturbios civiles</li>
            <li>Fallos en infraestructuras de telecomunicaciones</li>
            <li>Ataques cibernéticos masivos</li>
            <li>Cambios regulatorios que impidan la prestación del servicio</li>
          </ul>

          <h2>14. MODIFICACIONES</h2>
          <p>
            ConstructIA se reserva el derecho de modificar estos Términos en cualquier momento. 
            Las modificaciones se notificarán con al menos 30 días de antelación y entrarán en vigor 
            transcurrido dicho plazo. El uso continuado de la Plataforma constituirá aceptación de los nuevos términos.
          </p>

          <h2>15. TERMINACIÓN</h2>

          <h3>15.1. Terminación por el Usuario</h3>
          <p>
            El Usuario puede terminar su relación contractual en cualquier momento, notificándolo 
            con 30 días de antelación.
          </p>

          <h3>15.2. Terminación por la Empresa</h3>
          <p>ConstructIA puede terminar el servicio en los siguientes casos:</p>
          <ul>
            <li>Incumplimiento grave de estos Términos</li>
            <li>Falta de pago después de 30 días desde el vencimiento</li>
            <li>Uso fraudulento o malintencionado de la Plataforma</li>
            <li>Violación de normativas legales aplicables</li>
          </ul>

          <h3>15.3. Efectos de la Terminación</h3>
          <p>Tras la terminación:</p>
          <ul>
            <li>El Usuario tendrá 90 días para descargar sus datos</li>
            <li>Se eliminarán todos los datos del Usuario tras ese período</li>
            <li>Se mantendrán los datos necesarios para cumplimiento legal</li>
            <li>Cesarán todas las obligaciones de ambas partes</li>
          </ul>

          <h2>16. LEGISLACIÓN APLICABLE Y JURISDICCIÓN</h2>
          <p>
            Los presentes Términos se rigen por la legislación española. Para la resolución de cualquier 
            controversia, las partes se someten a la jurisdicción de los Juzgados y Tribunales de España, 
            renunciando expresamente a cualquier otro fuero que pudiera corresponderles.
          </p>

          <h2>17. RESOLUCIÓN DE DISPUTAS</h2>

          <h3>17.1. Mediación</h3>
          <p>
            Antes de acudir a los tribunales, las partes intentarán resolver sus diferencias mediante 
            mediación a través de una institución de mediación reconocida.
          </p>

          <h3>17.2. Arbitraje</h3>
          <p>
            Para contratos Enterprise, las disputas se resolverán mediante arbitraje de la Corte de 
            Arbitraje de Madrid, según su reglamento vigente.
          </p>

          <h2>18. DISPOSICIONES GENERALES</h2>

          <h3>18.1. Independencia de las Cláusulas</h3>
          <p>
            Si cualquier disposición de estos Términos es declarada inválida, el resto permanecerá en vigor.
          </p>

          <h3>18.2. Cesión</h3>
          <p>
            El Usuario no puede ceder sus derechos y obligaciones sin consentimiento escrito de ConstructIA.
          </p>

          <h3>18.3. Notificaciones</h3>
          <p>
            Las notificaciones se realizarán por email a la dirección registrada del Usuario.
          </p>

          <h2>19. CONTACTO</h2>
          <p>Para cualquier consulta sobre estos Términos:</p>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p><strong>Email legal:</strong> legal@constructia.com</p>
            <p><strong>Email soporte:</strong> soporte@constructia.com</p>
            <p><strong>Teléfono:</strong> +34 XXX XXX XXX</p>
            <p><strong>Horario:</strong> Lunes a Viernes, 9:00-18:00 CET</p>
          </div>

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
