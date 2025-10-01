"use client"

import React, { useCallback, useRef } from 'react'
import { Check, Upload, Image as ImageIcon, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface UploadBoxProps {
  onFileUpload: (file: File) => void
  uploadedFile: File | null
  onRemoveFile: () => void
}

export function UploadBox({ onFileUpload, uploadedFile, onRemoveFile }: UploadBoxProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      onFileUpload(files[0])
    }
  }, [onFileUpload])

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      onFileUpload(files[0])
    }
  }, [onFileUpload])

  const [isDragOver, setIsDragOver] = React.useState(false)

  // Dodaj obsługę kliknięcia na cały box
  const handleBoxClick = () => {
    if (!uploadedFile && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <Card className="rounded-2xl shadow-2xl bg-white/90 backdrop-blur-sm border-2 border-dashed border-white/30 hover:border-white/50 transition-all duration-300">
      <CardContent className="p-8">
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragEnter={() => setIsDragOver(true)}
          onDragLeave={() => setIsDragOver(false)}
          onClick={handleBoxClick}
          className={`
            flex flex-col items-center justify-center min-h-[300px] cursor-pointer rounded-xl transition-all duration-300
            ${isDragOver ? 'bg-white/20 border-white/60 scale-[1.02]' : ''}
            ${uploadedFile ? 'bg-gradient-to-br from-green-50 to-blue-50' : 'hover:bg-white/10'}
          `}
        >
          {uploadedFile ? (
            <div className="flex flex-col items-center space-y-4 w-full">
              <div className="relative">
                <div className="p-4 bg-gradient-to-br from-green-500 to-blue-500 rounded-full">
                  <ImageIcon className="h-8 w-8 text-white" />
                </div>
                {/* Zielony ptaszek po poprawnym przesłaniu */}
                <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-green-500 text-white flex items-center justify-center">
                  <Check className="h-3 w-3" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">Zdjęcie Przesłane!</p>
                <p className="text-sm text-gray-600 mt-1 truncate max-w-[200px]">{uploadedFile.name}</p>
              </div>
              <label htmlFor="file-input">
                <Button variant="outline" className="mt-4">
                  Wybierz Inne Zdjęcie
                </Button>
              </label>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <div className={`
                p-6 rounded-full transition-all duration-300
                ${isDragOver ? 'bg-white/30 scale-110' : 'bg-white/20'}
              `}>
                <Upload className={`
                  h-12 w-12 transition-all duration-300 text-white
                  ${isDragOver ? 'scale-110' : ''}
                `} />
              </div>
              
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  Prześlij Swoje Zdjęcie
                </h3>
                <p className="text-gray-700">
                  Przeciągnij i upuść swoje zdjęcie tutaj lub kliknij, aby przeglądać
                </p>
                <p className="text-sm text-gray-500">
                  Obsługuje pliki JPG, PNG i WEBP do 10MB
                </p>
              </div>
              
              <label htmlFor="file-input">
                <Button 
                  size="lg" 
                  className="mt-4 bg-gradient-to-r from-pink-500 to-blue-500 text-white hover:scale-105 transition"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Wybierz Zdjęcie
                </Button>
              </label>
            </div>
          )}
          
          <input
            id="file-input"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </CardContent>
    </Card>
  )
}