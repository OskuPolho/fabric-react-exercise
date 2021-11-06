import { useEffect, useState } from 'react';
import { fabric } from 'fabric';
import './App.css';

function App() {

  const [canvas, setCanvas] = useState(null);
  const [isMouseDown, setMouseDown] = useState(false);
  const [initialMousePos, setInitialMousePos] = useState(null);
  const [rect, setRect] = useState(null);
  const [rectDimensions, setRectDimensions] = useState(null);
  
  const initCanvas = () => (
    new fabric.Canvas('c', {
       height: 800,
       width: 800,
       backgroundColor: '#aaaaaa'
    })
  );

  const calculateRectDimensions = (rect) => {
    const coords = rect.aCoords;
    const width = coords.tr.x - coords.tl.x;
    const height = coords.br.y - coords.tl.y;
    setRectDimensions({width, height});
  }

  const addBorderRadiusControl = (x,y, offsetX, offsetY) => new fabric.Control({
    x,
    y,
    offsetX,
    offsetY,
    cursorStyle: 'pointer',
    mouseDownHandler: (options) => {
      setInitialMousePos({
        x: options.pageX,
        y: options.pageY,
      });
      setMouseDown(true);
    },
    cornerSize: 5
  });

  const addRect = canv => {
    const rect = new fabric.Rect({
      height: 400,
      width: 200,
      fill: '#555555',
      rx: 100,
      ry: 100
    });
    setRect(rect);
    canv.add(rect);
    canv.renderAll();
  }

  

  const isInsideShape = (cursorX, cursorY, shapeCoords) => {
    const xInShape = (cursorX <= shapeCoords.tr.x && cursorX >= shapeCoords.tl.x);
    const yInShape = cursorY >= shapeCoords.tr.y && cursorY <= shapeCoords.br.y;
    return xInShape && yInShape
  }
  
  useEffect(() => {
    if (!canvas) {
      setCanvas(initCanvas());
    } else if (canvas && !rect) {
      addRect(canvas);
    }
    if (rect) {
      fabric.Object.prototype.controls.mr.mouseDownHandler = 
        (e) => {
          console.log('mouseDown');
          setInitialMousePos({
            x: e.pageX,
            y: e.pageY
          });
          setRectDimensions({
            width: rect.get('width'),
            height: rect.get('height'),
            rx: rect.get('rx'),
            ry: rect.get('ry')
          });
          setMouseDown(true);
        }
      calculateRectDimensions(rect);
      const controlCoords = {
        tl:{x: -0.5, y: -0.5, offsetX: 16, offsetY: 16},
        tr:{x: 0.5, y: -0.5, offsetX: -16, offsetY: 16},
        bl:{x: -0.5, y: 0.5, offsetX: 16, offsetY: -16},
        br:{x: 0.5, y: 0.5, offsetX: -16, offsetY: -16},
      }
      Object.keys(rect.aCoords).forEach((corner) => {
        const controlName = `bRadius${corner}`;
        fabric.Object.prototype.controls[controlName] =
          addBorderRadiusControl(
            controlCoords[corner].x,
            controlCoords[corner].y,
            controlCoords[corner].offsetX,
            controlCoords[corner].offsetY
          );
      })
    }
  }, [canvas, rect])

  const calculateSideToDistanceRatio = (rectangle, cursorX) => {
    const midX = rectangle.aCoords.tl.x + ((rectangle.aCoords.tr.x - rectangle.aCoords.tl.x) / 2);
    const midY = rectangle.aCoords.tl.y + ((rectangle.aCoords.br.y - rectangle.aCoords.tr.y) / 2);
    const rectWidth = rectDimensions.width
    const rectHeight = rectDimensions.height
    const widerThanTall = rectWidth >= rectHeight;
    const distanceToMiddle = Math.abs(cursorX - midX);
    const distanceRatio = distanceToMiddle / (rectWidth / 2);
    return distanceRatio
  }
  const changeBorderRadius = (multiplier, rectWidth) => {
    return rectWidth * multiplier * 0.5
  }
  
  const calculateControllerPosition = (multiplier, rectWidth, pos) => {
    return rectWidth * multiplier * pos * -1
  }

  const scaleX = (options) => {
    console.log(options);
  }

  const calculateBrControllerPositions = (multiplier) => {
    fabric.Object.prototype.controls.bRadiustr.offsetX = calculateControllerPosition(multiplier, rectDimensions.width, fabric.Object.prototype.controls.bRadiustr.x)
    fabric.Object.prototype.controls.bRadiustr.offsetY = calculateControllerPosition(multiplier, rectDimensions.width, fabric.Object.prototype.controls.bRadiustr.y)
    fabric.Object.prototype.controls.bRadiustl.offsetX = calculateControllerPosition(multiplier, rectDimensions.width, fabric.Object.prototype.controls.bRadiustl.x)
    fabric.Object.prototype.controls.bRadiustl.offsetY = calculateControllerPosition(multiplier, rectDimensions.width, fabric.Object.prototype.controls.bRadiustl.y)
    fabric.Object.prototype.controls.bRadiusbl.offsetX = calculateControllerPosition(multiplier, rectDimensions.width, fabric.Object.prototype.controls.bRadiusbl.x)
    fabric.Object.prototype.controls.bRadiusbl.offsetY = calculateControllerPosition(multiplier, rectDimensions.width, fabric.Object.prototype.controls.bRadiusbl.y)
    fabric.Object.prototype.controls.bRadiusbr.offsetX = calculateControllerPosition(multiplier, rectDimensions.width, fabric.Object.prototype.controls.bRadiusbr.x)
    fabric.Object.prototype.controls.bRadiusbr.offsetY = calculateControllerPosition(multiplier, rectDimensions.width, fabric.Object.prototype.controls.bRadiusbr.y)
  }

  useEffect(() => {
    if(canvas && isMouseDown){
      canvas.on('mouse:up', options => {
        if (isMouseDown) {
          canvas.off('mouse:move');
          setMouseDown(false);
        }
      });
      canvas.on('mouse:move', options => {
        if(isMouseDown && initialMousePos && isInsideShape(options.e.pageX, options.e.pageY, rect.aCoords)){
          const multiplier = 1 - calculateSideToDistanceRatio(rect, options.e.pageX)
          calculateBrControllerPositions(multiplier);
          rect.set({
              rx: changeBorderRadius(multiplier, rectDimensions.width),
              ry: changeBorderRadius(multiplier, rectDimensions.width)
          });
          canvas.renderAll();
        }
      });
    }
  }, [isMouseDown]);

  return (
    <div className="App">
      <button onClick={() => {
        console.log('click');
        console.log(rect);
        rect.set({ width: 400 });
        canvas.renderAll();
      }}>
        Rectangle
      </button>
      <canvas id="c"/>
    </div>
  );
}

export default App;
