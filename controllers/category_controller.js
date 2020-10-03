const { Category } = require('../models');

exports.index = (req, res) => {
  res.send('NOT IMPLEMENTED: Site Home Page');
};

// Display list of all categorys.
exports.category_list = (req, res) => {
  Category.findAll({ order: [['id', 'ASC']] }).then((categories) => res.json(categories));
};

// Display category create form on GET.
exports.category_create_get = (req, res) => {
  Category.findAll().then((item) => {
    res.render('add_category', { categories: item });
  });
};

// Handle category create on POST.
exports.category_create_post = (req, res) => {
  const { name } = req.body;
  Category.create({
    name,
  }).then((item) => {
    res.json({
      Message: 'Created item.',
      Item: item,
    });
  }).catch((err) => {
    console.log(err);
  });
  req.flash('success_msg', '新增成功!');
  res.redirect('/dashboard');
};

// Display category delete form on GET.
exports.category_delete_get = async (req, res, next) => {
  const item = await Category.findOne({ where: { id: req.params.id } }).catch((e) => {
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

// Handle category delete on POST.
exports.category_delete_post = (req, res) => {
  res.send('NOT IMPLEMENTED: category delete POST');
};

// Display category update form on GET.
exports.category_update_get = async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  res.render('edit_category', { category });
};

// Handle category update on POST.
exports.category_update_post = async (req, res) => {
  const { name } = req.body;
  const category = await Category.findByPk(req.params.id);
  category.name = name;
  await category.save();
  req.flash('success_msg', '新增成功!');
  res.redirect('/dashboard');
};
