/**
 * Created by Liujx on 2017-07-25 16:12:42
 */
(function(global, $, mui, doc) {
	'use strict';
	
	var indexJs = function() {
        mui.init();
        this.config = {
            
        }
        this.eventsMap = {
            
        }
		this.initialization();
	}

	indexJs.prototype = {
		constructor: indexJs,
		muiSlider: function() {
			//获得slider插件对象
			var gallery = mui('.mui-slider');
			gallery.slider({
			  interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0;
			});
		},
		initialization: function() {	// 初始化
			this.muiSlider();
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

	global.indexJs = indexJs;

    $(function() {
        new indexJs();
    });

})(this, this.jQuery, this.mui, document);
