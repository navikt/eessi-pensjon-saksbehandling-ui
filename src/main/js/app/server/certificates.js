var keytool = require('node-keytool');
var fs = require('fs');
var path = require('path');

let load = async function (appconfig) {
  let filename = path.resolve(__dirname, appconfig.truststorePath);
  console.log('Loading truststore ' + filename + '= ' + fs.existsSync(filename));
  var store = keytool(filename, appconfig.truststorePassword, {debug: false, storetype: 'JKS'});
  try {
    res = await list(store);
    for (var certidx = 0; certidx < res.certs.length; certidx++) {
      var resobj = res.certs[certidx];
      var f = path.resolve(__dirname, './certificates/' + resobj.alias.replace(/[\(\)\/\\]/g,"_"));
      if (fs.existsSync(filename)) {
        console.log("certificate " + resobj.alias + ' already exists, skipping');
      } else {
        console.log("writing certificate " + resobj.alias + ' to ' + f);
        store.exportcert(resobj.alias, f);
      }
    }
  } catch (err) {
     console.log(err);
  };
}

var list = function (store) {

  return new Promise((resolve, reject) => {
    store.list(function(err, res) {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });

}

module.exports = {
   load
}
