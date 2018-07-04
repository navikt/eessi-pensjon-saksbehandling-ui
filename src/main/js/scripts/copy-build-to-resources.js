'use strict';

const fs = require('fs-extra');

const source = './build'
const destination = '../resources/public'

console.log('Deleting folder '+destination+' ...');
fs.remove(destination)
    .then(() => {
        console.log('Done - Sucessfully deleted folder ' + destination);

        fs.ensureDir(destination, err => {
            if (err) console.log(err);

            console.log('Copying '+source+' to '+ destination +' ...');
            fs.copy(source, destination, error => {
                if (error) return console.log(error);
                console.log('Done - Files successfully copied');
            });
        })
    })
    .catch(error => {
        console.log(error)
    });
