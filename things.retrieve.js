const models = require("./src/models");
const ThingsModel = models.ThingsModel;

const request = require('request');
const _ = require("lodash");
(async ()=>{
	console.log("Starting");

	let things = await ThingsModel.find({});
	let t = _.sample(things);

	request("http://localhost:8080/api/v1/thing/?unit=C,Kw&sort=name,-createTime", 
	(err, res, body) => {
	  if (err) { 
	  	return console.log(err); 
	  }
	  console.log("-----------------------------------------");
	  console.log("http://localhost:8080/api/v1/thing/");
	  console.log(JSON.stringify(JSON.parse(body),null,4));
	});

	request("http://localhost:8080/api/v1/thing/"+t._id, 
	(err, res, body) => {
	  if (err) { 
	  	return console.log(err); 
	  }
	  console.log("-----------------------------------------");
	  console.log("http://localhost:8080/api/v1/thing/"+t._id);
	  console.log(JSON.stringify(JSON.parse(body),null,4));
	});
})();