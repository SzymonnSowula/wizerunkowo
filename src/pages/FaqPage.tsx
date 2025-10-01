import React from 'react';
import NavBar from '@/layout/NavBar';
import { HelpCircle, Search } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function FAQ() {
  const [searchTerm, setSearchTerm] = React.useState('');

  const faqData = [
    {
      category: "Ogólne",
      questions: [
        {
          question: "Czym jest Wizerunkowo?",
          answer: "Wizerunkowo to platforma do generowania profesjonalnych zdjęć portretowych przy użyciu sztucznej inteligencji. Tworzymy wysokiej jakości zdjęcia biznesowe, które możesz wykorzystać w CV, na LinkedIn, lub w innych celach zawodowych."
        },
        {
          question: "Jak działa generowanie zdjęć?",
          answer: "Użytkownik przesyła swoje zdjęcie, a nasza AI analizuje jego cechy i generuje profesjonalne warianty w różnych stylach. Proces trwa zazwyczaj 2-5 minut i dostajesz kilka opcji do wyboru."
        },
        {
          question: "Czy moje zdjęcia są bezpieczne?",
          answer: "Tak, traktujemy prywatność bardzo poważnie. Twoje zdjęcia są szyfrowane i przechowywane bezpiecznie. Nie udostępniamy ich osobom trzecim i możesz je usunąć w dowolnym momencie."
        }
      ]
    },
    {
      category: "Płatności i Pakiety",
      questions: [
        {
          question: "Jakie są dostępne pakiety?",
          answer: "Oferujemy kilka pakietów: Basic (5 zdjęć), Professional (15 zdjęć), Premium (30 zdjęć) i Business (50 zdjęć). Każdy pakiet zawiera różne style i opcje personalizacji."
        },
        {
          question: "Jakie metody płatności akceptujecie?",
          answer: "Akceptujemy karty płatnicze (Visa, Mastercard), PayPal, oraz przelewy bankowe. Wszystkie płatności są przetwarzane bezpiecznie przez naszych partnerów płatniczych."
        },
        {
          question: "Czy mogę zwrócić pakiety?",
          answer: "Oferujemy 14-dniową gwarancję satysfakcji. Jeśli nie jesteś zadowolony z jakości wygenerowanych zdjęć, zwrócimy Ci pieniądze bez pytania."
        }
      ]
    },
    {
      category: "Techniczne",
      questions: [
        {
          question: "Jakie formaty zdjęć akceptujecie?",
          answer: "Akceptujemy zdjęcia w formatach JPG, PNG i WebP. Zalecamy rozdzielczość minimum 512x512 pikseli dla najlepszych rezultatów."
        },
        {
          question: "Jak długo trwa generowanie zdjęć?",
          answer: "Proces generowania trwa zazwyczaj 2-5 minut, w zależności od złożoności wybranego stylu i obciążenia serwerów."
        },
        {
          question: "Czy mogę edytować zdjęcia po wygenerowaniu?",
          answer: "Tak, wygenerowane zdjęcia możesz pobrać w wysokiej rozdzielczości i edytować w dowolnym programie graficznym."
        }
      ]
    },
    {
      category: "Wsparcie",
      questions: [
        {
          question: "Jak mogę skontaktować się z pomocą techniczną?",
          answer: "Możesz skontaktować się z nami przez email na support@wizerunkowo.pl, przez formularz kontaktowy na stronie, lub przez czat na żywo (dostępny w godzinach 9:00-17:00)."
        },
        {
          question: "Czy oferujecie wsparcie w języku polskim?",
          answer: "Tak, nasz zespół wsparcia mówi po polsku i jest dostępny od poniedziałku do piątku w godzinach 9:00-17:00."
        },
        {
          question: "Jak często aktualizujecie funkcje?",
          answer: "Regularnie dodajemy nowe style zdjęć i ulepszamy jakość generowania. Główne aktualizacje pojawiają się co 2-3 tygodnie."
        }
      ]
    }
  ];

  const filteredData = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/10"></div>

      <NavBar />
      <div className="relative z-10 pt-16">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-full">
                <HelpCircle className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Najczęściej zadawane pytania
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Znajdź odpowiedzi na wszystkie pytania dotyczące naszej platformy do generowania profesjonalnych zdjęć
            </p>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Szukaj w FAQ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/90 backdrop-blur-sm border-white/20"
              />
            </div>
          </div>

          {/* FAQ Content */}
          <div className="max-w-4xl mx-auto">
            {filteredData.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-white/70 text-lg">Nie znaleziono wyników dla wyszukiwania: "{searchTerm}"</p>
              </div>
            ) : (
              filteredData.map((category, categoryIndex) => (
                <div key={categoryIndex} className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Badge variant="secondary" className="text-sm font-medium px-3 py-1 bg-white/10 backdrop-blur-sm text-white border-white/20">
                      {category.category}
                    </Badge>
                    <div className="flex-1 h-px bg-white/20"></div>
                  </div>
                  
                  <Accordion type="single" collapsible className="space-y-4">
                    {category.questions.map((item, index) => (
                      <AccordionItem 
                        key={index} 
                        value={`item-${categoryIndex}-${index}`}
                        className="bg-white/90 backdrop-blur-sm rounded-lg border border-white/20 px-6"
                      >
                        <AccordionTrigger className="text-left font-medium text-gray-900 hover:text-purple-600 transition-colors">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))
            )}
          </div>

          {/* Contact Section */}
          <div className="max-w-4xl mx-auto mt-16 bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Nie znalazłeś odpowiedzi?
              </h3>
              <p className="text-gray-600 mb-6">
                Nasz zespół wsparcia jest gotowy pomóc Ci w każdej chwili
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:support@wizerunkowo.pl"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-medium rounded-lg hover:scale-105 transition-transform"
                >
                  Napisz do nas
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 border border-white/20 text-gray-700 font-medium rounded-lg hover:bg-white/10 transition-colors"
                >
                  Formularz kontaktowy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}