import { useState } from 'react'
import Home from './components/Home.jsx'
import SearchScreen from './components/SearchScreen.jsx'

function App() {
  const [screen, setScreen] = useState('home')

  if (screen === 'search') {
    return (
      <div className="app-phone">
        <SearchScreen onBack={() => setScreen('home')} />
      </div>
    )
  }

  return <Home onSearchClick={() => setScreen('search')} />
}

export default App