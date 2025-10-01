"use client";
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Jak działa Wizerunkowo?",
      answer: "Wizerunkowo używa zaawansowanej technologii AI do przekształcania zwykłych zdjęć w profesjonalne portrety biznesowe. Wystarczy przesłać swoje zdjęcie, wybrać styl, a nasza AI w ciągu kilku minut wygeneruje wysokiej jakości zdjęcie biznesowe."
    },
    {
      question: "Jakie formaty zdjęć akceptujecie?",
      answer: "Akceptujemy zdjęcia w formatach JPG, PNG i WebP. Zalecamy rozdzielczość minimum 512x512 pikseli dla najlepszych rezultatów. Zdjęcia mogą być w kolorze lub czarno-białe."
    },
    {
      question: "Ile czasu trwa generowanie zdjęcia?",
      answer: "Generowanie zdjęcia trwa zazwyczaj 2-5 minut, w zależności od wybranego stylu i obciążenia serwerów. Otrzymasz powiadomienie email gdy zdjęcie będzie gotowe."
    },
    {
      question: "Czy moje zdjęcia są bezpieczne?",
      answer: "Tak, bezpieczeństwo Twoich danych jest naszym priorytetem. Wszystkie zdjęcia są szyfrowane i przechowywane bezpiecznie. Nie udostępniamy ich osobom trzecim i możesz je usunąć w dowolnym momencie."
    },
    {
      question: "Jakie style zdjęć oferujecie?",
      answer: "Oferujemy różnorodne style: LinkedIn Professional, Corporate Executive, Creative Business, Startup Casual, oraz wiele innych. Każdy styl jest dostosowany do różnych branż i celów zawodowych."
    },
    {
      question: "Czy mogę edytować zdjęcia po wygenerowaniu?",
      answer: "Tak, wygenerowane zdjęcia możesz pobrać w wysokiej rozdzielczości i edytować w dowolnym programie graficznym. Dostarczamy zdjęcia w formatach odpowiednich do druku i mediów cyfrowych."
    },
    {
      question: "Jakie są opcje płatności?",
      answer: "Akceptujemy karty płatnicze (Visa, Mastercard), PayPal oraz przelewy bankowe. Wszystkie płatności są przetwarzane bezpiecznie przez naszych partnerów płatniczych."
    },
    {
      question: "Czy oferujecie gwarancję zwrotu?",
      answer: "Tak, oferujemy 30-dniową gwarancję satysfakcji. Jeśli nie jesteś zadowolony z jakości wygenerowanych zdjęć, zwrócimy Ci pieniądze bez pytania."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Najczęściej zadawane
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
              pytania
            </span>
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Znajdź odpowiedzi na najważniejsze pytania dotyczące naszej platformy
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-white/90 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-white/50 transition-colors"
                >
                  <span className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                
                {openIndex === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Masz więcej pytań?
            </h3>
            <p className="text-gray-600 mb-6">
              Nasz zespół wsparcia jest gotowy pomóc Ci w każdej chwili
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:kontakt@wizerunkowo.pl"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-medium rounded-lg hover:scale-105 transition-transform"
              >
                Napisz do nas
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Formularz kontaktowy
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
