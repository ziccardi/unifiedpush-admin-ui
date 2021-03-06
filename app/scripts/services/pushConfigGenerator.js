'use strict';

var upsServices = angular.module('upsConsole');

upsServices.factory('pushConfigGenerator', function ($resource, $q, ContextProvider) {

	function cordovaVariantType(variant) {
			if (variant.type === 'web_push') {
				return 'webpush';
			}
			return variant.type;
	}

	function variantSpecificConfiguration(variant, config) {
		switch (variant.type) {
			case 'android':
				config.senderID = variant.projectNumber;
				break;
			case 'web_push':
				config.appServerKey = variant.publicKey;
				break;
		}
	}

	return {
		generate: function(variants) {
			var pushConfig = {
				'pushServerURL': ContextProvider.contextPath()
			};
      if (variants) {
        variants.forEach(function (variant) {
          var type = cordovaVariantType(variant);
          var config = pushConfig[type] = {};
          variantSpecificConfiguration(variant, config);
          config.variantID = variant.variantID;
          config.variantSecret = variant.secret;
        });
      }
			return JSON.stringify(pushConfig, null, 2);
		}
	};

});
