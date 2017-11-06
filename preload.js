const models = require("./src/models");
const ThingsModel = models.ThingsModel;
const DatasModel = models.DatasModel;
const moment = require("moment");
const _ = require("lodash");

const sensors = [{name:"temperature",unit:"C"},{name:"eletricity",unit:"Kw"},{name:"pressure",unit:"psi"}];

(async ()=>{
	await DatasModel.remove({});
	await ThingsModel.remove({});
	sensors.forEach(async (s)=>{
		let thing = new ThingsModel({createTime: new Date().toString(), name:s.name, unit:s.unit});
		let obj = await thing.save();
		if(obj){
			let start = moment().subtract(1000,'hours');
			let data = [];
			for(var i=1;i<1000;i++){
				
				start = start.add(1,'hours');
				data.push({timestamp: start.toDate(),value:_.random(100,true),thing:obj._id.toString()});
			}
			let d = await DatasModel.insertMany(data);
		}
	});

	console.log("Finished");

	

})();