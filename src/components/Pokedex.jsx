// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';

const typeIcons = {
  bug: '/icons/bug.svg',
  dark: '/icons/dark.svg',
  dragon: '/icons/dragon.svg',
  electric: '/icons/electric.svg',
  fairy: '/icons/fairy.svg',
  fighting: '/icons/fighting.svg',
  fire: '/icons/fire.svg',
  flying: '/icons/flying.svg',
  ghost: '/icons/ghost.svg',
  grass: '/icons/grass.svg',
  ground: '/icons/ground.svg',
  ice: '/icons/ice.svg',
  normal: '/icons/normal.svg',
  poison: '/icons/poison.svg',
  psychic: '/icons/psychic.svg',
  rock: '/icons/rock.svg',
  steel: '/icons/steel.svg',
  water: '/icons/water.svg'
};

const typeColors = {
  bug: 'bg-green-500',
  dark: 'bg-gray-800',
  dragon: 'bg-purple-600',
  electric: 'bg-yellow-400',
  fairy: 'bg-pink-400',
  fighting: 'bg-red-700',
  fire: 'bg-red-500',
  flying: 'bg-blue-300',
  ghost: 'bg-purple-800',
  grass: 'bg-green-300',
  ground: 'bg-yellow-600',
  ice: 'bg-blue-200',
  normal: 'bg-gray-400',
  poison: 'bg-purple-500',
  psychic: 'bg-pink-600',
  rock: 'bg-yellow-800',
  steel: 'bg-gray-500',
  water: 'bg-blue-500'
};

// eslint-disable-next-line react/prop-types
const Pokedex = ({ search }) => {
  const [pokemon, setPokemon] = useState([]);
  const [displayCount, setDisplayCount] = useState(40);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllPokemon = async () => {
      const allPokemon = [];
      let nextUrl = 'https://pokeapi.co/api/v2/pokemon?limit=100';

      while (nextUrl) {
        const response = await fetch(nextUrl);
        const data = await response.json();
        allPokemon.push(...data.results);
        nextUrl = data.next;
      }

      const pokemonDetails = await Promise.all(
        allPokemon.map(async (poke) => {
          const res = await fetch(poke.url);
          return res.json();
        })
      );
      setPokemon(pokemonDetails);
      setLoading(false); // Set loading to false when all data is fetched
    };

    fetchAllPokemon();
  }, []);

  const filteredPokemon = pokemon.filter(poke =>
    poke.name.toLowerCase().includes(search)
  ).slice(0, displayCount);

  const handleShowMore = () => {
    setDisplayCount(displayCount + 40);
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredPokemon.map((poke, index) => (
          <div key={index} className="border p-4 rounded shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-transform hover:cursor-pointer">
            <h2 className="text-lg font-bold capitalize mb-2">{poke.name}</h2>
            <img src={poke.sprites.front_default} alt={poke.name} className="w-full h-auto mb-2" />
            <div className="flex space-x-1">
              {poke.types.map(type => (
                <div key={type.type.name} className={`p-2 rounded-full ${typeColors[type.type.name]}`}>
                  <img src={typeIcons[type.type.name]} alt={type.type.name} className="w-6 h-6" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {displayCount < pokemon.length && (
        <div className="mt-10 flex justify-center">
          <button onClick={handleShowMore} className="w-3/5 py-4 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition text-xl font-semibold">
            Show More
          </button>
        </div>
      )}
    </div>
  );
};

export default Pokedex;
