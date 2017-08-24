/**
 * Created by Liujx on 2017-08-09 23:27:57
 */
(function(global, $, mui, doc) {
  'use strict';
  var buyInfoJs = function() {
    mui.init();
    this.config = {
      $closeType: $('#closeType'),
      $title: $('#openType .mui-title'),
      typeName: '',
      brandArray: []
    }
    this.eventsMap = {
      "tap #buyInfoAreaItem a": "selectArea",
      "tap #selectAreaConfirm": "selectAreaConfirm",
      "tap #areaItem i": "delArea",
      "tap #openAreaItem": "openAreaItem",
      "tap #selectType": "selectTypeAjax", // 设备信息=> 加载类型
      "tap #clickType a": "selectBrandAjax", // 设备信息=> 加载品牌
      "tap #clickBrand a": "selectBrand", // 设备信息=> 选择品牌
      "tap .hide-brand": "hideBrand",
      "tap .close-type": "closeType",
      "tap #addType": "addType",
      "tap #cancelType": "cancelType",
      "tap #buyInfoTypeConfirm": "buyInfoTypeConfirm", // 收购车系 确认选择
      "tap #buyInfoTypeItem i": "delBuyInfoTypeItem"
    }
    this.initialization();
  }

  buyInfoJs.prototype = {
    constructor: buyInfoJs,
    delBuyInfoTypeItem: function(e) {
      var $this = $(e.target),
        self = this,
        tempTypeArray = [],
        tempBrandArray = [];

      $this.parent().remove();
      self._eachBuyInfoItem();

      $.each(self.config.brandArray, function(index, item) {
        $.each(item, function(key, val) {
          if ($.isArray(val)) {
            tempTypeArray.push(item[0]);
            tempBrandArray.push(val[0]);
          }
        });
      });

      $.ajax({
        url: SITE_URL + '/apiu/?a=buyinfoType',
        type: 'POST',
        data: {
          cars_type: tempTypeArray.join(','),
          cars_brand: tempBrandArray.join(',')
        },
        dataType: "json",
        success: function(data) {
          if (data.result == 'ok') {
            self.config.brandArray = [];
            self._muiToast(data.data.msg);
          } else {
            self._muiToast(data.data.msg);
          }
        }
      });
    },
    _eachBuyInfoItem: function() {
      var brandArray = this.config.brandArray;
      $('#buyInfoTypeItem span').each(function() {
        var $this = $(this),
          cateid = $this.attr('data-cateid'),
          brandid = $this.attr('data-brandid'),
          allNameArray = ($this.text()).split('-'),
          typeName = allNameArray[0],
          brandName = allNameArray[1],
          isItem;
        $.each(brandArray, function(index, item) {
          if (brandArray[index][0] == cateid) {
            isItem = true;
            item.push([brandid, brandName]);
            return false;
          } else {
            isItem = false;
          }
        });
        if (!isItem) {
          brandArray.push([cateid, typeName, [brandid, brandName]]);
        }
      });
    },
    buyInfoTypeConfirm: function() {
      var self = this,
        _list = '',
        tempTypeArray = [],
        tempBrandArray = [],
        brandArray = this.config.brandArray;

      $.each(brandArray, function(index, item) {
        $.each(item, function(key, val) {
          if ($.isArray(val)) {
            tempTypeArray.push(item[0]);
            tempBrandArray.push(val[0]);
            _list += '<span data-cateid="' + item[0] + '" data-brandid="' + val[0] + '">' + item[1] + '-' + val[1] + '<i class="iconfont icon-close47"></i></span>'
          }
        });
      });
      $.ajax({
        url: SITE_URL + '/apiu/?a=buyinfoType',
        type: 'POST',
        data: {
          cars_type: tempTypeArray.join(','),
          cars_brand: tempBrandArray.join(',')
        },
        dataType: "json",
        success: function(data) {
          if (data.result == 'ok') {
            $('#buyInfoTypeItem').html(_list);
            self._muiToast(data.data.msg);
            self.config.brandArray = [];
            mui('#openType').offCanvas().close();
            self.hideBrand();
          } else {
            self._muiToast(data.data.msg);
          }
        }
      });
    },
    hideBrand: function() {
      this.config.$closeType.removeClass('hide-brand').addClass('close-type');
      this.config.$title.text('选择机型');
      $('#selectBrand').hide();
      $('#selectTypeNone').show();
    },
    closeType: function() {
      this.config.brandArray = [];
      mui('#openType').offCanvas().close();
    },
    addType: function() {
      this._eachBuyInfoItem();
    },
    cancelType: function() {
      this.closeType();
      this.hideBrand();
    },
    selectBrand: function(e) {
      var self = this,
        $this = $(e.target),
        itemNum = 0,
        typeName = self.config.typeName,
        brandArray = this.config.brandArray,
        cateid = $this.parent().parent().attr('data-id') || $this.parent().parent().parent().attr('data-id'),
        brandid = $this.attr('data-id') || $this.parent().attr('data-id'),
        brandName = $this.text() || $this.siblings('span').text() || $this.children('span').text();

      $.each(brandArray, function(index, item) {
        itemNum += (item.length - 2);
      });

      if ($this.hasClass('active')) {
        $.each(brandArray, function(index, item) {
          if (item[0] == cateid) {
            item.removeByValue([brandid, brandName]);
            return;
          }
        });
        $this.removeClass('active');
      } else if (itemNum >= 6) {
        self._muiToast('最多选择6个收购车系哦~');
        return false;
      } else {
        var isItem;
        $.each(brandArray, function(index, item) {
          if (brandArray[index][0] == cateid) {
            isItem = true;
            item.push([brandid, brandName]);
            return false;
          } else {
            isItem = false;
          }
        });
        if (!isItem) {
          brandArray.push([cateid, typeName, [brandid, brandName]]);
        }
        $this.addClass('active');
      }
    },
    selectBrandAjax: function(e) {
      var self = this,
        $this = $(e.target),
        cateid = $this.attr('data-id');

      $('.mui-table-view-cell .mui-collapse-content a').removeClass('active');
      $this.addClass('active');

      $.ajax({
        url: SITE_URL + '/api/?a=selectCateBrand',
        type: 'POST',
        data: {
          cateid: cateid
        },
        dataType: "json",
        beforeSend: function() {
          $('#openType').append('<div class="loadding"><span class="mui-spinner mui-spinner-white"></span></div>')
        },
        success: function(data) {
          var _items = data.data.normal,
            _recom = data.data.recom,
            _list = '',
            _hotList = '',
            _hotAll = '',
            _brandlist = '',
            _model;
          if (data.result == 'ok' && _items != null) {
            for (var i = 0, len = _items.length; i < len; i++) {
              _model = _items[i];
              $.each(_model.brandlist, function(index, item) {
                _brandlist += '<li><a href="javascript:;" data-id="' + item.id + '">' + item.name + '</a></li>'
              });
              _list += '<div class="pp-cancas-block-tip" data-group="' + _model.first_letter + '">' + _model.first_letter + '</div><div class="pp-canvas-list" data-id="' + cateid + '" id="clickBrand">' + _brandlist + '</div>'
              _brandlist = '';
            }
            if (_recom != null) {
              $.each(_recom, function(index, item) {
                _hotList += '<li><a href="javascript:;" data-id="' + item.id + '"><span>' + item.name + '</span><img src="' + item.logo + '" alt="' + item.name + '"></a></li>'
              });
              _hotAll = '<div class="pp-cancas-block-tip" data-group="热">热门品牌</div><div class="pp-canvas-hotbrand mui-clearfix" data-id="' + cateid + '" id="clickBrand">' + _hotList + '</div>'
            }
            $('.loadding').remove();
            $('#brandListScroll .mui-scroll').html(_hotAll + _list);
            self._eachbuyInfoAddActive(false);
            self.config.typeName = $this.text();
            self._indexedList();
            self.config.$title.text('选择品牌');
            self.config.$closeType.removeClass('close-type').addClass('hide-brand');
            $('#selectTypeNone').hide();
            $('#selectBrand').show();
          } else {
            self._muiToast(data.data.msg);
          }
        }
      });
    },
    selectTypeAjax: function(e) { // 选择型号
      var self = this,
        $this = $(e.target),
        parentId = $this.attr('data-id');

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
                _list += '<a href="javascript:;" data-id="' + _model.id + '">' + _model.name + '</a>'
              }
              $this.siblings('.mui-collapse-content').html(_list);
              self._eachbuyInfoAddActive(true);
            } else {
              self._muiToast(data.data.msg);
            }
          }
        });
      }
    },
    _eachbuyInfoAddActive: function(isEach) {
      var self = this,
        tempTypeArray = [],
        tempBrandArray = [];

      $.each(self.config.brandArray, function(index, item) {
        $.each(item, function(key, val) {
          if ($.isArray(val)) {
            tempTypeArray.push(item[0]);
            tempBrandArray.push(val[0]);
          }
        });
      });

      if (isEach) {
        $('.mui-table-view-cell.mui-active #clickType a').each(function() {
          var $this = $(this);
          $.each(tempTypeArray, function(index, item) {
            if ($this.attr('data-id') == item) {
              $this.addClass('active');
            }
          });
        });
      } else {
        $('#brandListScroll a').each(function() {
          var $this = $(this);
          $.each(tempTypeArray, function(index, item) {
            if ($this.parent().parent().attr('data-id') == item) {
              $.each(tempBrandArray, function(val, key) {
                if ($this.attr('data-id') == key) {
                  $this.addClass('active');
                }
              });
            }
          });

        });
      }
    },
    _indexedList: function() {
      mui.ready(function() {
        var header = document.getElementById('brandBar');
        var footer = document.getElementById('footerBar');
        var list = document.getElementById('selectBrand');
        //calc hieght
        list.style.height = (document.body.offsetHeight - header.offsetHeight - footer.offsetHeight) + 'px';
        //create
        window.indexedList = new mui.IndexedList(list);
      });
    },
    openAreaItem: function() {
      var area = $("input[name=area]").val(),
        areaArray = area.split(',');
      $('#buyInfoAreaItem a').each(function() {
        var $this = $(this),
          areaID = $(this).attr('data-aid');
        $.each(areaArray, function(index, item) {
          if (item == areaID) {
            $this.addClass("active");
          }
        })
      });
    },
    delArea: function(e) {
      var self = this,
        $this = $(e.target),
        thisArea = $this.parent().attr('data-area'),
        allArea = $("input[name=area]").val(),
        newArea = this._splitStr(allArea, thisArea);
      $("input[name=area]").val(newArea);
      $.ajax({
        url: SITE_URL + '/apiu/?a=buyinfoArea',
        type: 'POST',
        data: {
          area: newArea
        },
        dataType: "json",
        success: function(data) {
          if (data.result == 'ok') {
            $this.parent().remove();
            self._muiToast(data.data.msg);
          } else {
            self._muiToast(data.data.msg);
          }
        }
      });
    },
    selectAreaConfirm: function() {
      var self = this,
        _list = '',
        areaIDArray = [],
        areaNameAttay = [];
      $('#buyInfoAreaItem .active').each(function() {
        var areaName = $(this).text(),
          areaID = $(this).attr('data-aid');
        areaIDArray.push(areaID);
        _list += '<span data-area="' + areaID + '">' + areaName + '<i class="iconfont icon-close47"></i></span>'
      });
      $("input[name=area]").val(areaIDArray.join(','));
      $.ajax({
        url: SITE_URL + '/apiu/?a=buyinfoArea',
        type: 'POST',
        data: {
          area: areaIDArray.join(',')
        },
        dataType: "json",
        success: function(data) {
          if (data.result == 'ok') {
            self._muiToast(data.data.msg);
            $('#areaItem').html(_list);
            mui('#openArea').offCanvas().close();
          } else {
            self._muiToast(data.data.msg);
          }
        }
      });
    },
    selectArea: function(e) {
      var self = this,
        $this = $(e.target),
        area = $this.attr('data-area');

      if ($this.hasClass('active')) {
        $this.removeClass('active');
      } else if ($('#buyInfoAreaItem .active').length < 3) {
        $this.addClass('active');
      } else {
        self._muiToast('最多可选择三个地区');
      }
    },
    _splitStr: function(str, s) {
      var StrArray = str.split(',');
      StrArray.removeByValue(s);
      var newStr = StrArray.join(',');
      return newStr;
    },
    _muiToast: function(msg) {
      mui.toast(msg, { duration: '3000ms', type: 'div' });
    },
    innerScroll: function() {
      mui(".mui-scroll-wrapper").scroll({
        deceleration: 0.0005
      });
    },
    initialization: function() { // 初始化
      this.innerScroll();
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

  Array.prototype.removeByValue = function(val) {
    for (var i = 0; i < this.length; i++) {
      if (this[i][1] == val[1]) {
        this.splice(i, 1);
        break;
      }
    }
  }

  global.buyInfoJs = buyInfoJs;

  $(function() {
    new buyInfoJs();
  });

})(this, this.jQuery, this.mui, document);