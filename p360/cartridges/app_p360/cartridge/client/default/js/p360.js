(function($){
   var P360 = function(element, options)
   {
       var view360 = $(element);
		var obj=this;
		var defaults = {
               imageDir:'images',
				imageCount:0,
				zoomPower:2,
				zoomRadius:100,
				autoRotate:false,
				autoRotateInterval:150,
				canvasWidth:0,
				canvasHeight:0,
				canvasID:''
            };
		
var newHeight;
var newWidth;
var canvas;
var loaded=false;
var context;
var iMouseX, iMouseY = 1;
var bMouseDown=false;
var tx;
var img_Array=new Array();
var ga = 0.0;
var fadeTimerId = 0;
var auto_rotate_count=0;
var autoRotateTimeId=0;
var modulus=0;
var zoomOn=0;
var autorotate_button;

options = $.extend(defaults, options);

 var clear = function(){ 
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}
var getImages=function(){
	for(var i=0;i<=options.imageCount-1;i++){
		img_Array[i]=new Image();
		if (options.p360Images[i]){
				if (options.p360Images[i].indexOf("http://") == 0 || options.p360Images[i].indexOf("https://") == 0) {
					img_Array[i].src=options.p360Images[i];
			    }
	            else{
					img_Array[i].src=options.imageDir + "/" + options.p360Images[i];
	            }
		}
		
		
		clear();
			img_Array[i].onload=function(){
				context.font = '10pt Calibri';
				context.fillText('loading:'+(i-1)+"/"+options.imageCount, 150, 100);
				}
	}
}

var trimFileName = function(fileName){
	var lastDotPosition = fileName.lastIndexOf(".");
	fileName = fileName.substr(0, lastDotPosition);
	return fileName;
}


var showImage=function(){
clear();
width = this.newWidth;
height = this.newHeight;
image=new Image();
                image.onload = function()
                {
                    context.drawImage(image, 0, 0, width, height);
                };
                if (options.p360Images[0].indexOf("http://") == 0 || options.p360Images[0].indexOf("https://") == 0) {
		            image.src=options.p360Images[0];
                    }else{
                        image.src=options.imageDir + "/" + options.p360Images[0];
                    }
}

var init_=function(){

view360.append("<canvas id='"+options.canvasID+"' width='" + options.canvasWidth +"' height='"+options.canvasHeight+"'></canvas>").css({cursor:'e-resize'});
view360.css({width:options.canvasWidth + "px",height:options.canvasHeight + "px",position:'relative'});
canvas=document.getElementById(options.canvasID);
context = canvas.getContext('2d');
tx=canvas.width/options.imageCount;
view360.find('.autospin').css({position:"absolute",right:"1%",bottom:'1%',display:'block',padding:'5px'});
clear();
fixDimensions();
getImages();

showImage();

if(options.autoRotate==true && typeof img_Array[options.imageCount] != 'undefined') {
start_auto_rotate();
view360.find(".autospin").text("Stop 360 Spin");
}


view360.find("canvas").mousemove(function(e){
var canvasOffset = $(canvas).offset();

iMouseX = Math.floor(e.pageX - canvasOffset.left);
       iMouseY = Math.floor(e.pageY - canvasOffset.top);
	    modulus=Math.ceil(iMouseX / tx);
	   if(modulus<=-1) { modulus=0}else if(modulus >options.imageCount-1){modulus=options.imageCount-1}else{};	   
	   if(options.autoRotate==false && bMouseDown==false){
	       
	   rotate360(modulus);
	   }
	   
	   if(bMouseDown==true){
	   zoom(img_Array[zoomOn]);
}
});

view360.find("#"+options.canvasID).mousedown(function(e){ //  mousedown event
       bMouseDown = true;
	   if(options.autoRotate==true){stop_auto_rotate();}
	   var canvasOffset = $(canvas).offset();
       iMouseX = Math.floor(e.pageX - canvasOffset.left);
       iMouseY = Math.floor(e.pageY - canvasOffset.top);
	    zoomOn=Math.ceil(iMouseX / tx); 
	   if(zoomOn<=0) { zoomOn=1}else if(zoomOn >options.imageCount){zoomOn=options.imageCount}else{};
    });


    view360.find("#"+options.canvasID).mouseup(function(e) { 
        bMouseDown = false;
		zoomOn=0;
		$(this).css({cursor:'e-resize'});
    });
	
	
	view360.find(".autospin").click(function(e){
		e.preventDefault();
if(options.autoRotate==false){
start_auto_rotate();
$(this).addClass("active");
}
else{
stop_auto_rotate();
$(this).removeClass("active");
}
});

}



var rotate360=function(img_no){
clear();
context.drawImage(img_Array[img_no], 0, 0, this.newWidth, this.newHeight);

}

var start_auto_rotate=function(){
options.autoRotate=true;
autoRotateTimeId=setInterval(function(){auto_rotate360();},options.autoRotateInterval);
}
function stop_auto_rotate(){
options.autoRotate=false;
clearInterval(autoRotateTimeId);
}

function auto_rotate360(){
if(modulus>0 && modulus<=options.imageCount -1 && auto_rotate_count<=0){auto_rotate_count=modulus;} 
auto_rotate_count++;
if(auto_rotate_count>options.imageCount-1){
auto_rotate_count=1;
}
rotate360(auto_rotate_count);
}

var zoom=function(image) { 

    clear(); 
    if (bMouseDown) { 
        context.drawImage(image, 0 - iMouseX * (options.zoomPower - 1), 0 - iMouseY * (options.zoomPower - 1), this.newWidth * options.zoomPower, this.newHeight * options.zoomPower);
        context.globalCompositeOperation = 'destination-atop';
        context.beginPath();
        context.arc(iMouseX, iMouseY, options.zoomRadius, 0, Math.PI*2, true);
        context.closePath();
        context.fill();
    }
   context.drawImage(image, 0, 0, this.newWidth, this.newHeight);
}
var fixDimensions = function(){
  	
    var image = {
    		width: options.imageWidth,    
	        height: options.imageHeight
    };
    var page = {
        width:$("#"+options.canvasID).width(),
        height:$("#"+options.canvasID).height()
    };
    
    var imageRatio = image.width/image.height;
    var pageRatio = page.width/page.height;
    var fixHeight = true;
    var newImage = {
        left:0,
        top:0,
        width:0,
        height:0
    };
    
    if (fixHeight){
        newImage.height = page.width / imageRatio;
        newImage.width = page.width;
        newImage.left = -(newImage.width - page.width) / 2;
		
		if(newImage.height > page.height){
			newImage.height = page.height;
			newImage.width = page.height * imageRatio;
		}
    } else {
        newImage.height = page.width / imageRatio;
        newImage.width = page.width;
        newImage.top = -(newImage.height - page.height) / 2;
    
    }
	var dimension = {"image": newImage};
					 
	this.newHeight = newImage.height;
	this.newWidth = newImage.width;
	
};
  
$(window).on("resize", function(){ 
	fixDimensions();
});
	
 init_();
 
};
 	$.fn.p360 = function(options)
    {
        return this.each(function()
        {
            var element = $(this);
            if (element.data('p360')) return;
            var p360 = new P360(this, options);
            element.data('p360', p360);
        });
    };
})(jQuery);	 