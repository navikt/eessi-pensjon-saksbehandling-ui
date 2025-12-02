const { defaultResolver } = require('jest-resolve');

module.exports = (request, options) => {
  if (request === 'canvas') {
    return require.resolve('./__mocks__/canvas.js', { paths: [options.basedir] });
  }
  return defaultResolver(request, options);
};


