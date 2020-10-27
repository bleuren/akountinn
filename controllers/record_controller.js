/* eslint-disable no-shadow */
const moment = require('moment');
const { Record } = require('../models');
const { User } = require('../models');
const { Category } = require('../models');

exports.index = (req, res) => {
  res.send('NOT IMPLEMENTED: Site Home Page');
};

// Display list of all records.
exports.record_list = async (req, res) => {
  const COLORS = [
    'rgb(255, 99, 132)',
    'rgb(54, 162, 235)',
    'rgb(255, 205, 86)',
    'rgba(51, 102, 204)',
    'rgba(220, 57, 18)',
    'rgba(255, 153, 0)',
    'rgba(16, 150, 24)',
    'rgba(153, 0, 153)',
    'rgba(0, 153, 198)',
    'rgba(221, 68, 119)',
    'rgba(102, 170, 0)',
    'rgba(184, 46, 46)',
    'rgba(49, 99, 149)',
    'rgba(153, 68, 153)',
    'rgba(34, 170, 153)',
    'rgba(170, 170, 17)',
    'rgba(102, 51, 204)',
    'rgba(230, 115, 0)',
    'rgba(139, 7, 7)',
    'rgba(101, 16, 103)',
    'rgba(50, 146, 98)',
    'rgba(85, 116, 166)',
    'rgba(59, 62, 172)',
    'rgba(183, 115, 34)',
    'rgba(22, 214, 32)',
    'rgba(185, 19, 131)',
    'rgba(244, 53, 158)',
    'rgba(156, 89, 53)',
    'rgba(169, 196, 19)',
    'rgba(42, 119, 141)',
    'rgba(102, 141, 28)',
    'rgba(190, 164, 19)',
    'rgba(12, 89, 34)',
    'rgba(116, 52, 17)',
    'rgba(255, 99, 132)',
    'rgba(54, 162, 235)',
    'rgba(255, 206, 86)',
    'rgba(75, 192, 192)',
    'rgba(153, 102, 255)',
    'rgba(255, 159, 64)',
  ];
  const categories = await Category.findAll({ order: ['id'] });
  let summary = await Record.findAll({
    include: [{ model: User, attributes: ['id', 'username'], as: 'user' }, { model: Category, attributes: ['id', 'name'], as: 'category' }],
    order: [['txAt', 'DESC']],
  });
  summary = summary.sort((a, b) => new Date(a.txAt) - new Date(b.txAt));
  let priceByCategory = [];
  const category = [];
  const categoryId = [];
  const data = {
    doughnut: [],
    bar: [],
  };
  summary.reduce((res, value) => {
    // eslint-disable-next-line no-param-reassign
    value.txAtMonth = new Date(value.txAt).getMonth();
    const key = value.category.name;
    if (!res[key]) {
      res[key] = {
        categoryId: value.categoryId,
        category: value.category.name,
        price: 0,
      };
      priceByCategory.push(res[key]);
    }
    res[key].price += value.price;
    return res;
  }, {});
  priceByCategory = priceByCategory.sort((a, b) => a.categoryId - b.categoryId);

  priceByCategory.forEach((item) => {
    category.push(item.category);
    categoryId.push(item.categoryId);
    data.doughnut.push(Math.abs(item.price));
  });

  const startDate = moment(summary[0].txAt);
  const endDate = moment(summary[summary.length - 1].txAt);
  const days = endDate.diff(startDate, 'days');
  const months = endDate.diff(startDate, 'months');
  priceByCategory.forEach((item, index) => {
    priceByCategory[index].price_per_day = Math.round(priceByCategory[index].price / days);
    priceByCategory[index].price_per_months = Math.round(priceByCategory[index].price / months);
  });

  const resultByMonth = [];

  summary.reduce((res, value) => {
    const key = `${value.txAtMonth}:${value.categoryId}`;
    if (!res[key]) {
      res[key] = {
        Id: value.txAtMonth,
        categoryId: value.categoryId,
        category: value.category.name,
        price: 0,
      };
      resultByMonth.push(res[key]);
    }
    res[key].price += value.price;
    return res;
  }, {});

  const items = [];
  const labels = [];
  for (let i = 0; i < 12; i += 1) {
    labels.push(moment().month(i).format('MMM'));
  }
  categories.forEach((item, index) => {
    items.push(resultByMonth.filter((item) => item.categoryId === categories[index].id));
  });
  items.forEach((item, index) => {
    if (item.length !== 0) {
      const tmp = new Array(12).fill(0);
      item.forEach((item) => {
        tmp[item.Id] = item.price;
      });
      data.bar[index] = tmp;
    }
  });
  data.doughnut = {
    labels: category,
    datasets: [{
      data: data.doughnut,
      borderWidth: 1,
      backgroundColor: COLORS,
    }],
  };

  const datasets = [];
  let current = 0;
  for (let i = 0; i < data.bar.length; i += 1) {
    if (Array.isArray(data.bar[i])) {
      datasets.push({
        label: categories[i].name,
        backgroundColor: COLORS[current],
        data: data.bar[i],
      });
      current += 1;
    }
  }
  data.bar = {
    labels,
    datasets,
  };
  const bar = {
    type: 'bar',
    data: data.bar,
    options: {
      title: {
        display: true,
      },
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      responsive: true,
      scales: {
        xAxes: [{
          stacked: true,
        }],
        yAxes: [{
          stacked: true,
        }],
      },
    },
  };
  const doughnut = {
    type: 'doughnut',
    data: data.doughnut,
  };
  const charts = { bar, doughnut };
  res.json({
    categories, category, summary, priceByCategory, charts,
  });
};

// Display detail page for a specific record.
exports.record_detail = (req, res) => {
  Record.findAll({
    include: [{ model: User, attributes: ['id', 'username'], as: 'user' }, { model: Category, attributes: ['id', 'name'], as: 'category' }],
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
