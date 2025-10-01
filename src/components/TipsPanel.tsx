"use client";
import React, { useState } from 'react';
import { Lightbulb, ChevronDown, ChevronUp, Camera, Users, Sparkles } from 'lucide-react';

const tips = [
  {
    icon: Camera,
    title: "Najlepsze zdjęcia",
    content: "Użyj zdjęcia z dobrym oświetleniem, gdzie twoja twarz jest wyraźnie widoczna. Unikaj cieni na twarzy i tła z rozpraszającymi elementami."
  },
  {
    icon: Users,
    title: "Pozycjonowanie",
    content: "Zdjęcie powinno pokazywać twoją twarz od ramion w górę. Upewnij się, że patrzysz prosto w obiektyw i uśmiechasz się naturalnie."
  },
  {
    icon: Sparkles,
    title: "Jakość AI",
    content: "Im lepsze zdjęcie źródłowe, tym lepszy wynik. Nasza AI najlepiej radzi sobie z wyraźnymi, wysokiej jakości zdjęciami."
  }
];

export default function TipsPanel() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Wskazówki dla najlepszego rezultatu</h3>
            <p className="text-sm text-gray-600">Kliknij, aby zobaczyć porady</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-6 space-y-4 animate-in slide-in-from-top-2 duration-300">
          {tips.map((tip, index) => {
            const IconComponent = tip.icon;
            return (
              <div key={index} className="flex gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <IconComponent className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">{tip.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{tip.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
