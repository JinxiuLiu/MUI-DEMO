var updata={
    templete: '<div class="pp-show-img upload-img"><div class="pp-del-img delete"></div><img src="'+$("#defaultImg").attr('src')+'" data-preview-src="" data-preview-group="1"><input type="hidden" name="p_pics[]" value="'+$("#defaultImg").attr('src')+'"/></div>',
    $addButton: $("#addimg"),
    $tip: $("#addimgtip"),
    selector: '.upload-img',
    firstSelector: '.first',
    deleteselector: '.upload-img .delete',
    maxImgNumber: $('#pic_number').val(),
    $showImgs: $("#showUploadImgs"),
    width: $("#upload_button").width()-1,
    height: $("#upload_button").height()-1,
    is_complete: true,
    is_imgsucc: 0
}

updata.$showImgs.on("tap", updata.deleteselector, function(e) {
    e.stopPropagation();
    $('.upload-img').removeClass('first');
    $('#stem_number').val(0);
    $(this).parent().remove();
    var length = $(updata.selector).length;
    if (length < updata.maxImgNumber) {
        updata.$addButton.show().find("div").css({"width":updata.$addButton.width()+"px","height":updata.$addButton.height()+"px"});
    }
    if ($(updata.firstSelector).length == 0) {
        if($('#pic_number').val() == 15){
        	$(updata.selector).first().addClass("first");
        }
    }
    if(length == 0){
    	updata.$tip.css('display','inline-block');
    }
});

// 设为首图
$('body').on('tap', '.mui-preview-footer', function() {
	var firsturl = $('.mui-zoom-wrapper.mui-active img').attr("src");
	var zoomNum = $('.mui-preview-indicator').text();
	var firstnum = zoomNum.split('/');
	$(".upload-img img").each(function(index){
     	var dataurl =$(this).attr("src");
        if(dataurl == firsturl) {
        	$(this).parent().addClass('first').siblings().removeClass('first');
        	$('#stem_number').val(firstnum[0] - 1);
        	$('#__MUI_PREVIEWIMAGE').hide().removeClass('mui-preview-in');
        }
    });
});

// Chinese (China) (zh_CN)
plupload.addI18n({"Stop Upload":"停止上传","Upload URL might be wrong or doesn't exist.":"上传的URL可能是错误的或不存在。","tb":"tb","Size":"大小","Close":"关闭","Init error.":"初始化错误。","Add files to the upload queue and click the start button.":"将文件添加到上传队列，然后点击”开始上传“按钮。","Filename":"文件名","Image format either wrong or not supported.":"图片格式错误或者不支持。","Status":"状态","HTTP Error.":"HTTP 错误。","Start Upload":"开始上传","mb":"mb","kb":"kb","Duplicate file error.":"重复文件错误。","File size error.":"文件大小错误。","N/A":"N/A","gb":"gb","Error: Invalid file extension:":"错误：无效的文件扩展名:","Select files":"选择文件","%s already present in the queue.":"%s 已经在当前队列里。","File: %s":"文件: %s","b":"b","Uploaded %d/%d files":"已上传 %d/%d 个文件","Upload element accepts only %d file(s) at a time. Extra files were stripped.":"每次只接受同时上传 %d 个文件，多余的文件将会被删除。","%d files queued":"%d 个文件加入到队列","File: %s, size: %d, max file size: %d":"文件: %s, 大小: %d, 最大文件大小: %d","Drag files here.":"把文件拖到这里。","Runtime ran out of available memory.":"运行时已消耗所有可用内存。","File count error.":"文件数量错误。","File extension error.":"文件扩展名错误。","Error: File too large:":"错误: 文件太大:","Add Files":"增加文件"});
var uploader = Qiniu.uploader({
    runtimes: 'html5,flash,html4',
    browse_button: 'upload_button',
    container: 'addimg',
    flash_swf_url: 'Moxie.swf',
    filters: {
    	mime_types : [ //只允许上传图片  
            { title : "Image files", extensions : "*" },  
        ],
        prevent_duplicates : true //不允许选取重复文件
    },
    multiple_queues:true,
    max_file_size: '100mb',
    chunk_size: '4mb',
    uptoken_url:$('#qiniutoken').val(),
    domain: $('#qiniudomain').val(),
    auto_start: true,
    save_key:true,
    init: {
        'Init':function(up){
            updata.$addButton.find("input[type='file']").attr('accept','image/*').attr('multiple','true');
            updata.width=$("#upload_button").width()-1;
            updata.height=$("#upload_button").height()-1;
        },
        'FilesAdded': function(up, files) {
            var length = $(updata.selector).length;
            if(length + files.length>updata.maxImgNumber){
            	mui.toast("本次最多可选择"+(updata.maxImgNumber-length)+"张图片", { duration:'3000ms', type:'div' });
                plupload.each(files, function (file, index) {
                    up.removeFile(file);
                });
            }else {
                updata.is_complete = false;
                updata.$tip.hide();
                var length = $(updata.selector).length;
                plupload.each(files, function (file, index) {
                    if (length + index >= updata.maxImgNumber) {
                        updata.$addButton.hide();
                        $(updata.selector).last().addClass("mbottom5");
                        up.removeFile(file);
                    } else {
                        var uploadimg = $(updata.templete);
                        uploadimg.insertBefore(updata.$addButton);
                        var id = file.id + '_uploadwarpper';
                        uploadimg.attr("id", id).css({
                            "width": updata.width  + "px",
                            "height": updata.height + "px"
                        }).find("img").css({"width": updata.width + "px", "height": updata.height + "px"});
                        var progress = new FileProgress(file, id);
                        progress.setStatus("等待...");
                        progress.bindUploadCancel(up);
                    }
                    if ((length + index + 1) == updata.maxImgNumber) {
                        updata.$addButton.hide();
                        $(updata.selector).last().addClass("mbottom5");
                    }
                });
            }
        },
        'UploadProgress': function(up, file) {
            var  id=file.id+'_uploadwarpper';
            var progress = new FileProgress(file, id);
            progress.setProgress(file.percent + "%",file.speed);
        },
        'FilesRemoved':function(){},
        'QueueChanged':function(){},
        'BeforeUpload': function() {},
        'UploadComplete': function(up) {
            var length = $(updata.selector).length;
            if (length >= updata.maxImgNumber) {
                updata.$addButton.hide();
                $(updata.selector).last().addClass("mbottom5");
            }

            updata.is_complete = true;
            // 上传成功文件数量
            updata.is_imgsucc = up.total.uploaded;

            $(".upload-img img").each(function(index){
             	var dataurl =$(this).attr("src");
//	            var dateurl = dataurl.split(IMG_EXT)[0];
	            $(this).next('input').val(dataurl);
            });
            $(".upload-img img").click(function(){
				$('#stem_number').val($(this).index());
			});

        },
        'FileUploaded': function(up, file, info) {
            var  id=file.id+'_uploadwarpper';
            var progress = new FileProgress(file,id);
            $.extend(info, {});
            progress.setComplete(up, info);
        },
        'Error': function(up, err, errTip) {
            if(plupload.FILE_DUPLICATE_ERROR != err.code){
                var _id = err.file.id + '_uploadwarpper';
                mui.toast(err.message, { duration:'3000ms', type:'div' });
                up.removeFile(err.file);
                $('#'+_id).remove();
            }
        }
    }
});
/*global plupload */
/*global qiniu */
function FileProgress(file, targetID) {
    this.fileProgressID = file.id;
    this.file = file;
    this.opacity = 100;
    this.height = 0;
    this.fileProgressWrapper = $('#' + this.fileProgressID);
    if (!this.fileProgressWrapper.length) {

        this.fileProgressWrapper = $('<div/>');
        var Wrappeer = this.fileProgressWrapper;
        Wrappeer.attr('id', this.fileProgressID).addClass('progressContainer');
        var progressBarWrapper = $("<div/>");
        progressBarWrapper.addClass("progress progress-striped");

        var progressBar = $("<div/>");
        progressBar.addClass("progress-bar progress-bar-info")
            .attr('role', 'progressbar')
            .attr('aria-valuemax', 100)
            .attr('aria-valuenow', 0)
            .attr('aria-valuein', 0)
            .width('0%');

        var progressBarPercent = $('<span class="status text-left" />');
        progressBarPercent.text("等待...");

        progressBar.append(progressBarPercent);
        progressBarWrapper.append(progressBar);
        Wrappeer.append(progressBarWrapper);
        $('#' + targetID).append(Wrappeer);
    } else {
        this.reset();
    }

    this.height = this.fileProgressWrapper.offset().top;
    this.setTimer(null);
}
FileProgress.prototype.setStatus = function(status, isUploading) {
    if (!isUploading) {
        this.fileProgressWrapper.find('.status').text(status);
    }
};
FileProgress.prototype.setTimer = function(timer) {
    this.fileProgressWrapper.FP_TIMER = timer;
};

FileProgress.prototype.getTimer = function(timer) {
    return this.fileProgressWrapper.FP_TIMER || null;
};

FileProgress.prototype.reset = function() {
    this.fileProgressWrapper.attr('class', "progressContainer");
    this.fileProgressWrapper.find('.progress .progress-bar-info').attr('aria-valuenow', 0).width('0%').find('span').text('');
    this.appear();
};

FileProgress.prototype.setProgress = function(percentage, speed) {
    this.fileProgressWrapper.attr('class', "progressContainer green");
    var file = this.file;
    var uploaded = file.loaded;
    var size = plupload.formatSize(uploaded).toUpperCase();
    var formatSpeed = plupload.formatSize(speed).toUpperCase();
    var progressbar = this.fileProgressWrapper.find('.progress').find('.progress-bar-info');
    if (this.fileProgressWrapper.find('.status').text() === '取消上传'){
        return;
    }
    this.fileProgressWrapper.find('.status').text(formatSpeed + "/s");
    percentage = parseInt(percentage, 10);
    if (file.status !== plupload.DONE && percentage === 100) {
        percentage = 99;
    }
    progressbar.attr('aria-valuenow', percentage).css('width', percentage + '%');
    this.appear();
};

FileProgress.prototype.setComplete = function(up, info) {
    var showImg = this.fileProgressWrapper.parent().find("img");
    this.setStatus("完成");
    this.fileProgressWrapper.remove();
    var res = $.parseJSON(info);
    var url;
    if (res.url) {
        url = res.url;
    } else {
        var domain = up.getOption('domain');
        url = domain + encodeURI(res.key);
    }
    showImg.attr('img_url', url);
    var imageView = IMG_EXT;
    if (!/imageView/.test(url)) {
        url += imageView
    }
    showImg.attr('src', url);

    var length = $(updata.selector).length;
    if (length >= updata.maxImgNumber) {
        updata.$addButton.hide();
        $(updata.selector).last().addClass("mbottom5");
    }
    if ($(updata.firstSelector).length == 0) {
        if($('#pic_number').val() == 15){
        	$(updata.selector).first().addClass("first");
        }
    }
};

FileProgress.prototype.setCancelled = function(manual) {
};

// 绑定取消上传事件
FileProgress.prototype.bindUploadCancel = function(up) {
    var self = this;
    if (up) {
        self.fileProgressWrapper.parent().find('.delete').on('tap', function(){
            self.setCancelled(false);
            up.removeFile(self.file);
        });
    }
};

FileProgress.prototype.appear = function() {
    if (this.getTimer() !== null) {
        clearTimeout(this.getTimer());
        this.setTimer(null);
    }

    if (this.fileProgressWrapper[0].filters) {
        try {
            this.fileProgressWrapper[0].filters.item("DXImageTransform.Microsoft.Alpha").opacity = 100;
        } catch (e) {
            // If it is not set initially, the browser will throw an error.  This will set it if it is not set yet.
            this.fileProgressWrapper.css('filter', "progid:DXImageTransform.Microsoft.Alpha(opacity=100)");
        }
    } else {
        this.fileProgressWrapper.css('opacity', 1);
    }
    this.fileProgressWrapper.css('height', '');
    this.height = this.fileProgressWrapper.offset().top;
    this.opacity = 100;
    this.fileProgressWrapper.show();
};
