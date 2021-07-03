/*=================================================================================================
-- TargetingCoordinate Class
	Objects of this class represent locations on the targeting grid. The coordinates are stored
	as the properties x and y of TargetingCoordinate objects.
=================================================================================================*/

/*=================================================================================================
-- NAMESPACE INITIALISATION
	In JavaScript a 'namespace' is an object in which we define other objects. The reason for
	doing this is to avoid any identifier names used in a script from 'clashing' with the same
	names used in another script. This is particularly important when defining classes, as it
	ensures all of the classes method and property names are unique, even if the same identifiers
	are used in another class or script.
	
	It's common to use a reversed domain name as a namespace - this is because you can
	be very sure that other developers won't have used your domain name as a namespace for their
	classes. Here we're using "com.flametreepublishing.cfk" as our namespace. Subsequent class
	method definitions are then assigned to this com.flametreepublishing.cfk object.
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
	This constructor creates a new instance of the TargetingCoordinate class. The class stores
	the x and y properties of a coordinate on the game's targeting grid.
	
	The constructor can be passed two arguments, which are the x and y values that the new object
	will represent. If no arguments are passed then the x and y coordinates of the object will
	default to 0.

	Classes always have a 'constructor' method. This is the method that's called when a new
	instance of the class is created with the 'new' keyword.
	
	The 'this' keyword, that you see used througout this script, is a reference to the instance
	of the class that's handling the method or stores the property value - I.E. the object itself.
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.TargetingCoordinate = function(x, y) {
	//Check if an x coordinate has been provided
	if (x == undefined) {
		//If no x coordinate was provided then the method's x parameter value will be undefined.
		//In this case, set x to 0
		this.x = 0;
	} else {
		//The x parameter does have a value, so assign that to the object's x property. Use the
		//Number() function to ensure the value we store is a Number object.
		this.x = Number(x);
	}
	//Do the same for the y parameter as we did for the x parameter. Notice that the x and y
	//parameter identifiers are distinct from the this.x and this.y property identifiers.
	if (y == undefined) {
		this.y = 0;
	} else {
		this.y = Number(y);
	}	
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: matches(coordinate:TargetingCoordinate):Boolean
	This method compares one TargetingCoordinate instance to a different TargetingCoordinate
	instance to see if they represent the same grid square.
	
	We can't simply test to see if instanceA == instanceB, because if they're different objects
	they won't be equal to each other, even if their property values are the same. Therefore this
	method compares the actual property values of the two TargetingCoordinate instances.
	
	The method returns true if the two TargetingCoordinate objects refer to the same grid cell,
	otherwise returns false.
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.TargetingCoordinate.prototype.matches = function(aCoordinate) {
	//Test the two coordinate properties. Use logicalAND to combine the test into one if statement
	if (aCoordinate.x == this.x && aCoordinate.y == this.y) {
		//Both TargetingCoordinate objects represent the same grid cell, so return true
		return(true);
	} else {
		//The TargetingCoordinate objects don't represent the same grid cell, so return false
		return(false);
	}
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: setCoordinates(x:Number, y:Number):Void
	This method updates the coordinates of the object with new x and y values.
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.TargetingCoordinate.prototype.setCoordinates = function(x, y) {
	//Check that a value has been provided for the method's x parameter (it will be undefined if
	//no value was provided)
	if(x != undefined) {
		//Assign the new x value to the object's x property, using the Number() function to ensure
		//it's a Number object
		this.x = Number(x);
	}
	if (y != undefined) {
		this.y = y
	}
}