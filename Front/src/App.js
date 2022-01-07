import './App.css';
import Front from './component/Front';
import React, { memo, useState, useCallback, useEffect } from 'react';
/*import Parse from 'parse'*/
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';

function App() {
  return (
    <RecoilRoot>
      <Front />
    </RecoilRoot>
  );
}

export default App;
