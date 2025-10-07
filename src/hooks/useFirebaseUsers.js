import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  increment, 
  serverTimestamp,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export const useFirebaseUsers = () => {
  const [users, setUsers] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  // Funkcja do określania odznaki na podstawie liczby kaw
  const getBadgeForCount = (count) => {
    if (count === 0) return 'Nowy'
    if (count <= 5) return 'Początkujący'
    if (count <= 15) return 'Miłośnik kawy'
    if (count <= 30) return 'Ekspert'
    if (count <= 50) return 'Mistrz kawy'
    return 'Legenda'
  };

  // Inicjalizacja domyślnych użytkowników
  const initializeDefaultUsers = async () => {
    const defaultUsers = [
      { id: 'alex-johnson', name: 'Alex Johnson', email: 'alex@company.com' },
      { id: 'sam-wilson', name: 'Sam Wilson', email: 'sam@company.com' },
      { id: 'taylor-smith', name: 'Taylor Smith', email: 'taylor@company.com' },
      { id: 'jordan-lee', name: 'Jordan Lee', email: 'jordan@company.com' },
      { id: 'casey-brown', name: 'Casey Brown', email: 'casey@company.com' },
      { id: 'morgan-taylor', name: 'Morgan Taylor', email: 'morgan@company.com' }
    ];

    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      
      // Jeśli brak użytkowników, dodaj domyślnych
      if (usersSnapshot.empty) {
        for (const user of defaultUsers) {
          await setDoc(doc(db, 'users', user.id), {
            ...user,
            coffeeCount: 0,
            badge: 'Nowy',
            lastScan: null,
            createdAt: serverTimestamp()
          });
        }
      }
    } catch (error) {
      console.error('Błąd podczas inicjalizacji użytkowników:', error);
    }
  };

  // Nasłuchiwanie zmian użytkowników
  useEffect(() => {
    const unsubscribeUsers = onSnapshot(
      query(collection(db, 'users'), orderBy('coffeeCount', 'desc')),
      (snapshot) => {
        const usersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersData);
        setLoading(false);
      },
      (error) => {
        console.error('Błąd podczas pobierania użytkowników:', error);
        setLoading(false);
      }
    );

    // Nasłuchiwanie aktywności
    const unsubscribeActivity = onSnapshot(
      query(collection(db, 'activity'), orderBy('timestamp', 'desc')),
      (snapshot) => {
        const activityData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRecentActivity(activityData.slice(0, 10)); // Ostatnie 10 aktywności
      }
    );

    // Inicjalizacja domyślnych użytkowników
    initializeDefaultUsers();

    return () => {
      unsubscribeUsers();
      unsubscribeActivity();
    };
  }, []);

  // Dodawanie kawy
  const addCoffee = async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      const user = users.find(u => u.id === userId);
      
      if (!user) return;

      const newCount = user.coffeeCount + 1;
      const newBadge = getBadgeForCount(newCount);

      // Aktualizuj użytkownika
      await updateDoc(userRef, {
        coffeeCount: increment(1),
        badge: newBadge,
        lastScan: serverTimestamp()
      });

      // Dodaj aktywność
      await setDoc(doc(collection(db, 'activity')), {
        userId: userId,
        userName: user.name,
        action: 'dodał kawę',
        coffeeCount: newCount,
        timestamp: serverTimestamp()
      });

    } catch (error) {
      console.error('Błąd podczas dodawania kawy:', error);
    }
  };

  // Dodawanie użytkownika Google
  const addGoogleUser = async (googleUser) => {
    try {
      const userId = googleUser.email.replace('@', '-').replace('.', '-');
      const existingUser = users.find(u => u.email === googleUser.email);
      
      if (existingUser) {
        return existingUser;
      }

      const newUser = {
        id: userId,
        name: googleUser.name,
        email: googleUser.email,
        coffeeCount: 0,
        badge: 'Nowy',
        lastScan: null,
        isGoogleUser: true,
        createdAt: serverTimestamp()
      };

      await setDoc(doc(db, 'users', userId), newUser);
      return { ...newUser, id: userId };
    } catch (error) {
      console.error('Błąd podczas dodawania użytkownika Google:', error);
      return null;
    }
  };

  // Obliczanie statystyk
  const totalCoffees = users.reduce((sum, user) => sum + (user.coffeeCount || 0), 0);
  const avgPerDay = Math.round(totalCoffees / 7); // Zakładając tydzień
  const topDrinker = users.length > 0 ? users[0] : null;
  const mostRecent = recentActivity.length > 0 ? recentActivity[0] : null;
  const activeUsers = users.filter(user => (user.coffeeCount || 0) > 0).length;

  return {
    users,
    recentActivity,
    loading,
    addCoffee,
    addGoogleUser,
    totalCoffees,
    avgPerDay,
    topDrinker,
    mostRecent,
    activeUsers
  };
};
