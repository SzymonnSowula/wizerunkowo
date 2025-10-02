# Replicate API Setup - Google Nano Banana

## Przegląd

Aplikacja została skonfigurowana do używania modelu Google Nano Banana przez Replicate API do generowania profesjonalnych zdjęć. Model ten oferuje najwyższą jakość edycji obrazów dostępną w Gemini 2.5.

## Konfiguracja

### 1. Zmienne środowiskowe

Dodaj do `.env`:

```env
# Replicate API Key
VITE_REPLICATE_API_KEY=r8_your_replicate_api_key_here

# (Opcjonalnie) Supabase Function fallback
REPLICATE_API_KEY=r8_your_replicate_api_key_here
```

### 2. Uzyskanie API Key z Replicate

1. Idź do [replicate.com](https://replicate.com)
2. Zarejestruj się lub zaloguj
3. Przejdź do [Account Settings](https://replicate.com/account/api-tokens)
4. Skopiuj swój API Token (zaczyna się od `r8_`)

### 3. Dodanie klucza do Netlify

Jeśli używasz Netlify, dodaj zmienną środowiskową:
- **Name:** `VITE_REPLICATE_API_KEY`
- **Value:** `r8_your_api_key_here`

## Model Information

**Model:** Google Nano Banana  
**Version:** Latest  
**Provider:** [Replicate](https://replicate.com/google/nano-banana/api)  
**Runs:** 13.2M+  

### Parametry modelu

- **image:** Base64 encoded image lub URL
- **prompt:** Tekst opisujący transformację
- **style:** Styl zdjęcia (professional, corporate, startup, linkedin, casual, cv)
- **quality:** Standard lub High
- **aspect_ratio:** 1:1, 4:3, 3:4, 16:9, 9:16

## Dostępne style

1. **LinkedIn** - Profesjonalne zdjęcie biznesowe
2. **Startup** - Nowoczesny styl tech industry
3. **Corporate** - Formalny styl executive
4. **Casual** - Profesjonalny ale swobodny
5. **Professional** - Uniwersalny styl biznesowy
6. **CV** - Idealne zdjęcie do CV

## Architektura

### Serwisy

- **ReplicateService** (`src/services/replicateService.ts`) - Bezpośrednia integracja z Replicate API
- **PhotoGenerationService** (`src/services/photoGenerationService.ts`) - Główny serwis generowania zdjęć
- **Supabase Function** (`supabase/functions/generate-professional-photo/`) - Fallback przez Supabase

### Przepływ generowania

1. Użytkownik wybiera zdjęcie i styl
2. Aplikacja waliduje plik (format, rozmiar)
3. Zdjęcie jest konwertowane do base64
4. Wywołanie Replicate API z Google Nano Banana
5. Polling statusu generowania
6. Zwrócenie URL wygenerowanego zdjęcia

## Zalety Google Nano Banana

- ✅ **Najwyższa jakość** - Najnowszy model Google Gemini 2.5
- ✅ **Szybkość** - Optymalizacja dla edycji obrazów
- ✅ **Precyzja** - Doskonałe zachowanie detali twarzy
- ✅ **Profesjonalizm** - Specjalizacja w zdjęciach biznesowych
- ✅ **Niezawodność** - 13.2M+ udanych generacji

## Troubleshooting

### Częste problemy

1. **"REPLICATE_API_KEY is required"**
   - Sprawdź czy klucz jest dodany do `.env`
   - Upewnij się, że klucz zaczyna się od `r8_`

2. **"Generation timed out"**
   - Sprawdź połączenie internetowe
   - Spróbuj z mniejszym plikiem obrazu

3. **"Invalid image format"**
   - Używaj JPG, PNG, WebP
   - Maksymalny rozmiar: 10MB

### Logi

Sprawdź logi w konsoli przeglądarki (F12 → Console) dla szczegółów błędów.

## Koszty

Replicate pobiera opłaty za użycie modelu. Sprawdź aktualne ceny na [replicate.com/pricing](https://replicate.com/pricing).

## Alternatywy

Jeśli Replicate nie jest dostępne, aplikacja automatycznie użyje Supabase Function jako fallback.
