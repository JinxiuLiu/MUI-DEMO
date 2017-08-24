/**
 * Created by Liujx on 2017-07-26 21:45:55
 */
(function(global, $, mui, doc) {
  'use strict';

  var carsJs = function() {
    mui.previewImage();
    this.eventsMap = {
      "tap #carBid": "clickOfferBtn",
      "tap .pp-car-footer-collect": "clickCollect"
    }
    this.initialization();
  }

  carsJs.prototype = {
    constructor: carsJs,
    carsSlider: function() {
      //获得slider插件对象
      var gallery = mui('.mui-slider');
      gallery.slider({
        interval: 5000, // 自动轮播周期，若为0则不自动播放，默认为0
        scrollTime: 500, // 轮播动画时间
        snapX: 0.4 // //横向切换距离(以当前容器宽度为基准)
      });
      $('#curNum').text(gallery.slider().itemLength - 2);
      doc.querySelector('.mui-slider').addEventListener('slide', function(e) {
        $('#total').text(e.detail.slideNumber + 1);
      });
    },
    clickCollect: function(e) {
      var $this = $(e.currentTarget),
        $collectSpan = $this.find("span"),
        textName = $collectSpan.text(),
        pid = $this.attr('data-id');

      if (!LOGINING) {
        mui.toast('您还没有登录！', { duration: '3000ms', type: 'div' });
        return false;
      }

      $.ajax({
        url: SITE_URL + '/api/collectcars',
        type: 'POST',
        data: {
          pid: pid
        },
        dataType: "json",
        success: function(data) {
          if (data.result === 'ok') {
            if (textName == "收藏") {
              $collectSpan.text("取消收藏");
              mui.toast('收藏成功！', { duration: '3000ms', type: 'div' });
              $this.addClass('active');
            } else {
              $collectSpan.text("收藏");
              mui.toast('取消收藏成功！', { duration: '3000ms', type: 'div' });
              $this.removeClass('active');
            }
          } else if (data.result === 'err') {
            mui.toast(data.data.msg, { duration: '3000ms', type: 'div' });
          }
        }
      });
    },
    clickOfferBtn: function() { // 出价
      var NowPrice = $('.pp-title-price').html(),
        title = '机主报价：' + NowPrice,
        message = '<input class="pp-popur-input" type="number" name="price" placeholder="请输入您的出价金额"/><span>万元</span><p>注：机主收到出价后会与您取得联系，出价不包含运费。</p>';
      mui.confirm(message, title, ['取消', '我要出价'], function(e) {
        if (e.index == 1) {
          var price = $("input[name='price']").val();
          if (!/^\d+(?=\.{0,1}\d+$|$)/.test(price) || price == "") {
            mui.toast('请输入正确的出价金额！', { duration: '3000ms', type: 'div' });
            return false;
          }
          $.ajax({
            url: SITE_URL + '/api/bidcars',
            type: 'POST',
            data: {
              pid: p_id,
              price: price
            },
            dataType: 'json',
            success: function(data) {
              if (data.result == 'ok') {
                mui.toast('出价成功', { duration: '3000ms', type: 'div' });
              } else {
                mui.toast(data.data.msg, { duration: '3000ms', type: 'div' });
              }
            }
          });

        }
      }, 'div');
    },
    ajaxCarsHits: function() {
      var shareUid = this._getQueryString('shareuid'),
        from = this._getQueryString('from');
      $.ajax({
        url: SITE_URL + '/api/ajaxcarshits',
        type: 'POST',
        data: {
          pid: p_id,
          shareuid: shareUid,
          from: from
        },
        dataType: 'json',
        success: function(data) {
          if (data.result == 'ok') {
            $('#pageView').html(data.data.data);
          }
        }
      });
    },
    _getQueryString: function(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return null;
    },
    initialization: function() { // 初始化
      this.carsSlider();
      this.ajaxCarsHits();
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

  global.carsJs = carsJs;

  $(function() {
    new carsJs();
  });

})(this, this.jQuery, this.mui, document);