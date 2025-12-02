module.exports = {
  createCanvas: () => ({
    getContext: () => ({
      fillRect: () => {},
      drawImage: () => {},
      // add more stubs if needed
    })
  }),
  loadImage: async () => ({})
};

