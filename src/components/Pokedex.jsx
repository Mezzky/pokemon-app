// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';

// eslint-disable-next-line react/prop-types
const Pokedex = ({ search }) => {
  const [pokemon, setPokemon] = useState([]);

  useEffect(() => {
    const fetchPokemon = async () => {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
      const data = await response.json();
      const pokemonDetails = await Promise.all(
        data.results.map(async (poke) => {
          const res = await fetch(poke.url);
          return res.json();
        })
      );
      setPokemon(pokemonDetails);
    };

    fetchPokemon();
  }, []);

  const filteredPokemon = pokemon.filter(poke => 
    poke.name.toLowerCase().includes(search)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {filteredPokemon.map((poke, index) => (
        <div key={index} className="border cursor-pointer p-4 rounded shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-transform">
          <h2 className="text-lg font-bold capitalize mb-2">{poke.name}</h2>
          <img src={poke.sprites.front_default} alt={poke.name} className="w-full h-auto mb-2" />
          <p className="text-sm">Type: {poke.types.map(type => type.type.name).join(', ')}</p>
        </div>
      ))}
    </div>
  );
};

export default Pokedex;
