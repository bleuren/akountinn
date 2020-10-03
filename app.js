const express = require('express');

const app = express();
// eslint-disable-next-line no-undef
const port = process.env.PORT || 3133;
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
const expressEjsLayout = require('express-ejs-layouts');
const passport = require('passport');
require('./config/passport')(passport);
// EJS
app.set('view engine', 'ejs');
app.use(expressEjsLayout);
// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, 'public')));

// BodyParser
app.use(express.urlencoded({ extended: false }));
// express session
app.use(session({
  secret: 'asdjkadsji',
  resave: true,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.loginStatus = !!req.user;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});
// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/records', require('./routes/records'));
app.use('/categories', require('./routes/categories'));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
