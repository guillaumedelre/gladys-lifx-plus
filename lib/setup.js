const Promise = require('bluebird');
const scan = require('./scan.js');

module.exports = function setup(){

    return scan()
		.then(function () {
            sails.log.debug(`Lifx module setup succeed.`);
		})
        .catch(function (err) {
            sails.log.error(`Lifx module failure :` + err);
        });
};