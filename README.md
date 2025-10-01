# Pic Posh Glow – Profesjonalne Zdjęcia AI

Aplikacja webowa do generowania profesjonalnych portretów biznesowych z dowolnego zdjęcia, wykorzystująca AI (Google Gemini) oraz Supabase jako backend.

## Funkcje

- Przesyłanie własnych zdjęć (upload lub drag&drop)
- Wybór stylu zdjęcia: LinkedIn, Startup, Korporacyjne, CV
- Generowanie portretu AI w wybranym stylu
- Podgląd oryginalnego i wygenerowanego zdjęcia
- Pobieranie wygenerowanego zdjęcia
- Responsywny interfejs
- Historia wygenerowanych zdjęć (Supabase)

## Instalacja

1. Sklonuj repozytorium:
   ```sh
   git clone https://github.com/twoj-user/pic-posh-glow.git
   cd pic-posh-glow
   ```

2. Zainstaluj zależności:
   ```sh
   npm install
   ```

3. Skonfiguruj plik `.env`:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   PORT=3000
   ```

4. Uruchom frontend:
   ```sh
   npm run dev
   ```

5. Uruchom backend (API do generowania zdjęć):
   ```sh
   node supabase/functions/generate-professional-photo/index.ts
   ```

## Technologie

- React + TypeScript
- Vite
- TailwindCSS
- Supabase
- Google Gemini API
- Express (backend)

## Konfiguracja Supabase

1. Utwórz projekt w [Supabase](https://supabase.com/).
2. Skopiuj URL projektu i klucz anon do `.env`.
3. Utwórz tabele według przykładowej struktury w dokumentacji.

## Konfiguracja Google Gemini

1. Utwórz API key w Google AI Studio.
2. Skopiuj klucz do `.env` jako `GEMINI_API_KEY`.

## Jak korzystać

1. Prześlij zdjęcie.
2. Wybierz styl portretu.
3. Wygeneruj zdjęcie AI.
4. Pobierz wygenerowany portret.

## Licencja

Projekt open-source na licencji MIT.

---

**Autor:** [SzymonnSowula](https://github.com/SzymonnSowula)
