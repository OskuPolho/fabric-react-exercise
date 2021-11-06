import { useEffect, useState, useRef } from 'react';
import { fabric } from 'fabric';
import {addRect, setUpRect} from './canvasFunctions';
import './App.css';

function App() {

  const [canvas, setCanvas] = useState(null);
  const [canvasObjects, setCanvasObjects] = useState(null);
  const [rect, setRect] = useState(null);
  
  const initCanvas = () => (
    new fabric.Canvas('c', {
       height: 800,
       width: 800,
       backgroundColor: '#aaaaaa'
    })
  );

  useEffect(() => {
    const canvas = initCanvas();
    canvas.on('mouse:up', () => {
      setCanvasObjects(canvas.toObject().objects)
    })
    addRect(canvas, setRect);
    setCanvas(canvas)
    setCanvasObjects(canvas.toObject().objects)
  }, [])

  useEffect(() => { 
    if (rect) {
      setUpRect(canvas,rect);
    }
  }, [rect, canvas])

  useEffect(() => {
    // canvas object can be stored to redux
    console.log('Save to redux');
  }, [canvasObjects])
  
  const canvasRef = useRef();

  return (
    <div className="App">
      <button onClick={() => {
      }}>
        Add rectangle
      </button>
      <canvas id="c" ref={canvasRef}/>
    </div>
  );
}

export default App;