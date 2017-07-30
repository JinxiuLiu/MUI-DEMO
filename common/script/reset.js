/**
 * Created by Liujx on 2017-07-25 09:41:22
 */

;(function(designWidth, maxWidth) {
	'use strict';

    var doc = document,
        win = window,
        docEl = doc.documentElement,
        oHTML = document.getElementsByTagName("html")[0],
        tid;

    function refreshRem() {
        var width = docEl.getBoundingClientRect().width;
        maxWidth = maxWidth || 540;
        width>maxWidth && (width=maxWidth);
        var rem = width * 40 / designWidth;
        oHTML.style.fontSize = rem + 'px';
    }

    refreshRem();

    win.addEventListener("resize", function() {
        clearTimeout(tid); //防止执行两次
        tid = setTimeout(refreshRem, 300);
    }, false);

    win.addEventListener("pageshow", function(e) {
        if (e.persisted) { // 浏览器后退的时候重新计算
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 300);
        }
    }, false);

    if (doc.readyState === "complete") {
        doc.body.style.fontSize = "16px";
    } else {
        doc.addEventListener("DOMContentLoaded", function(e) {
            doc.body.style.fontSize = "16px";
        }, false);
    }

})(750, 750);