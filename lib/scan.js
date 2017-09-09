const RequestPromise = require('request-promise');
const Promise = require('bluebird');

module.exports = function scan() {

    // get the range of IP address
    return gladys.param.getValue('LIFX_PLUS_API_TOKEN')
        .then((lifxPlusApiToken) => {

            var options = {
                    uri: 'https://api.lifx.com/v1/lights/all',
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + lifxPlusApiToken
                    },
                    simple: false,
                    json: true // Automatically parses the JSON string in the response
                };
			
			return RequestPromise(options)
				.then((data) => {
                    // get house only if there is devices connected
                    sails.log.debug(`Lifx Api request succeed : found ${data.length} lights.`);

                    if(data.length === 0) return [data];    
                    return [data, gladys.machine.getMyHouse()];
				})
                .spread((data, house) => {
                    return Promise.map(data, function(item){
                        
                        var name = item.label;
                        var identifier = item.id;
                        
                        // if no name has been found
                        // don't save device
                        if(!name) return null;

                        return gladys.device.create({
                            device: {
                                name: name,
                                identifier: identifier,
                                protocol: 'https',
                                service: 'lifxplus'
                            },
                            types: [
                                {
                                    name: name + '-power',
                                    type: 'binary',
                                    identifier: identifier + '-power',
                                    sensor: false,
                                    min: 0,
                                    max: 1
                                },
                                {
                                    name: name + '-brightness',
                                    type: 'brightness',
                                    identifier: identifier + '-brightness',
                                    sensor: false,
                                    min: 0,
                                    max: 100
                                },
                                {
                                    name: name + '-saturation',
                                    type: 'saturation',
                                    identifier: identifier + '-saturation',
                                    sensor: false,
                                    min: 0,
                                    max: 100
                                },
                                {
                                    name: name + '-kelvin',
                                    type: 'kelvin',
                                    identifier: identifier + '-kelvin',
                                    sensor: false,
                                    min: 2500,
                                    max: 9000
                                },
                                {
                                    name: name + '-hue',
                                    type: 'hue',
                                    identifier: identifier + '-hue',
                                    sensor: false,
                                    min: 0,
                                    max: 360
                                }
                            ]
                        });
                    });
                })
				.catch(function (err) {
                    sails.log.error(`Lifx module failure :` + err);
    			});
        })
        .catch(function (err) {
            sails.log.error(`Lifx module failure :` + err);
        });
};