module.exports = {
  createCanvas: () => ({
    getContext: () => ({
      fillRect: () => {},
      drawImage: () => {},
      measureText: () => ({ width: 0 })
    })
  }),
  loadImage: async () => ({})
};


