/**
 * Created by Liujx on 2017-07-26 21:33:10
 */
(function(global, $, mui, doc) {
	'use strict';
	
	var listJs = function() {
		mui.init();
		this.config = {
			
		}
		this.eventsMap = {
			
		}
		this.initialization();
	}

	listJs.prototype = {
		constructor: listJs,
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
		initialization: function() {	// 初始化
			var maps = this.eventsMap;
			this.forbidOffCanvas();
			this.innerScroll();
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

	global.listJs = listJs;

    $(function() {
        new listJs();
    });

})(this, this.jQuery, this.mui, document);