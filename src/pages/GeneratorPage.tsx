"use client";
import { Button } from '@/components/ui/button';
import { UploadBox } from '@/components/UploadBox';
import { StyleSelector, type PhotoStyle } from '@/components/StyleSelector';
import { PreviewCard } from '@/components/PreviewCard';
import { ArrowLeft, Sparkles, Zap, CheckCircle } from 'lucide-react';
import NavBar from '@/layout/NavBar';
import { useAuth } from '@/contexts/AuthContext';
import ProgressIndicator from '@/components/ProgressIndicator';
import TipsPanel from '@/components/TipsPanel';
import { Link } from 'react-router-dom';

interface GeneratorPageProps {
  uploadedFile: File | null;
  selectedStyle: PhotoStyle;
  generatedImage: string | null;
  isGenerating: boolean;
  onFileUpload: (file: File) => void;
  onRemoveFile: () => void;
  onStyleChange: (style: PhotoStyle) => void;
  onGenerate: () => void;
  onBack: () => void;
}

export default function GeneratorPage({
  uploadedFile,
  selectedStyle,
  generatedImage,
  isGenerating,
  onFileUpload,
  onRemoveFile,
  onStyleChange,
  onGenerate,
  onBack,
}: GeneratorPageProps) {
  const { user } = useAuth();
  
  // Calculate progress steps
  const getCurrentStep = () => {
    if (generatedImage) return 4;
    if (isGenerating) return 3;
    if (uploadedFile) return 2;
    return 1;
  };

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/10"></div>

      {/* Navigation */}
      <NavBar onLogoClick={onBack} />

      <div className="relative z-10 pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="mb-6 text-white hover:text-cyan-300 hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Powrót do Głównej
            </Button>
            
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              {user ? `Witaj, ${user.email?.split('@')[0]}!` : 'Generator AI'}
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Generator Profesjonalnych
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
                Zdjęć Biznesowych
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-8">
              Zamień swoje zwykłe zdjęcie w profesjonalny portret biznesowy w kilka sekund
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-sm">Generowanie w 30s</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm">Profesjonalna jakość</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span className="text-sm">AI-powered</span>
              </div>
            </div>
          </div>
          {/* Progress Indicator */}
          <div className="mb-8">
            <ProgressIndicator 
              currentStep={getCurrentStep()} 
              totalSteps={4} 
              isGenerating={isGenerating} 
            />
          </div>

          {/* Main Content */}
          <div className="max-w-6xl mx-auto space-y-8">
            <UploadBox 
              onFileUpload={onFileUpload}
              uploadedFile={uploadedFile}
              onRemoveFile={onRemoveFile}
            />
            <StyleSelector 
              selectedStyle={selectedStyle}
              onStyleChange={onStyleChange}
            />
            
            {/* Tips Panel */}
            <TipsPanel />
            
            {/* Generate Button */}
            {uploadedFile && (
              <div className="text-center">
                <Button
                  onClick={onGenerate}
                  size="xl"
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-pink-500 to-blue-500 text-white font-bold px-12 py-4 rounded-full shadow-lg hover:scale-105 transition min-w-[300px]"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin h-6 w-6 mr-3 border-2 border-white border-t-transparent rounded-full" />
                      Generuję profesjonalne zdjęcie...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-6 w-6 mr-3" />
                      Generuj Profesjonalne Zdjęcie
                    </>
                  )}
                </Button>
                {isGenerating && (
                  <p className="text-blue-100 mt-4 text-sm">
                    To może potrwać 30-60 sekund. Nie zamykaj tej strony.
                  </p>
                )}
              </div>
            )}
            
            <PreviewCard
              file={uploadedFile}
              generatedImage={generatedImage}
              isGenerating={isGenerating}
              onRemoveFile={onRemoveFile}
            />
          </div>
        </div>
      </div>
    </div>
  );
}