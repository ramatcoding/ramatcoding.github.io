/*=================================================================================================
	For notes and explanations on this class and its methods, see the version of the class
	contained in the "Exercise15\complete\" folder
=================================================================================================*/

/*=================================================================================================
-- NAMESPACE INITIALISATION
-------------------------------------------------------------------------------------------------*/
var com;
if (!com) {
	com = new Object();
}
if (!com.flametreepublishing) {
	com.flametreepublishing = new Object();
}
if (!com.flametreepublishing.cfk) {
	com.flametreepublishing.cfk = new Object();
}
/*===============================================================================================*/

/*=================================================================================================
-- CONSTRUCTOR
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.TargetingCoordinate = function(x, y) {
	if (x == undefined) {
		this.x = 0;
	} else {
		this.x = Number(x);
	}
	if (y == undefined) {
		this.y = 0;
	} else {
		this.y = Number(y);
	}	
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: matches(coordinate:TargetingCoordinate):Boolean
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.TargetingCoordinate.prototype.matches = function(aCoordinate) {
	if (aCoordinate.x == this.x && aCoordinate.y == this.y) {
		return(true);
	} else {
		return(false);
	}
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: setCoordinates(x:Number, y:Number):Void
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.TargetingCoordinate.prototype.setCoordinates = function(x, y) {
	if(x != undefined) {
		this.x = Number(x);
	}
	if (y != undefined) {
		this.y = Number(y);
	}
}
/*===============================================================================================*/