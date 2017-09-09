const RequestPromise = require('request-promise');
const Promise = require('bluebird');

module.exports = function exec(params){
    
  var newState = {};

  var lightId = params.deviceType.identifier.split("-")[0];
  
  switch(params.deviceType.type) {

    case 'binary': 
      if(params.state.value === 1){
        newState.power = "on";
      } else {
        newState.power = "off";
      }  
    break;

    case 'brightness': 
    	if (params.state.value > 0) {
        newState.power = "on";
      	newState.color = "brightness:" + params.state.value / 100;
    	}
    break;
    
    case 'kelvin': 
      newState.power = "on";
      newState.color = "kelvin:" + params.state.value;
    break;
    
    case 'hue': 
    	if (params.state.value > 0) {
        newState.power = "on";
	       	newState.color = "hue:" + params.state.value;
	      }
    break;
    
    case 'saturation': 
    	if (params.state.value > 0) {
        newState.power = "on";
      	newState.color = "saturation:" + params.state.value / 100;
    	}
    break;
  }

  console .log(newState)

	return gladys.param.getValue('LIFX_PLUS_API_TOKEN')
    .then((lifxPlusApiToken) => {
      var options = {
        uri: 'https://api.lifx.com/v1/lights/' + lightId + '/state',
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + lifxPlusApiToken
        },
        body: newState,
        simple: false,
        json: true // Automatically parses the JSON string in the response
	    };

	    return RequestPromise(options)
			.then((data) => {
        // get house only if there is devices connected
        console.log(`Lifx Api request succeed.`);
        console.log(data);
			})
			.catch(function (err) {
        sails.log.error(`Lifx Api request failed :` + err);
			});
    });
};