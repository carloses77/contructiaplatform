'use client';

import { useState } from 'react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "¿Cómo funciona la IA en el análisis de documentos de construcción?",
      answer: "Nuestra IA está específicamente entrenada con millones de documentos de construcción. Puede identificar automáticamente tipos de documentos (planos, contratos, memorias técnicas), extraer información clave, detectar inconsistencias y clasificar según normativas del sector."
    },
    {
      question: "¿Es seguro subir documentos confidenciales del proyecto?",
      answer: "Absolutamente. Contamos con certificación ISO 27001 y SOC 2 Type II. Todos los documentos se encriptan con AES-256, tanto en tránsito como en reposo. Además, cumplimos con RGPD y tenemos servidores en la UE para garantizar la privacidad de datos."
    },
    {
      question: "¿Cuánto tiempo toma migrar nuestros documentos existentes?",
      answer: "La migración depende del volumen de documentos. Para la mayoría de empresas (1,000-10,000 documentos), el proceso toma entre 1-2 semanas. Nuestro equipo se encarga de todo el proceso y verifica que la migración sea perfecta."
    },
    {
      question: "¿Puedo integrar ConstructIA con nuestro software actual?",
      answer: "Sí, tenemos integraciones nativas con los principales software de construcción como Autodesk, Trimble, Bentley y muchos más. También ofrecemos API REST para integraciones personalizadas con cualquier sistema interno."
    },
    {
      question: "¿Qué sucede si mi equipo no está familiarizado con IA?",
      answer: "No te preocupes. ConstructIA está diseñado para ser intuitivo. Incluimos formación personalizada para tu equipo, documentación completa y soporte técnico en español. La mayoría de usuarios dominan la plataforma en pocos días."
    },
    {
      question: "¿Puedo cambiar de plan en cualquier momento?",
      answer: "Por supuesto. Puedes actualizar o degradar tu plan en cualquier momento. Los cambios se reflejan inmediatamente y solo pagas la diferencia prorrateada. No hay penalizaciones por cambios de plan."
    },
    {
      question: "¿La IA funciona con documentos en diferentes idiomas?",
      answer: "Sí, nuestra IA maneja documentos en español, inglés, francés, alemán, italiano y portugués. Es especialmente potente con documentación técnica en español y cumple con normativas españolas y europeas de construcción."
    },
    {
      question: "¿Qué tipo de soporte técnico ofrecen?",
      answer: "Ofrecemos soporte multicanal: chat en vivo, email, teléfono y videollamadas. Los planes superiores incluyen gestor de cuenta dedicado. Nuestro equipo de soporte está formado por ingenieros que entienden el sector de la construcción."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Resolvemos las dudas más comunes sobre ConstructIA y la gestión documental con IA
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-2xl overflow-hidden">
              <button
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-inset"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                  <i className={`ri-${openIndex === index ? 'subtract' : 'add'}-line text-xl text-green-600 transition-transform`}></i>
                </div>
              </button>
              
              {openIndex === index && (
                <div className="px-8 pb-6 bg-gray-50">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-green-50 rounded-2xl p-8">
            <i className="ri-question-answer-line text-4xl text-green-600 mb-4"></i>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">¿Tienes más preguntas?</h3>
            <p className="text-gray-600 mb-6">
              Nuestro equipo de expertos está aquí para ayudarte con cualquier duda específica
            </p>
            <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors whitespace-nowrap cursor-pointer">
              Contactar Soporte
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}