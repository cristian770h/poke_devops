import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import PokemonCard from './components/pokemonCard'

function App() {
  const [pokemons, setPokemons] = useState([])
  const [isOnline, setIsOnline] = useState(globalThis.navigator.onLine);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=30')
        const results = response.data.results
        
        const detailedPokemons = await Promise.all(
          results.map(async (p) => {
            const detail = await axios.get(p.url)
            return detail.data
          })
        )
        setPokemons(detailedPokemons)
      } catch (error) {
        console.error("Error cargando pokemons", error)
      }
    }
    fetchPokemons()

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    globalThis.addEventListener('online', handleOnline);
    globalThis.addEventListener('offline', handleOffline);

    return () => {
      globalThis.removeEventListener('online', handleOnline);
      globalThis.removeEventListener('offline', handleOffline);
    };
  }, [])

  const handleNotify = (pokemonName) => {
    if (!("Notification" in globalThis)) {
      console.log("Este navegador no soporta notificaciones escritorio");
      return;
    }

    const spawnNotification = () => {
       // CORRECCIÓN: Quitamos "const notif =" para evitar el warning de variable no usada
       new Notification(`Has seleccionado a ${pokemonName}`, {
         body: '¡Excelente elección!',
         icon: '/pwa-192x192.png'
       });
    };

    if (Notification.permission === "granted") {
      spawnNotification();
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          spawnNotification();
        }
      });
    }
  }

  return (
    <div className="container">
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1>PokeApp DevOps</h1>
        {!isOnline && (
          <div style={{ background: '#ff4444', color: 'white', padding: '5px', borderRadius: '4px' }}>
            ⚠️ Modo Offline - Trabajando con Caché
          </div>
        )}
      </header>

      <div className="pokemon-grid">
        {pokemons.map((poke) => (
          <PokemonCard 
            key={poke.id} 
            pokemon={poke} 
            onClick={(p) => handleNotify(p.name)} 
          />
        ))}
      </div>
    </div>
  )
}

export default App