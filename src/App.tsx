import React from 'react';
import './App.css';
import RGL from './page/rgl/index'
 
const App: React.FC = () => {
  return (
    <div className="App">
      <RGL isDisplay={false} />
    </div>
  );
}

export default App;
