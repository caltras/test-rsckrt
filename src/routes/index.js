const ApiRoute = require("./api.routes");
const MainRoute = require("./main.routes");

class Routes{
	constructor(app){
		this.apiRoute = new ApiRoute(app);
		this.mainRoute = new MainRoute(app);
	}
}
module.exports = Routes;