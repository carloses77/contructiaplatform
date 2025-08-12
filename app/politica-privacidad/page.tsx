
import Link from 'next/link';

export default function PoliticaPrivacidad() {
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
              <h1 className="text-2xl font-bold text-gray-900">Política de Privacidad</h1>
              <p className="text-gray-600">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          
          <h2>1. INFORMACIÓN AL USUARIO</h2>
          <p>
            <strong>ConstructIA</strong> (en adelante, la "Empresa"), con domicilio en España, 
            en cumplimiento de lo dispuesto en el Reglamento General de Protección de Datos (RGPD) 
            2016/679 del Parlamento Europeo y del Consejo, de 27 de abril de 2016, y la Ley Orgánica 
            3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos 
            digitales (LOPDGDD), informa a los usuarios del sitio web constructia.com (en adelante, 
            el "Sitio Web") acerca del tratamiento de los datos personales que voluntariamente hayan 
            facilitado durante el proceso de registro, compra o en cualquiera de los formularios 
            habilitados en el Sitio Web.
          </p>

          <h2>2. RESPONSABLE DEL TRATAMIENTO</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p><strong>Razón Social:</strong> ConstructIA</p>
            <p><strong>Dirección:</strong> España</p>
            <p><strong>Email de contacto:</strong> privacidad@constructia.com</p>
            <p><strong>Teléfono:</strong> +34 XXX XXX XXX</p>
          </div>

          <h2>3. DELEGADO DE PROTECCIÓN DE DATOS (DPO)</h2>
          <p>
            La Empresa ha designado un Delegado de Protección de Datos (DPO) que puede ser contactado 
            a través de la dirección de correo electrónico: <strong>dpo@constructia.com</strong>
          </p>

          <h2>4. PRINCIPIOS APLICABLES AL TRATAMIENTO DE DATOS PERSONALES</h2>
          <p>El tratamiento de los datos personales de los usuarios se someterá a los siguientes principios recogidos en el artículo 5 del RGPD:</p>
          <ul>
            <li><strong>Principio de licitud, lealtad y transparencia:</strong> Se requerirá en todo momento el consentimiento del usuario previa información completamente transparente de los fines para los cuales se recogen los datos personales.</li>
            <li><strong>Principio de limitación de la finalidad:</strong> Los datos personales serán recogidos con fines determinados, explícitos y legítimos.</li>
            <li><strong>Principio de minimización de datos:</strong> Los datos personales serán adecuados, pertinentes y limitados a lo necesario en relación con los fines para los que son tratados.</li>
            <li><strong>Principio de exactitud:</strong> Los datos personales serán exactos y, si fuera necesario, actualizados.</li>
            <li><strong>Principio de limitación del plazo de conservación:</strong> Los datos personales serán mantenidos de forma que se permita la identificación de los interesados durante no más tiempo del necesario para los fines del tratamiento.</li>
            <li><strong>Principio de integridad y confidencialidad:</strong> Los datos personales serán tratados de tal manera que se garantice una seguridad adecuada de los datos personales.</li>
            <li><strong>Principio de responsabilidad proactiva:</strong> El responsable del tratamiento será responsable del cumplimiento de los principios anteriores y capaz de demostrarlo.</li>
          </ul>

          <h2>5. CATEGORÍAS DE DATOS PERSONALES</h2>
          <p>Las categorías de datos que se tratan en ConstructIA son únicamente datos identificativos:</p>
          <ul>
            <li>Datos de identificación: nombre, apellidos, DNI/NIE</li>
            <li>Datos de contacto: dirección postal, teléfono, email</li>
            <li>Datos comerciales: historial de pedidos, preferencias de compra</li>
            <li>Datos económicos y de transacciones: datos bancarios, historial de pagos</li>
            <li>Datos de conexión, geolocalización y navegación</li>
            <li>Datos profesionales: empresa, cargo, sector de actividad</li>
            <li>Datos sobre documentos: metadatos de archivos, logs de procesamiento</li>
          </ul>

          <p><strong>No se tratan categorías especiales de datos personales</strong> (aquellos que revelen el origen étnico o racial, las opiniones políticas, las convicciones religiosas o filosóficas, la afiliación sindical, datos genéticos, datos biométricos, datos relativos a la salud o datos relativos a la vida sexual o las orientaciones sexuales de una persona física).</p>

          <h2>6. BASE LEGAL PARA EL TRATAMIENTO DE DATOS PERSONALES</h2>
          <p>La base legal para el tratamiento de los datos personales es:</p>
          <ul>
            <li><strong>El consentimiento del interesado</strong> (artículo 6.1.a RGPD)</li>
            <li><strong>La ejecución de un contrato</strong> en el que el interesado es parte (artículo 6.1.b RGPD)</li>
            <li><strong>El cumplimiento de una obligación legal</strong> aplicable al responsable del tratamiento (artículo 6.1.c RGPD)</li>
            <li><strong>Los intereses legítimos</strong> del responsable del tratamiento (artículo 6.1.f RGPD)</li>
          </ul>

          <h2>7. FINES DEL TRATAMIENTO A QUE SE DESTINAN LOS DATOS PERSONALES</h2>
          <p>Los datos personales son recabados y gestionados por ConstructIA con las siguientes finalidades:</p>
          <ul>
            <li>Prestación de servicios de gestión documental con inteligencia artificial</li>
            <li>Gestión de la relación comercial y contractual</li>
            <li>Facturación y gestión contable</li>
            <li>Atención al cliente y soporte técnico</li>
            <li>Cumplimiento de obligaciones legales</li>
            <li>Mejora de nuestros servicios mediante análisis estadísticos</li>
            <li>Envío de comunicaciones comerciales (previa autorización)</li>
            <li>Procesamiento y análisis de documentos mediante IA (Gemini AI)</li>
            <li>Integración con plataformas externas (Obralia, Stripe)</li>
            <li>Gestión de pagos y domiciliaciones SEPA</li>
          </ul>

          <h2>8. PERÍODOS DE CONSERVACIÓN DE LOS DATOS PERSONALES</h2>
          <p>Los datos personales proporcionados se conservarán:</p>
          <ul>
            <li><strong>Datos comerciales:</strong> Durante la vigencia de la relación comercial y hasta 6 años después de la finalización de la misma (Código de Comercio)</li>
            <li><strong>Datos fiscales:</strong> 4 años (Ley General Tributaria)</li>
            <li><strong>Datos de facturación:</strong> 6 años (Código de Comercio)</li>
            <li><strong>Datos de marketing:</strong> Hasta que el usuario revoque su consentimiento</li>
            <li><strong>Logs de auditoría:</strong> 6 años para cumplimiento de obligaciones legales</li>
            <li><strong>Datos de documentos procesados:</strong> Según el período establecido contractualmente</li>
          </ul>

          <h2>9. DESTINATARIOS DE LOS DATOS PERSONALES</h2>
          <p>Los datos personales pueden ser comunicados a:</p>
          <ul>
            <li><strong>Obralia:</strong> Para la gestión y sincronización de documentos de construcción</li>
            <li><strong>Google (Gemini AI):</strong> Para el procesamiento inteligente de documentos</li>
            <li><strong>Stripe:</strong> Para el procesamiento de pagos</li>
            <li><strong>Entidades bancarias:</strong> Para la gestión de domiciliaciones SEPA</li>
            <li><strong>Proveedores de servicios tecnológicos:</strong> Hosting, mantenimiento</li>
            <li><strong>Administraciones públicas:</strong> Cuando sea legalmente exigible</li>
            <li><strong>Asesores legales y auditores:</strong> Para el cumplimiento de obligaciones</li>
          </ul>

          <h2>10. TRANSFERENCIAS INTERNACIONALES DE DATOS</h2>
          <p>
            Algunos de nuestros proveedores de servicios pueden estar ubicados fuera del Espacio Económico Europeo (EEE). 
            En estos casos, nos aseguraremos de que las transferencias se realicen con las garantías adecuadas:
          </p>
          <ul>
            <li>Decisiones de adecuación de la Comisión Europea</li>
            <li>Cláusulas contractuales tipo aprobadas por la Comisión Europea</li>
            <li>Certificaciones y códigos de conducta aprobados</li>
          </ul>

          <h2>11. DERECHOS DE LOS USUARIOS</h2>
          <p>Los usuarios tienen los siguientes derechos sobre sus datos personales:</p>

          <h3>11.1. Derecho de acceso</h3>
          <p>El usuario tiene derecho a obtener confirmación sobre si estamos tratando datos personales que le conciernen y, en tal caso, obtener información sobre sus datos personales concretos.</p>

          <h3>11.2. Derecho de rectificación</h3>
          <p>El usuario tiene derecho a que se corrijan los datos inexactos que le conciernan.</p>

          <h3>11.3. Derecho de supresión</h3>
          <p>El usuario tiene derecho a que se supriman sus datos personales, sin dilación indebida.</p>

          <h3>11.4. Derecho a la limitación del tratamiento</h3>
          <p>El usuario tiene derecho a que se limite el tratamiento de sus datos personales.</p>

          <h3>11.5. Derecho a la portabilidad de los datos</h3>
          <p>El usuario tiene derecho a recibir los datos personales que haya proporcionado en un formato estructurado, de uso común y lectura mecánica.</p>

          <h3>11.6. Derecho de oposición</h3>
          <p>El usuario tiene derecho a oponerse en cualquier momento al tratamiento de datos personales.</p>

          <h3>11.7. Derecho a no ser objeto de decisiones automatizadas</h3>
          <p>El usuario tiene derecho a no ser objeto de una decisión basada únicamente en el tratamiento automatizado.</p>

          <h2>12. EJERCICIO DE DERECHOS</h2>
          <p>Para ejercitar sus derechos, el usuario deberá dirigirse por escrito a:</p>
          <div className="bg-blue-50 p-6 rounded-lg">
            <p><strong>Email:</strong> derechos@constructia.com</p>
            <p><strong>Asunto:</strong> "Ejercicio de Derechos RGPD"</p>
            <p><strong>Documentación requerida:</strong> Copia del DNI o documento identificativo</p>
          </div>

          <h2>13. RECLAMACIONES ANTE LA AUTORIDAD DE CONTROL</h2>
          <p>
            Si considera que existe un problema o infracción de la normativa vigente en la forma en la que 
            se están tratando sus datos personales, tiene derecho a la tutela judicial efectiva y a presentar 
            una reclamación ante una autoridad de supervisión, en particular, ante la Agencia Española de 
            Protección de Datos (AEPD):
          </p>
          <div className="bg-red-50 p-6 rounded-lg">
            <p><strong>Agencia Española de Protección de Datos</strong></p>
            <p>C/ Jorge Juan, 6 – 28001 Madrid</p>
            <p>Teléfono: 901 100 099 – 912 663 517</p>
            <p>https://www.aepd.es</p>
          </div>

          <h2>14. MEDIDAS DE SEGURIDAD</h2>
          <p>ConstructIA ha adoptado las medidas técnicas y organizativas necesarias para garantizar la seguridad de los datos personales y evitar su alteración, pérdida, tratamiento o acceso no autorizado:</p>
          <ul>
            <li>Cifrado AES-256 para datos en tránsito y reposo</li>
            <li>Autenticación de dos factores obligatoria</li>
            <li>Logs de auditoría inviolables</li>
            <li>Copias de seguridad cifradas</li>
            <li>Control de acceso basado en roles</li>
            <li>Monitorización continua de seguridad</li>
            <li>Formación continua del personal</li>
            <li>Evaluaciones de impacto en la protección de datos</li>
          </ul>

          <h2>15. INTELIGENCIA ARTIFICIAL Y PROCESAMIENTO DE DOCUMENTOS</h2>
          <p>
            ConstructIA utiliza tecnología de inteligencia artificial (Google Gemini AI) para el procesamiento 
            y análisis de documentos. Este procesamiento se realiza con las siguientes garantías:
          </p>
          <ul>
            <li>Los documentos se procesan únicamente para los fines contractuales establecidos</li>
            <li>No se utiliza la información para entrenar modelos de IA</li>
            <li>Se mantiene la confidencialidad y segregación de datos por cliente</li>
            <li>Los metadatos generados se tratan con las mismas garantías que los datos originales</li>
            <li>Se aplican controles de calidad y supervisión humana</li>
          </ul>

          <h2>16. COOKIES Y TECNOLOGÍAS SIMILARES</h2>
          <p>
            Para información detallada sobre el uso de cookies, consulte nuestra 
            <Link href="/politica-cookies" className="text-green-600 hover:text-green-800 font-medium underline">
              Política de Cookies
            </Link>.
          </p>

          <h2>17. MODIFICACIONES</h2>
          <p>
            ConstructIA se reserva el derecho a modificar la presente Política de Privacidad para adaptarla 
            a novedades legislativas o jurisprudenciales, así como a prácticas de la industria. Dichas 
            políticas estarán vigentes hasta que sean modificadas por otras debidamente publicadas.
          </p>

          <h2>18. CONTACTO</h2>
          <p>Para cualquier consulta sobre esta Política de Privacidad, puede contactarnos en:</p>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p><strong>Email general:</strong> info@constructia.com</p>
            <p><strong>Email privacidad:</strong> privacidad@constructia.com</p>
            <p><strong>DPO:</strong> dpo@constructia.com</p>
            <p><strong>Teléfono:</strong> +34 XXX XXX XXX</p>
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
