"use client";

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import NavBar from "@/layout/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Basic validation
        if (!email || !password) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        const { error } = await signIn(email, password);
        
        if (error) {
            setError(error.message || 'Invalid credentials');
        } else {
            navigate('/');
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
                                        <LogIn className="h-8 w-8 text-white" />
                                    </div>
                                </div>
                                <CardTitle className="text-2xl font-bold">Witaj z powrotem</CardTitle>
                                <CardDescription>
                                    Zaloguj się do swojego konta, aby kontynuować
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {error && (
                                    <Alert className="mb-4" variant="destructive">
                                        <AlertDescription>{error}</AlertDescription>
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
                                                disabled={loading}
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
                                                placeholder="Wprowadź swoje hasło"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="pl-10 pr-10"
                                                required
                                                disabled={loading}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                                                disabled={loading}
                                            >
                                                {showPassword ? <EyeOff /> : <Eye />}
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <Button 
                                        type="submit" 
                                        className="w-full" 
                                        disabled={loading}
                                    >
                                        {loading ? "Logowanie..." : "Zaloguj się"}
                                    </Button>
                                </form>
                                
                                <div className="mt-6 text-center">
                                    <p className="text-sm text-gray-600">
                                        Nie masz konta?{" "}
                                        <Link 
                                            to="/signup" 
                                            className="text-purple-600 hover:text-purple-500 font-medium"
                                        >
                                            Zarejestruj się
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
