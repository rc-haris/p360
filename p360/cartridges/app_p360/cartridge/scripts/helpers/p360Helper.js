/**
 * function to generate public accessible path
 * 
 * @param {string}
 *            File Name
 * @returns {string} File URL
 */
function generatePublicFilePath(fileName, path) {
	
	if (fileName.indexOf("http://") == 0 || fileName.indexOf("https://") == 0) {
		url = fileName;
    }else{
		/* API Includes */
		let File = require('dw/io/File');
		let URLUtils = require('dw/web/URLUtils');
	
		if (fileName != "") {
			var rootDir = File.STATIC;
			file = new File(rootDir + File.SEPARATOR + path + fileName);
		//	file = new File(rootDir + File.SEPARATOR + fileName);
			var filePath = file.getFullPath();
			var indexToTrim = filePath.indexOf("/STATIC/") + 8;
			filePath = filePath.substring(indexToTrim);
			var url = URLUtils.imageURL(filePath, {}).toString().replace(
					/Sites(.+?)Site\/-\//, '-/Sites/');
			url = url.replace(/ /g, "%20");
		}
		else {
			url = "";
			}
	 }
	return url;
}


function generateBasePath(path) {
		/* API Includes */
		let File = require('dw/io/File');
		let URLUtils = require('dw/web/URLUtils');
		var rootDir = File.STATIC;
		file = new File(rootDir + File.SEPARATOR + path);
		var filePath = file.getFullPath();
		var indexToTrim = filePath.indexOf("/STATIC/") + 8;
		filePath = filePath.substring(indexToTrim);
		var url = URLUtils.imageURL(filePath, {}).toString().replace(/Sites(.+?)Site\/-\//, '-/Sites/');
			url = url.replace(/ /g, "%20");
			url = url.match(/(^.*[\\\/]|^[^\\\/].*)/i);
			url = url[0];
			return url;
}





/**
 * function to truncate file extention and return array
 * 
 * @param {Array}
 *            
 * @returns {Array}
 */

function trimFileName(fileNameArray) {
	var image360 = [];
	if(fileNameArray.length > 0){
		for(var l = 0; l < fileNameArray.length; l++){
			var lastDotPosition = fileNameArray[l].lastIndexOf(".");
			image360.push(fileNameArray[l].substr(0, lastDotPosition));
		}
	}
return image360;
}
/**
 * function to split comma seprated string and return array
 * 
 * @param {string}
 *            Video Tags
 * @returns {Array}
 */
function stringToArray(videoTags) {
	var tags;
	if (videoTags != "") {
		tags = videoTags.split(",");
	}

	else {
		tags = [];
	}

	return tags;

}

/**
 * function return allowed locale in JSON object
 * 
 * @returns {Array}
 */
function getLanguages(){
	
	var localeObj = [];
	var Locale = require('dw/util/Locale');
	var Site = require('dw/system/Site');
	var localeSite = Site.getCurrent();
	var locales = localeSite.getAllowedLocales();
	
	for(var l = 0; l < locales.length; l++){
		
		localeObj.push({"localeID" : Locale.getLocale(locales[l]).getID(),
			"localeName" : Locale.getLocale(locales[l]).getDisplayName()
		});
	}
	
	return localeObj;
}

function getCurrentLanguage(){
	
	var locale = "";
	var Locale = require('dw/util/Locale');
	var Site = require('dw/system/Site');
	var localeSite = Site.getCurrent();
	var locale = localeSite.getDefaultLocale();
	
	return locale;
}

/**
 * Return type of the current product
 * @param  {dw.catalog.ProductVariationModel} product - Current product
 * @return {string} type of the current product
 */
function getProductType(product) {
    var result;
    if (product.master) {
        result = 'master';
    } else if (product.variant) {
        result = 'variant';
    } else if (product.variationGroup) {
        result = 'variationGroup';
    } else if (product.productSet) {
        result = 'set';
    } else if (product.bundle) {
        result = 'bundle';
    } else if (product.optionProduct) {
        result = 'optionProduct';
    } else {
        result = 'standard';
    }
    return result;
}

/**
 * Return type of the current product
 * @param  {dw.catalog.ProductVariationModel} product - Current product
 * @return {string} type of the current product
 */
function getAssignProductType(product) {
    var result;
    if (product.master) {
        result = 'masterproducts';
    }  else if (product.variationGroup) {
        result = 'variationGroup';
    } else if (product.productSet) {
        result = 'productSets';
    } else if (product.bundle) {
        result = 'productBundles';
    } else {
        result = 'standardProducts';
    }
    return result;
}


module.exports.generatePublicFilePath = generatePublicFilePath;
module.exports.generateBasePath = generateBasePath;
module.exports.trimFileName = trimFileName;
module.exports.stringToArray = stringToArray;
module.exports.getLanguages = getLanguages;
module.exports.getCurrentLanguage = getCurrentLanguage;
module.exports.getProductType = getProductType;
module.exports.getAssignProductType = getAssignProductType;
