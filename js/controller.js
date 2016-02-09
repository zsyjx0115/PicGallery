$(document).ready(function(){
	var pics = new PicData();
	var data = pics.data;
	/*加载所有画报的数据*/
	var $gallery = $("#gallery");
	var html = [];
	data.forEach(function(ele, index){
		//先获取模板数据，然后将模板中关键字替换加载画报
		var template = $gallery.html();
		template = template.replace("{{index}}", index)
			.replace("{{image}}", ele.image)
			.replace("{{caption}}", ele.caption)
			.replace("{{describe}}", ele.describe)
			.replace("{{type}}", ele.type);
		html.push(template);
	});
	$gallery.html(html.join(''));

	var $controll = $("#controll");
	var $piccontroll = $controll.find(".piccontroll");
	for(var i = 0; i < data.length; i++){
		$piccontroll.append("<li class='pic' id='pic_" + i + "'></li>");
	}
	$piccontroll.find(".pic").each(function(index, ele){
		var $ele = $(ele);
		$ele.on("click", function(){
			var $this = $(this);
			setCenterClick(index);
			// $this.siblings().removeClass("active");
			// $this.addClass("active");
		});
	});
	//第一次加载随机选取一幅图放在正中间
	setCenterClick(GenerateRandom(0, data.length-1));
});

//按照范围生成随机数
function GenerateRandom(range0, range1){
	var max = Math.max(range0, range1);
	var min = Math.min(range0, range1);

	return Math.floor(Math.random() * (max - min)) + min;
}

//给中间图片绑定点击翻转事件
function setCenterClick(index){
	var $center_pic = $("#photo_" + index);
	$center_pic.unbind("click");
	$center_pic.siblings().removeClass("photo-center");
	$center_pic.addClass("photo-center");
	$center_pic.css({
		"left": '',
		"top": '',
		"-webkit-transform": "rotate(0deg) scale(1.2)"
	});

	$center_pic.on("click", function(){
		var $pic = $(this).children();
		var className = $pic.attr("class");
		if(/photo-front/.test(className)){
			$pic.removeClass("photo-front");
			$pic.addClass("photo-back");
		}
		else{
			$pic.removeClass("photo-back");
			$pic.addClass("photo-front");
		}
	});
	//设置控制条
	var $controll_pic = $("#pic_" + index);
	$controll_pic.siblings().removeClass("active");
	$controll_pic.addClass("active");
	//设置剩余图片
	setRemainPic($center_pic);
}

//1、剩余图片随机定位；2、给剩余图片绑定点击事件到中间展示
function setRemainPic(center){
	var remains = center.siblings();
	var $gallery = $("#gallery");
	remains.sort(function(a, b){
		return Math.random() > 0.5 ? 1 : -1;
	});
	var g_width = $gallery.outerWidth(),
		g_height = $gallery.outerHeight(),
		p_width = center.outerWidth(),
		p_height = center.outerHeight();
	remains.each(function(index, ele){
		var $ele = $(ele);
		var id = $ele.attr("id");
		if( index % 2){
			$ele.css({
				"left": GenerateRandom(0 - p_width / 4, g_width / 2 - p_width * 1.2),
				"top": GenerateRandom(0 - p_height / 4, g_height - p_height / 4),
				"-webkit-transform": "rotate(" + GenerateRandom(-150, 150) + "deg) scale(0.9)"
			});
		}
		else{
			$ele.css({
				"left": GenerateRandom(g_width / 2 + p_width * 0.8, g_width + p_width / 4),
				"top": GenerateRandom(0 - p_height / 4, g_height - p_height / 4),
				"-webkit-transform": "rotate(" + GenerateRandom(-150, 150) + "deg) scale(0.9)"
			});
		}
		$ele.unbind("click");
		//绑定点击事件，使点击元素居中显示
		$ele.on("click", function(){
			setCenterClick(id.slice(6));
		});
	});
}