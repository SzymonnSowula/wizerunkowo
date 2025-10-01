"use client";
import React, { useState } from 'react';
import { ArrowRight, Star, Camera, Briefcase, Palette, Zap, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

interface PricingSectionProps {
  onStart?: () => void;
}

export default function PricingSection({ onStart }: PricingSectionProps) {
  const [email, setEmail] = useState('');
  const { user } = useAuth();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Tutaj logika wysyłania emaila
    console.log('Email submitted:', email);
  };

  const handleGoogleLogin = () => {
    // Tutaj logika Google OAuth
    console.log('Google login clicked');
  };

  const handleStartGenerator = () => {
    if (onStart) {
      onStart();
    }
  };

  return (
    <section className="py-20 bg-gradient-hero relative overflow-hidden">
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/10"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:items-center max-w-7xl mx-auto">
          
          {/* Left Section - Value Proposition */}
          <div className="space-y-8">
            {/* Award Badge */}
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-semibold">#1 AI Photo Generator</span>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-white leading-tight">
                Zrób profesjonalne zdjęcie w minutę
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
                  – bez fotografa
                </span>
              </h2>
            </div>

            {/* Features List */}
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-start gap-3 md:gap-4 group">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Camera className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <p className="text-white text-base md:text-lg font-medium">
                    <span className="underline decoration-orange-400 decoration-2">Przerób zwykłe selfie</span> na zdjęcie biznesowe (CV, LinkedIn, dokumenty)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 md:gap-4 group">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <p className="text-white text-base md:text-lg font-medium">
                    Wyglądaj <span className="underline decoration-orange-400 decoration-2">profesjonalnie w oczach rekruterów</span> i klientów
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 md:gap-4 group">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Palette className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <p className="text-white text-base md:text-lg font-medium">
                    <span className="underline decoration-orange-400 decoration-2">Ożyw stare fotografie</span> – dodaj kolory i popraw jakość
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 md:gap-4 group">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <p className="text-white text-base md:text-lg font-medium">
                    Szybko, tanio i bez stresu – <span className="underline decoration-orange-400 decoration-2">jedno kliknięcie i gotowe</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 md:gap-4 group">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Package className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <p className="text-white text-base md:text-lg font-medium">
                    <span className="underline decoration-orange-400 decoration-2">Pakiety i subskrypcje</span> dopasowane do Twoich potrzeb
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - CTA Box */}
          <div className="relative w-full lg:w-auto">
            {/* Green Banner */}
            <div className="absolute -top-6 -right-6 lg:-right-6 z-20">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 md:px-6 py-3 rounded-full shadow-lg transform rotate-3">
                <p className="text-xs md:text-sm font-bold">
                  🎉 Pierwsze zdjęcie testowe za darmo!
                </p>
              </div>
            </div>

            {/* Main CTA Box */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 relative z-10 border border-gray-100 w-full">
              {user ? (
                /* Logged in user - Direct CTA */
                <div className="space-y-4 md:space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                      Witaj, {user.email?.split('@')[0]}!
                    </h3>
                    <p className="text-gray-600">
                      Gotowy na profesjonalne zdjęcia?
                    </p>
                  </div>

                  <Button
                    onClick={handleStartGenerator}
                    className="w-full h-12 md:h-14 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold text-base md:text-lg rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    Rozpocznij generowanie
                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6 ml-2" />
                  </Button>

                  {/* Statistics */}
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-500" />
                    <span className="text-xs md:text-sm font-medium">
                      127,543 zdjęć wygenerowanych w tym miesiącu
                    </span>
                  </div>

                  {/* Quick Links */}
                  <div className="flex gap-3">
                    <Link 
                      to="/gallery" 
                      className="flex-1 text-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Zobacz galerię
                    </Link>
                    <Link 
                      to="/pricing" 
                      className="flex-1 text-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Zobacz cennik
                    </Link>
                  </div>
                </div>
              ) : (
                /* Not logged in - Email capture form */
                <form onSubmit={handleEmailSubmit} className="space-y-4 md:space-y-6">
                  {/* Email Input */}
                  <div>
                    <Input
                      type="email"
                      placeholder="Wpisz swój email..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-12 md:h-14 text-base md:text-lg px-4 md:px-6 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-orange-500"
                      required
                    />
                  </div>

                  {/* Main CTA Button */}
                  <Button
                    type="submit"
                    className="w-full h-12 md:h-14 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold text-base md:text-lg rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    Rozpocznij za darmo
                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6 ml-2" />
                  </Button>

                  {/* Statistics */}
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-500" />
                    <span className="text-xs md:text-sm font-medium">
                      127,543 zdjęć wygenerowanych w tym miesiącu
                    </span>
                  </div>

                  {/* Separator */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">lub</span>
                    </div>
                  </div>

                  {/* Google Login */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogleLogin}
                    className="w-full h-10 md:h-12 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all"
                  >
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-4 h-4 md:w-5 md:h-5 bg-gradient-to-r from-blue-500 to-red-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">G</span>
                      </div>
                      <span className="font-medium text-sm md:text-base">Kontynuuj z Google</span>
                    </div>
                  </Button>

                  {/* Login Link */}
                  <p className="text-center text-xs md:text-sm text-gray-500">
                    Jeśli już masz konto, zalogujemy Cię automatycznie
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
