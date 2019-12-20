$(document).ready(function () {
	$("body").keydown(function(event) {
		if(event.which == '27'){
			$("#cancel").click();
		}
	});

	$('input').keypress(function (event) {
		if (event.which == 13) {
			event.preventDefault(); 
		}
	});
	$('#mail').click(clickMailBtn);
	$("#send").click(clickSendBtn);

	$("#cancel").click(function(){
		$("#mail-wrap").addClass("hidden");
		return false;
	});
});

function clickMailBtn (){
	$('#mail-wrap').removeClass('hidden');
}

function clickSendBtn () {
	if ($("#from")[0].value == "" ||  $("#subject")[0].value == "" || $("#message")[0].value == "") {
		alert("Please fill out the form");
		return false;
	} else {
		$.ajax({
			url:"mail.php",
			method:"post",
			data:{from:$("#from")[0].value, subject:$("#subject")[0].value, message:$("#message")[0].value}
		});
	}
}