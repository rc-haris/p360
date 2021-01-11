function getMeta(url, callback) {
	var img = new Image();
	img.src = url;
	img.onload = function() {
	callback(this.width, this.height);
	}
}

$(document).ready(function () {
	$('body').on('product:afterAttributeSelect', function (e, { data, container }) {
		if(data.product.p360Enabled && data.product.P360Images){
			P360Images = JSON.parse(data.product.P360Images);
			imageArray = P360Images['p360'];
			
			if(P360Images['p360'].length > 0){
				p360Data = true;
				
				var carousel = '<div id="p360">'
					+'<a href="#" class="autospin">360 Spin</a>'
					+'</div>';
				container.find('.p360init').empty().html(carousel);
			}
			
			else{
				p360Data = false;
				container.find('.p360init').empty().html();
			}
				if(imageArray[0]){
					if (imageArray[0].indexOf("http://") == 0 || imageArray[0].indexOf("https://") == 0) {
						var imageLocation = imageArray[0];
					} else {
						var imageLocation = data.product.basePath+imageArray[0];    
					}
					
					getMeta(imageLocation,
							function(width, height) { 
								$("#p360").p360(
										{
											imageDir:data.product.basePath,
											imageCount:imageArray.length,
											canvasID:'p360canvas',
											canvasWidth:540,
											canvasHeight:540,
											autoRotate:false,
											p360Images:imageArray,
											imageWidth:width,
											imageHeight:height
											
										});
							});
				}
		} else{
			container.find('.p360init').empty().html();
		}
		
		
	});
});