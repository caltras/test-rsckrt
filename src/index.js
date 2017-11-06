const config = require("./config");
const express = require("express");
const Routes = require("./routes");
const debug = require("debug")("application");
const models = require("./models");
const path = require("path");
const bodyParser = require('body-parser');
const passport = require("passport");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const session = require("express-session");

require('./config/passport')(passport);

class BootStrap {
	constructor(host, port){
		this.app = express();
		this.host = host;
		this.port = port;

		this.app.use(express.static('src/public'));
		this.app.use(express.static('node_modules/angular'));
		this.app.use(express.static('node_modules/angular-route'));
		this.app.use(bodyParser.json());
		//form
		this.app.use(bodyParser.urlencoded({ extended: true }));
		this.app.set('views', path.join(__dirname, '/views'));
		this.app.set('view engine', 'ejs');
		this.app.use(cookieParser()); 
		this.app.use(session({ secret: 'test-resourcekraft' }));
		this.app.use(passport.initialize());
		this.app.use(passport.session());
		this.app.use(flash());

	}

	loadRoutes(){
		new Routes(this.app);
		this.app.locals.Models = models;
	}
	listen(){
		this.app.listen(this.port,this.host,()=>{
			debug("Running at "+this.host+":"+this.port);
		});
	}
	static run (){
		debug("Starting executation...");
		if(!this.instance){
			this.instance = new BootStrap(config.HOST, config.PORT);
			this.instance.loadRoutes();
			this.instance.listen();
		}
		return this.instance;

	}
}

BootStrap.run();