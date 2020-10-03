const { Record } = require('../models');
const { User } = require('../models');
const { Category } = require('../models');

exports.index = (req, res) => {
  res.render('welcome');
};
exports.dashboard = (req, res) => {
  res.render('dashboard', {
    user: req.user,
    records: Record.findAll({ include: [{ model: User, as: 'user' }, { model: Category, as: 'category' }], order: [['createdAt', 'DESC']] }),
  });
};
