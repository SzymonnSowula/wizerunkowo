"use client"

import React from 'react'
import { ChevronDown, Briefcase, Rocket, Building } from 'lucide-react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export type PhotoStyle = 'linkedin' | 'startup' | 'corporate' | 'cv'

interface StyleSelectorProps {
  selectedStyle: PhotoStyle
  onStyleChange: (style: PhotoStyle) => void
}

const styles = [
  {
    value: 'linkedin' as PhotoStyle,
    label: 'LinkedIn Profesjonalne',
    description: 'Klasyczny styl biznesowy, idealny do profili LinkedIn',
    icon: Briefcase,
    gradientClass: 'bg-gradient-to-br from-blue-600 to-blue-800'
  },
  {
    value: 'startup' as PhotoStyle,
    label: 'Startup Casual',
    description: 'Nowoczesny, swobodny styl dla branży tech',
    icon: Rocket,
    gradientClass: 'bg-gradient-to-br from-purple-500 to-pink-600'
  },
  {
    value: 'corporate' as PhotoStyle,
    label: 'Korporacyjne Formalne',
    description: 'Formalny styl korporacyjny dla dużych firm',
    icon: Building,
    gradientClass: 'bg-gradient-to-br from-gray-700 to-gray-900'
  },
  {
    value: 'cv' as PhotoStyle,
    label: 'Zdjęcie do CV',
    description: 'Profesjonalne zdjęcie idealne do aplikacji o pracę',
    icon: Briefcase,
    gradientClass: 'bg-gradient-to-br from-green-600 to-emerald-700'
  }
]

export function StyleSelector({ selectedStyle, onStyleChange }: StyleSelectorProps) {
  const selectedStyleData = styles.find(style => style.value === selectedStyle)
  const SelectedIcon = selectedStyleData?.icon || Briefcase

  return (
    <Card className="rounded-2xl shadow-2xl bg-white/90 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 text-center break-words">
          Wybierz Styl Zdjęcia
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-between h-16 px-6 text-left rounded-xl border-2 border-white/30 hover:border-white/50 transition-all duration-300 bg-white/50 backdrop-blur-sm"
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div className={`p-2 rounded-lg ${selectedStyleData?.gradientClass} text-white shrink-0`}>
                  <SelectedIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-gray-900 truncate">
                    {selectedStyleData?.label}
                  </div>
                  <div className="text-sm text-gray-600 mt-1 break-words truncate max-w-[180px] sm:max-w-none">
                    {selectedStyleData?.description}
                  </div>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-600 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent className="w-80 p-2 rounded-xl shadow-2xl bg-white/95 backdrop-blur-sm border-white/30">
            {styles.map((style) => {
              const StyleIcon = style.icon
              return (
                <DropdownMenuItem
                  key={style.value}
                  onClick={() => onStyleChange(style.value)}
                  className={`
                    p-4 rounded-lg cursor-pointer transition-all duration-200 border
                    ${selectedStyle === style.value 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'hover:bg-gray-50 border-transparent'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3 w-full min-w-0">
                    <div className={`p-2 rounded-lg ${style.gradientClass} text-white shrink-0`}>
                      <StyleIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 truncate">
                        {style.label}
                      </div>
                      <div className="text-sm text-gray-600 mt-1 break-words truncate max-w-[140px] sm:max-w-none">
                        {style.description}
                      </div>
                    </div>
                    {selectedStyle === style.value && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                    )}
                  </div>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  )
}