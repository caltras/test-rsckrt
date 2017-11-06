let _ = require("lodash");

class ApiRoute{
	constructor(app){
		this.prefix = "api";
		this.version="v1";
		this.app = app;
		this.createRoutes();
	}
	getPath(){
		return "/"+this.prefix+"/"+this.version;
	}
	formatResponse(count,data,per_page,page){
		return {
			data : data,
			total:count,
			metadata: {
				per_page:per_page || 10,
				page:page || 1,
				total_page: Math.ceil(count/(per_page || 10))
			}
		};
	}
	createRoutes(){
		let self = this;

		var checkObjectId = (req,res,next)=>{
			try{
				self.app.locals.Models.isValidObjectId(req.params.id);
				next();
			}catch(e){
				self.handleError({error:true,status:500,mesage:"Invalid ObjectId found to 'Thing#"+req.params.id+"'"},res);
			}
		}
		//Thing API
		this.app.get(this.getPath()+"/thing",this.isLoggedIn, async (req,res)=>{
			try{
				let ThingsModel = this.app.locals.Models.ThingsModel;
				let filters = this.builFilters(req);
				let count = await ThingsModel.count(filters.filter); 
				let per_page = Number(req.query.per_page || 10);
				let page = Number(req.query.page || 0);
				page--;
				page = page < 0 ? 0: page;

				let list = await ThingsModel.find(filters.filter).skip(page).limit(per_page);

				res.json(this.formatResponse(count, list, req.query.per_page,req.query.page ));
			
			}catch(e){
				this.handleError({error:true,status:500,mesage:e.message},res);
			}
		});
		this.app.get(this.getPath()+"/thing/:id", this.isLoggedIn, checkObjectId ,async (req,res)=>{
			try{
				let ThingsModel = this.app.locals.Models.ThingsModel;
				let thing = await ThingsModel.findOne({_id:req.params.id, user: req.user._doc._id});
				res.json(thing);
			}catch(e){
				this.handleError({error:true,status:500,mesage:e.message},res);
			}
		});
		this.app.post(this.getPath()+"/thing",this.isLoggedIn,async (req,res)=>{
			try{
				let ThingsModel = this.app.locals.Models.ThingsModel;
				let data = req.body;
				data.createTime = new Date().toString();
				data.user = req.user._doc._id;
				let model = new ThingsModel(data);
				res.json(await model.save());
			}catch(e){
				this.handleError({error:true,status:500,mesage:e.message},res);
			}
			
		});
		this.app.put(this.getPath()+"/thing/:id",this.isLoggedIn, checkObjectId,async (req,res)=>{
			try{
				let ThingsModel = this.app.locals.Models.ThingsModel;
				let doc = await ThingsModel.findOneAndUpdate({_id:req.params.id, user: req.user._doc._id},req.body,{upsert:true});
				res.json(doc);
			}catch(e){
				this.handleError({error:true,status:500,mesage:e.message},res);
			}
		});
		this.app.delete(this.getPath()+"/thing/:id",this.isLoggedIn,checkObjectId,async (req,res)=>{
			try{
				let ThingsModel = this.app.locals.Models.ThingsModel;
				let thing = await ThingsModel.deleteOne({_id:req.params.id, user: req.user._doc._id});
				res.json(thing);
			}catch(e){
				this.handleError({error:true,status:500,mesage:e.message},res);
			}
		});

		//DATA endpoint
		this.app.post(this.getPath()+"/data/:id",checkObjectId,async (req,res)=>{
			try{
				let ThingsModel = this.app.locals.Models.ThingsModel;
				let thing = await ThingsModel.findOne({_id:req.params.id});
				if(thing){
					let DatasModel = this.app.locals.Models.DatasModel;
					let body = req.body;
					if(!(req.body instanceof Array)){
						body =[body];
					}
					let data = _.map(body,(d)=>{
						d.thing = req.params.id;
						return d;
					});
					
					let docs = await DatasModel.insertMany(data);
					thing.lastTransmission = new Date().toString();
					await ThingsModel.findOneAndUpdate({_id:req.params.id},thing,{upsert:true});

					res.json(docs);
				}else{
					this.handleError({error:true,status:404,mesage:"Nothing found to 'Thing#"+req.params.id+"'"},res);
				}
			}catch(e){
				this.handleError({error:true,status:500,mesage:e.message},res);
			}
			
		});
		this.app.get(this.getPath()+"/data/:id/:start/:end",this.isLoggedIn, checkObjectId, async (req,res)=>{
			try{
				let ThingsModel = this.app.locals.Models.ThingsModel;
				let thing = await ThingsModel.findOne({_id:req.params.id,user:req.user._doc._id});

				if(thing){
					let DatasModel = this.app.locals.Models.DatasModel;
					
					let dtStart = Date.parse(req.params.start);
					let dtEnd = Date.parse(req.params.end);
					let per_page = req.query.per_page || 10;
					let page = Number(req.query.page || 0);
					page--;
					page = page < 0 ? 0: page;

					let filter = { 
							thing : req.params.id,
							timestamp : { 
									$gte : dtStart, 
									$lt : dtEnd 
							}
					};

					let count = await DatasModel.count(filter); 
									
					let list = await DatasModel.find(filter).skip(Number(per_page*page)).limit(Number(per_page));

					res.json(this.formatResponse(count, list, req.query.per_page, req.query.page));
				}else{
					this.handleError({error:true,status:404,mesage:"Nothing found to 'Thing#"+req.params.id+"'"},res);
				}
			}catch(e){
				this.handleError({error:true,status:500,mesage:e.message},res);
			}
		});
	}
	isLoggedIn(req, res, next) {

	    if (req.isAuthenticated())
	        return next();

	    res.redirect('/login');
	}
	handleError(e,res){
		res.json(e);
	}

	builFilters(req){
		let query = req.query;
		let objectFilter = {
			filter: {},
			sort: {},
			page:1,
			per_page:10,
		}
		objectFilter.filter.user = req.user._doc._id;

		_.each(query,(f,i)=>{
			if(i==="sort"){
				_.each(f.split(","),(s)=>{
					let sort = 1;
					if(s.charAt(0) === "-"){
						sort = -1;
					}
					objectFilter.sort[s.replace("-","")] =  sort;	
				})
			}else{
				if(i==="per_page"){
					objectFilter.limit = f;
				}else{
					if(i==="page"){
						objectFilter.skip = objectFilter.limit * f;
					}else{
						objectFilter.filter[i] = f.split(",");
					}
				}
			}
		});
		return objectFilter;
	}

}
module.exports = ApiRoute;