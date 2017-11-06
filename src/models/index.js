const config = require("../config");
const mongoose = require("mongoose");
var options = { promiseLibrary: require('bluebird') }
var cachegoose = require('cachegoose');
cachegoose(mongoose);

let conn = mongoose.connect(config.DB_URL,options);

const Schema = mongoose.Schema;

const ThingsSchema = new Schema({
	user:{type:String, ref:'users'},
	createTime: { type: Date, required:true},
	name:{type:String, required:true},
	unit:{type:String, required:true},
	lastTransmission:Date,
	coordinates: Schema.Types.Mixed

});
const DatasSchema = new Schema({
	timestamp: {type:Date, required:true},
	value: {type:Number, required:true},
	thing: { type: String, ref: 'things', required:true }
});
const UsersSchema = new Schema({
	name: {type:String , required:true},
	user: {type:String , required:true},
	pass: {type:String , required:true}
});

const ThingsModel = mongoose.models.things || mongoose.model("things", ThingsSchema);
const DatasModel = mongoose.models.data || mongoose.model("datas", DatasSchema);
const UsersModel = mongoose.models.users || mongoose.model("users", UsersSchema);

module.exports = {

	ThingsSchema,
	ThingsModel,
	DatasSchema,
	DatasModel,
	UsersSchema,
	UsersModel,
	isValidObjectId : (id)=>{
		if(!mongoose.Types.ObjectId.isValid(id)){
			throw new Error("ObjectId invalid")
		}
		return true;
	}

}