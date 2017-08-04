/**
 * Created by Liujx on 2017-07-26 21:45:55
 */
(function(global, $, mui, doc) {
	'use strict';
	
	var carsJs = function() {
		mui.init();
		this.config = {
			
		}
		this.eventsMap = {
			"tap #carBid": "clickOfferBtn"
		}
		this.initialization();
	}

	carsJs.prototype = {
		constructor: carsJs,
		clickOfferBtn: function() {
			var title = '车主报价：46万',
				message = '<input class="pp-popur-input" type="number" placeholder="请输入您的出价金额"/><span>万元</span><p>注：机主收到出价后会与您取得联系，出价不包含运费。</p>';
	    	mui.confirm(message, title, ['取消','我要出价'], function (e) {
	    		if(e.index == 1) {
	    			mui.toast('出价成功',{ duration:'3000ms', type:'div' });
	    		}
	    	}, 'div');
		},
		initialization: function() {	// 初始化
			var maps = this.eventsMap;
            this._scanEventsMap(maps, true);
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