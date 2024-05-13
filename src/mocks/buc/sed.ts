export default (type: string) => {
/*  const m = require('mocks/buc/sed_' + type)
  return m.default*/

  let m;
  //import('./sed_' + type + '.ts')
  import(`./sed_${type}.ts`)
    .then(module => {
      console.log("Fra sed.ts:" + `src/mocks/buc/sed_${type}.ts`)
      m = module.default;
      console.log("Fra sed.ts:" + m.type)
      return m;
    })
    .catch(error => {
      console.error('Failed to load module:', error);
    });
}
