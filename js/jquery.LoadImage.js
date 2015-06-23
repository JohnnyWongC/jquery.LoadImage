/**
 * jquery.LoadImage v2.28
 * 16 Jun 2015
 *
 * 新增图片加载完成后移除 data-url 属性
 * 新增对背景图的支持 (v2.27 15 Jun 2015)
 * 新增无参数和一个参数的调用方法
 * 新增可以自定义 暂无图片 路径 (v2.26 09 Jun 2015)
 * 修复智能替换 nopic 的部分问题 (v2.25 24 Apr 2015)
 * 增加智能替换 nopic 的功能 (v2.24 21 Apr 2015)
 * 修改 jsSrc 提示
 * 修复IE7-下图片有时无法正常加载的问题 (v2.23 15 Apr 2015)
 * 优化图片显示效果
 * 基于 https://github.com/ispxin/LoadImage (2.22 22 Dec 2014)
 * 新增 加载图_loading.gif 暂无图片_noImage.png
 * 优化图片垂直居中
 * 优化暂无图片
 * 新增 jsSrc
 * 优化 暂无图片_noImage.png 的显示效果
 * 新增 isPosition 属性(是否自动居中)
 * 修复IE下有时只对某些图片起作用
 * 解决读取图片路径时不能读取到js动态修改后的图片路径
 *
 * by Johnny Wong
 *
 */

// 使用方法:
// <img src="image/null.gif" data-url="image/image.jpg" />
// $(function() {
//    $("img").LoadImage(true, false, 123, 321);
// });

;
(function($, window, undefined) {
	
	//该js插件所在路径 ("/js/jquery.LoadImage_2.28/")
	var jsSrc = "";

	var LoadImage = function(obj, isScaling, isPosition, width, height, noImageSrc) {
		// 初始化变量
		this.obj = obj;

		//加载loading.gif
		$(this.obj).attr("src", jsSrc + "image/loading.gif");
		if (isPosition) {
			$(this.obj).css({
				position: "relative",
				left: (width - 16) / 2,
				top: (height - 16) / 2
			});
		}
		this.isScaling = isScaling;
		this.isPosition = isPosition;
		this.width = width;
		this.height = height;

		// 加载图片
		this.load(arguments.length == 5 ? jsSrc + "image/noImage.png" : noImageSrc);
	}

	LoadImage.prototype = {
		// 加载图片
		load: function(noImageSrc) {
			var _this = this,
				imgUrl = String(this.obj.attr('data-url')).length < 3 || String(this.obj.attr('data-url')).toLowerCase().indexOf("nopic") > -1 ? noImageSrc : this.obj.attr('data-url'),
				newImg = new Image();

			newImg.onload = function() {
				
				// 等比例缩小
				if (_this.isScaling) {
					_this.scaling(this.width, this.height);
				}

				// 显示图片
				_this.obj.hide();
				_this.obj.attr('src', imgUrl);
				_this.obj.fadeIn(333);

				// 垂直居中
				if (_this.isPosition) {
					_this.position();
				}
			};
			newImg.src = imgUrl;
		},

		// 等比例缩小
		scaling: function(width, height) {
			if (width / height >= this.width / this.height) {
				if (width > this.width) {
					this.obj.attr("width", this.width);
					this.obj.attr("height", (height * this.width) / width);
				} else {
					this.obj.attr("width", width);
					this.obj.attr("height", height);
				}
			} else {
				if (height > this.height) {
					this.obj.attr("height", this.height);
					this.obj.attr("width", (width * this.height) / height);
				} else {
					this.obj.attr("width", width);
					this.obj.attr("height", height);
				}
			}
		},

		// 图片垂直居中定位
		position: function() {

			var imgWidth = this.obj.width(),
				imgHeight = this.obj.height(),
				left = (this.width - imgWidth) / 2,
				top = (this.height - imgHeight) / 2;

			this.obj.css({
				position: "relative",
				left: left,
				top: top
			});
		}

	}

	// 挂载到jQuery组件
	$.fn.LoadImage = function(isScaling, isPosition, width, height, noImageSrc) {
		var al = arguments.length;
		if(al <= 1){
			this.each(function(i, o) {
				$(this).css("background-image", "url(" + jsSrc + "image/loading.gif)");
				$(this).attr("data-url", $(this).attr('data-url').length < 3 || $(this).attr('data-url').toLowerCase().indexOf("nopic") > -1 ? (al == 1 ? isScaling : jsSrc + "image/noImage.png") : $(this).attr('data-url'));
				$.ajax({
				   url: $(o).attr("data-url"),
				   type: "Head",
				   success: function() {
				   		$(o).css("background-image", "url(" + $(o).attr("data-url") + ")");
				   },
				   error: function() {
				   		$(o).css("background-image", "url(" + (al == 1 ? isScaling : jsSrc + "image/noImage.png") +")");
				   },
				   complete: function(){
				   		$(o).removeAttr("data-url");
				   }
				});
			});
		}else{
			this.each(function(i, o) {
				al == 4 ? new LoadImage($(this), isScaling, isPosition, width, height) : new LoadImage($(this), isScaling, isPosition, width, height, noImageSrc);
				$(o).removeAttr("data-url");
				setTimeout(function() {
					if ($(o).attr("src").indexOf("image/loading.gif") > -1) {
						$(o).hide();
						$(o).attr("src", al == 4 ? jsSrc + "image/noImage.png" : noImageSrc);
						if (isPosition) {
							$(o).css({
								left: al == 4 ? (width - 76) / 2 : 0,
								top: al == 4 ? (height - 19) / 2 : 0
							});
						}
						$(o).fadeIn(333);
					}
				}, 5555);
			});
		}
	}

})(jQuery);