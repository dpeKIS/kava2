import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Coffee, BarChart3, Smartphone, Award, User, Scan, TrendingUp, Heart } from 'lucide-react'

const HomePage = ({ users, totalCoffees, onNavigate }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4 flex items-center justify-center gap-3">
          JavaJolt Junkies <Coffee className="w-12 h-12" />
        </h1>
        <p className="text-lg text-amber-800 max-w-2xl mx-auto">
          Śledź swoje spożycie kawy w biurze ze stylem i odrobiną przyjaznej rywalizacji!
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Scan Card */}
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="bg-amber-100 p-3 rounded-full">
                <Smartphone className="text-amber-600 w-6 h-6" />
              </div>
              <CardTitle className="text-2xl text-amber-900">Szybkie skanowanie</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-amber-800 mb-6">
              Zeskanuj kod QR, aby natychmiast zarejestrować spożycie kawy!
            </CardDescription>
            
            <div className="bg-white p-4 rounded-lg border border-amber-200 mb-6 flex justify-center">
              <div className="w-48 h-48 bg-amber-50 rounded-lg flex items-center justify-center border-2 border-dashed border-amber-300">
                <div className="text-center">
                  <Coffee className="w-16 h-16 text-amber-400 mx-auto mb-2" />
                  <p className="text-amber-600 font-medium">Kod QR</p>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => onNavigate('scan')} 
              className="w-full bg-amber-600 hover:bg-amber-700"
            >
              Przejdź do skanowania
            </Button>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="bg-amber-100 p-3 rounded-full">
                <BarChart3 className="text-amber-600 w-6 h-6" />
              </div>
              <CardTitle className="text-2xl text-amber-900">Ranking</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-amber-800 mb-6">
              Zobacz kto prowadzi w wyścigu kofeinowym w twoim biurze!
            </CardDescription>
            
            <div className="mb-6 space-y-3">
              {users.map((user, index) => (
                <div key={user.id} className="flex items-center justify-between py-2 border-b border-amber-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index === 0 ? 'bg-amber-100' : 'bg-amber-50'
                    }`}>
                      {index === 0 ? (
                        <Award className="text-amber-600 w-4 h-4" />
                      ) : (
                        <span className="text-amber-600 font-medium">{index + 1}</span>
                      )}
                    </div>
                    <span className={index === 0 ? 'font-medium' : ''}>{user.name}</span>
                  </div>
                  <span className={`font-bold ${index === 0 ? 'text-amber-700' : 'text-amber-600'}`}>
                    {user.coffeeCount} ☕
                  </span>
                </div>
              ))}
            </div>
            
            <Button 
              onClick={() => onNavigate('stats')} 
              className="w-full bg-amber-600 hover:bg-amber-700"
            >
              Zobacz pełny ranking
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* How It Works Section */}
      <div className="max-w-4xl mx-auto mt-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-amber-900">Jak to działa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="text-amber-600 w-8 h-8" />
                </div>
                <h3 className="font-bold text-amber-800 mb-2">1. Zaloguj się</h3>
                <p className="text-amber-700">Użyj Google lub wybierz swoje imię</p>
              </div>
              <div className="text-center">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Scan className="text-amber-600 w-8 h-8" />
                </div>
                <h3 className="font-bold text-amber-800 mb-2">2. Skanuj</h3>
                <p className="text-amber-700">Szybko zeskanuj kod QR</p>
              </div>
              <div className="text-center">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="text-amber-600 w-8 h-8" />
                </div>
                <h3 className="font-bold text-amber-800 mb-2">3. Śledź</h3>
                <p className="text-amber-700">Obserwuj jak rośnie twój licznik kawy</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-amber-900 text-amber-100 py-6 mt-12 rounded-lg">
        <div className="container mx-auto px-4 text-center">
          <p className="flex items-center justify-center gap-2">
            Stworzone z <Heart className="w-4 h-4 text-rose-400" /> i <Coffee className="w-4 h-4 text-amber-300" /> dla miłośników kawy
          </p>
          <p className="mt-2 text-sm">JavaJolt Junkies © 2024</p>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
