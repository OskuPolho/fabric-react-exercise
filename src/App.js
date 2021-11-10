import { useEffect, useState, useRef } from 'react';
import { fabric } from 'fabric';
import {addRect, setUpRect} from './canvasFunctions';
import {handleUndo, handleRedo, removeFuture} from './historyFunctions';
import './App.css';

function App() {

  const [canvas, setCanvas] = useState(null);
  const [currentCanvasObject, setCurrentCanvasObject] = useState(null);
  const [history, setHistory] = useState([]);
  const [indexInHistory, setIndexInHistory] = useState(0);
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
    canvas.on('object:modified', () => {
      setCurrentCanvasObject(canvas.toObject().objects)
    })
    canvas.on('mouse:up', (e) => {
      if (e.transform.action === 'borderRadius') {
        setCurrentCanvasObject(canvas.toObject().objects)
      }
    });
    addRect(canvas, setRect);
    setCanvas(canvas)
    setCurrentCanvasObject(canvas.toObject().objects)
  }, [])

  useEffect(() => { 
    if (rect) {
      setUpRect(canvas,rect);
    }
  }, [rect, canvas])

  useEffect(() => {
    if (currentCanvasObject) {
      removeFuture(history, setHistory, indexInHistory, setIndexInHistory, currentCanvasObject);
    }
  }, [currentCanvasObject])

  useEffect(() => {
    if(canvas){
      canvas.remove(...canvas.getObjects());
      history[indexInHistory].forEach(obj => {
        if (obj.type === 'rect') {
          addRect(canvas, setRect, obj);
        }
      });
    }
  }, [indexInHistory]);
  
  const canvasRef = useRef();

  return (
    <div className="App">
      <button onClick={() => handleUndo(indexInHistory, history, setIndexInHistory)}>Undo</button>
      <button onClick={() => handleRedo(indexInHistory, setIndexInHistory)}>Redo</button>
      <canvas id="c" ref={canvasRef}/>
    </div>
  );
}

export default App;