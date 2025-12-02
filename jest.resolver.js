import defaultResolver from 'jest-resolve/build/defaultResolver.js';

export default (request, options) => {
  if (request === 'canvas') {
    return new URL('./__mocks__/canvas.js', import.meta.url).pathname;
  }
  return defaultResolver(request, options);
};

