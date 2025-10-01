"use client";

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import NavBar from "@/layout/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserPlus, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import logo from "../assets/logoNumber2.png";
export default function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { signUp } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        // Basic validation
        if (!email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        const { error } = await signUp(email, password);
        
        if (error) {
            setError(error.message || 'Failed to create account');
        } else {
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        }
        
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/10"></div>

            <NavBar />
            <div className="relative z-10 pt-16">
                <div className="container mx-auto px-4 py-20 lg:py-32">
                    <div className="flex justify-center">
                        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-white/20">
                            <CardHeader className="text-center">
                                <div className="flex justify-center mb-4">
                                    <div className="p-3 bg-white/10 backdrop-blur-sm rounded-full">
                                        <img src={logo} alt="Wizerunkowo Logo" className="h-8 w-8" />
                                        {/* <UserPlus className="h-8 w-8 text-white" /> */}
                                    </div>
                                </div>
                                <CardTitle className="text-2xl font-bold">Utwórz konto</CardTitle>
                                <CardDescription>
                                    Zarejestruj się, aby rozpocząć korzystanie z konta
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {error && (
                                    <Alert className="mb-4" variant="destructive">
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}
                                
                                {success && (
                                    <Alert className="mb-4" variant="default">
                                        <AlertDescription>
                                            Konto zostało utworzone pomyślnie! Sprawdź swój email, aby zweryfikować konto. 
                                            Przekierowywanie do logowania...
                                        </AlertDescription>
                                    </Alert>
                                )}
                                
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Adres email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="Wprowadź swój email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="pl-10"
                                                required
                                                disabled={loading || success}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Hasło</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Utwórz hasło"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="pl-10 pr-10"
                                                required
                                                disabled={loading || success}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                                                disabled={loading || success}
                                            >
                                                {showPassword ? <EyeOff /> : <Eye />}
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Potwierdź hasło</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="confirmPassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="Potwierdź swoje hasło"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="pl-10 pr-10"
                                                required
                                                disabled={loading || success}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                                                disabled={loading || success}
                                            >
                                                {showConfirmPassword ? <EyeOff /> : <Eye />}
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <Button 
                                        type="submit" 
                                        className="w-full" 
                                        disabled={loading || success}
                                    >
                                        {loading ? "Tworzenie konta..." : "Utwórz konto"}
                                    </Button>
                                </form>
                                
                                <div className="mt-6 text-center">
                                    <p className="text-sm text-gray-600">
                                        Masz już konto?{" "}
                                        <Link 
                                            to="/login" 
                                            className="text-green-600 hover:text-green-500 font-medium"
                                        >
                                            Zaloguj się
                                        </Link>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
