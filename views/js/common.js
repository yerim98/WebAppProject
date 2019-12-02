$(function(){
	var h; // 윈도우 크기를 지정하는 변수입니다.
	var t; // 윈도우의 상단 좌표를 지정하는 변수입니다.
	var num=1; // 전체 위치를 관리하는 변수입니다.
	var link=""; // 페이지의 링크 경로를 지정하는 변수입니다.
	var startFlag=false; // 시작을 지정하는 변수입니다.

	setTimeout(function(){
		$("body, html").animate({scrollTop:0}, 400, function(){
			$("section").removeClass("active");
			$("#page1").addClass("active");
			startFlag=true;
		});
	}, 150);

	$(window).resize(function(){
		h=$(window).height();
		$("section").css({height:h});
	});

	$(window).scroll(function(){
		if(startFlag == false){
			return false;
		}

		t=$(window).scrollTop();

		if(t <= $("#page2").offset().top-400){
			$("#page1").addClass("active");
		}
		else if(t <= $("#page3").offset().top-400){
			$("#page2").addClass("active");
		}
		else if(t <= $("#page4").offset().top-400){
			$("#page3").addClass("active");
		}
		else if(t <= $("#page5").offset().top-400){
			$("#page4").addClass("active");
		}
		else if(t <= $("#page6").offset().top-400){
			$("#page5").addClass("active");
		}
		else{
			$("#page6").addClass("active");
		}

		if(t > 150){
			$(".fixed").addClass("active");
		}
		else{
			$(".fixed").removeClass("active");
		}
	});

	$("nav .gnb a").click(function(){
		link=$(this).attr("href");
		// console.log("top : "+$(link).offset().top);
		$("body, html").animate({scrollTop:$(link).offset().top}, 400);

		num=$(this).parent().index()+1;

		return false;
	});
	$("body, html").mousewheel(function(e, delta){
		if($("body, html").is(":animated")){
			return false;
		}
		if(delta > 0){
			// console.log("up");
			if(num > 1){
				num=num-1;
			}
		}else{
			// console.log("down");
			if(num < 6){
				num=num+1;
			}
		}
		// console.log("num : "+num);

		$("body, html").animate({scrollTop:$("#page"+num).offset().top}, 400);
	});
	$("body, html").keydown(function(e){
		// console.log("e.keyCode : "+e.keyCode);
		if($("body, html").is(":animated")){
			return false;
		}
		if(e.keyCode == 38){
			// console.log("up");
			if(num > 1){
				num=num-1;
			}
		}else if(e.keyCode == 40){
			// console.log("down");
			if(num < 6){
				num=num+1;
			}
		}
		// console.log("num : "+num);

		$("body, html").animate({scrollTop:$("#page"+num).offset().top}, 400);
	});

	$(window).trigger("resize");
	$(window).trigger("scroll");

	// Login modal
	var modal = document.getElementById('myModal');
	var btn = document.getElementById("modal");
	var span = document.getElementsByClassName("close")[0];                                          

	btn.onclick = function() {
		modal.style.display = "block";
	}

	span.onclick = function() {
		modal.style.display = "none";
	}

	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	}

});