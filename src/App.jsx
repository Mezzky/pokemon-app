// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Pokedex from './components/Pokedex';
import PokemonDetail from './components/PokemonDetail';
import './index.css';

const App = () => {
  const [search, setSearch] = useState('');

  return (
    <Router>
      <div className='container mx-auto'>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <h1 className="text-4xl font-bold text-center my-8">Pokedex</h1>
                <input 
                  type="text"
                  placeholder='Search Pokemon...'
                  className='border rounded p-2 w-full mb-4'
                  value={search}
                  onChange={(e) => setSearch(e.target.value.toLowerCase())}
                />
                <Pokedex search={search}/>
              </>
            }
          />
          <Route path="/pokemon/:id" element={<PokemonDetail />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
