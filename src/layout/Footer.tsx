"use client";
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Shield,
  Lock,
  Award,
  Users
} from 'lucide-react';
import logo from "../assets/logoNumber2.png";
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <img src={logo} alt="Wizerunkowo Logo" className="h-8 w-8" />
                <span className="text-2xl font-bold">Wizerunkowo</span>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Przekształcamy zwykłe zdjęcia w profesjonalne portrety biznesowe 
                przy użyciu najnowszej technologii AI.
              </p>
              
              {/* Trust Indicators */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>Bezpieczne przetwarzanie</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Lock className="w-4 h-4 text-blue-400" />
                  <span>Dane chronione SSL</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span>Jakość premium</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Szybkie linki</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">
                    Cennik
                  </Link>
                </li>
                <li>
                  <Link to="/gallery" className="text-gray-300 hover:text-white transition-colors">
                    Galeria
                  </Link>
                </li>
                <li>
                  <Link to="/ideas" className="text-gray-300 hover:text-white transition-colors">
                    Inspiracje
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-gray-300 hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
                    Logowanie
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Wsparcie</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                    Kontakt
                  </Link>
                </li>
                <li>
                  <Link to="/help" className="text-gray-300 hover:text-white transition-colors">
                    Pomoc
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">
                    Polityka prywatności
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-gray-300 hover:text-white transition-colors">
                    Warunki użytkowania
                  </Link>
                </li>
                <li>
                  <Link to="/refund" className="text-gray-300 hover:text-white transition-colors">
                    Zwroty i reklamacje
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Kontakt</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <a 
                    href="mailto:kontakt@wizerunkowo.pl" 
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    kontakt@wizerunkowo.pl
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-green-400" />
                  <a 
                    href="tel:+48123456789" 
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    +48 123 456 789
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-400 mt-1" />
                  <span className="text-gray-300">
                    ul. Technologiczna 123<br />
                    00-001 Warszawa, Polska
                  </span>
                </div>
              </div>

              {/* Social Media */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-3 text-gray-400">ŚLEDŹ NAS</h4>
                <div className="flex gap-3">
                  <a 
                    href="#" 
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a 
                    href="#" 
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-400 transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a 
                    href="#" 
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a 
                    href="#" 
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Users className="w-4 h-4" />
                <span>Dołącz do 50,000+ zadowolonych klientów</span>
              </div>
              <div className="text-sm text-gray-400">
                © 2024 Wizerunkowo. Wszystkie prawa zastrzeżone.
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
