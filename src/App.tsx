import React from 'react';
import './App.css';
import RGL from './page/rgl/index'
// import  Menu  from './page/test/main'
// import Test from './page/test2/index'
const App: React.FC = () => {
  return (
    <div className="App">
      <RGL isDisplay={false} />
       {/* <Test/> */}
       {/* <Menu/> */}
    </div>
  );
}

export default App;
