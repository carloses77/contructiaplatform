
import Link from 'next/link';

export default function AvisoLegal() {
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
              <h1 className="text-2xl font-bold text-gray-900">Aviso Legal</h1>
              <p className="text-gray-600">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          
          <h2>1. DATOS IDENTIFICATIVOS</h2>
          <p>
            En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la 
            Sociedad de la Información y del Comercio Electrónico (LSSI-CE), se informa a los usuarios 
            de los datos identificativos de la empresa:
          </p>

          <div className="bg-gray-50 p-6 rounded-lg">
            <p><strong>Denominación social:</strong> ConstructIA</p>
            <p><strong>Domicilio social:</strong> España</p>
            <p><strong>CIF:</strong> [Número de Identificación Fiscal]</p>
            <p><strong>Teléfono:</strong> +34 XXX XXX XXX</p>
            <p><strong>Email:</strong> legal@constructia.com</p>
            <p><strong>Sitio web:</strong> https://constructia.com</p>
            <p><strong>Registro Mercantil:</strong> [Datos de inscripción]</p>
          </div>

          <h2>2. OBJETO</h2>
          <p>
            El presente Aviso Legal regula el uso del sitio web <strong>constructia.com</strong> 
            y de la plataforma de gestión documental con inteligencia artificial <strong>ConstructIA</strong>, 
            propiedad de la empresa anteriormente citada.
          </p>

          <p>
            La utilización del sitio web le otorga la condición de usuario del mismo e implica la 
            aceptación plena de todas las cláusulas de este Aviso Legal. Si no está conforme con 
            cualquiera de las cláusulas aquí establecidas, no use este sitio web.
          </p>

          <h2>3. ACTIVIDAD EMPRESARIAL</h2>
          <p>
            <strong>ConstructIA</strong> se dedica al desarrollo y prestación de servicios de:
          </p>
          <ul>
            <li>Gestión documental especializada en el sector de la construcción</li>
            <li>Procesamiento inteligente de documentos mediante inteligencia artificial</li>
            <li>Integración con plataformas del sector construcción (Obralia)</li>
            <li>Análisis predictivo y reportes automatizados</li>
            <li>Consultoría tecnológica en transformación digital</li>
            <li>Desarrollo de software personalizado para construcción</li>
            <li>Servicios de cloud computing y almacenamiento seguro</li>
          </ul>

          <h2>4. USUARIOS</h2>
          <p>
            El acceso y uso de este sitio web confiere la condición de usuario, que acepta, 
            desde dicho acceso y/o uso, las Condiciones Generales de Uso aquí reflejadas. 
            Dichas condiciones serán de aplicación independientemente de las Condiciones 
            Generales de Contratación que en su caso resulten de obligado cumplimiento.
          </p>

          <h3>4.1. Capacidad Legal</h3>
          <p>
            Para utilizar nuestros servicios, el usuario debe:
          </p>
          <ul>
            <li>Ser mayor de edad (18 años) o tener capacidad legal para contratar</li>
            <li>En caso de menores, contar con autorización parental expresa</li>
            <li>Para personas jurídicas, estar debidamente constituidas y representadas</li>
            <li>No estar inhabilitado para contratar según la legislación vigente</li>
          </ul>

          <h2>5. USO DEL SITIO WEB</h2>
          <p>
            El sitio web y sus servicios son de acceso libre y gratuito para la información general, 
            no obstante, algunos servicios específicos están condicionados a la contratación previa 
            del servicio y/o al registro como usuario.
          </p>

          <h3>5.1. Uso Permitido</h3>
          <p>El usuario se compromete a utilizar el sitio web de forma diligente, conforme a:</p>
          <ul>
            <li>La ley, la moral y las buenas costumbres</li>
            <li>El orden público</li>
            <li>Las disposiciones del presente Aviso Legal</li>
            <li>Los términos específicos de cada servicio</li>
          </ul>

          <h3>5.2. Uso Prohibido</h3>
          <p>Queda prohibido utilizar el sitio web para:</p>
          <ul>
            <li>Realizar actividades ilícitas, ilegales o contrarias a la buena fe</li>
            <li>Difundir contenidos o propaganda de carácter racista, xenófobo, pornográfico</li>
            <li>Provocar daños en los sistemas físicos y lógicos del sitio web</li>
            <li>Introducir o difundir virus informáticos o sistemas análogos</li>
            <li>Intentar acceder y utilizar cuentas de correo electrónico de otros usuarios</li>
            <li>Reproducir, copiar, distribuir, transformar o modificar los contenidos</li>
            <li>Realizar actividades publicitarias o de explotación comercial</li>
          </ul>

          <h2>6. CONTENIDOS</h2>

          <h3>6.1. Contenidos Propios</h3>
          <p>
            Todos los contenidos del sitio web, incluyendo a título enunciativo pero no limitativo, 
            textos, fotografías, gráficos, imágenes, iconos, tecnología, software, así como su 
            diseño gráfico y códigos fuente, constituyen una obra cuya propiedad pertenece a 
            ConstructIA, sin que puedan entenderse cedidos al usuario ninguno de los derechos 
            de explotación sobre los mismos más allá de lo estrictamente necesario para el 
            correcto uso del sitio web.
          </p>

          <h3>6.2. Contenidos de Terceros</h3>
          <p>
            El sitio web puede incluir contenidos de terceros. ConstructIA actúa como mero 
            transmisor de dichos contenidos, no garantizando la licitud, fiabilidad, utilidad, 
            veracidad, exactitud o actualidad de los mismos.
          </p>

          <h3>6.3. Contenidos Generados por Usuarios</h3>
          <p>
            Los usuarios pueden subir documentos y contenidos a la plataforma. El usuario garantiza que:
          </p>
          <ul>
            <li>Posee todos los derechos necesarios sobre dichos contenidos</li>
            <li>Los contenidos no infringen derechos de terceros</li>
            <li>Los contenidos son lícitos y no contienen información clasificada</li>
            <li>Acepta que dichos contenidos sean procesados por nuestros sistemas de IA</li>
          </ul>

          <h2>7. PROPIEDAD INTELECTUAL E INDUSTRIAL</h2>

          <h3>7.1. Derechos de ConstructIA</h3>
          <p>
            ConstructIA es titular de todos los derechos de propiedad intelectual e industrial 
            del sitio web, así como de los elementos contenidos en el mismo, incluyendo:
          </p>
          <ul>
            <li>Marcas, nombres comerciales o signos distintivos</li>
            <li>Contenidos, diseño gráfico, código fuente</li>
            <li>Fotografías, imágenes, textos, logotipos</li>
            <li>Software y aplicaciones</li>
            <li>Algoritmos de inteligencia artificial</li>
            <li>Bases de datos y estructuras de información</li>
          </ul>

          <h3>7.2. Licencias de Terceros</h3>
          <p>
            Reconocemos y respetamos los derechos de propiedad intelectual de terceros, 
            incluyendo las licencias de:
          </p>
          <ul>
            <li><strong>Google Gemini AI:</strong> Tecnología de inteligencia artificial</li>
            <li><strong>Obralia:</strong> Plataforma de gestión de construcción</li>
            <li><strong>Stripe:</strong> Servicios de procesamiento de pagos</li>
            <li><strong>Supabase:</strong> Servicios de base de datos</li>
            <li><strong>React/Next.js:</strong> Frameworks de desarrollo</li>
          </ul>

          <h2>8. PROTECCIÓN DE DATOS PERSONALES</h2>
          <p>
            Para información detallada sobre el tratamiento de sus datos personales, consulte nuestra 
            <Link href="/politica-privacidad" className="text-green-600 hover:text-green-800 font-medium underline">
              Política de Privacidad
            </Link>, 
            que cumple con el Reglamento General de Protección de Datos (RGPD) y la 
            Ley Orgánica de Protección de Datos y Garantía de Derechos Digitales (LOPDGDD).
          </p>

          <div className="bg-blue-50 p-6 rounded-lg">
            <h4>Datos de Contacto para Protección de Datos:</h4>
            <p><strong>DPO (Delegado de Protección de Datos):</strong> dpo@constructia.com</p>
            <p><strong>Email específico:</strong> privacidad@constructia.com</p>
          </div>

          <h2>9. POLÍTICA DE COOKIES</h2>
          <p>
            Este sitio web utiliza cookies para mejorar la experiencia del usuario. 
            Para información completa sobre nuestro uso de cookies, consulte nuestra 
            <Link href="/politica-cookies" className="text-green-600 hover:text-green-800 font-medium underline">
              Política de Cookies
            </Link>.
          </p>

          <h2>10. ENLACES A TERCEROS</h2>
          <p>
            El sitio web puede contener enlaces a otros sitios web que no operamos ni controlamos. 
            No somos responsables del contenido, políticas de privacidad o prácticas de sitios 
            web de terceros.
          </p>

          <h3>10.1. Enlaces Salientes</h3>
          <p>Los enlaces a sitios externos incluyen:</p>
          <ul>
            <li>Obralia - Plataforma de gestión de construcción</li>
            <li>Google Workspace - Servicios en la nube</li>
            <li>Documentación técnica y normativas del sector</li>
            <li>Redes sociales corporativas</li>
          </ul>

          <h3>10.2. Enlaces Entrantes</h3>
          <p>
            El establecimiento de enlaces a nuestro sitio web desde sitios externos requiere 
            autorización previa por escrito, salvo para enlaces simples que cumplan con las 
            condiciones establecidas.
          </p>

          <h2>11. EXCLUSIÓN DE GARANTÍAS Y RESPONSABILIDAD</h2>

          <h3>11.1. Disponibilidad del Servicio</h3>
          <p>
            ConstructIA no garantiza la disponibilidad y continuidad del funcionamiento 
            del sitio web, aunque empleará sus mejores esfuerzos para mantener un servicio 
            estable con un objetivo de disponibilidad del 99.9%.
          </p>

          <h3>11.2. Exactitud de la Información</h3>
          <p>
            ConstructIA no garantiza la exactitud, veracidad, vigencia o completitud de 
            la información publicada en el sitio web, especialmente cuando provenga de fuentes externas.
          </p>

          <h3>11.3. Limitaciones de Responsabilidad</h3>
          <p>ConstructIA no será responsable de:</p>
          <ul>
            <li>Interrupciones, virus o desconexiones del sistema</li>
            <li>Retrasos o bloqueos causados por deficiencias o sobrecargas en Internet</li>
            <li>Daños que puedan causarse por terceros mediante intromisiones ilegítimas</li>
            <li>Fallos en los sistemas de terceros integrados</li>
            <li>Decisiones tomadas basándose únicamente en resultados automatizados</li>
          </ul>

          <h2>12. INTELIGENCIA ARTIFICIAL</h2>
          
          <h3>12.1. Uso de IA</h3>
          <p>
            ConstructIA utiliza tecnologías de inteligencia artificial para el procesamiento 
            de documentos. El usuario reconoce y acepta que:
          </p>
          <ul>
            <li>Los resultados de IA pueden contener errores o imprecisiones</li>
            <li>Se recomienda supervisión humana para decisiones críticas</li>
            <li>Los algoritmos se mejoran continuamente</li>
            <li>Los datos no se utilizan para entrenar modelos externos</li>
          </ul>

          <h3>12.2. Transparencia Algorítmica</h3>
          <p>
            Proporcionamos información sobre el funcionamiento de nuestros algoritmos y 
            permitimos que los usuarios entiendan cómo se procesan sus documentos.
          </p>

          <h2>13. MODIFICACIONES</h2>
          <p>
            ConstructIA se reserva el derecho de efectuar sin previo aviso las modificaciones 
            que considere oportunas en su sitio web, pudiendo cambiar, suprimir o añadir tanto 
            los contenidos y servicios que se presten a través de la misma como la forma en la 
            que éstos aparezcan presentados o localizados.
          </p>

          <h2>14. NULIDAD E INEFICACIA DE LAS CLÁUSULAS</h2>
          <p>
            Si cualquier cláusula del presente Aviso Legal fuera declarada nula o ineficaz por 
            resolución firme dictada por autoridad competente, las restantes cláusulas 
            permanecerán en vigor sin que queden afectadas por dicha declaración de nulidad.
          </p>

          <h2>15. LEGISLACIÓN APLICABLE Y JURISDICCIÓN</h2>
          <p>
            Las presentes Condiciones Generales se rigen por la legislación española. 
            Para la resolución de cualquier controversia relativa a las presentes Condiciones 
            Generales se estará a lo dispuesto en la legislación sobre jurisdicción competente, 
            siendo competentes los Juzgados y Tribunales de España.
          </p>

          <h3>15.1. Resolución Alternativa de Conflictos</h3>
          <p>
            De conformidad con la legislación vigente, informamos sobre los sistemas alternativos 
            de resolución de conflictos:
          </p>
          <ul>
            <li><strong>Consumidores:</strong> Plataforma de Resolución de Litigios en Línea (ODR): http://ec.europa.eu/odr</li>
            <li><strong>Empresas:</strong> Arbitraje a través de instituciones reconocidas</li>
            <li><strong>Mediación:</strong> Instituciones de mediación especializadas</li>
          </ul>

          <h2>16. INFORMACIÓN ADICIONAL LSSI-CE</h2>

          <h3>16.1. Servicios de la Sociedad de la Información</h3>
          <p>
            Los servicios prestados por ConstructIA constituyen servicios de la sociedad 
            de la información según se define en la LSSI-CE.
          </p>

          <h3>16.2. Comunicaciones Comerciales</h3>
          <p>
            Las comunicaciones comerciales realizadas a través del sitio web se identificarán 
            claramente como tales y se ajustarán a lo previsto en la LSSI-CE y normativa de desarrollo.
          </p>

          <h3>16.3. Códigos de Conducta</h3>
          <p>
            ConstructIA se adhiere a códigos de conducta del sector tecnológico y de protección 
            de datos cuando están disponibles y son aplicables.
          </p>

          <h2>17. INFORMACIÓN SECTORIAL</h2>

          <h3>17.1. Sector de la Construcción</h3>
          <p>
            Como empresa especializada en tecnología para la construcción, cumplimos con:
          </p>
          <ul>
            <li>Normativas técnicas del sector construcción</li>
            <li>Estándares de intercambio de información (BIM)</li>
            <li>Regulaciones de seguridad y salud laboral</li>
            <li>Normativas medioambientales aplicables</li>
          </ul>

          <h3>17.2. Certificaciones</h3>
          <p>
            ConstructIA mantiene las siguientes certificaciones:
          </p>
          <ul>
            <li>ISO 27001 - Gestión de Seguridad de la Información</li>
            <li>ISO 9001 - Gestión de Calidad</li>
            <li>GDPR Compliance Certificate</li>
            <li>SOC 2 Type II - Controles de Seguridad</li>
          </ul>

          <h2>18. CONTACTO</h2>
          <p>
            Para cualquier consulta relacionada con este Aviso Legal, puede contactarnos a través de:
          </p>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p><strong>Dirección postal:</strong> España</p>
            <p><strong>Teléfono:</strong> +34 XXX XXX XXX</p>
            <p><strong>Email general:</strong> info@constructia.com</p>
            <p><strong>Email legal:</strong> legal@constructia.com</p>
            <p><strong>Horario de atención:</strong> Lunes a Viernes de 9:00 a 18:00 CET</p>
          </div>

          <h2>19. VIGENCIA</h2>
          <p>
            El presente Aviso Legal estará vigente hasta que sea modificado por otro 
            debidamente publicado. Su duración coincidirá, por tanto, con el período 
            de tiempo durante el cual se encuentre publicado y accesible a los usuarios.
          </p>

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
