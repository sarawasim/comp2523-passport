const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const userController = require("../controllers/userController");
const localLogin = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  (email, password, done) => {
    const user = userController.getUserByEmailIdAndPassword(email, password); 
    return user
      ? done(null, user)  
      : done(null, false, {   
          message: "Your login details are not valid. Please try again",
        });
  }
);

const gitHubLogin = new GitHubStrategy(
  {
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: 'http://localhost:8081/auth/github/callback',
  },

  function (accessToken, refreshToken, profile, done) {
    let user = userController.findOrCreate(profile);
    console.log(profile);
    // console.log(user);
    return done(null, user);
  },
);


//req.session.passport.user
passport.serializeUser(function (user, done) { 
  done(null, user.id);  
});

passport.deserializeUser(function (id, done) {
  let user = userController.getUserById(id);
  if (user) { 
    done(null, user);
  } else {
    done({ message: "User not found" }, null);
  }
});

module.exports =
  passport.use(localLogin).use(gitHubLogin);