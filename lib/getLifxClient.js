var lifx = require('lifx-http-api');

module.exports = function getLifxClient() {

    return gladys.param.getValue('LIFX_HTTP_API_TOKEN')
        .then(function (lifxHttpApiToken) {
            return new lifx({
                bearerToken: lifxHttpApiToken
            });
        })
        .catch(function (err) {
            sails.log.error(`Lifx Api request failed :` + err);
        });

};

