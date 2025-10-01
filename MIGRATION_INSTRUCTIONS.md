# Instrukcje Migracji Bazy Danych

## Problem
Masz już tabelę `users` w bazie danych, a ja stworzyłem `user_profiles` jako osobną tabelę. To powoduje konflikty i duplikację danych.

## Rozwiązanie
Rozszerzę istniejącą tabelę `users` zamiast tworzenia nowej tabeli `user_profiles`.

## Co zostało zrobione

### 1. ✅ Usunięto stary plik migracji
- Usunięto `001_create_user_tables.sql` (który tworzył `user_profiles`)

### 2. ✅ Stworzono nową migrację
- `001_extend_existing_users_table.sql` - rozszerza istniejącą tabelę `users`

### 3. ✅ Zaktualizowano kod
- `UserService` - używa tabeli `users` zamiast `user_profiles`
- `types.ts` - zaktualizowano typy dla tabeli `users`
- `stripe-webhook` - używa tabeli `users`

## Nowa struktura tabeli `users`

```sql
users:
- id (uuid, primary key) - istniejące
- email (text) - istniejące  
- created_at (timestamp) - istniejące
- full_name (text) - NOWE
- avatar_url (text) - NOWE
- subscription_tier (text) - NOWE
- credits_remaining (integer) - NOWE
- daily_generations_used (integer) - NOWE
- last_generation_date (timestamptz) - NOWE
- updated_at (timestamptz) - NOWE
```

## Jak uruchomić migrację

### Opcja 1: Przez Supabase CLI
```bash
cd C:\Users\SXY\wizerunkowo
supabase db push
```

### Opcja 2: Przez Supabase Dashboard
1. Otwórz Supabase Dashboard
2. Przejdź do SQL Editor
3. Skopiuj zawartość pliku `supabase/migrations/001_extend_existing_users_table.sql`
4. Wklej i uruchom

## Co się stanie po migracji

### ✅ Istniejące dane
- Wszystkie istniejące użytkownicy zachowają swoje dane
- Dodane zostaną nowe kolumny z wartościami domyślnymi:
  - `subscription_tier = 'free'`
  - `credits_remaining = 1`
  - `daily_generations_used = 0`

### ✅ Nowe funkcje
- System limitów premium
- Śledzenie kredytów
- Integracja ze Stripe
- Automatyczne tworzenie użytkowników

### ✅ Bezpieczeństwo
- Row Level Security (RLS) dla nowych tabel
- Polityki dostępu dla użytkowników
- Automatyczne triggery

## Sprawdzenie po migracji

### 1. Sprawdź strukturę tabeli
```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;
```

### 2. Sprawdź dane użytkowników
```sql
SELECT id, email, subscription_tier, credits_remaining, daily_generations_used
FROM users 
LIMIT 5;
```

### 3. Sprawdź nowe tabele
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('subscriptions', 'usage_logs', 'payment_intents');
```

## Ewentualne problemy

### Problem: "Column already exists"
- **Przyczyna**: Kolumna już istnieje w tabeli
- **Rozwiązanie**: Użyj `ADD COLUMN IF NOT EXISTS` (już dodane w migracji)

### Problem: "Permission denied"
- **Przyczyna**: Brak uprawnień do modyfikacji tabeli
- **Rozwiązanie**: Uruchom jako superuser lub sprawdź uprawnienia

### Problem: "Foreign key constraint"
- **Przyczyna**: Konflikt z istniejącymi kluczami obcymi
- **Rozwiązanie**: Sprawdź czy nie ma konfliktów z `photos` i `api_logs`

## Rollback (jeśli coś pójdzie nie tak)

### Usuń nowe kolumny
```sql
ALTER TABLE users DROP COLUMN IF EXISTS full_name;
ALTER TABLE users DROP COLUMN IF EXISTS avatar_url;
ALTER TABLE users DROP COLUMN IF EXISTS subscription_tier;
ALTER TABLE users DROP COLUMN IF EXISTS credits_remaining;
ALTER TABLE users DROP COLUMN IF EXISTS daily_generations_used;
ALTER TABLE users DROP COLUMN IF EXISTS last_generation_date;
ALTER TABLE users DROP COLUMN IF EXISTS updated_at;
```

### Usuń nowe tabele
```sql
DROP TABLE IF EXISTS subscriptions;
DROP TABLE IF EXISTS usage_logs;
DROP TABLE IF EXISTS payment_intents;
```

## Po udanej migracji

1. **Testuj aplikację** - sprawdź czy wszystko działa
2. **Sprawdź logi** - czy nie ma błędów w konsoli
3. **Testuj płatności** - sprawdź integrację ze Stripe
4. **Testuj limity** - sprawdź czy system limitów działa

## Wsparcie

Jeśli napotkasz problemy:
1. Sprawdź logi w Supabase Dashboard
2. Sprawdź logi w konsoli przeglądarki
3. Sprawdź czy wszystkie zmienne środowiskowe są ustawione
4. Sprawdź czy Edge Functions zostały wdrożone

## Podsumowanie

Ta migracja:
- ✅ Zachowuje istniejące dane
- ✅ Dodaje nowe funkcje premium
- ✅ Utrzymuje kompatybilność z istniejącym kodem
- ✅ Jest bezpieczna i odwracalna
