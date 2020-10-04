const moment = require('moment');
const { Record } = require('../models');
const { User } = require('../models');
const { Category } = require('../models');

exports.index = (req, res) => {
  res.send('NOT IMPLEMENTED: Site Home Page');
};

// Display list of all records.
exports.record_list = (req, res) => {
  Record.findAll({
    include: [{ model: User, as: 'user' }, { model: Category, as: 'category' }],
    order: [['txAt', 'DESC']],
  })
    .then((records) => res.json(records));
};

// Display detail page for a specific record.
exports.record_detail = (req, res) => {
  Record.findAll({
    include: [{ model: User, as: 'user' }, { model: Category, as: 'category' }],
    order: [['txAt', 'DESC']],
    where: { categoryId: req.params.id },
  })
    .then((records) => res.json(records));
};

// Display record create form on GET.
exports.record_create_get = async (req, res) => {
  const categories = await Category.findAll({ order: ['id'] });
  res.render('add_record', { moment, categories });
};

// Handle record create on POST.
exports.record_create_post = (req, res) => {
  const {
    txAt, category, title, status, remark,
  } = req.body;
  let { price } = req.body;
  if (status === '0') {
    price = Math.abs(price) * -1;
  }
  Record.create({
    txAt,
    categoryId: category,
    title,
    status,
    price,
    remark,
    userId: req.user,
  }).catch((err) => {
    console.log(err);
  });
  req.flash('success_msg', '新增成功!');
  res.redirect('/dashboard');
};

// Display record delete form on GET.
exports.record_delete_get = async (req, res) => {
  const item = await Record.findOne({ where: { id: req.params.id } }).catch((e) => {
    console.log(e.message);
  });
  if (!item) {
    console.log('err');
  }
  item.destroy().then(() => {
    res.status(200).send();
  });
};

// Handle record delete on POST.
exports.record_delete_post = (req, res) => {
  res.send('NOT IMPLEMENTED: record delete POST');
};

// Display record update form on GET.
exports.record_update_get = async (req, res) => {
  const categories = await Category.findAll({ order: ['id'] });
  const record = await Record.findByPk(req.params.id);
  record.price = Math.abs(record.price);
  res.render('edit_record', { moment, categories, record });
};

// Handle record update on POST.
exports.record_update_post = async (req, res) => {
  const {
    txAt, category, title, status, remark,
  } = req.body;
  let { price } = req.body;
  if (status === '0') {
    price = Math.abs(price) * -1;
  } else {
    price = Math.abs(price);
  }
  const record = await Record.findByPk(req.params.id);
  record.txAt = txAt;
  record.categoryId = category;
  record.title = title;
  record.status = status;
  record.price = price;
  record.remark = remark;
  await record.save();
  req.flash('success_msg', '新增成功!');
  res.redirect('/dashboard');
};
