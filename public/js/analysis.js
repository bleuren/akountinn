/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
$.get('/records', (records) => {
  let canvas = document.getElementById('doughnut');
  let ctx = canvas.getContext('2d');
  const doughnut = new Chart(ctx, records.charts.doughnut);
  canvas = document.getElementById('bar');
  ctx = canvas.getContext('2d');
  const bar = new Chart(ctx, records.charts.bar);

  document.getElementById('doughnut').onclick = function onclick(evt) {
    const activePoints = doughnut.getElementsAtEvent(evt);
    if (activePoints[0]) {
      const chartData = activePoints[0]._chart.config.data;
      const idx = activePoints[0]._index;

      const label = chartData.labels[idx];
      $.get(`/records/${records.categories.find((element) => element.name === label).id}`, (data) => {
        $('#tableOverView').bootstrapTable('load', data);
      });
      console.log(`/records/${records.categories.find((element) => element.name === label).id}`);
    }
  };

  const $tableOverView = $('#tableOverView');
  const $tableByAvgPrice = $('#tableByAvgPrice');
  const $remove = $('#remove');
  let selections = [];

  function getIdSelections() {
    return $.map($tableOverView.bootstrapTable('getSelections'), (row) => row.id);
  }

  function detailFormatter(index, row) {
    const html = [];
    html.push(`<p><b>ID :</b> ${row.id}</p>`);
    html.push(`<p><b>類別 :</b> ${row.category.name}</p>`);
    html.push(`<p><b>標題 :</b> ${row.title}</p>`);
    html.push(`<p><b>備註 :</b> ${row.remark}</p>`);
    html.push(`<p><b>發布者 :</b> ${row.user.username}</p>`);
    html.push(`<p><b>群組 :</b> ${row.team.name}</p>`);
    html.push(`<p><b><a href="/records/edit/${row.id}">[編輯]</a></b> </p>`);
    return html.join('');
  }

  function totalTextFormatter() {
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
    $tableByAvgPrice.bootstrapTable('destroy').bootstrapTable({
      theadClasses: 'thead-light',
      undefinedText: 'N/A',
      showFooter: true,
      toolbar: '#toolbarByAvgPrice',
      data: records.priceByCategory,
      locale: $('#locale').val(),
      columns: [
        [{
          field: 'categoryId',
          sortable: true,
          visible: false,
        }, {
          field: 'category',
          title: '類別',
          sortable: true,
          align: 'center',
          footerFormatter: totalTextFormatter,
        }, {
          field: 'price',
          title: '總金額',
          sortable: true,
          align: 'center',
          footerFormatter: totalPriceFormatter,
        }, {
          field: 'price_per_day',
          title: '每日金額',
          sortable: true,
          align: 'center',
          footerFormatter: totalPriceFormatter,
        }, {
          field: 'price_per_months',
          title: '每月金額',
          sortable: true,
          align: 'center',
          footerFormatter: totalPriceFormatter,
        }],
      ],
    });

    $tableOverView.bootstrapTable('destroy').bootstrapTable({
      theadClasses: 'thead-light',
      undefinedText: 'N/A',
      data: records.summary,
      idField: 'id',
      showFooter: true,
      pagination: true,
      pageList: '[10, 25, 50, 100, all]',
      minimumCountColumns: 2,
      showCopyRows: true,
      clickToSelect: true,
      detailView: true,
      showColumnsToggleAll: true,
      showColumns: true,
      search: true,
      paginationDetailHAlign: 'right',
      paginationHAlign: 'left',
      searchAlign: 'left',
      toolbar: '#toolbarOverView',
      sortName: 'txAt',
      sortOrder: 'desc',
      detailFormatter,
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
    $tableOverView.on('check.bs.table uncheck.bs.table '
          + 'check-all.bs.table uncheck-all.bs.table',
    () => {
      $remove.prop('disabled', !$tableOverView.bootstrapTable('getSelections').length);
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
      $tableOverView.bootstrapTable('remove', {
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
});
