import React, { useState } from 'react';
import logo from '../logo.svg';
import '../App.css';
import App3 from './App3';

function App2() {
  let [a, updater]=useState(10);
  const onClick = () => {
    updater(++a);
    console.log(a);
  }

  return (
    <>
      <div className="App" onClick={onClick}>
        {a}
      </div>
      <App3 />
    </>
  );
}

export default App2;

