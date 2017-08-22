/**
 * Created by Liujx on 2017-08-03;
 */
(function(global, $, mui, doc) {
	'use strict';
	global.page = 1;
	var shopJs = function() {
		this.config = {}
		this.eventsMap = {
			"tap #refresh": "clickRefresh",
			"tap #remark": "clickRemark",
			"tap #delete": "clickDelete",
			"tap #putaway": "clickPutaway",
			"tap #adjustment": "clickAdjustment",
			"tap #soldOut": "addAttrPid",
			"tap #beenSold": "clickBeenSold",
			"tap #noSell": "clickNoSell"
		}
		this.initialization();
	}

	shopJs.prototype = {
		constructor: shopJs,
		shopPullRefresh: function() {
			var self = this;
			mui.ready(function() {
				mui.init({
					pullRefresh: {
					    container: '#pullrefresh',
					    up: {
					    	height: 100,	//可选.默认50.触发上拉加载拖动距离
					    	contentrefresh: "正在加载...",	//可选，正在加载状态时，上拉加载控件上显示的标题内容
					    	contentnomore: '没有更多数据了',	//可选，请求完毕若没有更多数据时显示的提醒内容；
					    	callback: self._pullUpRefresh
					    }
					}
				});
			});
		},
		_pullUpRefresh: function() {
			var self = this,
				source = getQueryString('source'),
				type = getQueryString('type');
			
			$.ajax({
                url: SITE_URL+'/apiu/?a=moreCarsList',
                type: 'POST',
                data: {
                	source: source,
                	type: type,
                    p: global.page
                },
                dataType:"json",
                success: function(data){
                	var _items = data.data.list,
            			_list = '',
            			_model;
                    if(data.result == 'ok' && _items != null) {
                        for(var i = 0,len = _items.length; i < len; i++){
                        	_model = _items[i];
                        	_list += '<li class="pp-shop-item">'+
						                '<a href="'+_model.p_url+'" class="mui-clearfix pp-cars-item">'+
						                    '<div class="pp-cars-img">'+
						                        '<img class="lazy" data-original="'+_model.p_mainpic+'" alt="'+_model.p_allname+'" />'+
						                    '</div>'+
						                    '<div class="pp-cars-info">'+
						                        '<h1 class="pp-cars-title">'+_model.p_allname+'</h1>'+
						                        '<div class="pp-cars-tag">'+
						                            '<span>'+_model.p_year+'年</span>'+
						                            '<i class="pp-cars-line">|</i>'+
						                            '<span>'+_model.p_hours+'小时</span>'+
						                            '<i class="pp-cars-line">|</i>'+
						                            '<span>'+_model.city_name+'</span>'+
						                        '</div>'+
						                        '<div class="pp-cars-tag color999">'+
						                            '<span>浏览: '+_model.hits+'</span>'+
						                            '<i class="pp-cars-line">|</i>'+
						                            '<span>分享: '+_model.share_count+'</span>'+
						                            '<i class="pp-cars-line">|</i>'+
						                            '<span>在售: '+_model.p_addtime+'</span>'+
						                        '</div>'+
						                        '<div class="pp-cars-bottom">'+
						                            '<div class="pp-cars-price">'+_model.p_price+'</div>'+
						                            '<div class="pp-cars-time">'+_model.p_listtime+'更新</div>'+
						                        '</div>'+
						                    '</div>'+
						                '</a>'+
						                '<div class="pp-shop-operation mui-clearfix" data-pid="'+_model.p_id+'">'+
						                	(function() {
							                	var list = '';
							                	if(type == '0') {
							                		list += '<a href="javascript:;" class="pp-operation-item">编辑</a>'+
										                	'<a href="javascript:;" class="pp-operation-item" id="adjustment">调价</a>'+
										                	'<a href="javascript:;" class="pp-operation-item" id="stick">置顶</a>'+
										                	'<a href="javascript:;" class="pp-operation-item" id="refresh">刷新</a>'+
										                	'<a href="#opeSoldOut" class="pp-operation-item" id="soldOut">下架</a>'+
										                    '<a href="javascript:;" class="pp-operation-item" id="remark">备注</a>'
							                	} else if(type == '1') {
							                		list += '<a href="javascript:;" class="pp-operation-item" id="delete">删除</a>'+
		                    								'<a href="javascript:;" class="pp-operation-item" id="republish">重新发布</a>'
							                	} else if(type == '2') {
							                		list += '<a href="javascript:;" class="pp-operation-item" id="delete">删除</a>'+
										                    '<a href="javascript:;" class="pp-operation-item" id="remark">备注</a>'+
										                    '<a href="javascript:;" class="pp-operation-item">编辑</a>'+
										                    '<a href="javascript:;" class="pp-operation-item" id="adjustment">调价</a>'+
										                    '<a href="javascript:;" class="pp-operation-item" id="beenSold">已售</a>'+
										                    '<a href="javascript:;" class="pp-operation-item" id="putaway">上架</a>'
							                	}
							                	return list;
							                }())+
						                '</div>'+
						                '<div class="pp-shop-tag mui-clearfix"><em>备注：</em><span id="remarkContent">'+
						                (function() {
						                	var lastRemark = _model.last_remark;
						                	if(lastRemark) {
						                		return lastRemark;
						                	} else {
						                		return '无';
						                	}
						                }())+
						                '</span></div>'+
						            '</li>'
                       }
            			$('#shopContent').append(_list);
            			global.page += 1;
            			$("img.lazy").lazyload({
							effect: 'fadein',
							placeholder_data_img: 'http://dev-static.ppershouji.com:8081/img/car.png'
						});
            			self.endPullupToRefresh(data.data.msg == '没有更多信息了！');
                    } else {
                    	mui.toast(data.data.msg, { duration:'3000ms', type:'div' });
                    	self.endPullupToRefresh(true);
                    }
                }
            });
            function getQueryString(name) {
            	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
			    var r = window.location.search.substr(1).match(reg);
			    if(r!=null)return  unescape(r[2]); return null;
            }
		},
		addAttrPid: function(e) {
			var $this = $(e.target),
				pid = $this.parent().attr('data-pid');
			$('.pp-soldout-popup').attr('data-pid', pid);
		},
		clickPutaway: function(e) {
			var self = this,
				$this = $(e.target),
				pid = $this.parent().attr('data-pid');
			$.ajax({
	            url: SITE_URL+'/apiu/?a=carShelves',
	            type: 'POST',
	            data: {
	                pid: pid
	            },
	            dataType:"json",
	            success: function(data){
	                if(data.result == 'ok') {
	                    self._muiToast('上架成功');
	                } else {
	                	self._muiToast(data.data.msg);
	                }
	            }
	        });
		},
		clickDelete: function(e) {
			var self = this,
				$this = $(e.target),
				pid = $this.parent().attr('data-pid');
			$.ajax({
	            url: SITE_URL+'/apiu/?a=carDel',
	            type: 'POST',
	            data: {
	                pid: pid
	            },
	            dataType:"json",
	            success: function(data){
	                if(data.result == 'ok') {
	                    self._muiToast('删除成功');
	                    $this.parent().parent().remove();
	                } else {
	                	self._muiToast(data.data.msg);
	                }
	            }
	        });
		},
		clickBeenSold: function(e) {	// 售出 => OK
			var self = this,
				$this = $(e.target),
				pid = $this.parent().attr('data-pid');
			$.ajax({
	            url: SITE_URL+'/apiu/?a=carSold',
	            type: 'POST',
	            data: {
	                pid: pid
	            },
	            dataType:"json",
	            success: function(data){
	                if(data.result == 'ok') {
	                    self._muiToast('售出成功');
	                    mui('.mui-popover').popover('toggle')
	                } else {
	                	self._muiToast(data.data.msg);
	                	mui('.mui-popover').popover('toggle')
	                }
	            }
	        });
		},
		clickNoSell: function(e) {	// 不想卖了 => OK
			var self = this,
				$this = $(e.target),
				pid = $this.parent().attr('data-pid');
			$.ajax({
	            url: SITE_URL+'/apiu/?a=carUnder',
	            type: 'POST',
	            data: {
	                pid: pid
	            },
	            dataType:"json",
	            success: function(data){
	                if(data.result == 'ok') {
	                    self._muiToast('下架成功');
	                    mui('.mui-popover').popover('toggle')
	                } else {
	                	self._muiToast(data.data.msg);
	                	mui('.mui-popover').popover('toggle')
	                }
	            }
	        });
		},
		clickAdjustment: function(e) {	// 调价 => OK
			var self = this,
				$this = $(e.target),
				nowPrice = $this.attr('data-price'),
				title = '<span class="pp-popur-adjustment">当前：<em class="bold">'+nowPrice+'</em></span>',
                message = '<input class="pp-popur-input" name="discount" type="number" placeholder="请输入调整后价格"/><span>万元</span>';
            mui.confirm(message, title, ['取消','确认'], function (e) {
                if(e.index == 1) {
                	var pid = $this.parent().attr('data-pid'),
                		price = (Number($("input[name=discount]").val())).toFixed(2);;
                	if (!/^\d+(?=\.{0,1}\d+$|$)/.test(price) || price =="") {
                		self._muiToast('请输入正确的调价金额');
						return false;
					}
                	$.ajax({
		                url: SITE_URL+'/apiu/?a=carPrice',
		                type: 'POST',
		                data: {
		                    pid: pid,
		                    price: price
		                },
		                dataType:"json",
		                success: function(data){
		                    if(data.result == 'ok') {
								$this.parent().siblings('.pp-cars-item').find('.pp-cars-price').text('￥'+price+'万')
								$this.attr('data-price', '￥'+price+'万');
		                        self._muiToast('调价成功');
		                        mui.closePopup();
		                    } else {
		                    	self._muiToast(data.data.msg);
		                    }
		                }
		            });
                } else {
                	$("input[name=discount]").val('');
                }
            }, 'div');
		},
		clickStick: function(e) {	// 置顶 => OK
			var self = this,
				$this = $(e.target),
				title = '请选择置顶类型',
                message = '<p>置顶规则:普通会员暂不能置顶，理事每个月可以置顶1次单台车源，秘书长每个月可以置顶2次单台车源，会长副会长每个月可以置顶3次单台车源。</p><p>每次置顶时间段为该置顶日期当天<em class="colorpp">0:00 - 24:00</em>，置顶日期请提前预约。</p><p>您本月置顶次数剩余<em class="colorpp">2</em>次，是否确认置顶？</p>';
            mui.confirm(message, title, ['取消','确认'], function (e) {
                if(e.index == 1) {
                	var pid = $this.parent().attr('data-pid');
                	$.ajax({
		                url: SITE_URL+'/apiu/?a=carTop',
		                type: 'POST',
		                data: {
		                    pid: pid
		                },
		                dataType:"json",
		                success: function(data){
		                    if(data.result == 'ok') {
		                        self._muiToast('置顶成功');
		                        mui.closePopup();
		                    } else {
		                    	self._muiToast(data.data.msg);
		                    }
		                }
		            });
                }
            }, 'div');
		},
		clickRemark: function(e) {	// 备注 => OK
			var self = this,
				$this = $(e.target),
				title = '备注',
                message = '<textarea class="remark-textarea" name="remark" rows="6" maxlength="50" placeholder="添加自定义备注，最多输入50个字"></textarea>';
            mui.confirm(message, title, ['取消','确认'], function (e) {
                if(e.index == 1) {
                	// 确认添加
                	var $textAreaVal = $('.remark-textarea').val(),
                		pid = $this.parent().attr('data-pid');
                	if($textAreaVal == '') {
                		self._muiToast('你还没有添加备注哦~');
                		$('.remark-textarea').focus();
                		return false;
                	}
                	$.ajax({
		                url: SITE_URL+'/apiu/?a=carRemark',
		                type: 'POST',
		                data: {
		                    pid: pid,
		                    remark: $textAreaVal
		                },
		                dataType:"json",
		                success: function(data){
		                    if(data.result == 'ok') {
		                        self._muiToast('备注添加成功');
		                        $this.parent().siblings().find('#remarkContent').html($textAreaVal);
		                        mui.closePopup();
		                    } else {
		                    	self._muiToast(data.data.msg);
		                    }
		                }
		            });
                } else {
                	$('.remark-textarea').val('');
                }
            }, 'div');
		},
		clickRefresh: function(e) {	// 刷新 => OK
			var self = this,
				$this = $(e.target),
				$refreshInfo = $('#fresh_content'),
				title = $refreshInfo.attr('data-title'),
                message = $refreshInfo.attr('data-content') + '\n' + $refreshInfo.attr('data-my');
            mui.confirm(message, title, ['取消','确认'], function (e) {
                if(e.index == 1) {
                	var pid = $this.parent().attr('data-pid');
                	$.ajax({
		                url: SITE_URL+'/apiu/?a=carFresh',
		                type: 'POST',
		                data: {
		                    pid: pid
		                },
		                dataType:"json",
		                success: function(data){
		                    if(data.result == 'ok') {
		                        self._muiToast('刷新成功');
		                        $refreshInfo.attr('data-my', '您今天刷新次数剩余<em class=\'colorpp\'>'+data.data.times+'</em>次，是否确认刷新？')
		                        mui.closePopup();
		                    } else {
		                    	self._muiToast(data.data.msg);
		                    }
		                }
		            });
                }
            }, 'div');
		},
		_muiToast: function(msg) {
			mui.toast(msg, { duration:'3000ms', type:'div' });
		},
		innerScroll: function() {
			mui(".mui-scroll-wrapper").scroll({
			 	deceleration : 0.0005
			});
		},
		initialization: function() {	// 初始化
			this.innerScroll();
			this.shopPullRefresh();
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

	global.shopJs = shopJs;

    $(function() {
        new shopJs();
    });

})(this, this.jQuery, this.mui, document);