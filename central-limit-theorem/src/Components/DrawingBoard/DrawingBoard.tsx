import React, { useEffect, useState, useRef } from 'react';

import './DrawingBoard.css';

type dataPoint = {
  price: number
}
type PropsType = {
  data: dataPoint[]
}




// https://www.d3-graph-gallery.com/graph/histogram_basic.html
const DrawingBoard: React.FC<PropsType> = (props) => {
  const d3 = window.d3;
  const id = `drawing-board-${new Date().getTime()}-${Math.round(1000*Math.random())}`;
  const idRef = React.createRef<HTMLDivElement>();



  return (
    <div className="drawing-board-wrapper">
      <div className={`drawing-board `} id={id} ref={idRef}>
        Hello from Drawing Board
      </div>
    </div>

  );
}

export default DrawingBoard;