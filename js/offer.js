/**
 * Created by Liujx on 2017-08-01 21:11:29
 */
(function(global, $, mui, doc) {
	'use strict';
	global.page = 1;
	var offerJs = function() {
		this.config = {}
		this.eventsMap = {
			"tap #call": "markingCalls"
		}
		this.initialization();
	}

	offerJs.prototype = {
		constructor: offerJs,
		offerPullRefresh: function() {
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
			var self = this;
			$.ajax({
                url: SITE_URL+'/apiu/?a=moreOffer',
                type: 'POST',
                data: {
                    p: global.page
                },
                dataType:"json",
                success: function(data){
                	var _items = data.data,
            			_list = '',
            			_model;
                    if(data.result == 'ok' && _items != null) {
                        for(var i = 0,len = _items.length; i < len; i++){
                        	_model = _items[i];
                        	_list += '<div class="pp-offer">'+
								        '<div class="pp-offer-cars '+
								        	(function() {
	                        					var p_is_del = _model.cars.p_is_del;
	                        					if(p_is_del == '1') {
	                        						return 'del';
	                        					} else {
	                        						return '';
	                        					}
	                        				}())+
								        	'">'+
								            '<a href="'+
									            (function() {
		                        					var p_is_del = _model.cars.p_is_del;
		                        					var p_url = _model.cars.p_url;
		                        					if(p_is_del == '1') {
		                        						return 'javascript:;';
		                        					} else {
		                        						return p_url;
		                        					}
		                        				}())+
								            	
								            	'" class="mui-clearfix pp-cars-item">'+
								                '<div class="pp-cars-img">'+
								                	'<div class="pp-sold-offshelf-tag"></div>'+
								                    '<img class="lazy" data-original="'+_model.cars.p_mainpic+'" alt="'+_model.cars.p_allname+'" />'+
								                '</div>'+
								                '<div class="pp-cars-info">'+
								                    '<h1 class="pp-cars-title">'+_model.cars.p_allname+'</h1>'+
								                    '<div class="pp-cars-tag">'+
								                        '<span>'+_model.cars.p_year+'年</span>'+
								                        '<i class="pp-cars-line">|</i>'+
								                        '<span>'+_model.cars.p_hours+'小时</span>'+
								                        '<i class="pp-cars-line">|</i>'+
								                        '<span>(无)</span>'+
								                    '</div>'+
								                    '<div class="pp-cars-tag color999">'+
								                        '<span>浏览: 无)</span>'+
								                        '<i class="pp-cars-line">|</i>'+
								                        '<span>分享: 无)</span>'+
								                        '<i class="pp-cars-line">|</i>'+
								                        '<span>在售: '+_model.cars.p_addtime+'</span>'+
								                    '</div>'+
								                    '<div class="pp-cars-bottom">'+
								                        '<div class="pp-cars-price"> '+_model.cars.p_price+'</div>'+
								                        '<div class="pp-cars-time">'+_model.cars.p_listtime+'更新</div>'+
								                    '</div>'+
								                '</div>'+
								            '</a>'+
								        '</div>'+
								        '<!-- 折叠面板 -->'+
								        '<li class="mui-table-view-cell mui-collapse">'+
								            '<a class="mui-navigate-right" href="#">已有<em class="colorpp">'+_model.count+'</em>人出价</a>'+
								            '<div class="mui-collapse-content">'+
								                (function() {
								                	var list = '';
													$.each(_model.bids, function(index, item) {
														list += '<div class="pp-offer-item">'+
										                    '<div class="pp-offer-name mui-clearfix">'+
										                        '<div class="pp-offer-portrait">'+
										                            '<img src="'+item.logo+'" alt="'+item.legalname+'" />'+
										                        '</div>'+
										                        '<div class="pp-offer-copyname">'+item.legalname+'</div>'+
										                        '<div class="pp-offer-time">'+
										                            '<span>'+item.create_time+'</span>'+
										                        '</div>'+
										                    '</div>'+
										                    '<div class="pp-offer-info mui-clearfix">'+
										                        '<div class="pp-offer-result">'+
										                            '<span>联系人：'+item.legalname+'</span>'+
										                            '<span>联系电话：'+item.mobile+'</span>'+
										                            '<span>他的出价：'+item.price+'万</span>'+
										                        '</div>'+
										                        '<div class="pp-offer-tel">'+
										                            '<a href="javascript:;" class="dial" id="call" data-mobile="'+item.mobile+'">'+
										                                '<i class="iconfont icon-phone"></i>'+
										                                '<span>拨打电话</span>'+
										                            '</a>'+
										                        '</div>'+
										                    '</div>'+
										                '</div>'
													});
													return list;
								                }())+
								            '</div>'+
								        '</li>'+
								    '</div>'
                        }
            			$('#offerContent').append(_list);
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
		},
		markingCalls: function(e) {
			var $this = $(e.currentTarget),
				mobile = $this.attr('data-mobile');
			mui.confirm(mobile.replace(/\B(?=(\d{4})+(?!\d))/g,'-'),' ',['取消','拨打'],function (e) {
	    		if(e.index == 1) {
	    			window.location.href = "tel:" + mobile;
	    		}
	    	},'div');
		},
		innerScroll: function() {
			mui(".mui-scroll-wrapper").scroll({
			 	deceleration : 0.0005
			});
		},
		initialization: function() {	// 初始化
			this.innerScroll();
			this.offerPullRefresh();
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

	global.offerJs = offerJs;

    $(function() {
        new offerJs();
    });

})(this, this.jQuery, this.mui, document);