import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [pokemons, setPokemons] = useState([])

  // 1. Consumo de API (Mínimo 30 pokemons)
  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=30')
        const results = response.data.results
        
        // Obtener detalles para la imagen
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
  }, [])

  // 2. Lógica de Notificaciones Nativas
  const handleNotify = (pokemonName) => {
    // Solicitar permiso
    if (!("Notification" in window)) {
      console.log("Este navegador no soporta notificaciones escritorio");
    } else if (Notification.permission === "granted") {
      // Si ya tiene permiso, enviar notificación
      new Notification(`Has seleccionado a ${pokemonName}`);
    } else if (Notification.permission !== "denied") {
      // Pedir permiso
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(`Has seleccionado a ${pokemonName}`);
        }
      });
    }
  }

  return (
    <div className="container">
      <h1>PokeApp DevOps</h1>
      <div className="pokemon-grid">
        {pokemons.map((poke) => (
          <div 
            key={poke.id} 
            className="card" 
            onClick={() => handleNotify(poke.name)} // Clic activa notificación
          >
            <img src={poke.sprites.front_default} alt={poke.name} />
            <h3>{poke.name}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App