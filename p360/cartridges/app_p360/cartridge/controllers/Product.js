'use strict';

/**
 * @namespace Product
 */

var page = module.superModule;
var server = require('server');
server.extend(page);

var cache = require('*/cartridge/scripts/middleware/cache');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');
var pageMetaData = require('*/cartridge/scripts/middleware/pageMetaData');

/**
 * @typedef ProductDetailPageResourceMap
 * @type Object
 * @property {String} global_availability - Localized string for "Availability"
 * @property {String} label_instock - Localized string for "In Stock"
 * @property {String} global_availability - Localized string for "This item is currently not
 *     available"
 * @property {String} info_selectforstock - Localized string for "Select Styles for Availability"
 */

  /**
  * Product-Show : This endpoint is called to show the details of the selected product
  * @name Base/Product-Show
  * @function
  * @memberof Product
  * @param {middleware} - cache.applyPromotionSensitiveCache
  * @param {middleware} - consentTracking.consent
  * @param {querystringparameter} - pid - Product ID
  * @param {category} - non-sensitive
  * @param {renders} - isml
  * @param {serverfunction} - get
  */
server.append('Show', cache.applyPromotionSensitiveCache, consentTracking.consent, function (req, res, next) {
	
	var ProductMgr = require('dw/catalog/ProductMgr');
	var preferences = require('*/cartridge/scripts/preferences/p360Preferences');
	var productHelper = require('*/cartridge/scripts/helpers/productHelpers');
	
	var p360Enabled = preferences.getP360Status();
	var reqParam = request.httpParameterMap.pid.stringValue;
	var pref;
	var p360Object;
	var viewData = res.getViewData();
	var p360Data = false;
    
    var p360Product = productHelper.showProductPage(req.querystring, req.pageMetaData).product;
    
	if(p360Enabled && p360Product.P360Images){
		var currentSite = preferences.getCurrentSiteID();
		var p360Dir = preferences.getFolderName();
		var path = currentSite+'/'+p360Dir+'/'+'/'+p360Product.id+'/';
		var P360Images = JSON.parse(p360Product.P360Images);
		pref = JSON.stringify(P360Images['p360']);
		if(P360Images['p360'].length > 0){
			p360Data = true;
		}
		
		else{
			p360Data = false;
		}
		
		p360Object = {'p360Enabled' : p360Enabled, 'P360Images' : P360Images, 'pref' : pref, 'p360Data' : p360Data};	
		
	} else {
		p360Object = {'p360Enabled' : p360Enabled, 'P360Images' : [], 'pref' : '[]', 'p360Data' : p360Data};
	}
	
	viewData.p360Object = p360Object;
    
    res.setViewData(viewData);
	
    return next();
}, pageMetaData.computedPageMetaData);

module.exports = server.exports();
