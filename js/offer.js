/**
 * Created by Liujx on 2017-08-01 21:11:29
 */
(function(global, $, mui, doc) {
	'use strict';
	
	var offerJs = function() {
		mui.init();
		this.config = {
			
		}
		this.eventsMap = {
			"tap #call": "markingCalls"
		}
		this.initialization();
	}

	offerJs.prototype = {
		constructor: offerJs,
		markingCalls: function() {
			mui.confirm('188-8888-8888',' ',['取消','拨打'],function (e) {
	    		if(e.index == 1) {
	    			window.location.href = "tel:10086";
	    		}
	    	},'div');
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

	global.offerJs = offerJs;

    $(function() {
        new offerJs();
    });

})(this, this.jQuery, this.mui, document);