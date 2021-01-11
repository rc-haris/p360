'use strict';

var base = module.superModule;

/**
 * @constructor
 * @classdesc Returns images for a given product
 * @param {dw.catalog.Product} product - product to return images for
 * @param {Object} imageConfig - configuration object with image types
 */
function Images(product, imageConfig) {
	imageConfig.types.push('magic360');
	base.call(this, product, imageConfig);
}

module.exports = Images;
