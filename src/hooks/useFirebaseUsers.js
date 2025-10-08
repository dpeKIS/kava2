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

  // Domyślni użytkownicy (fallback gdy Firebase nie działa)
  const defaultUsers = [
    { id: 'alex-johnson', name: 'Alex Johnson', email: 'alex@company.com', coffeeCount: 0, badge: 'Nowy', lastScan: null },
    { id: 'sam-wilson', name: 'Sam Wilson', email: 'sam@company.com', coffeeCount: 0, badge: 'Nowy', lastScan: null },
    { id: 'taylor-smith', name: 'Taylor Smith', email: 'taylor@company.com', coffeeCount: 0, badge: 'Nowy', lastScan: null },
    { id: 'jordan-lee', name: 'Jordan Lee', email: 'jordan@company.com', coffeeCount: 0, badge: 'Nowy', lastScan: null },
    { id: 'casey-brown', name: 'Casey Brown', email: 'casey@company.com', coffeeCount: 0, badge: 'Nowy', lastScan: null },
    { id: 'morgan-taylor', name: 'Morgan Taylor', email: 'morgan@company.com', coffeeCount: 0, badge: 'Nowy', lastScan: null }
  ];

  // Funkcja do określania odznaki na podstawie liczby kaw
  const getBadgeForCount = (count) => {
    if (count === 0) return 'Nowy'
    if (count <= 5) return 'Początkujący'
    if (count <= 15) return 'Miłośnik kawy'
    if (count <= 30) return 'Ekspert'
    if (count <= 50) return 'Mistrz kawy'
    return 'Legenda'
  };

  // Inicjalizacja domyślnych użytkowników w Firebase
  const initializeDefaultUsers = async () => {
    if (!db) return;
    
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      
      // Jeśli brak użytkowników, dodaj domyślnych
      if (usersSnapshot.empty) {
        for (const user of defaultUsers) {
          await setDoc(doc(db, 'users', user.id), {
            ...user,
            createdAt: serverTimestamp()
          });
        }
      }
    } catch (error) {
      console.error('Błąd podczas inicjalizacji użytkowników:', error);
    }
  };

  // Nasłuchiwanie zmian użytkowników lub fallback do localStorage
  useEffect(() => {
    if (db) {
      // Używaj Firebase
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
          // Fallback do localStorage
          loadFromLocalStorage();
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
          setRecentActivity(activityData.slice(0, 10));
        },
        (error) => {
          console.error('Błąd podczas pobierania aktywności:', error);
        }
      );

      // Inicjalizacja domyślnych użytkowników
      initializeDefaultUsers();

      return () => {
        unsubscribeUsers();
        unsubscribeActivity();
      };
    } else {
      // Fallback do localStorage
      loadFromLocalStorage();
    }
  }, []);

  // Fallback - ładowanie z localStorage
  const loadFromLocalStorage = () => {
    try {
      const savedUsers = localStorage.getItem('coffee-tracker-users');
      const savedActivity = localStorage.getItem('coffee-tracker-activity');
      
      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers);
        setUsers(parsedUsers.sort((a, b) => (b.coffeeCount || 0) - (a.coffeeCount || 0)));
      } else {
        setUsers(defaultUsers);
        localStorage.setItem('coffee-tracker-users', JSON.stringify(defaultUsers));
      }
      
      if (savedActivity) {
        setRecentActivity(JSON.parse(savedActivity));
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Błąd localStorage:', error);
      setUsers(defaultUsers);
      setLoading(false);
    }
  };

  // Zapisywanie do localStorage
  const saveToLocalStorage = (updatedUsers, updatedActivity) => {
    try {
      localStorage.setItem('coffee-tracker-users', JSON.stringify(updatedUsers));
      if (updatedActivity) {
        localStorage.setItem('coffee-tracker-activity', JSON.stringify(updatedActivity));
      }
    } catch (error) {
      console.error('Błąd zapisu localStorage:', error);
    }
  };

  // Dodawanie kawy
  const addCoffee = async (userId) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      const newCount = (user.coffeeCount || 0) + 1;
      const newBadge = getBadgeForCount(newCount);
      const timestamp = new Date().toISOString();

      if (db) {
        // Używaj Firebase
        const userRef = doc(db, 'users', userId);
        
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
      } else {
        // Fallback do localStorage
        const updatedUsers = users.map(u => 
          u.id === userId 
            ? { ...u, coffeeCount: newCount, badge: newBadge, lastScan: timestamp }
            : u
        ).sort((a, b) => (b.coffeeCount || 0) - (a.coffeeCount || 0));

        const newActivity = {
          id: Date.now().toString(),
          userId: userId,
          userName: user.name,
          action: 'dodał kawę',
          coffeeCount: newCount,
          timestamp: timestamp
        };

        const updatedActivity = [newActivity, ...recentActivity.slice(0, 9)];

        setUsers(updatedUsers);
        setRecentActivity(updatedActivity);
        saveToLocalStorage(updatedUsers, updatedActivity);
      }

    } catch (error) {
      console.error('Błąd podczas dodawania kawy:', error);
    }
  };

  // Dodawanie użytkownika Google
  const addGoogleUser = async (googleUser) => {
    try {
      const userId = googleUser.email.replace(/[@.]/g, '-');
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
        isGoogleUser: true
      };

      if (db) {
        // Używaj Firebase
        await setDoc(doc(db, 'users', userId), {
          ...newUser,
          createdAt: serverTimestamp()
        });
      } else {
        // Fallback do localStorage
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        saveToLocalStorage(updatedUsers);
      }

      return newUser;
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
