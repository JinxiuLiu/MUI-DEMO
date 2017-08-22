/**
 * Created by Liujx on 2017-08-05 15:04:34
 */
(function(global, $, mui, doc) {
	'use strict';
	
	global.page = 1;
	
	var collectJs = function() {
		this.eventsMap = {
			"tap .pp-collect-del": "delCollectCars"
		}
		this.initialization();
	}

	collectJs.prototype = {
		constructor: collectJs,
		delCollectCars: function(e) {
			var $this = $(e.target),
				carsID = $this.parent().parent().attr('data-id');
			$.ajax({
                url: SITE_URL + '/apiu/?a=deleteCollect',
                type: 'POST',
                data: {
                    id: carsID
                },
                dataType:"json",
                success: function(data){
                    if(data.result == 'ok') {
                        $this.parent().parent().remove();
                    } else {
                    	mui.toast(data.data.msg, { duration:'3000ms', type:'div' });
                    }
                }
            });
			
		},
		collectPullRefresh: function() {
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
                url: SITE_URL+'/apiu/?a=moreCollectCars',
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
                        	_list += '<li class="mui-table-view-cell '+
                        				(function() {
                        					var p_is_sold_out = _model.p_is_sold_out;
                        					var p_is_del = _model.p_is_del;
                        					if(p_is_sold_out == '1') {
                        						return 'sold';
                        					} else if(p_is_del == '1'){
                        						return 'del';
                        					} else {
                        						return '';
                        					}
                        				}())+
                        				'" data-id="'+_model.id+'">'+
								        '<div class="mui-slider-right mui-disabled">'+
								            '<a class="mui-btn pp-collect-del">删除</a>'+
								        '</div>'+
								        '<div class="mui-slider-handle">'+
								            '<a href="'+_model.cars.p_url+'" class="mui-clearfix pp-cars-item">'+
								                '<div class="pp-cars-img">'+
								                	'<div class="pp-sold-offshelf-tag"></div>'+
								                    '<img class="lazy" data-original="'+_model.cars.p_mainpic+'" alt="'+_model.cars.p_allname+'" />'+
								                    '<div class="pp-collect-tag user-cars">用户机源</div>'+
								                '</div>'+
								                '<div class="pp-cars-info">'+
								                    '<h1 class="pp-cars-title">'+_model.cars.p_allname+'</h1>'+
								                    '<div class="pp-cars-tag">'+
								                        '<span>'+_model.cars.p_year+'年</span>'+
								                        '<i class="pp-cars-line">|</i>'+
								                        '<span>'+_model.cars.p_hours+'小时</span>'+
								                        '<i class="pp-cars-line">|</i>'+
								                        '<span>'+_model.cars.p_address+'</span>'+
								                    '</div>'+
								                    '<div class="pp-cars-bottom">'+
								                        '<div class="pp-cars-price">'+_model.cars.p_price+'</div>'+
								                        '<div class="pp-cars-time">'+_model.cars.p_addtime+'</div>'+
								                    '</div>'+
								                '</div>'+
								            '</a>'+
								        '</div>'+
								    '</li>'
                        }
            			$('#collectContent').append(_list);
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
		innerScroll: function() {
			mui(".mui-scroll-wrapper").scroll({
			 	deceleration : 0.0005
			});
		},
		initialization: function() {	// 初始化
			this.innerScroll();
			this.collectPullRefresh();
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

	global.collectJs = collectJs;

    $(function() {
        new collectJs();
    });

})(this, this.jQuery, this.mui, document);