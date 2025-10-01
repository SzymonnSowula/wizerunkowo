# Stripe Checkout Setup

## Przegląd

Aplikacja używa teraz oficjalnego Stripe Checkout zamiast customowego formularza płatności. To zapewnia lepsze bezpieczeństwo, zgodność z PCI i łatwiejszą obsługę różnych metod płatności.

## Konfiguracja

### 1. Zmienne środowiskowe

Dodaj do `.env`:

```env
# Stripe Keys
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App URL
VITE_APP_URL=http://localhost:3000
```

### 2. Tworzenie produktów i cen w Stripe

#### One-time payments (jednorazowe płatności)

```bash
# 5 zdjęć - 29 zł
stripe products create --name="Pakiet 5 Zdjęć" --description="5 profesjonalnych zdjęć AI"
stripe prices create --unit-amount=2900 --currency=pln --product=prod_XXX

# 10 zdjęć - 49 zł  
stripe products create --name="Pakiet 10 Zdjęć" --description="10 profesjonalnych zdjęć AI"
stripe prices create --unit-amount=4900 --currency=pln --product=prod_XXX

# 25 zdjęć - 99 zł
stripe products create --name="Pakiet 25 Zdjęć" --description="25 profesjonalnych zdjęć AI"
stripe prices create --unit-amount=9900 --currency=pln --product=prod_XXX
```

#### Subskrypcje

```bash
# Miesięczna - 25 zł
stripe products create --name="Subskrypcja Miesięczna" --description="50 zdjęć miesięcznie"
stripe prices create --unit-amount=2500 --currency=pln --recurring[interval]=month --product=prod_XXX

# Roczna - 240 zł (20 zł/miesiąc)
stripe products create --name="Subskrypcja Roczna" --description="600 zdjęć rocznie"
stripe prices create --unit-amount=24000 --currency=pln --recurring[interval]=year --product=prod_XXX
```

### 3. Aktualizacja Price IDs w kodzie

Zastąp placeholder Price IDs w `src/pages/PricingPage.tsx`:

```typescript
priceId: 'price_1ABC123...', // Rzeczywisty Price ID z Stripe
```

### 4. Konfiguracja Webhook

1. W Stripe Dashboard → Webhooks
2. Dodaj endpoint: `https://your-project.supabase.co/functions/v1/stripe-webhook`
3. Wybierz events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `invoice.payment_succeeded`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

## Architektura

### Komponenty

- **CheckoutService** (`src/services/checkoutService.ts`) - Główny serwis do obsługi Checkout
- **PaymentModal** - Uproszczony modal z przekierowaniem do Stripe
- **PaymentSuccessPage** - Strona sukcesu z weryfikacją sesji

### Edge Functions

- **create-checkout-session** - Tworzy sesję Checkout w Stripe
- **get-checkout-session** - Pobiera szczegóły sesji
- **stripe-webhook** - Obsługuje webhook events

### Przepływ płatności

1. Użytkownik wybiera plan w `PricingPage`
2. Kliknięcie przycisku otwiera `PaymentModal`
3. Modal przekierowuje do Stripe Checkout
4. Użytkownik płaci na stronie Stripe
5. Stripe przekierowuje z powrotem do `PaymentSuccessPage`
6. Webhook aktualizuje kredyty użytkownika

## Zalety Stripe Checkout

- ✅ **Bezpieczeństwo** - Pełna zgodność z PCI DSS
- ✅ **Metody płatności** - Karty, Apple Pay, Google Pay, BLIK
- ✅ **Lokalizacja** - Automatyczne wykrywanie języka i waluty
- ✅ **Mobile-first** - Responsywny design
- ✅ **SCA** - Strong Customer Authentication
- ✅ **Mniej kodu** - Brak potrzeby customowych formularzy

## Testowanie

### Test cards

```
4242 4242 4242 4242 - Visa (sukces)
4000 0000 0000 0002 - Visa (odrzucona)
4000 0000 0000 9995 - Visa (niewystarczające środki)
```

### Testowanie webhook lokalnie

```bash
stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook
```

## Produkcja

1. Przełącz na live keys w Stripe
2. Zaktualizuj webhook URL na produkcji
3. Przetestuj pełny przepływ płatności
4. Skonfiguruj monitoring i alerty

## Troubleshooting

### Częste problemy

1. **"Price ID not found"** - Sprawdź czy Price ID jest poprawny
2. **Webhook nie działa** - Sprawdź URL i secret
3. **CORS errors** - Sprawdź konfigurację CORS w Edge Functions
4. **Metadata nie przekazuje się** - Sprawdź czy user_id jest w sesji

### Logi

Sprawdź logi w:
- Supabase Dashboard → Functions → Logs
- Stripe Dashboard → Webhooks → Logs
