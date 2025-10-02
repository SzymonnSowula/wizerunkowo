"use client";

import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { photoGenerationService } from '@/services/photoGenerationService';
import LandingPage from './LandingPage';
import GeneratorPage from './GeneratorPage';
import { type PhotoStyle } from '@/components/StyleSelector';

const Index = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<PhotoStyle>('linkedin');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showMainApp, setShowMainApp] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setGeneratedImage(null);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setGeneratedImage(null);
  };


  const handleGenerate = async () => {
    if (!uploadedFile) {
      toast({
        title: "Nie wybrano zdjęcia",
        description: "Najpierw prześlij zdjęcie",
        variant: "destructive"
      });
      return;
    }

    // Validate file
    const validation = photoGenerationService.validateImageFile(uploadedFile);
    if (!validation.valid) {
      toast({
        title: "Nieprawidłowy plik",
        description: validation.error,
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await photoGenerationService.generatePhoto({
        image: uploadedFile,
        style: selectedStyle,
        quality: 'high',
        aspectRatio: '1:1'
      });

      if (result.success && result.generatedImage) {
        setGeneratedImage(result.generatedImage);
        toast({
          title: "Zdjęcie wygenerowane pomyślnie!",
          description: "Twoje profesjonalne zdjęcie jest gotowe do pobrania"
        });
      } else {
        throw new Error(result.error || 'Nie udało się wygenerować zdjęcia');
      }
    } catch (error: any) {
      toast({
        title: "Generowanie nieudane",
        description: error.message || "Nie udało się wygenerować profesjonalnego zdjęcia. Spróbuj ponownie.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return !showMainApp ? (
    <LandingPage onStart={() => setShowMainApp(true)} />
  ) : (
    <GeneratorPage
      uploadedFile={uploadedFile}
      selectedStyle={selectedStyle}
      generatedImage={generatedImage}
      isGenerating={isGenerating}
      onFileUpload={handleFileUpload}
      onRemoveFile={handleRemoveFile}
      onStyleChange={setSelectedStyle}
      onGenerate={handleGenerate}
      onBack={() => setShowMainApp(false)}
    />
  );
};

export default Index;
