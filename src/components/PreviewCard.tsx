"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Eye, X } from 'lucide-react'

interface PreviewCardProps {
  file: File | null
  generatedImage?: string | null
  isGenerating?: boolean
  onRemoveFile?: () => void // Dodaj obsługę usuwania
}

export function PreviewCard({ file, generatedImage, isGenerating, onRemoveFile }: PreviewCardProps) {
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setPreviewUrl(null)
    }
  }, [file])

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a')
      link.href = generatedImage
      link.download = 'ai-professional-photo.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Original Image Preview */}
      <Card className="rounded-2xl shadow-2xl bg-white/90 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-500" />
            Twoje Oryginalne Zdjęcie
          </CardTitle>
        </CardHeader>
        <CardContent>
          {previewUrl ? (
            <div className="aspect-square relative overflow-hidden rounded-xl bg-gray-100 shadow-lg">
              <img
                src={previewUrl}
                alt="Original photo preview"
                className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
              />
              {/* X do usuwania zdjęcia */}
              {onRemoveFile && (
                <button
                  type="button"
                  onClick={onRemoveFile}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition"
                  aria-label="Usuń zdjęcie"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="aspect-square flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-500">Brak zdjęcia do podglądu</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generated Image Preview */}
      <Card className="rounded-2xl shadow-2xl bg-white/90 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <div className="h-5 w-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            Zdjęcie Wygenerowane przez AI
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isGenerating ? (
            <div className="aspect-square flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                  <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <p className="text-purple-600 font-medium">AI tworzy magię...</p>
                <p className="text-sm text-gray-600 mt-1">To może potrwać kilka chwil</p>
              </div>
            </div>
          ) : generatedImage ? (
            <div className="space-y-4">
              <div className="aspect-square relative overflow-hidden rounded-xl bg-gray-100 shadow-lg">
                <img
                  src={generatedImage}
                  alt="AI generated professional photo"
                  className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
                />
              </div>
              <Button 
                onClick={handleDownload}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105 transition"
                size="lg"
              >
                <Download className="h-5 w-5 mr-2" />
                Pobierz Zdjęcie
              </Button>
            </div>
          ) : (
            <div className="aspect-square flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <p className="text-gray-500">Twoje profesjonalne zdjęcie pojawi się tutaj</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}