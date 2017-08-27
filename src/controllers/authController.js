const passport = require('passport');

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Login Failed!',
  successRedirect: '/',
  successFlash: 'You are now logged in'
});
