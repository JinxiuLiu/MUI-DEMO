/**
 * Created by Liujx on 2017-07-31 17:22:01
 */
(function(global, $, mui, doc) {
	'use strict';
	
	var releaseJs = function() {
		mui.init();
        mui.previewImage({
            footer: '设为封面'
        });
		this.config = {
			
		}
		this.eventsMap = {
			"tap #release": "clickReleaseBtn",
			"tap #factoryYear": "selectDate"
		}
		this.initialization();
	}

	releaseJs.prototype = {
		constructor: releaseJs,
		selectDate: function() {
			console.log(22);
			// 日期选择
            var dtPicker = new mui.DtPicker({
            	"type": "month",
            	beginDate: new Date('2000-1'),//设置开始日期 
    			endDate: new Date(),//设置结束日期 
            });
		    dtPicker.show(function (selectItems) { 
		        console.log(selectItems.y);//{text: "2016",value: 2016} 
		    })
		},
		clickReleaseBtn: function() {
			var title = '提示',
    			message = '发布成功';
	    	mui.confirm(message, title, ['查看该机源','发布新机源'], function (e) {
	    		if(e.index == 1) {
	    			mui.toast('发布新机源',{ duration:'3000ms', type:'div' });
	    		} else {
	    			mui.toast('查看该机源',{ duration:'3000ms', type:'div' });
	    		}
	    	}, 'div');
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

	global.releaseJs = releaseJs;

    $(function() {
        new releaseJs();
    });

})(this, this.jQuery, this.mui, document);