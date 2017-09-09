module.exports = function(sails) {

    const exec = require('./lib/exec.js');
	const scan = require('./lib/scan.js');
    const setup = require('./lib/setup.js');

	gladys.on('ready', function(){
        scan();
    });

	return {
        scan,
        exec,
        setup
    };
};