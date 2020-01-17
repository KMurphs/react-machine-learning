import React, { useState, useEffect } from 'react';

import * as _d3 from 'd3';
import * as _jStat from 'jStat';

import './App.css';
import TestHistogram from './Components/Histogram/TestHistogram';

// https://stackoverflow.com/questions/53557919/call-external-javascript-function-from-react-typescript-components
// https://github.com/Microsoft/TypeScript/issues/21344
// Insert script file in public
// in this file: import * as _d3 from 'd3';
// In this file: declare global {interface Window {d3: typeof _d3;}}
// Everywhere else: window.d3.blablabla()
declare global {
  interface Window {
    d3: typeof _d3;
    jStat: typeof _jStat;
  }
}


const App: React.FC = () => {
  console.log('Version - d3: ', window.d3.version);
  console.log('Version - jStat: ', window.jStat.version);



  return (
    <div className="App">
      <header className="App-header">
        Hello from header
      </header>
      <TestHistogram />
    </div>
  );
}

export default App;
