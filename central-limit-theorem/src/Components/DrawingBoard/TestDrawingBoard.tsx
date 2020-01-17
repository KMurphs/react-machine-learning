import React, { useState, useEffect } from 'react';
import DrawingBoard from './DrawingBoard';



const TestDrawingBoard: React.FC = () => {


  return (
    <div className="TestDrawingBoard">
      <DrawingBoard data={[]}/>
    </div>
  );
}

export default TestDrawingBoard;
