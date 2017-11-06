var LocalStrategy   = require('passport-local').Strategy;
const UsersModel = require("../models").UsersModel;

module.exports = function(passport){
	passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        UsersModel.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField : 'user',
        passwordField : 'pass',
        passReqToCallback : true
    },
    function(req, userName, pass, done) {

    	//Async doesn't work
    	process.nextTick(() => {

	        let user = UsersModel.findOne({ 'user' :  userName },function(err,doc){
	        	if(err){
	        		return done(null, false, req.flash('signupMessage', err.message));
	        	}
	        	if(doc){
					return done(null, false, req.flash('signupMessage', 'That user is already taken.'));
				}else{
					console.log(req.body);
					let user = new UsersModel(req.body);
					let response = user.save().then(function(){
						return done(null,user);	
					});
				}
	        });

        });

    }));
    passport.use('local-login', new LocalStrategy({
        usernameField : 'user',
        passwordField : 'pass',
        passReqToCallback : true
    },
    function(req, userName, pass, done) {

        UsersModel.findOne({ 'user' :  userName, 'pass': pass }, function(err, user) {
            if (err)
                return done(err);

            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.'));

            return done(null, user);
        });
    }));
}