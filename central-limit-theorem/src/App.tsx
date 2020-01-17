import React, { useState, useEffect } from 'react';

import * as _d3 from 'd3';
import * as _jStat from 'jStat';

import './App.css';
import Histogram from './Components/Histogram/Histogram';

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
  //console.log('Version - d3: ', window.d3.version);
  //console.log('Version - jStat: ', window.jStat.version);
  const [data, setData] = useState<any>([]);
  const [newChunkStart, setNewChunkStart] = useState<number>(0);
  const chunkLength = 1000;

  
  if(data.length === 0){
    window.d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/1_OneNum.csv").then((csvData)=>{
      setData(csvData);
      console.log(csvData)
    })
  }
  

  useEffect(()=>{

    let interval: any;
    if(newChunkStart <= data.length){
      // interval = setInterval(()=>{
        setNewChunkStart((newChunkStart: number) => {
          console.log('Tick', newChunkStart)
          const nextChunkStart = newChunkStart + chunkLength;
          return nextChunkStart;
        })
      // }, 1000);
    }

    return ()=>{clearInterval(interval)}
  }, [newChunkStart])




  return (
    <div className="App">
      <header className="App-header">
        Hello from header
      </header>
      <Histogram data={data.splice(newChunkStart, chunkLength)}/>
    </div>
  );
}

export default App;
