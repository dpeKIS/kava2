import { useState } from 'react'
import { useFirebaseUsers } from './hooks/useFirebaseUsers'
import HomePage from './components/HomePage'
import ScanPage from './components/ScanPage'
import StatsPage from './components/StatsPage'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [currentUser, setCurrentUser] = useState(null)
  
  const {
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
  } = useFirebaseUsers()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-800 font-medium">Ładowanie aplikacji...</p>
        </div>
      </div>
    )
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'scan':
        return (
          <ScanPage 
            users={users}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            addCoffee={addCoffee}
            addGoogleUser={addGoogleUser}
            onNavigate={setCurrentPage}
          />
        )
      case 'stats':
        return (
          <StatsPage 
            users={users}
            recentActivity={recentActivity}
            totalCoffees={totalCoffees}
            avgPerDay={avgPerDay}
            topDrinker={topDrinker}
            mostRecent={mostRecent}
            activeUsers={activeUsers}
            onNavigate={setCurrentPage}
          />
        )
      default:
        return (
          <HomePage 
            users={users.slice(0, 3)} // Top 3 dla strony głównej
            totalCoffees={totalCoffees}
            onNavigate={setCurrentPage}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
      {renderPage()}
    </div>
  )
}

export default App
