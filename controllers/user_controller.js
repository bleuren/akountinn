const passport = require('passport');
const bcrypt = require('bcrypt');
const { User } = require('../models');

exports.index = (req, res) => {
  res.send('NOT IMPLEMENTED: Site Home Page');
};

// Display list of all users.
exports.user_login = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/',
    failureFlash: true,
  })(req, res, next);
};

// Display detail page for a specific user.
exports.user_logout = (req, res) => {
  req.logout();
  req.flash('success_msg', '您已經登出');
  res.redirect('/');
};

// Display user update form on GET.
exports.user_update_get = (req, res) => {
  res.render('reset');
};

// Handle user update on POST.
exports.user_update_post = (req, res) => {
  const { password, newPassword } = req.body;
  const saltRounds = 10;
  const hash = bcrypt.hashSync(newPassword, saltRounds);

  User.findOne({ where: { id: req.user } })
    .then((user) => {
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          // eslint-disable-next-line no-param-reassign
          user.password = hash;
          user.save();
          req.logout();
          req.flash('success_msg', '更新成功! 請重新登入');
          res.redirect('/');
        } else {
          req.flash('error_msg', '密碼輸入錯誤');
          res.redirect('/users/reset');
        }
      });
    })
    .catch((e) => { console.log(e); });
};
