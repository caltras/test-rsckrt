const models = require("./src/models");
const ThingsModel = models.ThingsModel;

const request = require('request');
const _ = require("lodash");
(async ()=>{
	console.log("Starting");
	let things = await ThingsModel.find({});
	console.log(things);
	setInterval(()=>{
		
		let t = _.sample(things)
		data = [{timestamp:new Date().toString(),value: _.random(0,500)}];
		console.log("http://localhost:8080/api/v1/data/"+t._id);
		request("http://localhost:8080/api/v1/data/"+t._id, 
		{ method: "POST",json: true, body:data }, 
		(err, res, body) => {
		  if (err) { 
		  	return console.log(err); 
		  }
		  console.log(body);
		});
	},1000);
})();