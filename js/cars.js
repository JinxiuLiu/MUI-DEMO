/**
 * Created by Liujx on 2017-07-26 21:45:55
 */
$(function() {
	$('#carBid').on('click', function() {
		var title = '车主报价：46万',
			message = '<input class="pp-popur-input" type="number" placeholder="请输入您的出价金额"/><span>万元</span><p>注：机主收到出价后会与您取得联系，出价不包含运费。</p>';
    	mui.confirm(message, title, ['取消','我要出价'], function (e) {
    		if(e.index == 1) {
    			mui.toast('出价成功',{ duration:'3000ms', type:'div' });
    		}
    	}, 'div');
	});
	
});