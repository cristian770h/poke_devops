import { useState, useEffect } from 'react';

export const usePokemonData = () => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lógica de Notificación Nativa [cite: 14, 15, 16]
  const triggerNotification = (pokemonName) => {
    if (!("Notification" in window)) return;

    const send = () => {
      // No usar alert(), usar new Notification [cite: 16]
      new Notification("¡Has seleccionado un Pokémon!", {
        body: `Has seleccionado a ${pokemonName}`,
        icon: '/pokedex-icon.png', // Asegúrate de tener este icono
        vibrate: [200, 100, 200]
      });
    };

    if (Notification.permission === "granted") {
      send();
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") send();
      });
    }
  };

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        // Traemos 50 para asegurar el mínimo de 30 [cite: 6]
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=50');
        const data = await res.json();
        
        // Mapeo detallado para obtener imágenes de alta calidad
        const detailed = await Promise.all(
          data.results.map(async (p) => {
            const r = await fetch(p.url);
            return r.json();
          })
        );
        setPokemons(detailed);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPokemons();
  }, []);

  return { pokemons, loading, triggerNotification };
};