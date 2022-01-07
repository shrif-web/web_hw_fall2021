import React, { useState, useCallback } from 'react';
import logo from '../logo.svg';
import '../App.css';

function App3() {
  let [a, updater]=useState(10);
  const onClick = () => {
    updater(x => x+1);
    console.log(a);
  }

  return (
    <>
      <div className="App" onClick={onClick}>
        {a}
      </div>
    </>
  );
}

export default React.memo(App3);