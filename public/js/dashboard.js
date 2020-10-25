/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-undef */
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
function generateTableHead(table, data) {
  const thead = table.createTHead();
  const row = thead.insertRow();
  for (const key of data) {
    const th = document.createElement('th');
    const text = document.createTextNode(key);
    th.appendChild(text);
    row.appendChild(th);
  }
}

function generateTable(table, data) {
  for (const element of data) {
    const row = table.insertRow();
    for (key in element) {
      if (Object.prototype.hasOwnProperty.call(element, key)) {
        const cell = row.insertCell();
        const text = document.createTextNode(element[key]);
        cell.appendChild(text);
      }
    }
  }
}

let records = $.ajax({
  type: 'GET',
  url: '/records',
  dataType: 'json',
  async: false,
}).responseJSON;

const categories = $.ajax({
  type: 'GET',
  url: '/categories',
  async: false,
  dataType: 'json',
}).responseJSON;

let result = [];
const category = [];
const categoryId = [];
const data = {
  doughnut: [],
  bar: [],
};
records = records.sort((a, b) => new Date(a.txAt) - new Date(b.txAt));
records.reduce((res, value) => {
  // eslint-disable-next-line no-param-reassign
  value.txAtMonth = new Date(value.txAt).getMonth();
  const key = value.category.name;
  if (!res[key]) {
    res[key] = {
      categoryId: value.categoryId,
      category: value.category.name,
      price: 0,
    };
    result.push(res[key]);
  }
  res[key].price += value.price;
  return res;
}, {});
result = result.sort((a, b) => a.categoryId - b.categoryId);
$.each(result, (i, row) => {
  category.push(row.category);
  categoryId.push(row.categoryId);
  data.doughnut.push(Math.abs(row.price));
});

const startDate = moment(records[0].txAt);
const endDate = moment(records[records.length - 1].txAt);
const days = endDate.diff(startDate, 'days');
const months = endDate.diff(startDate, 'months');

$.each(result, (i) => {
  result[i].price_per_day = Math.round(result[i].price / days);
  result[i].price_per_months = Math.round(result[i].price / months);
});
const table = document.getElementById('price_per_categories');
const tableData = Object.keys(result[0]);
generateTableHead(table, tableData);
generateTable(table, result);
data.doughnut = {
  labels: category,
  datasets: [{
    data: data.doughnut,
    borderWidth: 1,
    backgroundColor: COLORS,
  }],
};
let canvas = document.getElementById('doughnut');
let ctx = canvas.getContext('2d');
const doughnutChart = new Chart(ctx, {
  type: 'doughnut',
  data: data.doughnut,
});

document.getElementById('doughnut').onclick = function onclick(evt) {
  const activePoints = doughnutChart.getElementsAtEvent(evt);
  if (activePoints[0]) {
    const chartData = activePoints[0]._chart.config.data;
    const idx = activePoints[0]._index;

    const label = chartData.labels[idx];
    // const value = chartData.datasets[0].data[idx];
    // const url = `label=${label}?/records/${categories.find((element) => element.name === label).id}&value=${value}`;
    $.get(`/records/${categories.find((element) => element.name === label).id}`, (data) => {
      $('#table').bootstrapTable('load', data);
    });
    console.log(`/records/${categories.find((element) => element.name === label).id}`);
  }
};

result = [];

records.reduce((res, value) => {
  const key = `${value.txAtMonth}:${value.categoryId}`;
  if (!res[key]) {
    res[key] = {
      Id: value.txAtMonth,
      categoryId: value.categoryId,
      category: value.category.name,
      price: 0,
    };
    result.push(res[key]);
  }
  res[key].price += value.price;
  return res;
}, {});
let items = records;
const labels = [];
for (let i = 0; i < 12; i += 1) {
  labels.push(moment().month(i).format('MMM'));
}
items = [];
$.each(categories, (i, row) => {
  items.push(result.filter((item, index, array) => item.categoryId === categories[i].id));
});

$.each(items, (i, row) => {
  if (row.length !== 0) {
    const tmp = new Array(12).fill(0);
    $.each(row, (i, r) => {
      tmp[r.Id] = r.price;
    });
    data.bar[i] = tmp;
  }
});
const datasets = [];
let current = 0;
for (let i = 0; i < data.bar.length; i += 1) {
  if (Array.isArray(data.bar[i])) {
    datasets.push({
      label: categories[i].name,
      backgroundColor: COLORS[current += 1],
      data: data.bar[i],
    });
  }
}

data.bar = {
  labels,
  datasets,
};

canvas = document.getElementById('bar');
ctx = canvas.getContext('2d');
const barChart = new Chart(ctx, {
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
});
console.log(categories);

const $table = $('#table');
const $remove = $('#remove');
let selections = [];

function getIdSelections() {
  return $.map($table.bootstrapTable('getSelections'), (row) => row.id);
}

function responseHandler(res) {
  $.each(res.rows, (i, row) => {
    row.state = $.inArray(row.id, selections) !== -1;
  });
  return res;
}

function detailFormatter(index, row) {
  const html = [];
  html.push(`<p><b>ID :</b> ${row.id}</p>`);
  html.push(`<p><b>類別 :</b> ${row.category.name}</p>`);
  html.push(`<p><b>標題 :</b> ${row.title}</p>`);
  html.push(`<p><b>備註 :</b> ${row.remark}</p>`);
  html.push(`<p><b>發布者 :</b> ${row.user.username}</p>`);
  html.push(`<p><b><a href="/records/edit/${row.id}">[編輯]</a></b> </p>`);
  return html.join('');
}

function totalTextFormatter(data) {
  return '總額';
}

function totalPriceFormatter(data) {
  const { field } = this;
  return `$${data.map((row) => +row[field]).reduce((sum, i) => sum + i, 0)}`;
}

function dateFormatter(data) {
  return moment(data).format('YYYY-MM-DD');
}

function initTable() {
  $table.bootstrapTable('destroy').bootstrapTable({
    theadClasses: 'thead-light',
    undefinedText: 'N/A',
    data: records,
    locale: $('#locale').val(),
    columns: [
      [{
        field: 'state',
        checkbox: true,
        sortable: false,
        align: 'center',
        valign: 'middle',
        class: 'd-none',
      }, {
        field: 'id',
        title: '編號',
        sortable: true,
        align: 'center',
        visible: false,
      }, {
        field: 'txAt',
        title: '日期',
        sortable: true,
        align: 'center',
        formatter: dateFormatter,
        footerFormatter: totalTextFormatter,
      }, {
        field: 'title',
        title: '項目',
        sortable: true,
        align: 'center',
      }, {
        field: 'category.name',
        title: '類別',
        sortable: true,
        align: 'center',
        visible: false,
      }, {
        field: 'status',
        title: '收支',
        sortable: true,
        align: 'center',
        visible: false,
      }, {
        field: 'price',
        title: '金額',
        sortable: true,
        align: 'center',
        footerFormatter: totalPriceFormatter,
      }, {
        field: 'remark',
        title: '備註',
        sortable: true,
        align: 'center',
        visible: false,
      }, {
        field: 'userId',
        title: '發布',
        sortable: true,
        align: 'center',
        visible: false,
      }],
    ],
  });
  $table.on('check.bs.table uncheck.bs.table '
        + 'check-all.bs.table uncheck-all.bs.table',
  () => {
    $remove.prop('disabled', !$table.bootstrapTable('getSelections').length);
    selections = getIdSelections();
  });

  $remove.click(() => {
    const ids = getIdSelections();
    ids.forEach(
      (element) => $.ajax({
        type: 'DELETE',
        url: `/records/delete/${element}`,
        success(response) {
          console.log(response);
        },
        error(err) {
          console.log('Error:', err);
        },
      }),
    );
    $table.bootstrapTable('remove', {
      field: 'id',
      values: ids,
    });
    $remove.prop('disabled', true);
  });
}

$(() => {
  initTable();
  $('#locale').change(initTable);
});
