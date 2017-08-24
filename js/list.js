/**
 * Created by Liujx on 2017-07-26 21:33:10
 */
(function(global, $, mui, doc) {
  'use strict';

  global.page = 1;

  var listJs = function() {
    this.config = {}
    this.eventsMap = {
      "tap #filterBlock a": "selectFilterTag", // 高级筛选
      "tap #filterConfirm": "confirmFilter", // 高级筛选 => 确定
      "tap #filterReset": "resetFilter", // 高级筛选 => 重置
      "tap #selectAreaItem a": "selectArea", // 选择地区
      "tap #selectAreaConfirm": "selectAreaConfirm", // 选择地区 => 确定
      "tap #selectType": "selectTypeAjax", // 选择类型 => ajax
      "tap #selectSort a": "selectSort", // 选择排序
      "tap #openTypeOffCanvas": "openTypeOffCanvas",
      "tap #selectBrandList a": "selectBrandList" // 选择品牌
    }
    this.initialization();
  }

  listJs.prototype = {
    constructor: listJs,
    listPullRefresh: function() {
      var self = this;
      mui.ready(function() {
        mui.init({
          pullRefresh: {
            container: '#pullrefresh',
            up: {
              height: 100, //可选.默认50.触发上拉加载拖动距离
              contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
              contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
              callback: self._pullUpRefresh
            }
          }
        });
      });
    },
    _pullUpRefresh: function() {
      var self = this,
        con = getQueryString('con'),
        type = $('#tabType .mui-active').attr('data-type');
      $.ajax({
        url: SITE_URL + '/api/?a=carsList',
        type: 'POST',
        data: {
          con: con || '',
          type: type,
          p: global.page
        },
        dataType: "json",
        success: function(data) {
          var _items = data.data.list,
            _list = '',
            _model;
          if (data.result == 'ok' && _items != null) {
            for (var i = 0, len = _items.length; i < len; i++) {
              _model = _items[i];
              _list += '<li class="pp-cars-list ' +
                (function() {
                  var p_is_sold_out = _model.p_is_sold_out;
                  if (p_is_sold_out == '1') {
                    return 'sold';
                  } else {
                    return '';
                  }
                }()) +
                '">' +
                '<a href="' + _model.p_url + '" title="' + _model.p_allname + '" class="mui-clearfix pp-cars-item">' +
                '<div class="pp-cars-img">' +
                '<div class="pp-sold-offshelf-tag"></div>' +
                (function() {
                  var pStick = _model.p_stick;
                  if (pStick) {
                    return pStick;
                  } else {
                    return '';
                  }
                }()) +
                '<img class="lazy" data-original="' + _model.p_mainpic + '" alt="' + _model.p_allname + '" />' +
                '</div>' +
                '<div class="pp-cars-info">' +
                '<h1 class="pp-cars-title">' + _model.p_allname + '</h1>' +
                '<div class="pp-cars-tag">' +
                '<span>' + _model.p_year + '年</span>' +
                '<i class="pp-cars-line">|</i>' +
                '<span>' + _model.p_hours + '小时</span>' +
                '<i class="pp-cars-line">|</i>' +
                '<span>' + _model.p_address + '</span>' +
                '</div>' +
                '<div class="pp-cars-bottom">' +
                '<div class="pp-cars-price">' + _model.p_price + '</div>' +
                '<div class="pp-cars-time">' + _model.p_addtime + '</div>' +
                '</div>' +
                '</div>' +
                '</a>' +
                '</li>'
            }
            $('#item').append(_list);
            $("img.lazy").lazyload({
              effect: 'fadein',
              placeholder_data_img: 'http://dev-static.ppershouji.com:8081/img/car.png'
            });
            global.page += 1;
            self.endPullupToRefresh(data.data.msg == '没有更多信息了！');
          } else {
            mui.toast(data.data.msg, { duration: '3000ms', type: 'div' });
            self.endPullupToRefresh(true);
          }
        }
      });

      function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
      }
    },
    selectBrandList: function(e) {
      var $this = $(e.target),
        $selectBrandConfirm = $('#selectBrandConfirm'),
        NoSelectUrl = $selectBrandConfirm.attr('data-url');

      if ($this.hasClass('active')) {
        $this.removeClass('active');
        $selectBrandConfirm.attr('href', NoSelectUrl);
      } else {
        $('#selectBrandList a').removeClass('active');
        $this.addClass('active');
        $selectBrandConfirm.attr('href', $this.attr('data-url'));
      }
    },
    selectSort: function(e) {
      var $this = $(e.target),
        $selectSortConfirm = $('#selectSortConfirm'),
        NoSelectUrl = $selectSortConfirm.attr('data-url');

      if ($this.hasClass('active')) {
        $this.removeClass('active');
        $selectSortConfirm.attr('href', NoSelectUrl);
      } else {
        $this.addClass('active').parent().siblings().children().removeClass('active');
        $selectSortConfirm.attr('href', $this.attr('data-url'));
      }
    },
    selectTypeAjax: function(e) {
      var $this = $(e.target),
        parentId = $this.attr('data-id'),
        selectID = $this.attr('data-select-id'),
        dataUrl = $('#allType').attr('data-url');
      if (!$this.parent('.mui-collapse').hasClass('mui-active')) {
        $.ajax({
          url: SITE_URL + '/api/selectCateType',
          type: 'POST',
          data: {
            parent_id: parentId
          },
          dataType: "json",
          success: function(data) {
            var _items = data.data,
              _list = '',
              _model;
            if (data.result == 'ok' && _items != null) {
              for (var i = 0, len = _items.length; i < len; i++) {
                _model = _items[i];
                _list += '<a href="' + dataUrl + 'os' + parentId + 'oj' + _model.id + '" ' +
                  (function() {
                    var NowselectID = _model.id;
                    if (selectID == NowselectID) {
                      return 'class="active"';
                    } else {
                      return '';
                    }
                  }()) +
                  '>' + _model.name + '</a>'
              }
              $this.siblings('.mui-collapse-content').html('<a href="' + dataUrl + 'os' + parentId + '">全部</a>' + _list);
            } else {
              mui.toast(data.data.msg, { duration: '3000ms', type: 'div' });
            }
          }
        });
      }
    },
    openTypeOffCanvas: function(e) {
      var self = this;
      $('#openType #selectType').each(function() {
        var $this = $(this);
        if ($this.hasClass('active')) {
          var parentId = $this.attr('data-id'),
            selectID = $this.attr('data-select-id'),
            dataUrl = $('#allType').attr('data-url');
          $.ajax({
            url: SITE_URL + '/api/selectCateType',
            type: 'POST',
            data: {
              parent_id: parentId
            },
            dataType: "json",
            success: function(data) {
              var _items = data.data,
                _list = '',
                _model;
              if (data.result == 'ok' && _items != null) {
                for (var i = 0, len = _items.length; i < len; i++) {
                  _model = _items[i];
                  _list += '<a href="' + dataUrl + 'os' + parentId + 'oj' + _model.id + '" ' +
                    (function() {
                      var NowselectID = _model.id;
                      if (selectID == NowselectID) {
                        return 'class="active"';
                      } else {
                        return '';
                      }
                    }()) +
                    '>' + _model.name + '</a>'
                }
                $this.siblings('.mui-collapse-content').html('<a href="' + dataUrl + 'os' + parentId + '">全部</a>' + _list);
                $this.parent().addClass('mui-active');
              } else {
                mui.toast(data.data.msg, { duration: '3000ms', type: 'div' });
              }
            }
          });
        }
      });
    },
    selectAreaConfirm: function() {
      var conArry = [],
        con = '',
        dataUrl = $('#selectAreaItem').attr('data-area-url');

      $('#selectAreaItem .active').each(function() {
        var $this = $(this);
        conArry.push($(this).attr('data-value'));
      });
      con = conArry.join(',');
      if (con != "") {
        window.location.href = dataUrl + 'oa' + con;
      } else {
        window.location.href = dataUrl;
      }
    },
    selectArea: function(e) {
      var $this = $(e.target);
      if ($this.hasClass('active')) {
        $this.removeClass('active');
      } else if ($('#selectAreaItem .active').length < 3) {
        $this.addClass('active');
      } else {
        mui.toast('最多可选择三个地区', { duration: '3000ms', type: 'div' });
      }
    },
    confirmFilter: function(e) { // 筛选-确认
      var $this = $(e.target),
        dataUrl = $this.attr('data-con'),
        con = '';
      $("#filterBlock .pp-canvas-block-item .active").each(function(i, item) {
        var $this = $(this);
        con += $this.attr('data-value');
      });
      if (con != "") {
        window.location.href = dataUrl + con;
      } else {
        window.location.href = dataUrl;
      }
    },
    resetFilter: function() { // 筛选-重置
      $('#filterBlock a').removeClass('active').parent().attr('data-value', '');
    },
    selectFilterTag: function(e) { // 筛选-选择
      var $this = $(e.target),
        value = $this.attr('data-value');
      $this.addClass('active').siblings().removeClass('active');
      $this.parent().attr('data-value', value);
    },
    forbidOffCanvas: function() { // 禁止滑动侧栏
      var offCanvasInner = mui('.mui-off-canvas-wrap')[0].querySelector('.mui-inner-wrap');
      offCanvasInner.addEventListener('drag', function(event) {
        event.stopPropagation();
      });
    },
    innerScroll: function() {
      mui(".mui-scroll-wrapper").scroll({
        deceleration: 0.0005
      });
    },
    initialization: function() { // 初始化
      this.forbidOffCanvas();
      this.innerScroll();
      this.listPullRefresh();
      this._scanEventsMap(this.eventsMap, true);
    },
    _scanEventsMap: function(maps, isOn) {
      var delegateEventSplitter = /^(\S+)\s*(.*)$/;
      var bind = isOn ? this._delegate : this._undelegate;
      for (var keys in maps) {
        if (maps.hasOwnProperty(keys)) {
          var matchs = keys.match(delegateEventSplitter);
          bind(matchs[1], matchs[2], this[maps[keys]].bind(this));
        }
      }
    },
    _delegate: function(name, selector, func) {
      $(doc).on(name, selector, func);
    },
    _undelegate: function(name, selector, func) {
      $(doc).off(name, selector, func);
    }
  }

  global.listJs = listJs;

  $(function() {
    new listJs();
  });

})(this, this.jQuery, this.mui, document);