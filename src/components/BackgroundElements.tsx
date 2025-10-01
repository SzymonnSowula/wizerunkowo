"use client";
import React from 'react';

export default function BackgroundElements() {

  return (
    <>
      {/* Floating Geometric Shapes - Reduced and Slower */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large Primary Circles - Slower animations */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/15 to-purple-600/15 rounded-full blur-xl animate-float-very-slow shadow-lg shadow-blue-500/10"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-blue-500/15 to-cyan-500/15 rounded-full blur-lg animate-float-slow shadow-lg shadow-blue-500/10"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-blue-400/15 to-blue-600/15 rounded-full blur-2xl animate-float-very-slow shadow-lg shadow-blue-500/10"></div>
        
        {/* Medium Accent Circles - Reduced opacity */}
        <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-md animate-float-medium shadow-md shadow-blue-500/15"></div>
        <div className="absolute bottom-1/4 right-1/4 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full blur-lg animate-float-slow shadow-md shadow-blue-500/15"></div>
        
        {/* Small Glowing Dots - Reduced count */}
        <div className="absolute top-16 right-1/2 w-6 h-6 bg-white/20 rounded-full animate-pulse-slow shadow-md shadow-white/30"></div>
        <div className="absolute bottom-20 left-1/3 w-4 h-4 bg-white/25 rounded-full animate-pulse-slow delay-2000 shadow-md shadow-white/30"></div>
        <div className="absolute top-1/2 left-16 w-3 h-3 bg-cyan-300/30 rounded-full animate-pulse-slow delay-1000 shadow-sm shadow-cyan-300/30"></div>
        
        {/* Subtle Gradient Lines */}
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-300/10 to-transparent animate-pulse-slow delay-3000"></div>
        
        {/* Corner Accents - Reduced intensity */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/8 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-500/8 to-transparent rounded-full blur-3xl animate-pulse-slow delay-2000"></div>
      </div>

      {/* Subtle Animated Grid - Single layer, slower */}
      <div className="absolute inset-0 opacity-4">
        <div 
          className="absolute inset-0 animate-grid-move-slow"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            animation: 'grid-move-slow 40s linear infinite'
          }} 
        />
      </div>

      {/* Floating String Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-0 w-full h-px animate-string-wave">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent"></div>
        </div>
      </div>

      {/* Subtle Radial Gradients */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-blue-500/5 via-blue-500/3 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-radial from-blue-400/6 via-transparent to-transparent rounded-full blur-2xl animate-pulse-slow delay-3000"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-radial from-cyan-500/5 via-transparent to-transparent rounded-full blur-3xl animate-pulse-slow delay-1500"></div>
      
      {/* Subtle Light Rays */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-white/3 to-transparent animate-pulse-slow delay-4000"></div>
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/3 to-transparent animate-pulse-slow delay-2500"></div>
    </>
  );
}

