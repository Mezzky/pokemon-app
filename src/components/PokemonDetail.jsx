import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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

const PokemonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [evolutionChain, setEvolutionChain] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const parseEvolutionChain = useCallback((chain, evolutions = []) => {
    evolutions.push({
      name: chain.species.name,
      url: chain.species.url,
    });

    if (chain.evolves_to.length > 0) {
      chain.evolves_to.forEach(evolution => {
        parseEvolutionChain(evolution, evolutions);
      });
    }

    setEvolutionChain(evolutions);
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Fetch pokemon details
        const pokRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!pokRes.ok) throw new Error('Failed to fetch pokemon details');
        const pokData = await pokRes.json();
        setPokemon(pokData);

        // Fetch species for description and evolution chain
        const specRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
        if (!specRes.ok) throw new Error('Failed to fetch species data');
        const specData = await specRes.json();
        setSpecies(specData);

        // Fetch evolution chain
        if (specData.evolution_chain?.url) {
          const evoRes = await fetch(specData.evolution_chain.url);
          if (!evoRes.ok) throw new Error('Failed to fetch evolution chain');
          const evoData = await evoRes.json();
          parseEvolutionChain(evoData.chain);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching details:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, parseEvolutionChain]);

  if (loading) return <div className="text-center text-2xl py-16">Loading...</div>;
  if (error) return <div className="text-center text-red-500 text-xl py-16">Error: {error}</div>;
  if (!pokemon) return <div className="text-center text-xl py-16">Pokemon not found</div>;

  const description = species?.flavor_text_entries
    ?.find(entry => entry.language.name === 'en')
    ?.flavor_text.replace(/\f/g, ' ') || 'No description available';

  const stats = pokemon.stats.reduce((acc, stat) => {
    acc[stat.stat.name] = stat.base_stat;
    return acc;
  }, {});

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
      >
        ← Back
      </button>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image */}
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-4xl font-bold capitalize mb-2">{pokemon.name}</h1>
              <p className="text-gray-500 mb-4">#{String(pokemon.id).padStart(3, '0')}</p>
              <img
                src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                alt={pokemon.name}
                className="w-64 h-64 object-contain"
              />
            </div>

            {/* Basic Info */}
            <div className="flex flex-col justify-center">
              {/* Types */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-3">Types</h2>
                <div className="flex gap-3 flex-wrap">
                  {pokemon.types.map(type => (
                    <span
                      key={type.type.name}
                      className={`${typeColors[type.type.name]} text-white px-4 py-2 rounded-full font-semibold capitalize`}
                    >
                      {type.type.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Physical Attributes */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-3">Physical Attributes</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-100 p-4 rounded">
                    <p className="text-gray-600 text-sm">Height</p>
                    <p className="text-xl font-bold">{(pokemon.height / 10).toFixed(1)} m</p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded">
                    <p className="text-gray-600 text-sm">Weight</p>
                    <p className="text-xl font-bold">{(pokemon.weight / 10).toFixed(1)} kg</p>
                  </div>
                </div>
              </div>

              {/* Abilities */}
              <div>
                <h2 className="text-2xl font-bold mb-3">Abilities</h2>
                <div className="space-y-2">
                  {pokemon.abilities.map(ability => (
                    <div key={ability.ability.name} className="bg-gray-100 p-3 rounded">
                      <p className="font-semibold capitalize">{ability.ability.name}</p>
                      {ability.is_hidden && <p className="text-sm text-orange-600 font-bold">Hidden Ability</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {description && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Pokedex Entry</h2>
            <p className="text-lg text-gray-700 leading-relaxed">{description}</p>
          </div>
        )}

        {/* Stats */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-6">Base Stats</h2>
          <div className="space-y-4">
            {Object.entries(stats).map(([statName, value]) => (
              <div key={statName}>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold capitalize">{statName.replace('-', ' ')}</span>
                  <span className="font-bold">{value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      value > 100 ? 'bg-green-500' : value > 75 ? 'bg-yellow-500' : 'bg-orange-500'
                    }`}
                    style={{ width: `${(value / 150) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Evolution Chain */}
        {evolutionChain.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Evolution Chain</h2>
            <div className="flex flex-wrap gap-6 justify-center">
              {evolutionChain.map((evolution, index) => (
                <div key={index} className="text-center">
                  <button
                    onClick={() => {
                      const evoId = evolution.url.split('/').filter(Boolean).pop();
                      navigate(`/pokemon/${evoId}`);
                    }}
                    className="hover:opacity-75 transition"
                  >
                    <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evolution.url.split('/').filter(Boolean).pop()}.png`}
                        alt={evolution.name}
                        className="w-24 h-24 object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                    <p className="font-semibold capitalize text-blue-600 hover:underline">{evolution.name}</p>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PokemonDetail;
