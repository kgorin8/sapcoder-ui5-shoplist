jQuery.sap.declare("kgorin.shoplist.util.Formatter");

kgorin.shoplist.util.Formatter = { 

	uppercaseFirstChar : function(sStr) {
		return sStr.charAt(0).toUpperCase() + sStr.slice(1);
	},

	isRatingAvailable : function (value) {
		if(value){
			return true;
		}else{
			return false;
		}
	},
	
	getAvgRating : function(value){
	    if(value){
            return (parseFloat(value));
	    }else{
	        return 0;
	    }
	},

	isRatingNotAvailable : function (value) {
		if(value){
			return false;
		}else{
			return true;
		}
	},
	convertStr2Float: function(sStr){
		if(sStr){
			var floatNumber = parseFloat(sStr);
    		return (floatNumber);
		}
		else{
			return (0.0);
		}
	}
	
};