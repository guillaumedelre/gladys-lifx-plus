var lifx = require('lifx-http-api'), client;

module.exports = function exec(params) {

    var newState = {};

    var lightId = 'id:' + params.deviceType.identifier.split("-")[0];

    switch (params.deviceType.type) {

        case 'binary':
            if (params.state.value === 1) {
                newState.power = "on";
            } else {
                newState.power = "off";
            }
            break;

        case 'brightness':
            if (params.state.value < 0) {
                params.state.value = 0;
            }
            if (params.state.value > 100) {
                params.state.value = 100;
            }
            newState.brightness = params.state.value / 100;
            break;

        case 'kelvin':
            if (params.state.value < 2500) {
                params.state.value = 2500;
            }
            if (params.state.value > 9000) {
                params.state.value = 9000;
            }
            newState.kelvin = params.state.value;
            break;

        case 'hue':
            if (params.state.value < 0) {
                params.state.value = 0;
            }
            if (params.state.value > 360) {
                params.state.value = 360;
            }
            newState.hue = params.state.value;
            break;

        case 'saturation':
            if (params.state.value < 0) {
                params.state.value = 0;
            }
            if (params.state.value > 100) {
                params.state.value = 100;
            }
            newState.saturation = params.state.value / 100;
            break;

        case 'duration':
            if (params.state.value < 0) {
                params.state.value = 0;
            }
            newState.diration = params.state.value;
            break;
    }

    return gladys.param.getValue('LIFX_PLUS_API_TOKEN')
        .then(function (apiToken) {
            client = new lifx({
                bearerToken: apiToken
            });

            return client
                .setState(lightId, newState)
                .then(function (data) {
                    console.log(`Lifx Api request succeed with params: ${newState}`);
                })
                .catch(function (err) {
                    sails.log.error(`Lifx Api request failed with params: ${newState} :` + err);
                });
        })
        .catch(function (err) {
            sails.log.error(`Lifx module failure :` + err);
        });
};