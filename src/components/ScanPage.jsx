import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Coffee, CheckCircle, ArrowRight, Sparkles } from 'lucide-react'
import FirebaseAuth from './FirebaseAuth'

const ScanPage = ({ users, currentUser, setCurrentUser, addCoffee, addGoogleUser, onNavigate }) => {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [confettiActive, setConfettiActive] = useState(false)

  // Funkcja do obsługi logowania Google
  const handleGoogleUser = async (googleUserData) => {
    if (googleUserData) {
      const user = await addGoogleUser(googleUserData)
      setCurrentUser(user)
    } else {
      setCurrentUser(null)
    }
  }

  // Funkcja do wyboru użytkownika z listy
  const handleEmployeeSelect = (user) => {
    setCurrentUser(user)
  }

  // Funkcja do dodania kawy
  const handleAddCoffee = async () => {
    if (currentUser) {
      await addCoffee(currentUser.id)
      setShowConfirmation(true)
      setConfettiActive(true)
      
      // Ukryj potwierdzenie po 3 sekundach
      setTimeout(() => {
        setConfettiActive(false)
      }, 1000)
    }
  }

  // Funkcja do resetowania formularza
  const resetForm = () => {
    setShowConfirmation(false)
    setCurrentUser(null)
  }

  // Funkcja do określania liczebnika
  const getOrdinal = (count) => {
    if (count === 1) return '1.'
    if (count === 2) return '2.'
    if (count === 3) return '3.'
    return `${count}.`
  }

  // Efekt konfetti
  const ConfettiEffect = () => {
    if (!confettiActive) return null

    return (
      <div className="fixed inset-0 pointer-events-none z-50">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-amber-400 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 1}s`,
              animationDuration: `${1 + Math.random()}s`
            }}
          />
        ))}
      </div>
    )
  }

  if (showConfirmation && currentUser) {
    const updatedUser = users.find(u => u.id === currentUser.id) || currentUser
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <ConfettiEffect />
        <div className="w-full max-w-md">
          <Card className="shadow-xl">
            <CardHeader className="bg-amber-600 text-white text-center">
              <Coffee className="w-12 h-12 mx-auto mb-4" />
              <CardTitle className="text-2xl">Kawa zarejestrowana!</CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-center">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="text-amber-600 w-12 h-12" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-amber-900 mb-2">
                Dziękujemy, {updatedUser.name?.split(' ')[0] || 'Użytkowniku'}!
              </h2>
              
              <p className="text-amber-800 mb-4">
                To twoja <span className="font-bold">{getOrdinal(updatedUser.coffeeCount || 0)}</span> kawa dzisiaj
              </p>
              
              <div className="flex items-center justify-center gap-2 mb-6">
                <Coffee className="text-amber-600 w-5 h-5" />
                <span className="text-2xl font-bold text-amber-700">{updatedUser.coffeeCount || 0}</span>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  {updatedUser.badge || 'Nowy'}
                </Badge>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={handleAddCoffee} 
                  className="w-full bg-amber-600 hover:bg-amber-700"
                >
                  <Coffee className="w-4 h-4 mr-2" />
                  Dodaj kolejną kawę
                </Button>
                
                <Button 
                  onClick={resetForm} 
                  variant="outline" 
                  className="w-full border-amber-300 text-amber-700 hover:bg-amber-50"
                >
                  Zmień użytkownika
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="text-center mt-6">
            <Button 
              onClick={() => onNavigate('stats')} 
              variant="link" 
              className="text-amber-700 hover:text-amber-900"
            >
              Zobacz ranking <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="bg-amber-600 text-white text-center">
            <Coffee className="w-12 h-12 mx-auto mb-4" />
            <CardTitle className="text-2xl">Zarejestruj kawę</CardTitle>
          </CardHeader>
          
          <CardContent className="p-6">
            <CardDescription className="text-amber-800 mb-6 text-center">
              Zaloguj się, aby śledzić spożycie kawy
            </CardDescription>
            
            {/* Firebase Google Auth */}
            <div className="mb-4">
              <FirebaseAuth 
                onUserChange={handleGoogleUser}
                currentUser={currentUser}
              />
            </div>
            
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-amber-200"></div>
              <span className="mx-4 text-amber-500">lub</span>
              <div className="flex-grow border-t border-amber-200"></div>
            </div>
            
            {/* Employee List */}
            <h3 className="text-center text-amber-800 font-medium mb-4">Wybierz swoje imię</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {users.map(user => (
                <Button
                  key={user.id}
                  onClick={() => handleEmployeeSelect(user)}
                  variant="outline"
                  className="h-auto p-3 text-left border-amber-200 hover:bg-amber-50 hover:border-amber-300 transition-all duration-200"
                >
                  <div className="w-full">
                    <div className="font-medium text-amber-800">{user.name}</div>
                    <div className="text-sm text-amber-600 flex items-center gap-1">
                      <Coffee className="w-3 h-3" />
                      {user.coffeeCount || 0}
                      <Badge variant="secondary" className="ml-1 text-xs bg-amber-100 text-amber-700">
                        {user.badge || 'Nowy'}
                      </Badge>
                    </div>
                  </div>
                </Button>
              ))}
            </div>

            {currentUser && (
              <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="text-center">
                  <p className="text-amber-800 mb-3">
                    Zalogowano jako: <span className="font-medium">{currentUser.name}</span>
                  </p>
                  <Button 
                    onClick={handleAddCoffee}
                    className="w-full bg-amber-600 hover:bg-amber-700"
                  >
                    <Coffee className="w-4 h-4 mr-2" />
                    Dodaj kawę
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="text-center mt-6">
          <Button 
            onClick={() => onNavigate('home')} 
            variant="link" 
            className="text-amber-700 hover:text-amber-900"
          >
            ← Powrót do strony głównej
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ScanPage
