// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import Pokedex from './components/Pokedex';
import './index.css';

const App = () => {
  const [search, setSearch] = useState('');

  return (
    <div className='container mx-auto'>
      <h1 className="text-4xl font-bold text-center my-8">Pokedex</h1>
      <input 
        type="text"
        placeholder='Search Pokemon...'
        className='border rounded p-2 w-full mb-4'
        value={search}
        onChange={(e) => setSearch(e.target.value.toLowerCase())}
      />
      <Pokedex search={search}/>
    </div>
  )
}

export default App
