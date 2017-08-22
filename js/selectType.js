/**
 * Created by Liujx on 2017-07-25 16:12:42
 */
(function(global, $, mui, doc) {
	'use strict';
	
	var selectTypeJs = function() {
		this.eventsMap = {
			"tap #selectType": "selectTypeAjax"
		}
		this.initialization();
	}

	selectTypeJs.prototype = {
		constructor: selectTypeJs,
		selectTypeAjax: function(e) {
			var $this = $(e.target),
				parentId = $this.attr('data-id');
			
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
	                        	_list += '<a href="'+SITE_URL+'/buy/?con=ot'+_model.id+'">'+_model.name+'</a>'
	                        }
	            			$this.siblings('.mui-collapse-content').html('<a href="'+SITE_URL+'/buy/?con=ot'+parentId+'">全部</a>' + _list);
	                    } else {
	                    	mui.toast(data.data.msg, { duration:'3000ms', type:'div' });
	                    }
	                }
	            });
			}
		},
		initialization: function() {	// 初始化
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

	global.selectTypeJs = selectTypeJs;

    $(function() {
        new selectTypeJs();
    });

})(this, this.jQuery, this.mui, document);