export const addBrControllers = (rect) => {
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

export const addBorderRadiusControl = (x,y, offsetX, offsetY) => new fabric.Control({
    x,
    y,
    offsetX,
    offsetY,
    cursorStyle: 'pointer',
    actionName: 'borderRadius',
    actionHandler: (options) => {
      console.log(options);
      calculateBorderRadius(options)
    },
    withConnection: false,
    render: (ctx, left, top) => {
      console.log(rect.rx);
      ctx.beginPath();
      ctx.arc(left, top, 5, 0, 6.28319);
      ctx.fill()
      ctx.stroke();
      ctx.font = "10px Arial";
      ctx.fillText(`${Math.floor(rect.rx)}`, left + 5, top + 10);
    },
    cornerSize: 5
  });