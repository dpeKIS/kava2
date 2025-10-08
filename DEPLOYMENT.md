# 🚀 Deployment na GitHub Pages

Kompletny przewodnik wdrażania aplikacji Coffee Tracker na GitHub Pages.

## 📋 Wymagania wstępne

- Konto GitHub
- Git zainstalowany lokalnie
- Node.js i pnpm/npm

## 🔧 Konfiguracja Firebase (opcjonalna)

### 1. Ustawienie Firebase
Jeśli chcesz używać Firebase, edytuj `src/lib/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "twój-prawdziwy-api-key",
  authDomain: "kava-tracker.firebaseapp.com", 
  projectId: "kava-tracker",
  storageBucket: "kava-tracker.firebasestorage.app",
  messagingSenderId: "twój-sender-id",
  appId: "twój-app-id",
  measurementId: "twój-measurement-id"
};
```

### 2. Bez Firebase
Aplikacja działa bez Firebase używając localStorage - nie musisz nic zmieniać!

## 🚀 Deployment na GitHub Pages

### Metoda 1: Automatyczny deployment z GitHub Actions

#### Krok 1: Przygotowanie repozytorium
```bash
# Stwórz nowe repozytorium na GitHub
# Sklonuj projekt lokalnie
git clone https://github.com/twoja-nazwa/coffee-tracker.git
cd coffee-tracker

# Skopiuj pliki aplikacji do repozytorium
# (skopiuj zawartość folderu coffee-tracker)

# Dodaj pliki do git
git add .
git commit -m "Initial commit - Coffee Tracker app"
git push origin main
```

#### Krok 2: Konfiguracja Vite dla GitHub Pages
Edytuj `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/coffee-tracker/', // Nazwa twojego repozytorium
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

#### Krok 3: Dodanie GitHub Actions
Stwórz `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm install

    - name: Build
      run: npm run build

    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

#### Krok 4: Włączenie GitHub Pages
1. Idź do Settings repozytorium
2. Scroll do "Pages"
3. Source: "Deploy from a branch"
4. Branch: "gh-pages"
5. Folder: "/ (root)"
6. Save

### Metoda 2: Ręczny deployment

#### Krok 1: Budowanie aplikacji
```bash
# Zainstaluj zależności
npm install

# Zbuduj aplikację
npm run build
```

#### Krok 2: Deployment przez gh-pages
```bash
# Zainstaluj gh-pages
npm install --save-dev gh-pages

# Dodaj script do package.json
"scripts": {
  "deploy": "gh-pages -d dist"
}

# Deploy
npm run deploy
```

## 🔧 Konfiguracja dla różnych ścieżek

### Subdomena GitHub Pages
Jeśli używasz `username.github.io`, ustaw w `vite.config.js`:
```javascript
base: '/coffee-tracker/'
```

### Własna domena
Jeśli masz własną domenę, ustaw:
```javascript
base: '/'
```

## 📱 Testowanie lokalnie

```bash
# Serwer deweloperski
npm run dev

# Podgląd buildu
npm run build
npm run preview
```

## 🔒 Zmienne środowiskowe (dla Firebase)

### GitHub Secrets
1. Idź do Settings → Secrets and variables → Actions
2. Dodaj secrets:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - itd.

### Aktualizacja firebase.js
```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // ...
};
```

## 🎯 Gotowe przykłady

### package.json scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "gh-pages -d dist"
  }
}
```

### vite.config.js kompletny
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/coffee-tracker/' : '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
```

## 🔍 Rozwiązywanie problemów

### Błąd 404 na GitHub Pages
- Sprawdź czy `base` w vite.config.js jest poprawny
- Upewnij się że branch gh-pages istnieje
- Sprawdź czy pliki są w folderze dist

### Problemy z routingiem
Dodaj `404.html` w public/:
```html
<!DOCTYPE html>
<html>
<head>
  <script>
    window.location.href = '/coffee-tracker/';
  </script>
</head>
</html>
```

### Firebase nie działa
- Sprawdź konfigurację w firebase.js
- Upewnij się że domeny są dodane w Firebase Console
- Aplikacja działa bez Firebase używając localStorage

## 🎉 Po deploymencie

Twoja aplikacja będzie dostępna pod:
`https://twoja-nazwa.github.io/coffee-tracker/`

### Funkcjonalności:
✅ Pełny licznik kawy  
✅ System odznak  
✅ Ranking w czasie rzeczywistym  
✅ Eksport danych  
✅ Responsywny design  
✅ Offline support (localStorage)  
✅ Firebase integration (opcjonalne)  

## 📞 Wsparcie

Jeśli masz problemy:
1. Sprawdź GitHub Actions logs
2. Sprawdź console w przeglądarce
3. Upewnij się że wszystkie pliki są w repozytorium

Aplikacja jest w pełni funkcjonalna i gotowa do użytkowania!
