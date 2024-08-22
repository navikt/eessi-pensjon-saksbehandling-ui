export default (type: string) => {

/*  const m = require('mocks/buc/sed_' + type)
  return m.default*/

  let m;
  import(`./sed_${type}.ts`)
    .then(module => {
      m = module.default;
      return m;
    })
    .catch(error => {
      console.error('Failed to load module:', error);
    });
}
