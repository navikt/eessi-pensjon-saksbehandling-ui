let https = require('https');

let _https = function (options) {

  return new Promise((resolve, reject) => {
    console.log('HTTPS request ' + options.method + ' ' + options.hostname + options.path)
    let req = https.request(options, res => {
      let body = '';
      res.on('data', chunk => {
        body += chunk.toString();
      });
      res.on('error', err => {
        reject(err);
      });
      res.on('end', () => {
        console.log('HTTPS request ended, status Code: ' + res.statusCode);
        if (res.statusCode <= 200 && res.statusCode <= 299) {
          resolve({
            statusCode : res.statusCode,
            headers    : res.headers,
            body       : body
          });
        } else {
          reject({
            statusCode : res.statusCode,
            headers    : res.headers
          });
        }
      });
    });
    req.on('error', reject);
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

module.exports = {
  https : _https
};
