exports.index = (req, res) => {
  res.render('welcome');
};
exports.dashboard = (req, res) => {
  res.render('dashboard', {
    user: req.user,
  });
};
exports.analysis = (req, res) => {
  res.render('analysis', {
    user: req.user,
  });
};
