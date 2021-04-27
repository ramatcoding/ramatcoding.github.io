/*=================================================================================================
-- Spacecraft Class
	This class represents the enemy spacecraft in the game. Objects of the class store the name,
	size, coordinates and status of each spacecraft.
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
	This constructor creates new instances of the Spacecraft object. The constructor expects 3
	arguments from which it creates the spacecraft:
		aSize is a Number object that defines the size of the new Spacecraft instance
		aName is a String object that defines the name of the new Spacefraft instance
		aAcronym is a String object that defines an acronym for the Spacecraft instance
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.Spacecraft = function(aSize, aName, aAcronym) {
	//craftSize is the number of grid cells the spacecraft covers
	this.craftSize = aSize;
	//craftName is the full name of the spacecraft
	this.craftName = aName;
	//craftAcronym is an acronym, or initials, for the spacecraft; this will be displayed on any
	//targeting grid cells on which the spacecraft has been hit.
	this.craftAcronym = aAcronym;
	//craftCoords will store the TargetingCoordinate objects that represent the grid cells covered
	//by the spacecraft
	this.craftCoords = new Array();
	//craftHits is an array that stores the TargetingCoordinate objects for any hits the
	//spacecraft has taken
	this.craftHits = new Array();
	//isDestroyed indicates whether-or-not the spacecraft has been destroyed
	this.isDestroyed = false;
	//Spacecraft data is shown in the enemy fleet panel; each Spacecraft object maintains a
	//reference to its HTML elements within that panel to simplify the process of updating the
	//information. The next four object properties are used for storing those HTML element
	//references. We first declare them by assigning a null value to them.
	//fleetPanelRowElement represents the <tr> element in which the Spacecraft object will
	//display its data
	this.fleetPanelRowElement = null;
	//craftNameElement is the <td> element that displays the spacecraft's name
	this.craftNameElement = null;
	//craftSizeElement is the <td> element that displays the spacecraft's size
	this.craftSizeElement = null;
	//craftHitsElement is the <td> element that displays the number of hits the spacecraft has
	//taken
	this.craftHitsElement = null;
	//Now the properties for storing the HTML elements are declared, call the
	//createFleetPanelElements() method that will generate the actual HTML elements.
	this.createFleetPanelElements();
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: createFleetPanelElements():Void
	This method creates the HTML elements used to display the spacecraft's data within the
	enemyFleetPanelTable HTML table
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.Spacecraft.prototype.createFleetPanelElements = function() {	
	//Use createElement to create a <td> element for storing the craft's name
	this.craftNameElement = document.createElement("td");
	//Assign a CSS class to the new <td> element
	this.craftNameElement.className = "shipInfo";
	//Generate the text that will be displayed in the new <td> element, and add it to the element
	//using its innerHTML property.
	this.craftNameElement.innerHTML = this.craftName + " (" + this.craftAcronym + ")";
	//Use createElement to create a <td> element for storing the craft's size
	this.craftSizeElement = document.createElement("td");
	//Assign CSS class to the new <td> element
	this.craftSizeElement.className = "shipInfo";
	//Add the number for the spacecraft size to the <td> element, using its innerHTML property.
	//The innerHTML property expects to receive a String object, so we use the String() function to
	//convert the craftSize number to a string.
	this.craftSizeElement.innerHTML = String(this.craftSize);
	//Use createElement to create a <td> element for storing the number of hits on the craft
	this.craftHitsElement = document.createElement("td");
	//Assign CSS class to the new <td> element
	this.craftHitsElement.className = "shipInfo";
	//Use new element's innerHTML property to set the contents of the new <td> element.
	//The number of hits will be equal to the number of TargetingCoordinate objects contained in
	//the craftHits array. Therefore we set the contenst of the new <td> element to be
	//the length property of the array, converted to a string using the String() function.
	this.craftHitsElement.innerHTML = String(this.craftHits.length);
	//Now create the table row element into which all of the newly created <td> elements will
	//be added
	this.fleetPanelRowElement = document.createElement("tr");
	//Give the new <tr> element an id attribute based on the craftAcronym property
	this.fleetPanelRowElement.setAttribute("id", "spacecraft_" + this.craftAcronym);
	//Add the <td> elements to the new <tr> element
	this.fleetPanelRowElement.appendChild(this.craftNameElement);
	this.fleetPanelRowElement.appendChild(this.craftSizeElement);
	this.fleetPanelRowElement.appendChild(this.craftHitsElement);
	//Finally, add the new <tr> element to the enemyFleetPanelTableBody <tbody> element, which
	//is hard-coded into the HTML document (take a look at the HTML document to see for yourself)
	document.getElementById("enemyFleetPanelTableBody").appendChild(this.fleetPanelRowElement);	
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: removeFleetPanelElements():Void
	This method removes the spacecraft's info from the enemyFleetPanel <table> element. This
	method will be called when a new game is created, thereby ensuring now info remains from a
	previous game.
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.Spacecraft.prototype.removeFleetPanelElements = function() {
	//Check that the spacecraft objects fleetPanelRowElement <tr> element exists
	if (this.fleetPanelRowElement != null) {
		//Check that the craftNameElement <td> element exists
		if (this.craftNameElement != null) {
			//Remove the craftNameElement <td> element from the spacecraft's <tr> element
			this.fleetPanelRowElement.removeChild(this.craftNameElement);
			//Reset the craftNameElement property value to null
			this.craftNameElement = null;
		}
		//Check that the craftSizeElement <td> element exists
		if (this.craftSizeElement != null) {
			//Remove the craftSizeElement from the spacecraft's <tr> element
			this.fleetPanelRowElement.removeChild(this.craftSizeElement);
			//Reset the craftSizeElement property value to null
			this.craftSizeElement = null;
		}
		//Check that the craftHitsElement <td> element exists
		if (this.craftHitsElement != null) {
			//Remove the craftHitsElement from the spacecraft's <tr> element
			this.fleetPanelRowElement.removeChild(this.craftHitsElement);
			//Reset the craftHitsElement property value to null
			this.craftHitsElement = null;
		}
		//Remove the spacecraft's fleetPanelRowElement <tr> element from the page (the parentNode
		//property returns a reference to an element's parent element)
		this.fleetPanelRowElement.parentNode.removeChild(this.fleetPanelRowElement);
	}
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: instersects(aCoordinate:TargetingCoordinate):Boolean
	This method checks to see if the TargetingCoordinate object passed to the method intersects
	with any of TargetingCoordinate objects that represent the spacecraft's position. The
	TargetingCoordinate object to test is captured as the aCoordinate parameter.
	
	If the TargetingCoordinate intersects the spacecraft then the method returns true, otherwise
	it returns false
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.Spacecraft.prototype.intersects = function(aCoordinate) {
	//Declare a varaible for storing the method's result. Initialise that variable to false
	var theResult = false;
	//Loop through the craftCoords array, so that each of the TargetingCoordinate objects it
	//contains can be tested against the aCoord TargetingCoordinate object.
	for(var i = 0; i < this.craftCoords.length; i++) {
		//Check to see if the two TargetingCoordinates point to the same grid cell by calling
		//the matches() method of one of the TargetingCoordinate objects, passing in the other as
		//an argument.
		if (this.craftCoords[i].matches(aCoordinate)) {
			//If the matches() method has returned true then aCoordinate does intersect with the
			//spacecraft, and so the method's result will be true
			theResult = true;
			//We know an intersection has occurred, so we can break from looping through the array.
			break;
		}
	}
	//Return the method's result
	return(theResult);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: getAcronym():String
	This method provides a quick lookup for the spacecraft's acronym. A script could of course get
	this value by using the spacecraft's craftAcronym property value; however, it is good practice
	to use 'getter' and 'setter' methods to access an objects properties, as it allows us to do
	things in response to the getting / setting of the property's value. In this case, though,
	we're just returning the craftAcronym property value.
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.Spacecraft.prototype.getAcronym = function() {
	return(this.craftAcronym);
}

/*=================================================================================================
-- METHOD: positionSpacecraft(aContext:StarfleetDefence, aCoordinate:TargetingCoordinate):Boolean
	This method attempts to position the spacecraft relative to a TargetingCoordinate object,
	captured as the aCoordinate parameter. The method will work out which directions the spacecraft
	could be laid out if starting from the grid cell represented by aCoordinate (note that the
	spacecraft can't run outside of the 10x10 targeting grid, and can't overlap another spacecraft
	object).
	
	The aContext parameter receives a reference to the currently active StartfleetDefence game
	engine object. We will need to be calling a number of methods of that object, and so receiving
	a reference to it is done for convenience.
	
	The method returns true if it was able to position the spacecraft, otherwise it returns false.
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.Spacecraft.prototype.positionSpacecraft = function(aContext, aCoordinate) {
	//Firstly, check that the starting position - represented by aCoordinate - can be used. We
	//do this by calling the game engine's hitTest() method
	if (aContext.hitTest(aCoordinate) != "miss") {
		//If hitTest() returns anything other than "miss" then we can't position the spacecraft
		//on this grid cell, so return false
		return(false);
	}
	//We've ascertained that aCoordinate doesn't intersect any other spacecraft, so now we need
	//to work out the directions in which we may be able to position the spacecraft, starting from
	//aCoordinate. The Spacecraft object's layoutOptions() method does this (see below), returning
	//an array containing up to four strings; each string is a direction in which the spacecraft
	//can be laid out, given as "north", "east", "south" and "west".
	var layoutOptions = this.getLayoutOptions(aContext, aCoordinate);
	//Check that the array returned by getLayoutOptions() contains some values
	if (layoutOptions.length == 0) {
		//The array returned by getLayoutOptions() is empty, and so the spacecraft can't be
		//laid out in any direction from aCoordinate
		return(false);
	}
	//At this point we can assume that the getLayoutOptions() array contains at least one value.
	//We'll select a direction from the array at random. To do this we will generate a random
	//number that is between 0 and the last index number of the layoutOptions array...
	var randomDirectionIndex = Math.floor(Math.random() * layoutOptions.length);
	//...then we'll use that random number to access a value from within the layoutOptions array.
	var layoutDirection = layoutOptions[randomDirectionIndex];
	//Reset the craftCoords property to a new, empty array
	this.craftCoords = new Array();
	//Add the starting coordinate - aCoordinate - to the craftCoords array using the push()
	//method of the Array object
	this.craftCoords.push(aCoordinate);
	//To create new TargetingCoordinate objects for each cell covered by the spacecraft, and add
	//those objects to the craftCoords array, we'll run through a for loop the required number
	//of times.
	for(var i = 1; i < this.craftSize; i++) {
		//Create a new TargetingCoordinate object
		var newCoordinate = new com.flametreepublishing.cfk.TargetingCoordinate();
		//Check to see which direction the spacecraft is being laid out in
		if (layoutDirection == "north") {
			//If being laid out in a northerly direction, then each new TargetingCoordinate's y
			//property needs to decrease by 1 for each repeation of the loop
			newCoordinate.setCoordinates(aCoordinate.x, aCoordinate.y -i);
		} else if (layoutDirection == "east") {
			//If being laid out in a easterly direction, then each new TargetingCoordinate's x
			//property needs to increase by 1 for each repeation of the loop
			newCoordinate.setCoordinates(aCoordinate.x + i, aCoordinate.y);
		} else if (layoutDirection == "south") {
			//If being laid out in a southerly direction, then each new TargetingCoordinate's y
			//property needs to increase by 1 for each repeation of the loop
			newCoordinate.setCoordinates(aCoordinate.x, aCoordinate.y +i);
		} else if (layoutDirection == "west") {
			//If being laid out in a westerly direction, then each new TargetingCoordinate's x
			//property needs to decrease by 1 for each repeation of the loop
			newCoordinate.setCoordinates(aCoordinate.x -i, aCoordinate.y);
		}
		//Each repeation of the for loop will create a new TargetingCoordinate object - add this
		//to the craftCoords array using the push() method of the Array object
		this.craftCoords.push(newCoordinate);
	}
	//If the scripts runs to this point then the method has successfully positioned the
	//spacecraft, so return true
	return(true);	
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: getLayoutOptions(aContext:StarfleetDefence, aCoordinate:TargetingCoordinate):Array
	This method helps to determine the directions in which the spacecraft can be laid-out from a
	starting point represented by the TargetingCoordinate object captured as the aCoordinate
	parameter. The method also receives a reference to the active StarfleetDefence 'game engine'
	object, for convenience.
	
	The method returns an array that lists the compass directions in which the spacecraft can be
	laid out. If an empty array is returned then the ship cannot be laid-out from the given
	starting point.
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.Spacecraft.prototype.getLayoutOptions = function(aContext, aCoordinate) {
	//Declare a variable for storing the return value, and assign an empty array to the variable
	var theResult = new Array();
	//Check if the spacecraft can be laid out in a northerly direction
	if (this.canLayoutInDirection(aContext, aCoordinate, "north")) {
		//The spacecraft can be laid out in a northerly direction, so add "north" to the method's
		//result
		theResult.push("north");
	}
	//Check if the spacecraft can be laid out in an easterly direction
	if (this.canLayoutInDirection(aContext, aCoordinate, "east")) {
		//The spacecraft can be laid out in an easterly direction, so add "east" to the method's
		//result
		theResult.push("east");
	}
	//Check if the spacecraft can be laid out in an southerly direction
	if (this.canLayoutInDirection(aContext, aCoordinate, "south")) {
		//The spacecraft can be laid out in a southerly direction, so add "south" to the method's
		//result
		theResult.push("south");
	}
	//Check if the spacecraft can be laid out in an westerly direction
	if (this.canLayoutInDirection(aContext, aCoordinate, "west")) {
		//The spacecraft can be laid out in a westerly direction, so add "west" to the method's
		//result
		theResult.push("west");
	}
	//Return the method's result
	return(theResult);
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: canLayoutInDirection(aContext:StarfleetDefence, aCoordinate:TargetingCoordinate, aDirection:String):Boolean
	This method calculate whether the spacecraft object can be laid out in the direction indicated
	the aDirection parameter, from a starting point represented by the aCoordinate parameter. A
	reference to the active StarfleetDefence object - captured as the aContext parameter - is
	passed to the method for convenience.
	
	The method returns true if the spacecraft can be laid out in the direction, otherwise
	returns false.
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.Spacecraft.prototype.canLayoutInDirection = function(aContext, aCoordinate, aDirection) {
	//Declare a variable for storing the method result, and initialise it to true
	var theResult = true;
	//Create a TargetingCoordinate object that will be used for testing against the
	//StarfleetDefence object's hitTest() method.
	var testCoord = new com.flametreepublishing.cfk.TargetingCoordinate();
	//The method needs to check each cell that the spacecraft would occupy if laid out in the
	//direction indicated by aDirection; we need a for loop to do this
	for (var i = 1; i < this.craftSize; i++) {
		//Update the testCoord object so it represents the coordinates the will be tested in
		//this repetition of the loop - the new coordinates will depend on the aDirection
		//parameter, so test each of the possible values and act accordingly
		if (aDirection == "north") {
			//If being laid out in a northerly direction, then testCoord's y property needs to
			//decrease by 1 for each repeation of the loop
			testCoord.setCoordinates(aCoordinate.x, aCoordinate.y -i);
		} else if (aDirection == "east") {
			//If being laid out in a easterly direction, then testCoord's x property needs to
			//increase by 1 for each repeation of the loop
			testCoord.setCoordinates(aCoordinate.x + i, aCoordinate.y);
		} else if (aDirection == "south") {
			//If being laid out in a southerly direction, then testCoord's y property needs to
			//increase by 1 for each repeation of the loop
			testCoord.setCoordinates(aCoordinate.x, aCoordinate.y + i);
		} else if (aDirection == "west") {
			//If being laid out in a westerly direction, then testCoord's x property needs to
			//decrease by 1 for each repeation of the loop
			testCoord.setCoordinates(aCoordinate.x -i, aCoordinate.y);
		}
		//Now that the testCoord object is updated, use the game engine's hitTest() method to
		//see if it intersects another spacecraft, or runs off screen. 
		if (aContext.hitTest(testCoord) != "miss") {
			//If the result of hitTest() does not equal "miss" then the spacecraft cannot be
			//laid out in the direction indicated by aDirection. Set the return variable to
			//false
			theResult = false;
			//The spacecraft can't be laid out in this direction, so no need to continue testing
			//the remaining spacecraft coordinates, so we can break from the loop
			break;
		}
	}
	//Return the result of the method
	return(theResult);	
}
/*===============================================================================================*/

/*=================================================================================================
-- METHOD: takeHit(aCoordinate:TargetingCoordinate):Boolean
	This method handles what happens when the spacecraft takes a hit at the location indicated
	by the TargetingCoordinate object captured by the aCoordinate parameter.
	
	The method assumes that aCoordinate has already been tested and confirmed as intersecting the
	spacecraft object.
	
	If by taking the hit the spacecraft is destroyed then the method returns true, otherwise
	it returns false.
-------------------------------------------------------------------------------------------------*/
com.flametreepublishing.cfk.Spacecraft.prototype.takeHit = function(aCoordinate) {
	//Add aCoordinate to the craftHits array
	this.craftHits.push(aCoordinate);
	//Update the number shown in the spacecraft's craftHitsElement of the Enemy Fleet Panel; use
	//the String() function to convert the craftHits.length number to a String object
	this.craftHitsElement.innerHTML = String(this.craftHits.length);
	//Compare the length of the craftHits array to the craftSize of the spacecraft
	if (this.craftHits.length == this.craftSize) {
		//If the craftHits array's length is the same as the craftSize, then this means each
		//cell of the spacecraft must have been hit - in other words the spacecraft has been
		//destroyed, so set the isDestroyed property to true
		this.isDestroyed = true;
		//Update the Enemy Fleet Panel table elements to reflect the fact that the spacecraft has
		//been destroyed
		this.craftNameElement.className = "shipInfo destroyed";
		this.craftSizeElement.className = "shipInfo destroyed";
		this.craftHitsElement.className = "shipInfo destroyed";
	}
	//Return the isDestroyed property value
	return(this.isDestroyed);
}
/*===============================================================================================*/



