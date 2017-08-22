/**
 * Created by Liujx on 2017-08-03 10:27:29
 */
(function(global, $, mui, doc) {
	'use strict';
	
	var loginJs = function() {
		mui.init();
		this.config = {}
		this.eventsMap = {
			"tap #imageVerification": "refreshImageVerification",
			"tap #getCode": "clickSendTextMsg",
			"tap #register": "clickRegister"
		}
		this.initialization();
	}

	loginJs.prototype = {
		constructor: loginJs,
		clickRegister: function() {
			var self = this,
				mobile = $('input[name=mobile]').val(),
				imageVerification = $('input[name=imageverification]').val(),
                authcode = $('input[name=authcode]').val();
            
            if(!/^1\d{10}$/.test(mobile) || mobile == ""){
            	self._muiToast('请输入正确的手机号！');
                return false;
            }

            if(!/\d{4}$/.test(imageVerification) || imageVerification == ""){
            	self._muiToast('请输入正确图形验证码！');
                return false;
            }
            
			if(!/^\d{4}$/.test(authcode) || authcode == ""){
				self._muiToast('请输入正确手机验证码！');
                return false;
            }

			$.ajax({
                url: SITE_URL+'/login/',
                type: 'POST',
                data: {
                    mobilephone: mobile,
                    authcode: authcode
                },
                dataType:"json",
                success: function(data){
                    if(data.result == 'ok') {
                        window.location.href = data.data.url;
                    } else {
                    	self._muiToast(data.data.msg);
                    }
                }
            });
		},
		clickSendTextMsg: function() {
			var self = this,
				mobile = $('input[name=mobile]').val(),
                imageVerification = $('input[name=imageverification]').val();

            if(!/^1\d{10}$/.test(mobile) || mobile == ""){
            	self._muiToast('请输入正确的手机号！');
                return false;
            }

            if(!/\d{4}$/.test(imageVerification) || imageVerification == ""){
            	self._muiToast('请输入正确图形验证码！');
                return false;
            }
            
            this._checkImgCode(mobile, imageVerification);
		},
		_sendTextMsg: function(mobile, imgCode) {
			var self = this;
			
            $.ajax({
                url: SITE_URL+'/login/?a=sendAuthcode',
                type: 'POST',
                data: {
                    param: imgCode,
                    mobile: mobile
                },
                dataType:"json",
                beforeSend: function() {
                	$("#getCode").attr({"disabled":"disabled"});
                },
                success: function(data){
                    if(data.result == 'ok') {
                    	// 发送短信成功 => 倒计时
                    	self._countdown(60);
                    } else {
                    	self._muiToast(data.data.msg);
                    }
                }
            });
		},
		_checkImgCode: function(mobile, imgCode) {
			var self = this;

            $.ajax({
                url: SITE_URL+'/login/?a=checkCode',
                type: 'POST',
                data: {
                    param: imgCode
                },
                dataType:"json",
                success: function(data){
                    if(data.result == 'ok') {
                    	// 验证成功， 发送短信
                    	self._sendTextMsg(mobile, imgCode);
                    } else {
                    	self._muiToast(data.data.msg);
                    }
                }
            });
		},
		refreshImageVerification: function(e) {
			var imgUrl = SITE_URL + '/include/kcaptcha/?' + Math.random();
            $(e.target).attr('src', imgUrl);
		},
		_countdown: function(intDiff) {
			var self = this,
				$getCode = $("#getCode");
			var timer = window.setInterval(function(){
                if(intDiff > 0){
                    var second = intDiff;
                    $getCode.attr({"disabled":"disabled"});
                    $getCode.html(second + ' s');
                    intDiff--;
                }
                else{
                    //结束触发器
                    window.clearInterval(timer);
					$getCode.removeAttr("disabled");
                    $getCode.html('获取验证码');
                }
            }, 1000);
		},
		_muiToast: function(msg) {
			mui.toast(msg, { duration:'3000ms', type:'div' });
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

	global.loginJs = loginJs;

    $(function() {
        new loginJs();
    });

})(this, this.jQuery, this.mui, document);