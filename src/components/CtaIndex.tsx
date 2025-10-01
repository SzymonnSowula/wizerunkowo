"use client";
import React from "react";
import Img1 from "../assets/zdj1.jpg";
import Img2 from "../assets/zdj2.jpg";
import Img3 from "../assets/zdj3.jpg";
import Img4 from "../assets/zdj4.jpg";
import Result from "../assets/result.png";
import { ArrowRight } from "lucide-react";

interface CtaIndexProps {
  onStart: () => void;
}

export default function CtaIndex({ onStart }: CtaIndexProps) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8 w-full max-w-4xl mx-auto">
          {/* Left: Selfies grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm">
              <img src={Img1} alt="Selfie 1" className="object-cover w-full h-40" />
            </div>
            <div className="rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm">
              <img src={Img2} alt="Selfie 2" className="object-cover w-full h-40" />
            </div>
            <div className="rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm">
              <img src={Img3} alt="Selfie 3" className="object-cover w-full h-40" />
            </div>
            <div className="rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm">
              <img src={Img4} alt="Selfie 4" className="object-cover w-full h-40" />
            </div>
          </div>
          {/* Arrow */}
          <div className="flex flex-col items-center">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <path d="M10 40H60M60 40L40 20M60 40L40 60" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {/* Right: Generated photo */}
          <div className="relative rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm">
            <img src={Result} alt="Generated AI Photo" className="object-cover w-64 h-80" />
            <span className="absolute top-3 right-3 bg-green-600 text-xs text-white px-3 py-1 rounded-full font-semibold">
              Wygenerowane AI
            </span>
          </div>
        </div>
        {/* CTA Button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={onStart}
            className="px-8 py-4 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-bold rounded-full text-lg shadow-lg hover:scale-105 transition cursor-pointer relative z-50"
            style={{ pointerEvents: 'auto' }}
          >
            Wygeneruj swoją sesję AI
            <ArrowRight className="w-5 h-5 ml-2 inline" />
          </button>
        </div>
      </div>
    </section>
  );
}
