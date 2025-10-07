# JavaJolt Junkies - Coffee Tracker z Firebase

Profesjonalna aplikacja do śledzenia spożycia kawy w biurze z prawdziwą bazą danych Firebase, autentykacją Google i systemem rankingu w czasie rzeczywistym.

## 🚀 Nowe funkcjonalności Firebase

### ✅ Integracja z Firebase:
- **Firestore Database** - wszystkie dane przechowywane w chmurze
- **Firebase Authentication** - prawdziwe logowanie Google
- **Real-time Updates** - automatyczne aktualizacje bez odświeżania
- **Persistent Data** - dane zachowują się między sesjami
- **Cloud Security** - bezpieczne przechowywanie danych

### 🔥 Funkcjonalności Firebase:
- **Automatyczna synchronizacja** - zmiany widoczne natychmiast dla wszystkich
- **Offline Support** - aplikacja działa nawet bez internetu
- **Scalable Backend** - obsługa dowolnej liczby użytkowników
- **Analytics** - śledzenie użytkowania aplikacji
- **Security Rules** - kontrola dostępu do danych

## 🛠️ Konfiguracja Firebase

### 1. Ustawienie Firebase Config
Edytuj plik `src/lib/firebase.js` i zastąp konfigurację swoimi danymi:

```javascript
const firebaseConfig = {
  apiKey: "twój-api-key",
  authDomain: "kava-tracker.firebaseapp.com",
  projectId: "kava-tracker",
  storageBucket: "kava-tracker.firebasestorage.app",
  messagingSenderId: "twój-sender-id",
  appId: "twój-app-id",
  measurementId: "twój-measurement-id"
};
```

### 2. Włączenie usług Firebase
W [Firebase Console](https://console.firebase.google.com/):

1. **Authentication** → Sign-in method → Google (włącz)
2. **Firestore Database** → Create database → Start in test mode
3. **Analytics** → Enable Google Analytics (opcjonalne)

### 3. Struktura bazy danych Firestore

**Kolekcja `users`:**
```
{
  id: "alex-johnson",
  name: "Alex Johnson",
  email: "alex@company.com",
  coffeeCount: 5,
  badge: "Miłośnik kawy",
  lastScan: timestamp,
  isGoogleUser: false,
  createdAt: timestamp
}
```

**Kolekcja `activity`:**
```
{
  userId: "alex-johnson",
  userName: "Alex Johnson",
  action: "dodał kawę",
  coffeeCount: 5,
  timestamp: timestamp
}
```

## 🎯 Domyślni użytkownicy

Aplikacja automatycznie tworzy 6 domyślnych użytkowników:
- Alex Johnson (alex@company.com)
- Sam Wilson (sam@company.com)
- Taylor Smith (taylor@company.com)
- Jordan Lee (jordan@company.com)
- Casey Brown (casey@company.com)
- Morgan Taylor (morgan@company.com)

Wszyscy zaczynają z 0 kaw i odznaką "Nowy".

## 🏆 System odznak (automatyczny)

Odznaki przyznawane na podstawie liczby kaw:
- **Nowy** - 0 kaw
- **Początkujący** - 1-5 kaw
- **Miłośnik kawy** - 6-15 kaw
- **Ekspert** - 16-30 kaw
- **Mistrz kawy** - 31-50 kaw
- **Legenda** - 50+ kaw

## 🚀 Uruchomienie

```bash
# Instalacja zależności
pnpm install

# Uruchomienie serwera deweloperskiego
pnpm run dev

# Budowanie do produkcji
pnpm run build
```

## 📱 Jak używać

1. **Logowanie Google** - kliknij "Zaloguj się przez Google" dla prawdziwej autentykacji
2. **Wybór z listy** - lub wybierz domyślnego użytkownika
3. **Dodawanie kaw** - każde kliknięcie zapisuje się w Firebase
4. **Real-time ranking** - zobacz zmiany natychmiast
5. **Eksport danych** - pobierz CSV z aktualnych danych

## 🔧 Technologie

- **React 19** - nowoczesny frontend
- **Firebase 12** - backend as a service
- **Firestore** - NoSQL database
- **Firebase Auth** - autentykacja użytkowników
- **Tailwind CSS** - stylowanie
- **shadcn/ui** - komponenty UI
- **Lucide Icons** - ikony
- **Vite** - bundler

## 📊 Funkcje Firebase

### Real-time Updates
Wszystkie zmiany synchronizują się automatycznie między urządzeniami bez odświeżania strony.

### Offline Support
Aplikacja działa offline i synchronizuje dane po przywróceniu połączenia.

### Security Rules (przykład)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null;
    }
    match /activity/{activityId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🎨 Design

Aplikacja zachowuje profesjonalny design z dodatkowymi elementami Firebase:
- Wskaźniki ładowania podczas synchronizacji
- Oznaczenia użytkowników Google
- Real-time aktualizacje statystyk
- Offline/online status

## 📝 Deployment

### Firebase Hosting
```bash
# Instalacja Firebase CLI
npm install -g firebase-tools

# Logowanie
firebase login

# Inicjalizacja
firebase init hosting

# Deploy
firebase deploy
```

### Inne platformy
Aplikacja działa na Vercel, Netlify, GitHub Pages po zbudowaniu.

## 🔒 Bezpieczeństwo

- Wszystkie dane chronione przez Firebase Security Rules
- Autentykacja Google OAuth 2.0
- HTTPS wymuszony przez Firebase
- Walidacja danych po stronie serwera

## 📈 Analytics

Firebase Analytics automatycznie śledzi:
- Liczba aktywnych użytkowników
- Najpopularniejsze funkcje
- Czas spędzony w aplikacji
- Konwersje (dodawanie kaw)

Aplikacja jest teraz w pełni funkcjonalna z prawdziwą bazą danych i gotowa do użytkowania w środowisku produkcyjnym!
