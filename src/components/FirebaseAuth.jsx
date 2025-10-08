import { useState, useEffect } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { Button } from '@/components/ui/button.jsx';
import { LogIn, LogOut, User } from 'lucide-react';

const FirebaseAuth = ({ onUserChange, currentUser }) => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firebaseAvailable, setFirebaseAvailable] = useState(false);

  useEffect(() => {
    if (auth && googleProvider) {
      setFirebaseAvailable(true);
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setFirebaseUser(user);
        setLoading(false);
        
        if (user && onUserChange) {
          // Przekaż dane użytkownika do rodzica
          onUserChange({
            name: user.displayName,
            email: user.email,
            picture: user.photoURL
          });
        }
      });

      return () => unsubscribe();
    } else {
      // Firebase nie jest dostępny
      setFirebaseAvailable(false);
      setLoading(false);
    }
  }, [onUserChange]);

  const handleGoogleSignIn = async () => {
    if (!firebaseAvailable) {
      // Mock logowanie gdy Firebase nie działa
      const mockUser = {
        name: 'Demo User',
        email: 'demo@example.com',
        picture: null
      };
      
      if (onUserChange) {
        onUserChange(mockUser);
      }
      return;
    }

    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      if (onUserChange) {
        onUserChange({
          name: user.displayName,
          email: user.email,
          picture: user.photoURL
        });
      }
    } catch (error) {
      console.error('Błąd podczas logowania:', error);
      // Fallback do mock logowania
      const mockUser = {
        name: 'Demo User',
        email: 'demo@example.com',
        picture: null
      };
      
      if (onUserChange) {
        onUserChange(mockUser);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      if (firebaseAvailable && auth) {
        await signOut(auth);
      }
      if (onUserChange) {
        onUserChange(null);
      }
    } catch (error) {
      console.error('Błąd podczas wylogowania:', error);
      if (onUserChange) {
        onUserChange(null);
      }
    }
  };

  if (loading) {
    return (
      <Button disabled className="w-full">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
        Ładowanie...
      </Button>
    );
  }

  if (firebaseUser || (!firebaseAvailable && currentUser)) {
    const user = firebaseUser || currentUser;
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
          {user.photoURL || user.picture ? (
            <img 
              src={user.photoURL || user.picture} 
              alt={user.displayName || user.name}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-amber-600" />
            </div>
          )}
          <div className="flex-1">
            <p className="font-medium text-amber-800">{user.displayName || user.name}</p>
            <p className="text-sm text-amber-600">{user.email}</p>
            {!firebaseAvailable && (
              <p className="text-xs text-amber-500">Demo Mode</p>
            )}
          </div>
        </div>
        
        <Button 
          onClick={handleSignOut}
          variant="outline"
          className="w-full border-amber-300 text-amber-700 hover:bg-amber-50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Wyloguj się
        </Button>
      </div>
    );
  }

  return (
    <Button 
      onClick={handleGoogleSignIn}
      className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm"
      disabled={loading}
    >
      <div className="flex items-center justify-center gap-2">
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {firebaseAvailable ? 'Zaloguj się przez Google' : 'Demo Login (Firebase niedostępny)'}
      </div>
    </Button>
  );
};

export default FirebaseAuth;
