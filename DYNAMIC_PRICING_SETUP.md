# Dynamic Pricing Setup

## Przegląd

Aplikacja teraz pobiera ceny bezpośrednio ze Stripe zamiast używać sztywno zakodowanych wartości. Promocje są tylko wizualnym chwytem marketingowym.

## Konfiguracja

### 1. Stwórz produkty w Stripe Dashboard

#### One-time payments (jednorazowe płatności)

```bash
# 5 zdjęć
stripe products create --name="Pakiet 5 Zdjęć" --description="5 profesjonalnych zdjęć AI" --metadata="credits=5"
stripe prices create --unit-amount=2900 --currency=pln --product=prod_XXX

# 10 zdjęć  
stripe products create --name="Pakiet 10 Zdjęć" --description="10 profesjonalnych zdjęć AI" --metadata="credits=10"
stripe prices create --unit-amount=4900 --currency=pln --product=prod_XXX

# 25 zdjęć
stripe products create --name="Pakiet 25 Zdjęć" --description="25 profesjonalnych zdjęć AI" --metadata="credits=25"
stripe prices create --unit-amount=9900 --currency=pln --product=prod_XXX
```

#### Subskrypcje

```bash
# Miesięczna - 50 zdjęć
stripe products create --name="Subskrypcja Miesięczna" --description="50 zdjęć miesięcznie" --metadata="credits=50"
stripe prices create --unit-amount=2500 --currency=pln --recurring[interval]=month --product=prod_XXX

# Roczna - 600 zdjęć
stripe products create --name="Subskrypcja Roczna" --description="600 zdjęć rocznie" --metadata="credits=600"
stripe prices create --unit-amount=24000 --currency=pln --recurring[interval]=year --product=prod_XXX
```

### 2. Ważne: Ustaw metadata

Każdy produkt musi mieć metadata z liczbą kredytów:
- `credits=5` dla 5 zdjęć
- `credits=10` dla 10 zdjęć
- `credits=25` dla 25 zdjęć
- `credits=50` dla subskrypcji miesięcznej
- `credits=600` dla subskrypcji rocznej

### 3. Zmienne środowiskowe

Upewnij się, że masz ustawione:
```env
STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...
```

## Jak to działa

### 1. Pobieranie cen
- `get-pricing` Edge Function pobiera wszystkie aktywne ceny ze Stripe
- Mapuje je na strukturę `PricingPlan` na podstawie nazwy produktu i metadata
- Dodaje marketingowe features i CTAs

### 2. Marketingowe promocje
- `originalPrice` = cena * 1.2 (20% "oszczędności")
- `savings` = "Oszczędzasz X zł"
- To są tylko wizualne efekty - rzeczywista cena to ta ze Stripe

### 3. Caching
- Ceny są cachowane na 5 minut
- Automatyczne odświeżanie przy zmianie cen w Stripe

## Struktura danych

### PricingPlan
```typescript
{
  id: string;           // Product ID z Stripe
  name: string;         // Nazwa produktu
  description: string;  // Opis produktu
  price: {
    oneTime?: number;   // Cena jednorazowa
    monthly?: number;   // Cena miesięczna
    yearly?: number;    // Cena roczna
  };
  credits: number;      // Liczba kredytów (z metadata)
  period: string;       // 'one-time' | 'monthly' | 'yearly'
  priceId: string;      // Price ID z Stripe
  mode: string;         // 'payment' | 'subscription'
  currency: string;     // Waluta (PLN)
  originalPrice?: number; // Marketingowa cena (cena * 1.2)
  savings?: string;     // Marketingowy tekst oszczędności
  popular?: boolean;    // Czy popularny (10 zdjęć)
  bestValue?: boolean;  // Czy najlepsza oferta (roczna)
  features?: Array;     // Lista funkcji
  cta?: Object;         // Przycisk CTA
}
```

## Zalety

- ✅ **Synchronizacja** - Ceny zawsze aktualne ze Stripe
- ✅ **Elastyczność** - Łatwa zmiana cen w Stripe Dashboard
- ✅ **Marketing** - Promocje jako wizualny efekt
- ✅ **Caching** - Szybkie ładowanie
- ✅ **Fallback** - Działa nawet gdy Stripe nie działa

## Testowanie

1. Stwórz produkty w Stripe
2. Ustaw metadata z liczbą kredytów
3. Sprawdź czy ceny się ładują na stronie
4. Przetestuj płatności

## Troubleshooting

### Ceny się nie ładują
- Sprawdź czy `STRIPE_SECRET_KEY` jest ustawiony
- Sprawdź czy produkty mają metadata `credits`
- Sprawdź logi Edge Function

### Złe mapowanie planów
- Sprawdź nazwy produktów w Stripe
- Sprawdź metadata `credits`
- Sprawdź czy produkty są aktywne

### Błędy płatności
- Sprawdź czy Price IDs są poprawne
- Sprawdź czy produkty są aktywne w Stripe
