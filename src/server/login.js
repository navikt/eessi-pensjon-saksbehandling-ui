
let request = require('./request');
let url = require('url');

let login = async function (appconfig) {

 let srvUrl = url.parse(appconfig.eessiFagmodulUrl);
 let body = JSON.stringify({
   'username' : appconfig.srvPensjonUsername,
   'password' : appconfig.srvPensjonPassword
  });

 try {

   let r = await request.https({
     hostname           : srvUrl.host,
     path               : '/login',
     method             : 'POST',
     headers            : {
       'Content-Type'   : 'application/json',
       'Content-Length' : body.length
     },
     body               : body,
     rejectUnauthorized : false,
     rejectCert         : true,
     agent              : false
   });
   console.log(r);
 } catch (err) {
   console.log(err);
 }
}

module.exports = {
   login
}
