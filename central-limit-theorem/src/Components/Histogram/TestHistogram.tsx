import React, { useState, useEffect } from 'react';
import Histogram from './Histogram';



const TestHistogram: React.FC = () => {
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
      interval = setInterval(()=>{
        setNewChunkStart((newChunkStart: number) => {
          console.log('Tick', newChunkStart)
          const nextChunkStart = newChunkStart + chunkLength;
          return nextChunkStart;
        })
      }, 1000);
    }

    return ()=>{clearInterval(interval)}
  }, [newChunkStart])




  return (
    <div className="TestHistogram">
      <Histogram data={data.splice(newChunkStart, chunkLength)}/>
    </div>
  );
}

export default TestHistogram;
