const { Op } = require('sequelize');
const {
  Team,
} = require('../models');

exports.index = (req, res) => {
  res.render('welcome');
};
exports.dashboard = async (req, res) => {
  const teams = await Team.findAll({
    where: {
      [Op.or]: [
        { owner: req.user },
        { member: req.user },
      ],
    },
  });
  console.log(teams);
  res.render('dashboard', {
    user: req.user,
    teams,
  });
};
exports.analysis = (req, res) => {
  res.render('analysis', {
    team: req.params.teamId,
    user: req.user,
  });
};
