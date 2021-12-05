const LocalStrategy = require('passport-local').Strategy

function initialize(passport) {
    const authenticateUser = (email, password, done) => {
        const user = getUserByEmail(email);
    }
}

passport.use(new LocalStrategy({usernameField: 'email'}), authenicateUser);

passport.serializeUser((user, doen) => { })
passport.deserializeUser((user, doen) => { })