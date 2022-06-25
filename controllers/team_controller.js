const { User, Team } = require('../models');

exports.index = (req, res) => {
  res.send('NOT IMPLEMENTED: Site Home Page');
};

// Display list of all teams.
exports.team_list = (req, res) => {
  Team.findAll({ order: [['id', 'ASC']] }).then((categories) => res.json(categories));
};

// Display team create form on GET.
exports.team_create_get = (req, res) => {
  Team.findAll().then((item) => {
    res.render('add_team', { categories: item });
  });
};

// Handle team create on POST.
exports.team_create_post = async (req, res) => {
  const { name, member } = req.body;
  if (member === '') {
    Team.create({
      name,
      owner: req.user,
      member: req.user,
    }).catch((err) => {
      console.log(err);
    });
  } else {
    const user = await User.findOne({ where: { username: member } });
    if (user) {
      Team.create({
        name,
        owner: req.user,
        member: user.id,
      }).catch((err) => {
        console.log(err);
      });
    } else {
      console.log('no user found');
    }
  }
  req.flash('success_msg', '新增成功!');
  res.redirect('/dashboard');
};

// Display team delete form on GET.
exports.team_delete_get = async (req, res, next) => {
  const item = await Team.findOne({ where: { id: req.params.id } }).catch((e) => {
    console.log(e.message);
  });
  if (!item) {
    console.log('err');
    next();
  }
  item.destroy().then(() => {
    res.status(200).send();
  });
};

// Handle team delete on POST.
exports.team_delete_post = (req, res) => {
  res.send('NOT IMPLEMENTED: team delete POST');
};

// Display team update form on GET.
exports.team_update_get = async (req, res) => {
  const team = await Team.findByPk(req.params.id);
  res.render('edit_team', { team });
};

// Handle team update on POST.
exports.team_update_post = async (req, res) => {
  const { name } = req.body;
  const team = await Team.findByPk(req.params.id);
  team.name = name;
  await team.save();
  req.flash('success_msg', '新增成功!');
  res.redirect('/analysis');
};
