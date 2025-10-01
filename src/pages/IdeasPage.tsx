import React, { useState } from 'react';
import NavBar from '@/layout/NavBar';
import { Lightbulb, ArrowRight, Sparkles, Camera, Palette, Briefcase, Heart } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Ideas() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const ideaCategories = [
    { value: 'all', label: 'Wszystkie' },
    { value: 'biznesowe', label: 'Biznesowe' },
    { value: 'kreatywne', label: 'Kreatywne' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'artystyczne', label: 'Artystyczne' }
  ];

  const ideasData = [
    {
      category: 'biznesowe',
      title: 'Portret korporacyjny',
      description: 'Elegancki styl idealny dla kadry kierowniczej i profesjonalistów',
      icon: <Briefcase className="h-6 w-6" />,
      tips: [
        'Użyj ciemnego garnituru lub eleganckiej bluzki',
        'Zachowaj neutralne tło (białe, szare, niebieskie)',
        'Pozuj z lekkim uśmiechem i pewnym siebie spojrzeniem',
        'Unikaj zbyt wielu dodatków i biżuterii'
      ],
      style: 'Corporate',
      color: 'bg-blue-100 text-blue-700'
    },
    {
      category: 'biznesowe',
      title: 'Zdjęcie na LinkedIn',
      description: 'Profesjonalne zdjęcie do CV i mediów społecznościowych',
      icon: <Briefcase className="h-6 w-6" />,
      tips: [
        'Ubierz się w strój biznesowy',
        'Używaj naturalnego oświetlenia',
        'Zachowaj uśmiech, ale nie przesadzaj',
        'Upewnij się, że zdjęcie jest ostre i dobrze oświetlone'
      ],
      style: 'Professional',
      color: 'bg-blue-100 text-blue-700'
    },
    {
      category: 'kreatywne',
      title: 'Portret artystyczny',
      description: 'Kreatywny styl z elementami artystycznymi',
      icon: <Palette className="h-6 w-6" />,
      tips: [
        'Eksperymentuj z oświetleniem i cieniami',
        'Używaj interesujących tła lub tekstur',
        'Spróbuj różnych kątów i perspektyw',
        'Nie bój się kolorów i kontrastów'
      ],
      style: 'Creative',
      color: 'bg-purple-100 text-purple-700'
    },
    {
      category: 'kreatywne',
      title: 'Portret nowoczesny',
      description: 'Współczesny styl z minimalizmem',
      icon: <Sparkles className="h-6 w-6" />,
      tips: [
        'Użyj prostego, jednolitego tła',
        'Skup się na naturalnych cechach twarzy',
        'Eksperymentuj z kolorami włosów i makijażem',
        'Zachowaj prostotę w stylizacji'
      ],
      style: 'Modern',
      color: 'bg-purple-100 text-purple-700'
    },
    {
      category: 'lifestyle',
      title: 'Zdjęcie casual',
      description: 'Relaksujący styl dla codziennego użytku',
      icon: <Heart className="h-6 w-6" />,
      tips: [
        'Ubierz się w wygodne, casualowe ubrania',
        'Użyj naturalnego oświetlenia',
        'Pozuj w swobodny sposób',
        'Możesz użyć kolorowego tła lub lokalizacji'
      ],
      style: 'Casual',
      color: 'bg-green-100 text-green-700'
    },
    {
      category: 'lifestyle',
      title: 'Portret outdoor',
      description: 'Zdjęcie na zewnątrz z naturalnym oświetleniem',
      icon: <Camera className="h-6 w-6" />,
      tips: [
        'Wybierz odpowiednią porę dnia (złota godzina)',
        'Zwróć uwagę na tło i otoczenie',
        'Używaj naturalnych kolorów w stylizacji',
        'Eksperymentuj z różnymi lokalizacjami'
      ],
      style: 'Outdoor',
      color: 'bg-green-100 text-green-700'
    },
    {
      category: 'artystyczne',
      title: 'Portret dramatyczny',
      description: 'Intensywny styl z mocnym charakterem',
      icon: <Sparkles className="h-6 w-6" />,
      tips: [
        'Eksperymentuj z kontrastowym oświetleniem',
        'Używaj ciemnych, intensywnych kolorów',
        'Skup się na ekspresji i emocjach',
        'Nie bój się cieni i dramatyzmu'
      ],
      style: 'Dramatic',
      color: 'bg-red-100 text-red-700'
    },
    {
      category: 'artystyczne',
      title: 'Portret vintage',
      description: 'Retro styl inspirowany dawnymi epokami',
      icon: <Palette className="h-6 w-6" />,
      tips: [
        'Użyj stylizacji inspirowanej określoną epoką',
        'Eksperymentuj z sepia i vintage filtrami',
        'Wybierz odpowiednie tło i rekwizyty',
        'Zwróć uwagę na detale i akcesoria'
      ],
      style: 'Vintage',
      color: 'bg-red-100 text-red-700'
    }
  ];

  const filteredIdeas = ideasData.filter(idea => 
    selectedCategory === 'all' || idea.category === selectedCategory
  );

  const categoryIcons = {
    biznesowe: <Briefcase className="h-5 w-5" />,
    kreatywne: <Palette className="h-5 w-5" />,
    lifestyle: <Heart className="h-5 w-5" />,
    artystyczne: <Sparkles className="h-5 w-5" />
  };

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/10"></div>

      <NavBar />
      <div className="relative z-10 pt-16">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-full">
                <Lightbulb className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Inspiracje i pomysły
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Odkryj różne style i koncepcje dla swoich profesjonalnych zdjęć
            </p>
          </div>

          {/* Category Filter */}
          <div className="max-w-6xl mx-auto mb-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex items-center gap-2 text-white">
                  <Sparkles className="h-4 w-4" />
                  <span className="font-medium">Kategorie:</span>
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Wybierz kategorię" />
                  </SelectTrigger>
                  <SelectContent>
                    {ideaCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center gap-2">
                          {categoryIcons[category.value as keyof typeof categoryIcons]}
                          {category.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Ideas Grid */}
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIdeas.map((idea, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${idea.color}`}>
                          {idea.icon}
                        </div>
                        <Badge variant="outline" className={idea.color}>
                          {idea.style}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                      {idea.title}
                    </CardTitle>
                    <p className="text-gray-600 leading-relaxed">
                      {idea.description}
                    </p>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 text-sm">Wskazówki:</h4>
                      <ul className="space-y-2">
                        {idea.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="flex items-start gap-2 text-sm text-gray-600">
                            <ArrowRight className="h-3 w-3 mt-1 text-purple-500 flex-shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full group-hover:bg-purple-50 group-hover:border-purple-200 transition-colors"
                      >
                        Zastosuj ten styl
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Tips Section */}
          <div className="max-w-6xl mx-auto mt-16">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Ogólne wskazówki dla najlepszych rezultatów
                </h3>
                <p className="text-gray-600">
                  Oto kilka uniwersalnych rad, które pomogą Ci uzyskać doskonałe zdjęcia
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="p-3 bg-blue-100 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                    <Camera className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Jakość zdjęcia</h4>
                  <p className="text-sm text-gray-600">
                    Używaj wysokiej rozdzielczości i dobrego oświetlenia
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="p-3 bg-purple-100 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                    <Palette className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Stylizacja</h4>
                  <p className="text-sm text-gray-600">
                    Wybierz odpowiednie ubrania i makijaż dla danego stylu
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="p-3 bg-green-100 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Pozycja</h4>
                  <p className="text-sm text-gray-600">
                    Pozuj naturalnie i zachowaj pewność siebie
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="p-3 bg-red-100 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-red-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Ekspresja</h4>
                  <p className="text-sm text-gray-600">
                    Bądź sobą i pozwól swojej osobowości zabłysnąć
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="max-w-4xl mx-auto mt-16 bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Gotowy na swoją sesję?
            </h3>
            <p className="text-gray-600 mb-6">
              Wybierz swój ulubiony styl i stwórz profesjonalne zdjęcia już dziś
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-pink-500 to-blue-500 text-white font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform"
            >
              Rozpocznij generowanie
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}