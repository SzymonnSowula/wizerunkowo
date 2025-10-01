"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "../assets/logoNumber2.png";

interface NavBarProps {
  onLogoClick?: () => void;
}

export default function NavBar({ onLogoClick }: NavBarProps = {}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
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

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    closeMobileMenu();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        {onLogoClick ? (
          <button 
            onClick={onLogoClick}
            className="flex items-center gap-2 hover:opacity-90 transition"
          >
            <img src={logo} alt="Wizerunkowo Logo" className="h-10 w-10" />
            <span className="text-xl font-bold text-white tracking-wide drop-shadow">Wizerunkowo</span>
          </button>
        ) : (
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition">
            <img src={logo} alt="Wizerunkowo Logo" className="h-10 w-10" />
            <span className="text-xl font-bold text-white tracking-wide drop-shadow">Wizerunkowo</span>
          </Link>
        )}
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
        {/* Auth Section & Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:text-cyan-300 hover:bg-white/10">
                    <User className="w-4 h-4 mr-2" />
                    {user.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" className="text-white hover:text-cyan-300 hover:bg-white/10">
                    Logowanie
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-gradient-to-r from-pink-500 to-blue-500 text-white font-bold px-4 py-2 rounded-full shadow-lg hover:scale-105 transition">
                    Rejestracja
                  </Button>
                </Link>
              </div>
            )}
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
            
            {/* Mobile Auth Section */}
            <div className="pt-4 border-t border-white/10">
              {user ? (
                <div className="space-y-2">
                  <div className="text-white/70 text-sm px-2 py-1">
                    Signed in as: {user.email}
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="w-full text-white hover:text-cyan-300 hover:bg-white/10 justify-start"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link to="/login" onClick={closeMobileMenu}>
                    <Button
                      variant="ghost"
                      className="w-full text-white hover:text-cyan-300 hover:bg-white/10"
                    >
                      Logowanie
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={closeMobileMenu}>
                    <Button
                      className="w-full bg-gradient-to-r from-pink-500 to-blue-500 text-white font-bold px-5 py-2 rounded-full shadow-lg hover:scale-105 transition"
                      size="sm"
                    >
                      Rejestracja
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}