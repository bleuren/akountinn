const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { User } = require('../models');

module.exports = (passport) => {
  passport.use(
    new LocalStrategy({
      usernameField: 'username',
    }, (username, password, done) => {
      // match user
      User.findOne({ where: { username } })
        .then((user) => {
          if (!user) {
            return done(null, false, { message: 'username not registered' });
          }

          // math passwords
          return bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (!isMatch) {
              return done(null, false, { message: 'password incorrect' });
            }
            return done(null, user);
          });
        })
        .catch((e) => {
          console.log(e);
        });
    }),
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findByPk(id)
      .then((user) => {
        done(null, user.id);
      }).catch((e) => {
        console.log(e);
      });
  });
};
