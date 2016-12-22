function addCoord(){
	var count = document.getElementsByClassName("coords").length;
	count = count + 1;
	if(count > 44){
		alert("You cannot have more than 44 data points...for now");
		return null;
	}
	var element = document.getElementById("cont_1");
	var coord = document.getElementById("orderedPair1");
	var cln = coord.cloneNode(true);
	var newId = "orderedPair" + count;
	cln.getElementsByClassName("coord")[0].value = null;
	cln.getElementsByClassName("coord")[1].value = null;
	cln.setAttribute("id",newId)
	element.appendChild(cln);
}

function deleteCoord(sender){
	var toBeDeleted = sender.parentNode;
	var parent = toBeDeleted.parentNode;
	if(toBeDeleted.id == "orderedPair1"){
		alert("Cannot delete the first Ordered Pair");
	}
	else{
		parent.removeChild(toBeDeleted);
	}
}

function plot() {

	var CANVAS = {
		id: "regCanvas",
		width: 650,
		height: 650,
	};

	var canvas = document.getElementById(CANVAS.id);
	var ctx = canvas.getContext('2d');

	ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);
	drawAxes(ctx);
	var opt = document.getElementById('plot-select').value;
	if(opt == "page"){
		var coords = document.getElementsByClassName("coords");
		var i;
		var Xs = [];
		var Ys = [];
		for(i = 0; i < coords.length; i++){
			coord = coords[i];
			var x_y = coord.getElementsByClassName("coord");
			var rawX = parseFloat(x_y[0].value);
			var rawY = parseFloat(x_y[1].value);
			if(rawX > 324 || rawX < -324 || rawY > 324 || rawY < -324){
				alert("Max: 324\nMin: -324 ");
				return null;
			}
			else if(x_y[0].value == "" || x_y[1].value == "") {
			}
			else{
				Xs.push(rawX);
				Ys.push(rawY);
				plotPoint(ctx,rawX,rawY,CANVAS.height,CANVAS.width);
			}
		}
		regression(ctx,Xs,Ys,CANVAS.height,CANVAS.width);
	}
	else if(opt == "file"){
    	var file = document.getElementById('file').files[0];
    	if(!file){
    		alert("No File Selected")
    	}
    	else{
	    	var reader = new FileReader();
	    	var Xs = [];
		    var Ys = [];
	    	reader.onloadend = function (e) {
		        var txt = "";
		        txt = (e.target.result);
		        var ordered = txt.split("\n");
		        for(var i = 0; i < ordered.length; i++){
		        	var split = ordered[i].split(",");
		        	var rawX = parseInt(split[0]);
		        	var rawY = parseInt(split[1]);
		        	if(rawX > 324 || rawX < -324 || rawY > 324 || rawY < -324){
						alert("Max: 324\nMin: -324 ");
						return null;
					}
					else if(split[0]=="" || split[1]=="") {
					}
					else{
			          	Xs.push(rawX);
			         	Ys.push(rawY);
			         	plotPoint(ctx,rawX,rawY,CANVAS.height,CANVAS.width);
			        }
		        }  
		        regression(ctx,Xs,Ys,CANVAS.height,CANVAS.width);
		    }
		    reader.readAsText(file); 
		}
    	 
    }
    
}


function drawAxes(ctx){
	ctx.beginPath();
	ctx.moveTo(0,325);
	ctx.lineTo(650,325);
	ctx.moveTo(325,0);
	ctx.lineTo(325,650);
	ctx.lineWidth = 2;
	ctx.strokeStyle = 'black';
	ctx.stroke();
}

function plotPoint(ctx,rawX,rawY,height,width){
	var x = (width/2) + rawX;
	var y = height - rawY - (height/2);
	ctx.moveTo(x,y);
	ctx.arc(x,y,1,0,Math.PI*2,true);
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 1;
	ctx.stroke();
}

function regression(ctx,X,Y,height,width){
	var i;
	var aveX = 0;
	var aveY = 0;
	for(i = 0; i < X.length; i++){
		aveX = aveX + X[i];
		aveY = aveY + Y[i];
	}
	aveX = aveX/X.length;
	aveY = aveY/Y.length;
	var num = 0;
	for(i = 0; i < X.length; i++){
		var tmp = (X[i]-aveX)*(Y[i]-aveY);
		num = num + tmp;
	}
	var denom = 0;
	for(i = 0; i < X.length; i++){
		var tmp = Math.pow((X[i]-aveX),2);
		denom = denom + tmp;
	}
	m = num/denom;

	document.getElementById("m").value = Math.round(10000*m)/10000;

	var b = aveY - m*aveX;
	document.getElementById("b").value = Math.round(10000*b)/10000;
	
	var SStot = 0;
	for(i = 0; i < Y.length; i++){
		var tmp = Math.pow((Y[i]-aveY),2);
		SStot = SStot + tmp;
	}
	var SSres = 0;
	for(i = 0; i < Y.length; i++){
		var tmpY = X[i]*m + b;
		var tmp = Math.pow((Y[i]-tmpY),2);
		SSres = SSres + tmp;
	}

	var rsqr = 1-(SSres/SStot);
	document.getElementById("rsquared").value = Math.round(10000*rsqr)/10000;

	var startX = -325;
	var startY = -325*(m) + b;
	var endX = 325;
	var endY = 325*(m) + b;
	startX = (width/2) + startX;
	startY = height - startY - (height/2);
	endX = (width/2) + endX;
	endY = height - endY - (height/2);

	ctx.beginPath();
	ctx.moveTo(startX,startY);
	ctx.lineTo(endX,endY);
	ctx.strokeStyle = 'red';
	ctx.stroke();
}

function onplotchange() {
    var opt = document.getElementById('plot-select').value;
    if(opt == "file"){
    	document.getElementById("cont_1").style.display = "none"
    	document.getElementById("cont_2").style.display = "block"
    }
    else if(opt == "page"){
    	document.getElementById("cont_1").style.display = "block"
    	document.getElementById("cont_2").style.display = "none"
    }
}
