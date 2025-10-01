import React, { useState } from 'react';
import NavBar from '@/layout/NavBar';
import { Image, Filter, Download, Heart, Share2, ZoomIn } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const galleryData = [
    {
      id: 1,
      src: '/src/assets/zdj1.jpg',
      alt: 'Profesjonalne zdjęcie biznesowe - styl korporacyjny',
      category: 'biznesowe',
      style: 'Corporate',
      description: 'Elegancki styl biznesowy idealny na LinkedIn'
    },
    {
      id: 2,
      src: '/src/assets/zdj2.jpg',
      alt: 'Zdjęcie portretowe - styl kreatywny',
      category: 'kreatywne',
      style: 'Creative',
      description: 'Artystyczny portret z nowoczesnym podejściem'
    },
    {
      id: 3,
      src: '/src/assets/zdj3.jpg',
      alt: 'Zdjęcie profesjonalne - styl casual',
      category: 'casual',
      style: 'Casual',
      description: 'Relaksujący styl idealny dla startupów'
    },
    {
      id: 4,
      src: '/src/assets/zdj4.jpg',
      alt: 'Portret formalny - styl executive',
      category: 'biznesowe',
      style: 'Executive',
      description: 'Formalny styl dla wysokich stanowisk'
    },
    {
      id: 5,
      src: '/src/assets/result.png',
      alt: 'Przykład wygenerowanego zdjęcia',
      category: 'kreatywne',
      style: 'Modern',
      description: 'Nowoczesny styl z elementami artystycznymi'
    },
    {
      id: 6,
      src: '/src/assets/zdj1.jpg',
      alt: 'Zdjęcie profesjonalne - styl korporacyjny',
      category: 'biznesowe',
      style: 'Corporate',
      description: 'Klasyczny styl biznesowy'
    },
    {
      id: 7,
      src: '/src/assets/zdj2.jpg',
      alt: 'Portret kreatywny',
      category: 'kreatywne',
      style: 'Artistic',
      description: 'Kreatywny portret z unikalnym stylem'
    },
    {
      id: 8,
      src: '/src/assets/zdj3.jpg',
      alt: 'Zdjęcie casual',
      category: 'casual',
      style: 'Relaxed',
      description: 'Przyjazny styl casual'
    }
  ];

  const categories = [
    { value: 'all', label: 'Wszystkie' },
    { value: 'biznesowe', label: 'Biznesowe' },
    { value: 'kreatywne', label: 'Kreatywne' },
    { value: 'casual', label: 'Casual' }
  ];

  const filteredImages = galleryData.filter(image => {
    const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory;
    const matchesSearch = image.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.style.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
                <Image className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Galeria zdjęć
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Zobacz przykłady profesjonalnych zdjęć wygenerowanych przez naszą AI
            </p>
          </div>

          {/* Filters */}
          <div className="max-w-6xl mx-auto mb-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex items-center gap-2 text-white">
                  <Filter className="h-4 w-4 text-black" />
                  <span className="font-medium text-black">Filtry:</span>
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Wybierz kategorię" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="relative flex-1 max-w-md">
                  <Input
                    placeholder="Szukaj stylów..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/90 backdrop-blur-sm border-white/20"
                  />
                  <ZoomIn className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredImages.map((image) => (
                <Card key={image.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex gap-2">
                          <Button size="sm" variant="secondary" className="rounded-full">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="secondary" className="rounded-full">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="secondary" className="rounded-full">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {image.style}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            image.category === 'biznesowe' ? 'border-blue-200 text-blue-700' :
                            image.category === 'kreatywne' ? 'border-purple-200 text-purple-700' :
                            'border-green-200 text-green-700'
                          }`}
                        >
                          {categories.find(cat => cat.value === image.category)?.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {image.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Empty State */}
          {filteredImages.length === 0 && (
            <div className="text-center py-16">
              <Image className="h-16 w-16 text-white/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white/70 mb-2">
                Brak wyników
              </h3>
              <p className="text-white/50">
                Spróbuj zmienić filtry lub wyszukiwanie
              </p>
            </div>
          )}

          {/* CTA Section */}
          <div className="max-w-4xl mx-auto mt-16 bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Chcesz mieć podobne zdjęcia?
            </h3>
            <p className="text-gray-600 mb-6">
              Dołącz do tysięcy zadowolonych klientów i stwórz swoje profesjonalne zdjęcia już dziś
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-pink-500 to-blue-500 text-white font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform"
            >
              Rozpocznij teraz
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}