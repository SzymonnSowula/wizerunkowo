"use client";
import React from 'react';
import { Star, Quote } from 'lucide-react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Anna Kowalska",
      role: "HR Manager",
      company: "TechCorp",
      content: "Wizerunkowo zmieniło moje podejście do zdjęć biznesowych. W 2 minuty mam profesjonalne zdjęcie na LinkedIn, które przyciąga uwagę rekruterów.",
      rating: 5,
      avatar: "AK"
    },
    {
      name: "Michał Nowak",
      role: "Freelancer",
      company: "Design Studio",
      content: "Jako freelancer potrzebuję profesjonalnych zdjęć do portfolio. Wizerunkowo oszczędza mi czas i pieniądze - nie muszę już wynajmować fotografa.",
      rating: 5,
      avatar: "MN"
    },
    {
      name: "Katarzyna Wiśniewska",
      role: "CEO",
      company: "StartupXYZ",
      content: "Nasz zespół używa Wizerunkowo do wszystkich zdjęć korporacyjnych. Jakość jest niesamowita, a cena nieporównywalnie niższa niż studio fotograficzne.",
      rating: 5,
      avatar: "KW"
    },
    {
      name: "Piotr Zieliński",
      role: "Konsultant",
      company: "Business Solutions",
      content: "Szybko, profesjonalnie i tanio. Wizerunkowo to najlepsza inwestycja w mój wizerunek zawodowy. Polecam każdemu!",
      rating: 5,
      avatar: "PZ"
    },
    {
      name: "Magdalena Krawczyk",
      role: "Prawo",
      company: "Kancelaria Prawna",
      content: "Jako prawnik muszę wyglądać profesjonalnie. Wizerunkowo zapewnia mi zdjęcia na najwyższym poziomie bez konieczności wychodzenia z biura.",
      rating: 5,
      avatar: "MK"
    },
    {
      name: "Tomasz Lewandowski",
      role: "IT Manager",
      company: "Software House",
      content: "Rewolucyjna technologia! Wizerunkowo to przyszłość fotografii biznesowej. Wszystkie moje zdjęcia wyglądają jak z profesjonalnego studia.",
      rating: 5,
      avatar: "TL"
    }
  ];

  return (
    <section className="py-20 bg-gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            Opinie naszych klientów
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Co mówią o nas
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
              nasi klienci
            </span>
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Dołącz do tysięcy zadowolonych użytkowników, którzy już odkryli potencjał AI w fotografii biznesowej
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Quote Icon */}
              <div className="flex justify-between items-start mb-4">
                <Quote className="w-8 h-8 text-purple-500 opacity-50" />
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>

              {/* Content */}
              <p className="text-gray-700 leading-relaxed mb-6 text-sm">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-600 text-xs">
                    {testimonial.role}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">50,000+</div>
            <div className="text-blue-100 text-sm">Zadowolonych klientów</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">4.9/5</div>
            <div className="text-blue-100 text-sm">Średnia ocena</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">1M+</div>
            <div className="text-blue-100 text-sm">Wygenerowanych zdjęć</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">99%</div>
            <div className="text-blue-100 text-sm">Pozytywnych opinii</div>
          </div>
        </div>
      </div>
    </section>
  );
}
