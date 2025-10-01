"use client";
import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle, Zap, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CtaIndex from "@/components/CtaIndex";
import PricingSection from "@/components/PricingSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/layout/Footer";
import BackgroundElements from "@/components/BackgroundElements";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logoNumber2.png";
export default function LandingPage({ onStart }: { onStart: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleStartGenerator = () => {
    onStart();
  };

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <BackgroundElements />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/10"></div>

      {/* Integrated NavBar */}
      <nav className="relative z-50 w-full">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition">
            <img src={logo} alt="Wizerunkowo Logo" className="h-10 w-10" />
            <span className="text-xl font-bold text-white tracking-wide drop-shadow">Wizerunkowo</span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-white/90 text-sm font-medium">
            <Link 
              to="/pricing" 
              className={`hover:text-cyan-300 transition ${isActive('/pricing') ? 'text-cyan-300 font-semibold' : ''}`}
            >
              Cennik
            </Link>
            <Link 
              to="/faq" 
              className={`hover:text-cyan-300 transition ${isActive('/faq') ? 'text-cyan-300 font-semibold' : ''}`}
            >
              FAQ
            </Link>
            <Link 
              to="/login" 
              className={`hover:text-cyan-300 transition ${isActive('/login') ? 'text-cyan-300 font-semibold' : ''}`}
            >
              Logowanie
            </Link>
            <Link 
              to="/gallery" 
              className={`hover:text-cyan-300 transition ${isActive('/gallery') ? 'text-cyan-300 font-semibold' : ''}`}
            >
              Galeria
            </Link>
            <Link 
              to="/ideas" 
              className={`hover:text-cyan-300 transition ${isActive('/ideas') ? 'text-cyan-300 font-semibold' : ''}`}
            >
              Inspiracje
            </Link>
          </div>
          
          {/* CTA Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            {/* Desktop CTA Button */}
            <div className="hidden md:block">
              <Button
                onClick={handleStartGenerator}
                className="bg-gradient-to-r from-pink-500 to-blue-500 text-white font-bold px-5 py-2 rounded-full shadow-lg hover:scale-105 transition"
                size="sm"
              >
                Zrób zdjęcia jak te →
              </Button>
            </div>
            
            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-white hover:text-cyan-300 transition"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-black/90 backdrop-blur-md border-t border-white/10">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <Link 
                to="/pricing" 
                onClick={closeMobileMenu}
                className={`block py-2 text-white/90 hover:text-cyan-300 transition ${isActive('/pricing') ? 'text-cyan-300 font-semibold' : ''}`}
              >
                Cennik
              </Link>
              <Link 
                to="/faq" 
                onClick={closeMobileMenu}
                className={`block py-2 text-white/90 hover:text-cyan-300 transition ${isActive('/faq') ? 'text-cyan-300 font-semibold' : ''}`}
              >
                FAQ
              </Link>
              <Link 
                to="/login" 
                onClick={closeMobileMenu}
                className={`block py-2 text-white/90 hover:text-cyan-300 transition ${isActive('/login') ? 'text-cyan-300 font-semibold' : ''}`}
              >
                Logowanie
              </Link>
              <Link 
                to="/gallery" 
                onClick={closeMobileMenu}
                className={`block py-2 text-white/90 hover:text-cyan-300 transition ${isActive('/gallery') ? 'text-cyan-300 font-semibold' : ''}`}
              >
                Galeria
              </Link>
              <Link 
                to="/ideas" 
                onClick={closeMobileMenu}
                className={`block py-2 text-white/90 hover:text-cyan-300 transition ${isActive('/ideas') ? 'text-cyan-300 font-semibold' : ''}`}
              >
                Inspiracje
              </Link>
              
              {/* Mobile CTA Button */}
              <div className="pt-4 border-t border-white/10">
                <Button
                  onClick={() => {
                    closeMobileMenu();
                    handleStartGenerator();
                  }}
                  className="w-full bg-gradient-to-r from-pink-500 to-blue-500 text-white font-bold px-5 py-2 rounded-full shadow-lg hover:scale-105 transition"
                  size="sm"
                >
                  Zrób zdjęcia jak te →
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Pricing Section */}
      <PricingSection onStart={handleStartGenerator} />
      
      {/* Hero Section */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            🔥 Zwolnij swojego fotografa
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Profesjonalne Zdjęcia
            <span className="bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent block">
              Biznesowe z AI
            </span>
          </h1>
          <p className="text-xl lg:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Prześlij dowolne zdjęcie i otrzymaj profesjonalną sesję biznesową w kilka sekund
          </p>
          <Button
            onClick={handleStartGenerator}
            size="xl"
            className="mb-12 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-bold px-8 py-4 rounded-full shadow-lg hover:scale-105 transition relative z-50"
            style={{ pointerEvents: 'auto' }}
          >
            Zacznij Teraz
            <ArrowRight className="h-6 w-6 ml-2" />
          </Button>
          
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {[
              { icon: Zap, title: "Natychmiastowe Rezultaty", desc: "Transformacja AI w sekundach" },
              { icon: CheckCircle, title: "Jakość Profesjonalna", desc: "Zdjęcia biznesowe na poziomie studia" },
              { icon: Sparkles, title: "Różne Style", desc: "LinkedIn, korporacyjne, startup, CV" }
            ].map((feature, index) => (
              <div key={index} className="text-center text-white/90">
                <div className="inline-flex p-3 bg-white/10 rounded-xl mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-white/70">{feature.desc}</p>
              </div>
            ))}
          </div>
          <CtaIndex onStart={handleStartGenerator} />
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}