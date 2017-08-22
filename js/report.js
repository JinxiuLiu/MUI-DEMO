/**
 * Created by Liujx on 2017-08-05 20:51:10
 */
(function(global, $, mui, doc) {
	'use strict';
	
	var reportJs = function() {
		this.tagID = '';
		this.eventsMap = {
			"tap #reportTag": "selectReportTag",
			"tap #reportBtn": "submitReport"
		}
		this.initialization();
	}

	reportJs.prototype = {
		constructor: reportJs,
		submitReport: function() {
			var $reportBtn = $('#reportBtn'),
				tagID = this.tagID,
				reportDesc = $('#reportDesc').val(),
				dataPid = $("input[name=data-pid]").val();
	
			if( tagID == '' ) {
				mui.toast("请至少选择一项举报原因！", { duration:'3000ms', type:'div' });
				return false;
			}
			if( tagID == '99' && reportDesc == '') {
				mui.toast("其他原因必须填写补充说明！", { duration:'3000ms', type:'div' });
				return false;
			}else {
				$.ajax({
				    url: SITE_URL+'/report/',
				    type:'POST',
				    data:{
				    	a: 'add',
				    	pid: dataPid,
				    	tag: tagID,
				    	remark: reportDesc
				    },
				    dataType:'json', 
				    beforeSend:function(){
			            $reportBtn.attr({"disabled":"disabled"});
			        },
				    success:function(data){
				    	if(data.result === 'err') {
				    		mui.toast(data.data.msg, { duration:'3000ms', type:'div' });
	                        if(data.data.url) {
	                            setTimeout(function () {
	                                window.location.href=data.data.url;
	                            }, 3000);
	                        }
				    		$reportBtn.removeAttr("disabled");
				    	} else {
				    		mui.toast(data.data.msg, { duration:'3000ms', type:'div' });
				    		setTimeout(function () {
                                history.back();
                            }, 3000);
				    	}
				    }
				});
			}
		},
		selectReportTag: function(e) {
			var $this = $(e.target);
			$this.addClass('active').siblings().removeClass('active');
			this.tagID = $this.attr('data-id');
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

	global.reportJs = reportJs;

    $(function() {
        new reportJs();
    });

})(this, this.jQuery, this.mui, document);