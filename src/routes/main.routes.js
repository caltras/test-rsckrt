const passport = require("passport");

class MainRoute{
	constructor(app){
		this.app = app;
		this.createRoutes();
	}
	getPath(){
		return "";
	}
	createRoutes(){
		this.app.get(this.getPath()+"/login",async (req,res)=>{
			res.render("login");
		});
		
		this.app.get(this.getPath()+"/signup",async (req,res)=>{
			res.render("signup");
		});

		this.app.post('/login', passport.authenticate('local-login', {
	        successRedirect : '/', 
	        failureRedirect : '/login',
	        failureFlash : true 
	    }));

		this.app.post('/signup', passport.authenticate('local-signup', {
	        successRedirect : '/',
	        failureRedirect : '/signup',
	        failureFlash : true 
	    }));

		this.app.get(this.getPath()+"/",this.isLoggedIn,(req,res)=>{
			res.render("main",{user:req.user._doc});
		});
		this.app.get('/logout', function(req, res) {
	        req.logout();
	        res.redirect('/login');
	    });
	}
	isLoggedIn(req, res, next) {

	    if (req.isAuthenticated())
	        return next();

	    res.redirect('/login');
	}
}
module.exports = MainRoute;