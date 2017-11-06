const models = require("./src/models");
const ThingsModel = models.ThingsModel;

const request = require('request');
const _ = require("lodash");
(async ()=>{

	console.log("Save Thing");
	let thing = {createTime: new Date().toString(), unit:"liter", name: "Gas"};
	request("http://localhost:8080/api/v1/thing/",{ method : "POST", json:true, body: thing},(err,res,body)=>{
		if(err){
			console.log(err);
			return;
		}
		console.log(body);
		thing = body;
		console.log("Update Thing");
		if(thing){
			thing.name += " (updated)";
			request("http://localhost:8080/api/v1/thing/"+thing._id,{ method : "PUT", json:true, body: thing},(e,r,b)=>{
				if(e){
					console.log(e);
					return
				}
				console.log(b);
				thing = b;
				console.log("Delete Thing");
				request("http://localhost:8080/api/v1/thing/"+thing._id,{ method : "DELETE"},(er,rs,bd)=>{
					if(er){
						console.log(er);
						return
					}
					console.log(bd);
				});
			});
		}

	});
})();