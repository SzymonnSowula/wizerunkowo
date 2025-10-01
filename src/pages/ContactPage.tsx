"use client";
import React from 'react';
import { ArrowLeft, Mail, Phone, MapPin, Clock, MessageSquare, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ContactForm from '@/components/ContactForm';
import NavBar from '@/layout/NavBar';
import { Link } from 'react-router-dom';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/10"></div>

      {/* Navigation */}
      <NavBar />

      <div className="relative z-10 pt-16">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <Link to="/">
              <Button 
                variant="ghost" 
                className="mb-6 text-white hover:text-cyan-300 hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Powrót do Głównej
              </Button>
            </Link>
            
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 text-sm font-medium mb-8">
              <MessageSquare className="w-4 h-4" />
              Kontakt i wsparcie
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Skontaktuj się
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
                z nami
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Jesteśmy tutaj, aby pomóc Ci w każdej sprawie związanej z Wizerunkowo
            </p>
          </div>

          {/* Contact Form */}
          <div className="mb-16">
            <ContactForm />
          </div>

          {/* Additional Contact Options */}
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {/* Email Support */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Email Support</h3>
                <p className="text-gray-600 mb-4">
                  Napisz do nas na adres kontaktowy. Odpowiadamy w ciągu 24 godzin.
                </p>
                <a 
                  href="mailto:kontakt@wizerunkowo.pl"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  kontakt@wizerunkowo.pl
                </a>
              </div>

              {/* Phone Support */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Wsparcie telefoniczne</h3>
                <p className="text-gray-600 mb-4">
                  Potrzebujesz natychmiastowej pomocy? Zadzwoń do nas.
                </p>
                <a 
                  href="tel:+48123456789"
                  className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
                >
                  +48 123 456 789
                </a>
              </div>

              {/* FAQ */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <HelpCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">FAQ</h3>
                <p className="text-gray-600 mb-4">
                  Sprawdź nasze najczęściej zadawane pytania i odpowiedzi.
                </p>
                <Link 
                  to="/faq"
                  className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                >
                  Zobacz FAQ
                </Link>
              </div>
            </div>

            {/* Office Hours */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Godziny pracy</h3>
                <p className="text-gray-600">Kiedy możesz się z nami skontaktować</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900 mb-3">Wsparcie techniczne</h4>
                  <div className="space-y-2 text-gray-600">
                    <p>Poniedziałek - Piątek: 9:00 - 18:00</p>
                    <p>Sobota: 10:00 - 16:00</p>
                    <p>Niedziela: Zamknięte</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900 mb-3">Sprzedaż i płatności</h4>
                  <div className="space-y-2 text-gray-600">
                    <p>Poniedziałek - Piątek: 8:00 - 20:00</p>
                    <p>Sobota: 9:00 - 17:00</p>
                    <p>Niedziela: 10:00 - 16:00</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                <p className="text-center text-gray-700">
                  <strong>Pilne sprawy:</strong> W przypadku problemów z dostępem do konta lub płatnościami, 
                  skontaktuj się z nami telefonicznie - odpowiadamy 24/7.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
