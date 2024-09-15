import React from 'react';
import LoadMap from './loadMap';
import TestMap from './testMap';
import Header from './header';

const App: React.FC = () => {
  return (
    
    <div className="App" style={{ backgroundColor: 'black', color: 'black', minHeight: '100vh' }}>
      <Header /> 
      <TestMap/>
    </div>
  );
};

export default App;

