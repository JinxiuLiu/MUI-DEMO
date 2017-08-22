/**
 * Created by Liujx on 2017-08-02;
 */
(function(global, $, mui, doc) {
	'use strict';
	
	var searchJs = function() {
		mui.init();
		this.config = {}
		this.eventsMap = {
			"focus #search": "inputFocus",
			"blur #search": "inputBlur",
			"tap .pp-search-cancel": "clickCancel"
		}
		this.initialization();
	}

	searchJs.prototype = {
		constructor: searchJs,
		searchFun: function() {
			$(document).keyup(function(event) {
				var keywords = event.target.value,
					dataType = $('.pp-hot-keywords').attr('data-type-value');
				if (event.keyCode == 13) {
					if (event.target.className && event.target.className.indexOf("mui-input-clear") != -1) {
						if (!keywords) {
							mui.toast('请输入关键字~', { duration: '1000ms', type:'div' });
						} else {
							window.location.href = SITE_URL + '/buy/'+dataType+'/k=' + keywords;
							event.target.value = '';
						}
					}
				}
			});
		},
		clickCancel: function(e) {
			var $btn = $(e.target);
      		$btn.parents(".pp-search").removeClass("search-active");
      		$('#search').blur();
		},
		inputFocus: function(e) {
			var $input = $(e.target);
      		$input.parents(".pp-search").addClass("search-active");
		},
		inputBlur: function(e) {
			var $input = $(e.target);
      		$input.parents(".pp-search").removeClass("search-active");
		},
		initialization: function() {	// 初始化
			var maps = this.eventsMap;
			this.searchFun();
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

	global.searchJs = searchJs;

    $(function() {
        new searchJs();
    });

})(this, this.jQuery, this.mui, document);