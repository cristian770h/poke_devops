import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
// IMPORTANTE: Importamos el componente seguro que creamos
import PokemonCard from './components/pokemonCard' 

function App() {
  const [pokemons, setPokemons] = useState([])
  // (Opcional) Estado para detectar si está offline, útil para la defensa PWA
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // 1. Consumo de API (Mínimo 30 pokemons) [cite: 6]
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

    // Listeners para el estado de red (Plus para la defensa PWA)
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [])

  // 2. Lógica de Notificaciones Nativas [cite: 14]
  const handleNotify = (pokemonName) => {
    // Verificar soporte
    if (!("Notification" in window)) {
      console.log("Este navegador no soporta notificaciones escritorio");
      return;
    }

    // Función auxiliar para lanzar la notificación
    const spawnNotification = () => {
       // [cite: 16] - Usamos new Notification, no alert
       new Notification(`Has seleccionado a ${pokemonName}`, {
         body: '¡Excelente elección de Pokémon!',
         icon: '/pwa-192x192.png' // Usa el icono de tu PWA si quieres
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
        {/* Indicador visual de estado offline para la defensa [cite: 11] */}
        {!isOnline && (
          <div style={{ background: '#ff4444', color: 'white', padding: '5px', borderRadius: '4px' }}>
            ⚠️ Modo Offline - Trabajando con Caché
          </div>
        )}
      </header>

      <div className="pokemon-grid">
        {pokemons.map((poke) => (
          // USAMOS EL COMPONENTE SEGURO AQUÍ
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