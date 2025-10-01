# System Uwierzytelniania i Premium - Konfiguracja

## Przegląd Systemu

Zaimplementowano kompletny system uwierzytelniania z limitami premium:

### 🎯 **Funkcjonalności**

- **Uwierzytelnianie użytkowników** - Rejestracja, logowanie, wylogowanie
- **System limitów** - Bezpłatni użytkownicy: 1 generowanie dziennie
- **Subskrypcje premium** - Różne poziomy dostępu
- **Śledzenie użycia** - Logowanie wszystkich działań
- **Integracja Stripe** - Płatności i dodawanie kredytów

### 📊 **Poziomy Dostępu**

| Poziom | Kredyty | Limit dzienny | Cena |
|--------|---------|---------------|------|
| **Free** | 1 | 1 generowanie | Bezpłatnie |
| **Premium** | 50/miesiąc | 10 generowań/dzień | 25 zł/miesiąc |
| **Pro** | 300/rok | 50 generowań/dzień | 240 zł/rok |

### 🗄️ **Struktura Bazy Danych**

#### Tabela `user_profiles`
- Informacje o użytkowniku
- Poziom subskrypcji
- Pozostałe kredyty
- Licznik dziennych generowań

#### Tabela `subscriptions`
- Aktywne subskrypcje
- Integracja ze Stripe
- Status płatności

#### Tabela `usage_logs`
- Log wszystkich działań
- Śledzenie zużycia kredytów
- Metadane operacji

## 🚀 **Instalacja i Konfiguracja**

### 1. Zmienne Środowiskowe

Dodaj do pliku `.env`:

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# App
VITE_APP_URL=http://localhost:5173
```

### 2. Migracje Bazy Danych

```bash
# Uruchom migracje w Supabase
supabase db push

# Lub załaduj plik SQL ręcznie w Supabase Dashboard
```

### 3. Konfiguracja Stripe

1. **Utwórz konto Stripe** na [stripe.com](https://stripe.com)
2. **Pobierz klucze API** z Dashboard → Developers → API Keys
3. **Skonfiguruj webhooki** (opcjonalnie):
   - Endpoint: `https://your-domain.com/api/stripe-webhook`
   - Events: `payment_intent.succeeded`, `invoice.payment_succeeded`

### 4. Konfiguracja Supabase

1. **Włącz RLS** (Row Level Security) dla wszystkich tabel
2. **Skonfiguruj polityki** (już zawarte w migracji)
3. **Włącz funkcje Edge** dla płatności

## 🔧 **Użycie w Komponencie**

### Sprawdzanie Limitów

```tsx
import { useAuth } from '@/contexts/AuthContext';
import GenerationLimits from '@/components/GenerationLimits';

function MyComponent() {
  const { user, userLimits, useCredits } = useAuth();

  const handleGenerate = async () => {
    if (!userLimits?.canGenerate) {
      alert('Nie możesz generować zdjęć');
      return;
    }

    // Wykonaj generowanie
    const success = await useCredits(1);
    if (success) {
      // Generowanie zakończone pomyślnie
    }
  };

  return (
    <div>
      <GenerationLimits />
      <button onClick={handleGenerate}>Generuj</button>
    </div>
  );
}
```

### Wyświetlanie Statusu Użytkownika

```tsx
import UserLimitsDisplay from '@/components/UserLimitsDisplay';

function UserDashboard() {
  return (
    <div>
      <UserLimitsDisplay showUpgradeButton={true} />
    </div>
  );
}
```

## 📱 **Komponenty UI**

### `UserLimitsDisplay`
- Wyświetla status użytkownika
- Pozostałe kredyty
- Dzisiejsze użycie
- Przycisk upgrade

### `GenerationLimits`
- Sprawdza czy można generować
- Pokazuje powody blokady
- Sugeruje akcje (kup kredyty, upgrade)

### `PaymentModal`
- Integracja ze Stripe
- Automatyczne dodawanie kredytów
- Obsługa błędów płatności

## 🔐 **Bezpieczeństwo**

- **RLS** - Użytkownicy widzą tylko swoje dane
- **Walidacja** - Sprawdzanie limitów przed każdą operacją
- **Logowanie** - Wszystkie działania są logowane
- **Szyfrowanie** - Płatności przez Stripe

## 🧪 **Testowanie**

### Test Cards Stripe
- **Sukces**: `4242 4242 4242 4242`
- **Błąd**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

### Scenariusze Testowe
1. **Rejestracja** - Sprawdź czy tworzy się profil
2. **Generowanie** - Sprawdź czy odejmuje kredyty
3. **Limity** - Sprawdź blokadę po wyczerpaniu
4. **Płatność** - Sprawdź dodawanie kredytów
5. **Reset** - Sprawdź reset dziennych limitów

## 🚨 **Rozwiązywanie Problemów**

### Częste Problemy

1. **"User not authenticated"**
   - Sprawdź czy użytkownik jest zalogowany
   - Sprawdź konfigurację Supabase

2. **"Cannot generate"**
   - Sprawdź limity użytkownika
   - Sprawdź czy są kredyty

3. **"Payment failed"**
   - Sprawdź klucze Stripe
   - Sprawdź konfigurację Edge Function

4. **"Database error"**
   - Sprawdź czy migracje zostały uruchomione
   - Sprawdź polityki RLS

### Debugowanie

```tsx
// Włącz debug w konsoli
console.log('User limits:', userLimits);
console.log('Can generate:', userLimits?.canGenerate);
```

## 📈 **Monitorowanie**

- **Supabase Dashboard** - Logi bazy danych
- **Stripe Dashboard** - Płatności i webhooki
- **Browser Console** - Błędy frontend
- **Network Tab** - Zapytania API

## 🔄 **Aktualizacje**

System jest zaprojektowany aby łatwo dodawać nowe funkcje:

1. **Nowe poziomy** - Dodaj do `getSubscriptionLimits()`
2. **Nowe limity** - Rozszerz `UserLimits` interface
3. **Nowe akcje** - Dodaj do `usage_logs` action enum
4. **Nowe płatności** - Rozszerz `PaymentModal`

## 📞 **Wsparcie**

W przypadku problemów:
1. Sprawdź logi w konsoli
2. Sprawdź konfigurację zmiennych
3. Sprawdź status Stripe/Supabase
4. Sprawdź czy migracje zostały uruchomione
