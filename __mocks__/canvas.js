
function noop() {}

function mockContext2D() {
  return {
    canvas: null,
    fillRect: noop,
    clearRect: noop,
    getImageData: () => ({ data: new Uint8ClampedArray(0) }),
    putImageData: noop,
    createImageData: () => ({ data: new Uint8ClampedArray(0) }),
    setTransform: noop,
    drawImage: noop,
    save: noop,
    fillText: noop,
    restore: noop,
    beginPath: noop,
    moveTo: noop,
    lineTo: noop,
    closePath: noop,
    stroke: noop,
    translate: noop,
    scale: noop,
    rotate: noop,
    arc: noop,
    fill: noop,
    measureText: () => ({ width: 0 }),
    transform: noop,
    globalCompositeOperation: 'source-over',
  };
}

function createCanvas(width = 0, height = 0) {
  const canvas = {
    width,
    height,
    getContext: (type) => (type === '2d' ? mockContext2D() : null),
    toBuffer: () => Buffer.from([]),
    toDataURL: () => 'data:image/png;base64,',
  };
  return canvas;
}

async function loadImage() {
  return { width: 0, height: 0 };
}

module.exports = {
  createCanvas,
  Canvas: function () {},
  Image: function () {},
  loadImage,
};


