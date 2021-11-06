import { useEffect, useState, useRef } from 'react';
import { fabric } from 'fabric';
import {addBrControllers, widerThanTall, calculateBrControllerPositions} from './calculations';
import './App.css';

function App() {

  const [canvas, setCanvas] = useState(null);
  const [rect, setRectProperties] = useState()
  
  const initCanvas = () => (
    new fabric.Canvas('c', {
       height: 800,
       width: 800,
       backgroundColor: '#aaaaaa'
    })
    
  );

  const addRect = () => {
    const testRect = new fabric.Rect({
      height: 200,
      width: 200,
      fill: '#555555',
      rx: 0,
      ry: 0,
      noScaleCache: false,
    });
    setRectProperties(testRect);
    canvas.add(testRect);
  }

  useEffect(() => {
    const canvas = initCanvas();
    canvas.on('after:render', () => {
    })
    setCanvas(canvas)
  }, [])

  useEffect(() => { 
    if (rect) {
      addBrControllers(canvas, rect);
      const shortSide = widerThanTall(rect) ? rect.width : rect.height
      calculateBrControllerPositions(0.1, shortSide);
      rect.on('scaling', (options) => {
        rect.set({
          width: rect.width * rect.scaleX,
          height: rect.height * rect.scaleY,
          scaleX: 1,
          scaleY: 1
        })
        canvas.renderAll()
      });
    }
  }, [rect])

  const canvasRef = useRef();

  return (
    <div className="App">
      <button onClick={() => {
        addRect();
        canvas.renderAll();
      }}>
        Add rectangle
      </button>
      <canvas id="c" ref={canvasRef}/>
    </div>
  );
}

export default App;