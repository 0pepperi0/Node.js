'use strict'
//  demo data
var measurements = [
  {
    measurementid: 1,
    timestamp: new Date(2022, 10, 27, 9, 25, 0),
    locationid: 1,
    unit: "Celsius",
    amount: 0,
    deviceid: 112232
  },
  {
    measurementid: 2,
    timestamp: new Date(2022, 10, 27, 9, 25, 0),
    locationid: 1,
    unit: "Humidity(%)",
    amount: 66,
    deviceid: 112232
  },
  {
    measurementid: 3,
    timestamp: new Date(2022, 10, 27, 9, 25, 0),
    locationid: 2,
    unit: "Celsius",
    amount: 30,
    deviceid: 112233
  },
  {
    measurementid: 4,
    timestamp: new Date(2022, 10, 27, 9, 25, 0),
    locationid: 2,
    unit: "Humidity(%)",
    amount: 40,
    deviceid: 112233
  }
];

var locations = [
  {
    locationid: 1,
    latitude: 62.888855,
    longitude: 27.6284978,
    address: "Microkatu 1, 70210 KUOPIO",
    information: "Savonia Microkatu Campus"
  },
  {
    locationid: 2,
    latitude: 62.329815,
    longitude: 27.851587,
    address: "Opiskelijankatu 3, 78210 VARKAUS",
    information: "Savonia Varkaus Campus"
  }
];

var devices =
  [
    {
      deviceid: 112232,
      shortname: "NodeMcu V3",
      information: "NodeMcu v3 powered with ESP8266 and added DHT22 sensor"
    },
    {
      deviceid: 112233,
      shortname: "RuuviTag",
      information: "Wireless Temperature, Humidity, Air Pressure and Motion Sensor"
    }
  ];
// Managing search params for GET method
function search(measurements, req, res) {
  return measurements.filter((measurement) => {
    let isValid = true;
    for (var param in req.query) {
      if (!measurement.hasOwnProperty(param) || req.query[param] != measurement[param]) {
        isValid = false;
      }
    }
    return isValid;
  })
}


// this is what server.js uses
module.exports =


{
  fetchMeasurements: function (req, res) {
    console.log("Body = " + JSON.stringify(req.body));
    // search params are in req.query object
    console.log("Params = " + JSON.stringify(req.query));
    for (var propName in req.query) {
      if (req.query.hasOwnProperty(propName)) {
        console.log(propName, req.query[propName]);
      }
    }
    res.json(search(measurements, req, res)); // server send response with res.json
  },

  addMeasurement: function (req, res) {
    // req.body object contains all information with POST method
    console.log("Body = " + JSON.stringify(req.body));
    console.log("Params = " + JSON.stringify(req.query));
    measurements.push(req.body);
    console.log(measurements);
    res.status(201);
    res.send(req.body);
    //res.send({message: "OK"}); // server also sends response with this 
  },

  updateMeasurement: function (req, res) {
    // Client sends put method request
    console.log("Body = " + JSON.stringify(req.body));
    console.log("Params = " + JSON.stringify(req.params));
    measurements.forEach((measurement) => {
      if (measurement["measurementid"] == req.params.id) {
        for (var newValue in req.body) {
          console.log(newValue + " => " + req.body[newValue])
          if (measurement.hasOwnProperty(newValue)) {
            measurement[newValue] = req.body[newValue];
          }
        }
      }
    });

    //res.json({message:"Ok"}); 
    // if we try to use both send and json responses error occurs

    // use for loop to go through measurements
    // if req.params.id is same as measurementid -> change other fields


    res.send("The measurement with id " + req.params.id + " is editted with next inforamtion:\n" + req.body);
},

  deleteMeasurement: function (req, res) {
    // Client sends DELETE method request
    console.log("Body = " + JSON.stringify(req.body));
    console.log("Params = " + JSON.stringify(req.params));
    console.log(req.query);
    measurements = measurements.filter((measurement) => {
      if (measurement["measurementid"] == req.params.id) {
        return false;
      }
      return true;
    })
    res.send("Delete requested")
  },

fetchSingleMeasurement: function (req, res) {
  // Client sends get method request
  console.log("Body = " + JSON.stringify(req.body));
  console.log("Params = " + JSON.stringify(req.params));
  res.send("Single measurement requested");
},

fetchDevice: function(req, res) {
  res.json(devices);
},

addDevice: function(req, res) {
  // first: check if user has provided required fields
  // from req.body
  if (req.body.deviceid == undefined) {
    res.status(400); // bad request
    res.send("deviceid missing");
  } else if (req.body.information == undefined) {
    res.status(400); // bad request
    res.send("information missing");
  } else if (req.body.shortname == undefined) {
    res.status(400);
    res.send("shortname missing");
  } else {
    devices.push({
      deviceid: req.body.deviceid,
      shortname: req.body.shortname,
      information: req.body.information
    });
    res.status(201);
    res.send("OK");
  }// TODO: check shortname
},

fetchLocation: function(req, res) {
  res.json(locations); // server send response with res.json
},

addLocation: function (req, res) {
  if(req.body.locationid == undefined) {
    res.status(400);
    res.send("locationid missing");
  } else if (req.body.latitude == undefined) {
    res.status(400);
    res.send("latitude missing");
  } else if (req.body.longitude == undefined) {
    res.status(400);
    res.send("longitude missing");
  } else if (req.body.address == undefined) {
    res.status(400);
    res.send("address missing");
  } else if (req.body.information == undefined) {
    res.status(400);
    res.send("information missing");
  } else {
    locations.push({
      locationid : req.body.locationid,
      latitude : req.body.latitude,
      longitude : req.body.longitude,
      address : req.body.address,
      information : req.body.information
    });
  }
  res.send("OK");
},

}