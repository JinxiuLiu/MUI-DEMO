(function(w){
	w.Calendar = function (opt) {
		// 创建日历控件基本结构	
		var cldbox = document.createElement("div");
		cldbox.className = 'calendar-container';
		var tpl = "";
		tpl += '<div class="calendar-title mui-clearfix">';
		tpl += '<div class="calendar-month"></div>';
		tpl += '<div class="calendar-reserve">已预订</div>';
		tpl += '</div>';
		tpl += '<div class="calendar-week"><div>日</div><div>一</div><div>二</div><div>三</div><div>四</div><div>五</div><div>六</div></div>';
		tpl += '<div class="calendar-content mui-clearfix"></div>';
		cldbox.innerHTML=tpl;
		document.querySelector(opt.el).appendChild(cldbox);
		
		// dom 对象
		var omonth = cldbox.querySelector(".calendar-month");
		// var oyear = cldbox.querySelector(".calendar-year");
		var content = cldbox.querySelector(".calendar-content");
		
		// 时间对象(默认当前)
		var dateObj;
		if(opt.value){
			dateObj = opt.value;
		}else{
			dateObj = new Date();
		}
		// 年月获取 
		var month = getMonth(dateObj);
		var year = getYear(dateObj);
		if(month < 10){
            month = '0' + month;  //补齐
        }
		// 月年的显示
		omonth.innerHTML = month + "<em>月</em>";
		// 获取本月1号的周值
		var fistWeek = getCurmonWeeknum(dateObj);
		// 本月总日数
		var monDaynum = getCurmonDaynum(dateObj);
		// 当前日期
		var nowDay = getDay(dateObj);
		//初始化显示本月信息
		var reservedNum = [];
		$.ajax({
            url: SITE_URL+'/apiu/?a=getStickDateList',
            type: 'POST',
            async: false,
            data: {
            	year: year,
            	month: month,
            	pid: GetQueryString('pid')
            },
            dataType:"json",
            success: function(data){
                if(data.result == 'ok') {
                	$('#topNum').html(data.data.top_num);
                    reservedNum = data.data.list;
                } else {
                	mui.toast(data.data.msg, { duration:'3000ms', type:'div' });
                }
            }
        });
		
		setContent(content, fistWeek, monDaynum, nowDay, reservedNum);
		
		var isSupportMUI = (typeof mui === 'function');
		var evt = {
			type: isSupportMUI ? 'tap': 'click'
		}
		// 显示当前时间
		content.addEventListener(evt.type, function (event) {
			if(hasclass(event.target.className,"reserve") || $(event.target).parent().hasClass('reserve')) return false;
		    if(hasclass(event.target.className,"today") || hasclass(event.target.className,"later") || $(event.target).parent().hasClass('today') || $(event.target).parent().hasClass('later')){
				var day;
				if(event.target.tagName === 'DIV') {
					day = event.target.firstChild.innerHTML;
				} else {
					day = event.target.innerHTML;
				}
				if(day < 10){
		            day = '0' + day;  //补齐
		        }
				var dateObj = new Date(year, month-1, day);
				var week = getWeek(dateObj);
				opt.callback({
					'over_time': year + '-' + month+ '-' + day,
					'year': year,
					'month': month,
					'day': day,
					'week': week
				});
			}; 
		});
	}
	
	//有无指定类名的判断
	function hasclass(str,cla){
	  	var i = str.search(cla);
	  	if(i==-1){
	   		return false;
	  	}else{
	   		return true;
	  	};
	}
	
	// 初始化日期显示方法
	function setContent(el, fistWeek, monDaynum, nowDay, reservedNum){
		// 留空
		for(var i=1;i <= fistWeek;i++){
			var subContent = document.createElement("div");
			subContent.innerHTML = "";
			el.appendChild(subContent);
		}
		// 正常区域
		for(var i = 1; i <= monDaynum; i++){
			var subContent = document.createElement("div");
			subContent.className= "canChoose";
			// today之前
			if(i < nowDay) {
				subContent.classList.add("before");
			}
			// 当天
			if(i == nowDay){
				subContent.classList.add("today");
			}
			if(i > nowDay) {
				subContent.classList.add("later");
			}
			subContent.innerHTML = '<span>'+i+'</span>';
			el.appendChild(subContent);
			// 已预订
			for(var j = 0; j < reservedNum.length; j++) {
				if(i == reservedNum[j]) {
					subContent.classList.add("reserve");
				}
			}
		}
	}
	
	// 清除内容
	function clearContent(el){
		el.innerHTML="";
	}
	
	// 判断闰年
	function isLeapYear(year){ 
		if( (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0)){
			return true;
		}else{
			return false;
		}
	}
	
	// 得到当前年份
	function getYear (dateObj) {
		return dateObj.getFullYear()
	}
	
	// 得到当前月份
	function getMonth (dateObj) { 
		var month=dateObj.getMonth()
		switch(month) { 
			case 0: return "1"; break; 
		  	case 1: return "2"; break; 
		  	case 2: return "3"; break; 
		  	case 3: return "4"; break; 
		  	case 4: return "5"; break; 
		  	case 5: return "6"; break; 
		  	case 6: return "7"; break; 
		  	case 7: return "8"; break; 
		  	case 8: return "9"; break; 
		  	case 9: return "10"; break; 
		  	case 10: return "11"; break; 
		  	case 11: return "12"; break;   
		  	default: 
		}
	}
	
	// 得到当前号数
	function getDay (dateObj) {
		return dateObj.getDate();
	}
	
	// 得到周期数
	function getWeek (dateObj) {
		var week;
		switch (dateObj.getDay()){
		 	case 1: week = "星期一"; break;
		 	case 2: week = "星期二"; break;
		 	case 3: week = "星期三"; break;
		 	case 4: week = "星期四"; break;
		 	case 5: week = "星期五"; break;
		 	case 6: week = "星期六"; break;
		 	default: week = "星期天";
		}
		return week;
	}
	
	// 获取本月总日数方法
	function getCurmonDaynum(dateObj){
		var year=dateObj.getFullYear();
		var month=dateObj.getMonth();
		if(isLeapYear(year)){//闰年
			switch(month) { 
				case 0: return "31"; break; 
				case 1: return "29"; break; //2月
				case 2: return "31"; break; 
			   	case 3: return "30"; break; 
			   	case 4: return "31"; break; 
			   	case 5: return "30"; break; 
			   	case 6: return "31"; break; 
			   	case 7: return "31"; break; 
			   	case 8: return "30"; break; 
			   	case 9: return "31"; break; 
			   	case 10: return "30"; break; 
			   	case 11: return "31"; break;   
				default:  
			}
		}else{//平年
	   		switch(month) { 
	   			case 0: return "31"; break; 
	   			case 1: return "28"; break; //2月 
	   			case 2: return "31"; break; 
			   	case 3: return "30"; break; 
			   	case 4: return "31"; break; 
			   	case 5: return "30"; break; 
			   	case 6: return "31"; break; 
			   	case 7: return "31"; break; 
			   	case 8: return "30"; break; 
			   	case 9: return "31"; break; 
			   	case 10: return "30"; break; 
			   	case 11: return "31"; break;   
	   			default:  
			}   
		}
	}
	
	function GetQueryString(name) {
	    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	    var r = window.location.search.substr(1).match(reg);
	    if(r!=null)return  unescape(r[2]); return null;
	}
	
	// 获取本月1号的周值
	function getCurmonWeeknum(dateObj){
		var oneyear = new Date();
		var year = dateObj.getFullYear();
		var month = dateObj.getMonth(); //0是12月
		oneyear.setFullYear(year);
		oneyear.setMonth(month); //0是12月
		oneyear.setDate(1);
		return oneyear.getDay();  
	}
})(window);


$(function() {
	var cld = new Calendar({
	    el: '#calendar',
	    value: '', // 默认为new Date();
	    callback: function(obj) {
	    	var $stickContent = $('#stick_content'),
	    		content = $stickContent.attr('data-content'),
	    		my = $stickContent.attr('data-my'),
	    		message = '<p>'+content+'</p><p>每次置顶时间段为该置顶日期当天<em class="colorpp">0:00 - 24:00</em>，置顶日期请提前预约。</p><p>'+my+'</p>';
	    		title = $stickContent.attr('data-title');
	        mui.confirm(message, title, ['取消','确认'], function (e) {
			    if(e.index == 1) {
			    	$.ajax({
			            url: SITE_URL+'/apiu/?a=carTop',
			            type: 'POST',
			            data: {
			                pid: GetQueryString('pid'),
			                over_time: obj.over_time
			            },
			            dataType:"json",
			            success: function(data){
			                if(data.result == 'ok') {
			                	window.history.back();
			                	mui.toast('置顶成功', { duration:'3000ms', type:'div' });
			                    mui.closePopup();
			                } else {
			                	mui.toast(data.data.msg, { duration:'3000ms', type:'div' });
			                }
			            }
			        });
			    }
			}, 'div');
	    }
	});
	function GetQueryString(name) {
	    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	    var r = window.location.search.substr(1).match(reg);
	    if(r!=null)return  unescape(r[2]); return null;
	}
});