window.onload = function () {
	//canvas initialization
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	//dimensions
	var W = canvas.width;
	var H = canvas.height;
	//Variables
	var degrees = 360;
	var new_degrees = 0;
	var difference = 0;
	var color = "#b2c831"; //green looks better to me
	var bgcolor = "#222";
	var text;
	var animation_loop, redraw_loop;

	function init() {
		//Clear the canvas everytime a chart is drawn
		ctx.clearRect(0, 0, W, H);
		//Background 360 degree arc
		ctx.beginPath();
		ctx.strokeStyle = bgcolor;
		ctx.lineWidth = 30;
		ctx.arc(W / 2, H / 2, 100, 0, Math.PI * 2, false); //you can see the arc now
		ctx.stroke();

		//gauge will be a simple arc
		//Angle in radians = angle in degrees * PI / 180
		var radians = degrees * Math.PI / 180;
		ctx.beginPath();
		ctx.strokeStyle = color;
		ctx.lineWidth = 30;
		//The arc starts from the rightmost end. If we deduct 90 degrees from the angles
		//the arc will start from the topmost end
		ctx.arc(W / 2, H / 2, 100, 0 - 90 * Math.PI / 180, radians - 90 * Math.PI / 180, false);
		//you can see the arc now
		ctx.stroke();

		//Lets add the text
		ctx.fillStyle = color;
		ctx.font = "50px open sans";
		text = Math.floor(degrees / 360 * 100) + "%";
		//Lets center the text
		//deducting half of text width from position x
		text_width = ctx.measureText(text).width;
		//adding manual value to position y since the height of the text cannot
		//be measured easily. There are hacks but we will keep it manual for now.
		ctx.fillText(text, W / 2 - text_width / 2, H / 2 + 15);
	}
	//novo_grau = new ajaxMemoria();
	function draw() {
		if (typeof animation_loop != undefined) clearInterval(animation_loop);
		ajaxMemoria();

	}


	function ajaxMemoria() {
		$.ajax({
			method: "get",
			dataType: "json",
			url: "./assets/app/classe-json.php?url=3",
			success: function (data) {
				new_degrees = graficoMemoria(data);
				difference = new_degrees - degrees;
				animation_loop = setInterval(animate_to, 1000 / difference);
			}
		})
	}
	function graficoMemoria(arrJson) {
		var memoriaEmUso = 0;
		var memoriaMaxima = 0;
		$.each(arrJson, function (key, val) {
			if (key == "used_memory") {
				memoriaEmUso = parseInt(val);
			}
			if (key == "maxi_memory") {
				memoriaMaxima = parseInt(val);
			}
		});
		var graus = Math.floor((memoriaEmUso * 360) / memoriaMaxima);
		return graus;

	}
	//function to make the chart move to new degrees
	function animate_to() {
		//clear animation loop if degrees reaches to new_degrees
		if (degrees == new_degrees)
			clearInterval(animation_loop);

		if (degrees < new_degrees)
			degrees++;
		else
			degrees--;
		init();
	}

	//Lets add some animation for fun
	draw();
	redraw_loop = setInterval(draw, 1000); //Draw a new chart every 2 seconds
}