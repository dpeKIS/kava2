import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  Coffee, 
  BarChart3, 
  Plus, 
  Clock, 
  Activity, 
  Calendar, 
  Download, 
  Award,
  TrendingUp,
  Users,
  Target
} from 'lucide-react'

const StatsPage = ({ 
  users, 
  recentActivity, 
  totalCoffees, 
  avgPerDay, 
  topDrinker, 
  mostRecent, 
  activeUsers,
  onNavigate 
}) => {
  const [timeFilter, setTimeFilter] = useState('week')

  // Funkcja do formatowania czasu Firebase Timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Nigdy'
    
    // Obsługa Firebase Timestamp
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return 'Przed chwilą'
    if (diffMins < 60) return `${diffMins} min temu`
    if (diffHours < 24) return `${diffHours} godz. temu`
    if (diffDays === 1) return 'Wczoraj'
    return `${diffDays} dni temu`
  }

  // Funkcja do eksportu danych
  const handleExport = () => {
    const csvContent = [
      ['Pozycja', 'Imię', 'Liczba kaw', 'Ostatnie skanowanie', 'Odznaka'],
      ...users.map((user, index) => [
        index + 1,
        user.name || 'Nieznany',
        user.coffeeCount || 0,
        formatTime(user.lastScan),
        user.badge || 'Nowy'
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `coffee-stats-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <Button 
          onClick={() => onNavigate('home')} 
          variant="outline"
          className="flex items-center gap-2 border-amber-300 text-amber-700 hover:bg-amber-50"
        >
          <Coffee className="w-5 h-5" />
          JavaJolt Junkies
        </Button>
        <Button 
          onClick={() => onNavigate('scan')} 
          className="bg-amber-600 hover:bg-amber-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Dodaj kawę
        </Button>
      </header>

      {/* Main Leaderboard */}
      <Card className="shadow-lg mb-8">
        <CardHeader className="bg-amber-600 text-white">
          <CardTitle className="text-2xl flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Ranking kawowy
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold text-amber-800">Ranking kofeinowy biura</h2>
              <p className="text-amber-600">Aktualizowane na bieżąco z Firebase</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={timeFilter === 'week' ? 'default' : 'outline'}
                onClick={() => setTimeFilter('week')}
                className="flex items-center gap-1"
                size="sm"
              >
                <Calendar className="w-4 h-4" />
                Ten tydzień
              </Button>
              <Button 
                onClick={handleExport}
                variant="outline"
                className="flex items-center gap-1"
                size="sm"
              >
                <Download className="w-4 h-4" />
                Eksport
              </Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-amber-50">
                <tr>
                  <th className="py-3 px-4 text-left text-amber-700 font-semibold">Pozycja</th>
                  <th className="py-3 px-4 text-left text-amber-700 font-semibold">Pracownik</th>
                  <th className="py-3 px-4 text-left text-amber-700 font-semibold">Kawy</th>
                  <th className="py-3 px-4 text-left text-amber-700 font-semibold">Ostatnie skanowanie</th>
                  <th className="py-3 px-4 text-left text-amber-700 font-semibold">Odznaka</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr 
                    key={user.id} 
                    className={`border-b border-amber-100 hover:bg-amber-25 transition-colors ${
                      index === 0 ? 'bg-amber-50 border-l-4 border-l-amber-500' :
                      index === 1 ? 'bg-gray-50 border-l-4 border-l-gray-400' :
                      index === 2 ? 'bg-orange-50 border-l-4 border-l-orange-400' : ''
                    }`}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {index === 0 && <Award className="w-5 h-5 text-amber-500" />}
                        <span className={`font-bold ${
                          index <= 2 ? 'text-amber-600' : 'text-gray-700'
                        }`}>
                          {index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-800">{user.name || 'Nieznany'}</div>
                        {user.isGoogleUser && (
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            Google User
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-700">{user.coffeeCount || 0}</span>
                        <Coffee className="w-4 h-4 text-amber-600" />
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {formatTime(user.lastScan)}
                    </td>
                    <td className="py-4 px-4">
                      <Badge 
                        variant="secondary" 
                        className={`${
                          index === 0 ? 'bg-amber-100 text-amber-800 animate-pulse' : 
                          'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {user.badge || 'Nowy'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Activity Card */}
        <Card className="shadow-lg">
          <CardHeader className="bg-amber-600 text-white">
            <CardTitle className="text-xl flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Ostatnia aktywność
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="bg-amber-100 p-2 rounded-full">
                      <Coffee className="text-amber-600 w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        {activity.userName || 'Nieznany użytkownik'} 
                        <span className="text-gray-500 font-normal"> {activity.action || 'dodał kawę'}</span>
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{formatTime(activity.timestamp)}</span>
                        <span>•</span>
                        <span>Łącznie: {activity.coffeeCount || 0} ☕</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Coffee className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>Brak aktywności</p>
                  <p className="text-sm">Dodaj pierwszą kawę!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Stats Card */}
        <Card className="shadow-lg">
          <CardHeader className="bg-amber-600 text-white">
            <CardTitle className="text-xl flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Statystyki biura
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-amber-50 p-4 rounded-lg text-center">
                <div className="flex items-center justify-center mb-2">
                  <Coffee className="w-5 h-5 text-amber-600 mr-1" />
                  <p className="text-amber-600 text-sm font-medium">Łączne kawy</p>
                </div>
                <p className="text-3xl font-bold text-amber-800">{totalCoffees || 0}</p>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-lg text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-5 h-5 text-amber-600 mr-1" />
                  <p className="text-amber-600 text-sm font-medium">Śr. dziennie</p>
                </div>
                <p className="text-3xl font-bold text-amber-800">{avgPerDay || 0}</p>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-lg text-center">
                <div className="flex items-center justify-center mb-2">
                  <Award className="w-5 h-5 text-amber-600 mr-1" />
                  <p className="text-amber-600 text-sm font-medium">Lider</p>
                </div>
                <p className="text-lg font-bold text-amber-800">
                  {topDrinker ? `${(topDrinker.name || 'Nieznany').split(' ')[0]} (${topDrinker.coffeeCount || 0})` : 'Brak'}
                </p>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-lg text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-5 h-5 text-amber-600 mr-1" />
                  <p className="text-amber-600 text-sm font-medium">Aktywni</p>
                </div>
                <p className="text-3xl font-bold text-amber-800">{activeUsers || 0}</p>
              </div>
            </div>
            
            {mostRecent && (
              <div className="mt-4 p-3 bg-amber-100 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>Ostatnia aktywność:</strong> {mostRecent.userName || 'Nieznany'} - {formatTime(mostRecent.timestamp)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default StatsPage
