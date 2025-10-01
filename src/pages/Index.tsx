"use client";

import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
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

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
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
    setIsGenerating(true);
    try {
      const imageData = await convertFileToBase64(uploadedFile);
      const { data, error } = await supabase.functions.invoke('generate-professional-photo', {
        body: { 
          imageData,
          style: selectedStyle 
        }
      });
      if (error) {
        throw new Error(error.message || 'Failed to generate photo');
      }
      if (data?.error) {
        throw new Error(data.error);
      }
      if (data?.generatedImage) {
        setGeneratedImage(data.generatedImage);
        toast({
          title: "Zdjęcie wygenerowane pomyślnie!",
          description: "Twoje profesjonalne zdjęcie jest gotowe do pobrania"
        });
      } else {
        throw new Error('No image received from AI service');
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
