/**
 * Created by Liujx on 2017-07-31 17:22:01
 */
(function(global, $, mui, doc) {
	'use strict';
	
	var releaseJs = function() {
        mui.previewImage({
            footer: '设为封面'
        });
        this.baiduKey = 'PPweoLIW1XwvNZwIGZHGvRIaElUobdxj';
		this.config = {
			$closeType: $('#closeType'),
			$title: $('#openType .mui-title'),
			first_cate_id: '',
			second_cate_id: '',
			brand_id: '',
			model_id: '',
			brandName: '',
			modelName: ''
		}
		this.eventsMap = {
			"tap #notLookItem": "selectNotLook",	//不给谁看 
			"tap #notLookConfirm": "notLookConfirm",	// 不给谁看 => 确定
			"tap #release": "clickReleaseBtn",	// 发布按钮
			"tap #factoryYear": "selectDate",	// 选择出厂日期
			"tap #facilityLocation": "selectLocation",	// 选择设备位置
			"tap .pp-select-tag span": "selectTag",	// 选择标签
			"tap #openTypeOffCanvas": "openTypeOffCanvas",	// 打开设备信息侧栏	
			"tap #selectType": "selectTypeAjax",	// 设备信息=> 加载类型
			"tap #clickType a": "selectBrandAjax",	// 设备信息=> 加载品牌
			"tap #clickBrand a": "selectModelAjax",	// 设备信息=> 加载型号
			"tap #selectModeNone .pp-canvas-list a": "selectModel",	// 设备信息=> 选择型号
			"tap #ModelConfirm": "ModelConfirm",	// 确定型号选择,
			"tap .hide-model": "hideModel",
			"tap .hide-brand": "hideBrand",
			"tap .close-type": "closeType"
		}
		this.initialization();
	}

	releaseJs.prototype = {
		constructor: releaseJs,
		notLookConfirm: function() {
			var areaIDArray = [],
				areaNameAttay = [];
			$('#notLookItem .active').each(function() {
				var areaName = $(this).text(),
					areaID = $(this).attr('data-aid');
				areaIDArray.push(areaID);
				areaNameAttay.push(areaName);
			});
			$("input[name=p_no_look]").val(areaIDArray.join(','));
			$('#NotLookText').text(areaNameAttay.join(' '));
			mui('#openNoArea').offCanvas().close();
		},
		selectNotLook: function(e) {
			var $this = $(e.target);
			if($this.hasClass('active')) {
				$this.removeClass('active');
			} else if($('#notLookItem .active').length < 3){
				$this.addClass('active');
			} else {
				mui.toast('最多可选择三个地区', { duration:'3000ms', type:'div' });
			}
		},
		hideModel: function() {
			this.config.$closeType.removeClass('hide-model').addClass('hide-brand');
			this.config.$title.text('设备品牌');
			$('#selectModeNone').hide();
			$('#BrandList').show();
		},
		hideBrand: function() {
			this.config.$closeType.removeClass('hide-brand').addClass('close-type');
			this.config.$title.text('设备机型');
			$('#BrandList').hide();
			$('#selectTypeNone').show();
		},
		closeType: function() {
			mui('#openType').offCanvas().close();
		},
		openTypeOffCanvas: function() {
			var firstCateID = $("input[name=first_cate_id]").val();
			$('#selectTypeNone #selectType').each(function() {
				var $this = $(this);
				if(firstCateID == $this.attr('data-id')) {
					$this.addClass('active');
				}
			});
			mui('#openType').offCanvas().show();
		},
		ModelConfirm: function() {
			var self = this;
			if(self.config.model_id == '') {
				mui.toast('您还没有选择型号哦~', { duration:'3000ms', type:'div' });
				return false;
			}
			$("input[name=first_cate_id]").val(self.config.first_cate_id);
			$("input[name=second_cate_id]").val(self.config.second_cate_id);
			$("input[name=brand_id]").val(self.config.brand_id);
			$("input[name=model_id]").val(self.config.model_id);
			$('#facilityInfo').html(self.config.brandName + '-' + self.config.modelName);
			this.config.$closeType.removeClass('hide-model').addClass('close-type');
			this.config.$title.text('设备机型');
			$('#selectModeNone').hide();
			$('#selectTypeNone').show();
			mui('#openType').offCanvas().close();
		},
		selectModel: function(e) {
			var $this = $(e.target);
			if($this.hasClass('active')) {
				$this.removeClass('active');
			}else {
				$('#selectModeNone .pp-canvas-list a').removeClass('active');
				$this.addClass('active');
				this.config.first_cate_id = $this.attr('data-first_category_id');
				this.config.second_cate_id = $this.attr('data-second_category_id');
				this.config.brand_id = $this.attr('data-brand_id');
				this.config.model_id = $this.attr('data-id');
				this.config.modelName = $this.text();
			}
		},
		selectModelAjax: function(e) {
			var self = this,
				$this = $(e.target),
				modelID = $("input[name=model_id]").val(),
				cateid = $this.parent().parent().attr('data-id'),
				cateid2 = $this.parent().parent().parent().attr('data-id'),
				brandid = $this.attr('data-id'),
				brandid2 = $this.parent().attr('data-id');
			
			$('#brandListScroll .pp-canvas-list a').removeClass('active');
			$this.addClass('active');
			
			$.ajax({
                url: SITE_URL+'/api/?a=selectModel',
                type: 'POST',
                data: {
                    cateid: cateid || cateid2,
                    brandid: brandid || brandid2
                },
                dataType:"json",
                success: function(data){
                	var _items = data.data,
            			_list = '',
            			_model;
                    if(data.result == 'ok' && _items != null) {
						$.each(_items, function(index, item) {
							_list += '<li><a href="javascript:;" '+
										(function() {
                        					var NowModelID = item.id;
                        					if(modelID == NowModelID) {
                        						return 'class="active"';
                        					}else {
                        						return '';
                        					}
                        				}())+
										' data-id="'+item.id+'" data-brand_id="'+item.brand_id+'" data-first_category_id="'+item.first_category_id+'" data-second_category_Id="'+item.second_category_Id+'">'+item.name+'</a></li>'
						});
						$('#selectModeNone .pp-canvas-list').html(_list);
						self.config.brandName = $this.text() || $this.siblings().text();
						self.config.$title.text('设备型号');
						self.config.$closeType.removeClass('hide-brand').addClass('hide-model');
						$('#BrandList').hide();
            			$('#selectModeNone').show();
                    } else {
                    	mui.toast(data.data.msg, { duration:'3000ms', type:'div' });
                    }
                }
            });
		},
		selectBrandAjax: function(e) {
			var self = this,
				$this = $(e.target),
				cateid = $this.attr('data-id');
				
			$('.mui-table-view-cell .mui-collapse-content a').removeClass('active');
			$this.addClass('active');
			
			$.ajax({
                url: SITE_URL+'/api/?a=selectCateBrand',
                type: 'POST',
                data: {
                    cateid: cateid
                },
                dataType:"json",
                beforeSend: function() {
                	$('#openType').append('<div class="loadding"><span class="mui-spinner mui-spinner-white"></span></div>')
                },
                success: function(data){
                	var brandID = $("input[name=brand_id]").val(),
                		_items = data.data.normal,
                		_recom = data.data.recom,
            			_list = '',
            			_hotList = '',
            			_hotAll = '',
            			_brandlist = '',
            			_model;
                    if(data.result == 'ok' && _items != null) {
                        for(var i = 0,len = _items.length; i < len; i++){
                        	_model = _items[i];
                        	$.each(_model.brandlist, function(index, item) {
                        		_brandlist += '<li><a href="javascript:;" '+
                        						(function() {
		                        					var NowBrandID = item.id;
		                        					if(brandID == NowBrandID) {
		                        						return 'class="active"';
		                        					}else {
		                        						return '';
		                        					}
		                        				}())+
                        						' data-id="'+item.id+'">'+item.name+'</a></li>'
                        	});
                        	_list += '<div class="pp-cancas-block-tip" data-group="'+_model.first_letter+'">'+_model.first_letter+'</div><div class="pp-canvas-list" data-id="'+cateid+'" id="clickBrand">'+_brandlist+'</div>'
                        	_brandlist = '';
                        }
                        if(_recom != null) {
                        	$.each(_recom, function(index, item) {
                        		_hotList += '<li><a href="javascript:;" data-id="'+item.id+'"><span>'+item.name+'</span><img src="'+item.logo+'" alt="'+item.name+'"></a></li>'
                        	});
                        	_hotAll = '<div class="pp-cancas-block-tip" data-group="热">热门品牌</div><div class="pp-canvas-hotbrand mui-clearfix" data-id="'+cateid+'" id="clickBrand">'+_hotList+'</div>'
                        }
                        $('.loadding').remove();
            			$('#brandListScroll .mui-scroll').html(_hotAll + _list);
            			self._indexedList();
            			self.config.$title.text('设备品牌');
            			self.config.$closeType.removeClass('close-type').addClass('hide-brand');
            			$('#selectTypeNone').hide();
            			$('#BrandList').show();
                    } else {
                    	mui.toast(data.data.msg, { duration:'3000ms', type:'div' });
                    }
                }
            });
		},
		_indexedList: function() {
			mui.ready(function() {
		        var header = document.getElementById('brandBar');
		        var footer = document.getElementById('footerBar');
		        var list = document.getElementById('BrandList');
		        //calc hieght
		        list.style.height = (document.body.offsetHeight - header.offsetHeight - footer.offsetHeight) + 'px';
		        //create
		        window.indexedList = new mui.IndexedList(list);
		    });
		},
		selectTypeAjax: function(e) {	// 选择型号
			var $this = $(e.target),
				parentId = $this.attr('data-id'),
				secondCateID = $("input[name=second_cate_id]").val();
			if(!$this.parent('.mui-collapse').hasClass('mui-active')) {
				$.ajax({
	                url: SITE_URL+'/api/selectCateType',
	                type: 'POST',
	                data: {
	                    parent_id: parentId
	                },
	                dataType:"json",
	                success: function(data){
	                	var _items = data.data,
	            			_list = '',
	            			_model;
	                    if(data.result == 'ok' && _items != null) {
	                        for(var i = 0,len = _items.length; i < len; i++){
	                        	_model = _items[i];
	                        	_list += '<a href="javascript:;" '+
	                        				(function() {
	                        					var CateID = _model.id;
	                        					if(secondCateID == CateID) {
	                        						return 'class="active"';
	                        					}else {
	                        						return '';
	                        					}
	                        				}())+
	                        				' data-id="'+_model.id+'">'+_model.name+'</a>'
	                        }
	            			$this.siblings('.mui-collapse-content').html(_list);
	                    } else {
	                    	mui.toast(data.data.msg, { duration:'3000ms', type:'div' });
	                    }
	                }
	            });
			}
		},
		selectTag: function(e) {
			var $this = $(e.target),
				name = $this.attr('data-name');

			if($this.hasClass('active')) {
				$this.removeClass('active');
				$('input[name='+name+']').val('');
			} else {
				$this.addClass('active');
				$('input[name='+name+']').val('1');
			}
		},
		selectLocation: function() {
			var self = this;
			var cityPicker = new mui.PopPicker({
				layer: 2
			});
			$.ajax({
                url: SITE_URL+'/api/getArea',
                type: 'POST',
                data: {},
                dataType:"json",
                success: function(data){
                    if(data.result == 'ok') {
                        cityPicker.setData(data.data);
                        var aid = $('input[name=aid]').val(),
                        	cid = $('input[name=cid]').val();
                        // 设置默认值
                        cityPicker.pickers[0].setSelectedValue(aid, 0, function() {
                        	setTimeout(function() {
								cityPicker.pickers[1].setSelectedValue(cid);
							}, 100);
                        });
                        // 显示选择器
                        cityPicker.show(function(items) {
                        	var address = items[0].text + ' ' + items[1].text;
                        	$('#facilityLocationText').text(address);
							$('input[name=aid]').val(items[0].value);
							$('input[name=cid]').val(items[1].value);
							self._addressResolution(address);
						});
                    } else {
                    	mui.toast(data.data.msg, { duration:'3000ms', type:'div' });
                    }
                }
            });
		},
		selectDate: function(e) {
			var beginDate,
				endDate;
			$.ajax({
                url: SITE_URL+'/api/getYear',
                type: 'POST',
                data: {},
                dataType:"json",
                success: function(data){
                	if(data.result == 'ok') {
                		beginDate = data.data[0];
                		endDate = data.data[data.data.length - 1];
                		// 日期选择
			            var dtPicker = new mui.DtPicker({
			            	"type": "month",
			            	beginDate: new Date(beginDate),	//设置开始日期 
			    			endDate: new Date(endDate),	//设置结束日期 
			            });
			            dtPicker.setSelectedValue($('input[name=p_year]').val())
                		dtPicker.show(function (selectItems) {
					    	var yearValue = selectItems.y.value;
					    	$('#factoryYearText').text(yearValue);
							$('input[name=p_year]').val(yearValue);
					    });
                	}
                }
          	});
		},
		clickReleaseBtn: function() {
			var self = this,
				mobile = $("input[name='p_tel']").val();

			if(!updata.is_complete){
				self._muiToast("图片正在上传中，请稍后再试");
		        return false;
		    }
	
			if($('.upload-img').length < 5){
				self._muiToast("请至少成功上传5张图片！");
		      	return false;
		    }
	
			if($("input[name=aid]").val() == 0 && $("input[name=cid]").val() == 0){
				self._muiToast("请选择地区！");
				return false;
			}
	
			if($("input[name=first_cate_id]").val() == 0 && $("input[name=second_cate_id]").val() == 0 && $("input[name=brand_id]").val() == 0 && $("input[name=model_id]").val() == 0){
				self._muiToast("请选择设备信息！");
				return false;
			}
	
			if($("input[name=p_year]").val() == "" ){
				self._muiToast("请选择出厂年限！");
				return false;
			}

			if($("input[name=p_hours]").val() == ""){
				self._muiToast("请填写使用小时数！");
				$("input[name=p_hours]").focus();
				return false;
			}

			if($("input[name=p_price]").val() == ""){
				self._muiToast("请填写车主报价！");
				$("input[name=p_price]").focus();
				return false;
			}

			if($("textarea[name=p_details]").val() == ""){
				self._muiToast("请填写车主描述！");
				$("textarea[name='p_details']").focus();
				return false;
			}

			if($("input[name=p_username]").val() == ""){
				self._muiToast("请填写联系人信息！");
				$("input[name='p_username']").focus();
				return false;
			}

			if(!/^1\d{10}$/.test(mobile) || mobile == ""){
				self._muiToast("请填写正确的联系方式！");
				$("input[name='p_tel']").focus();
				return false;
			}

			$.ajax({
                type: 'POST',
                url: SITE_URL + '/sell/',
                data: $("form").serialize(),
                dataType: 'json',
                success: function (data) {
                    if(data.result == 'ok') {
                    	var title = '提示',
			    			message = '发布成功';
				    	mui.confirm(message, title, ['查看该机源','发布新机源'], function (e) {
				    		if(e.index == 1) {
				    			window.location.href = data.data.add_url;	// 发布新机源
				    		} else {
				    			window.location.href = data.data.detail_url;	//查看该机源
				    		}
				    	}, 'div');
                    } else {
                    	self._muiToast(data.data.msg);
                    }
                }
            });
		},
		_addressResolution: function(address) {	// 获取经纬度
			var self = this,
				url = 'http://api.map.baidu.com/geocoder/v2/';
			$.ajax({
				type:"get",
				url: url,
				data: {
					address: address,
					ak: self.baiduKey,
					output: 'json'
				},
				dataType: 'jsonp',
				success: function(data) {
					if(data.status == '0') {
						$("input[name=p_longitude]").val((data.result.location.lng).toFixed(6));
						$("input[name=p_latitude]").val((data.result.location.lat).toFixed(6));
					}
				},
				error : function(err){
					self._muiToast("服务端错误，请刷新后重试");
				}
			});
		},
		forbidOffCanvas: function() {
			var offCanvasInner = mui('.mui-off-canvas-wrap')[0].querySelector('.mui-inner-wrap');
			offCanvasInner.addEventListener('drag', function(event) {
			    event.stopPropagation();
			});
		},
		innerScroll: function() {
			mui(".mui-scroll-wrapper").scroll({
			 	deceleration : 0.0005
			});
		},
		_muiToast: function(msg) {
			mui.toast(msg, { duration:'3000ms', type:'div' });
		},
		_inputPriceZero: function() {	// 价格 补零
			setTimeout(function() {
				var $priceInput = $("input[name=discount]");
				$priceInput.blur(function(){
					var sun_price = $priceInput.val();
					$priceInput.val((Number(sun_price)).toFixed(2));
				});
			}, 100);
		},
		initialization: function() {	// 初始化
			this.forbidOffCanvas();
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

	global.releaseJs = releaseJs;

    $(function() {
        new releaseJs();
    });

})(this, this.jQuery, this.mui, document);