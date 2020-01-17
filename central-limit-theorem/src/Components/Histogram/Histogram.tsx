import React from 'react';

import './Histogram.css';



const Histogram: React.FC = () => {
  const id = `Histogram-${new Date().getTime()}-${Math.round(1000*Math.random())}`;

  // set the dimensions and margins of the graph
  var margin = {top: 10, right: 30, bottom: 30, left: 40},
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;


  return (
    <div className={`Histogram `} id={id}>
    </div>
  );
}

export default Histogram;